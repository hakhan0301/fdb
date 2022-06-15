/* eslint-disable @next/next/no-img-element */
import { getBlogs } from '@fdb/db/models/blogs';
import { useState } from 'react';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';

import type { GetServerSideProps } from 'next';
import { getSession, useSession } from 'next-auth/react';
import NewPostField from "@fdb/ui/posts/NewPostField";
import Post from "@fdb/ui/posts/Post";
import { tryStrikeFetchedUser } from "@fdb/db/models/users";

const reloadSession = () => {
  const event = new Event("visibilitychange");
  document.dispatchEvent(event);
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  const user = session?.user;

  // @ts-ignore next-auth is stupid and doesn't have a type for this
  const strikes = await tryStrikeFetchedUser(user?.name);
  // @ts-ignore
  if (user && (user.strikes >= 3 || strikes >= 3)) {
    return {
      redirect: {
        destination: '/banned',
        permanent: false,
      },
    }
  }

  return {
    props: {
      blogPosts: await getBlogs(session?.user?.email),
      // @ts-ignore
      userStrikes: strikes || 0,
      // @ts-ignore
      userStreaks: user?.streaks || 0,
    }
  }
}

export default function Home({ blogPosts, userStrikes, userStreaks }: any) {
  const session = useSession();
  const [formShown, setFormShown] = useState(false);

  const [streak, setStreak] = useState(userStreaks);
  const [strikes, setStrikes] = useState(userStrikes);

  return (
    <div className='flex-grow'>
      <div className="mx-auto max-w-xl">
        <div className="flex flex-col">

          <div className="flex flex-col">
            <div className='bg-gradient-to-r from-green-400 to-blue-500 text-white'>
              <div className='flex flex-row items-center px-2 gap-2 py-2 w-fit'>
                <button
                  className='text-2xl cursor-pointer hover:text-rose-500 hover:animate-pulse'
                  onClick={() => setFormShown(!formShown)}>
                  {formShown ? <BsChevronDown /> : <BsChevronUp />}
                </button>
                <span className='select-none'>New Post</span>
              </div>
            </div>
            {formShown && <NewPostField />}
          </div>

          <pre>{`${streak} streak, ${strikes} strikes`}</pre>

          <div className='flex flex-col gap-4'>
            {blogPosts.map((blogPost: any, index: number) => <Post
              key={JSON.stringify(blogPost)}
              {...blogPost} index={index}
              sessionUser={session?.data?.user}
            />)}
          </div>
        </div>
      </div>
    </div>
  )
}