/* eslint-disable @next/next/no-img-element */
import { getBlogs } from '@fdb/db/models/blogs';
import { useEffect, useState } from 'react';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import type { GetServerSideProps } from 'next';
import { getSession, useSession } from 'next-auth/react';
import NewPostField from "@fdb/ui/posts/NewPostField";
import Post from "@fdb/ui/posts/Post";
import { tryStrikeFetchedUser, tryStrikeUser } from "@fdb/db/models/users";
import StreakStrike from "@fdb/ui/posts/StreakStrike";
import { User } from '@fdb/db/types';

import appContext, { AppContext } from '@fdb/ui/contexts/appContext';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const user = session?.user as User;

  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }

  const isUserStriked = await tryStrikeFetchedUser(user.name);
  user.strikes += isUserStriked ? 1 : 0;
  user.streaks = isUserStriked ? 1 : user.streaks;

  // @ts-ignore
  if (user.strikes >= 3) {
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
      userStrikes: user.strikes,
      userStreaks: user.streaks
    }
  }
}

type StreaksStrikes = {
  streaks: number,
  strikes: number
};

const getStreakStrikes = async () => {
  const res = await fetch('/api/user/streakStrikes');
  const streakStrikes: StreaksStrikes = await res.json();

  return streakStrikes;
};

export default function Home({ blogPosts, userStrikes, userStreaks }: any) {
  const session = useSession();
  const [formShown, setFormShown] = useState(false);

  const [app, setApp] = useState<AppContext>({
    posts: blogPosts,
    streaks: userStreaks,
    strikes: userStrikes,
    addPost: (post) => setApp((prevApp) => ({
      ...prevApp,
      posts: [post, ...prevApp.posts]
    })),
    resetStreakStrikes: () => getStreakStrikes().then(
      (streaksStrikes: StreaksStrikes) => {
        setApp((prevApp) => ({ ...prevApp, ...streaksStrikes }))
      }
    )
  });


  useEffect(() => {
    app.resetStreakStrikes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app.resetStreakStrikes]);


  return (
    <appContext.Provider value={app}>
      <div className='flex-grow'>
        <div className="mx-auto max-w-xl flex flex-col">
          <StreakStrike streak={app.streaks} strikes={app.strikes} />

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


          <div className='flex flex-col gap-4'>
            {app.posts.map((blogPost: any, index: number) => <Post
              key={JSON.stringify(blogPost)}
              {...blogPost} index={index}
              sessionUser={session?.data?.user}
            />)}
          </div>
        </div>
      </div>
    </appContext.Provider>
  )
}