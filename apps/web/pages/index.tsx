import { getBlogs } from '@fdb/db/models/blogs';
import { useEffect, useState } from 'react';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import NewPostField from "@fdb/ui/posts/NewPostField";
import Post from "@fdb/ui/posts/Post";
import { tryStrikeFetchedUser } from "@fdb/db/models/users";
import StreakStrike from "@fdb/ui/posts/StreakStrike";

import appContext, { AppContext } from '@fdb/ui/contexts/appContext';
import Button from '@fdb/ui/common/Button';
import { Post as PostType } from "@fdb/db/models/blogs";
import { withSessionSsr } from '../lib/withAuth';

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;
    if (!user?.id) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        }
      }
    }

    const strikedUser = await tryStrikeFetchedUser(user.name);
    user.strikes += strikedUser ? strikedUser.strikes : 0;
    user.streaks = strikedUser ? strikedUser.streaks : user.streaks;

    // @ts-ignore
    if (strikedUser && strikedUser.strikes >= 3) {
      return {
        redirect: {
          destination: '/banned',
          permanent: false,
        },
      }
    }

    return {
      props: {
        blogPosts: await getBlogs(user.id),
        user: {
          ...strikedUser,
          lastPost: strikedUser?.lastPost.toString(),
          lastStrike: strikedUser?.lastStrike.toString(),
        }
      }
    };
  }
);

type StreaksStrikes = {
  streaks: number,
  strikes: number
};

const getStreakStrikes = async () => {
  const res = await fetch('/api/user/streakStrikes');
  const streakStrikes: StreaksStrikes = await res.json();

  return streakStrikes;
};


const getPosts = async (lastPostDate?: string) => {
  const res = await fetch(`/api/blogs?${lastPostDate ? `cursor=${lastPostDate}` : ''}`);
  const posts: PostType[] = await res.json();
  return posts;
};

const POSTS_PER_PAGE = 10;

export default function Home({ blogPosts, user }: any) {
  const [formShown, setFormShown] = useState(false);
  const [page, setPage] = useState(0);

  const [app, setApp] = useState<AppContext>({
    posts: blogPosts,
    streaks: user.streaks,
    strikes: user.strikes,
    addPost: (post) => {
      setApp((prevApp) => ({
        ...prevApp,
        posts: [post, ...prevApp.posts]
      }));
      setFormShown(false);
    },
    addPosts: (posts) => setApp((prevApp) => ({
      ...prevApp,
      posts: [...prevApp.posts, ...posts]
    })),
    resetStreakStrikes: () => getStreakStrikes().then(
      (streaksStrikes: StreaksStrikes) => {
        setApp((prevApp) => ({ ...prevApp, ...streaksStrikes }))
      }
    )
  });

  const onNextPage = async () => {
    const newPage = page + 1;
    const posts = app.posts;

    if (posts.length < newPage * POSTS_PER_PAGE + POSTS_PER_PAGE) {
      app.addPosts(await getPosts(posts[posts.length - 1].createdAt));
      window.scrollTo(0, 0);
    }
    setPage(page + 1);
  };

  const onPrevPage = () => {
    setPage(Math.max(0, page - 1));
  };

  useEffect(() => {
    app.resetStreakStrikes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app.resetStreakStrikes]);


  return (
    <appContext.Provider value={app}>
      <div className='flex-grow'>
        <div className="mx-auto max-w-xl flex flex-col">
          <StreakStrike streak={app.streaks} strikes={app.strikes} />

          {/* newpost */}
          <div className="flex flex-col">
            <div className='bg-gradient-to-r from-green-400 to-blue-500 text-white group cursor-pointer'

              onClick={() => setFormShown(!formShown)}>
              <div className='flex flex-row items-center px-2 gap-2 py-2 w-fit'>
                <button
                  className='text-2xl cursor-pointer group-hover:text-yellow-500'>
                  {formShown ? <BsChevronUp /> : <BsChevronDown />}
                </button>
                <span className='select-none'>New Post</span>
              </div>
            </div>
            {formShown && <NewPostField />}
          </div>

          {/* posts */}
          <div className='flex flex-col gap-4'>
            {app.posts
              .slice(page * POSTS_PER_PAGE, page * POSTS_PER_PAGE + POSTS_PER_PAGE)
              .map((blogPost: any, index: number) =>
                <Post key={JSON.stringify(blogPost)} index={index} sessionUser={user}
                  {...blogPost}
                />
              )
            }
          </div>

          {/* pagination button */}
          <div className='flex bg-pink-50 justify-between px-3 py-5'>
            <Button isDisabled={page == 0} onPress={onPrevPage}>
              Prev
            </Button>
            <Button onPress={onNextPage}>
              Next
            </Button>
          </div>


          {/* footer */}
          <div className='flex justify-center align-center px-4 py-4 bg-black'>
            <div className='text-lg font-bold text-white'>Foolar DB</div>
          </div>

        </div>
      </div>
    </appContext.Provider>
  )
}