/* eslint-disable @next/next/no-img-element */
import { getBlogs } from '@fdb/db/models/blogs';
import { useState } from 'react';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { AiFillFire } from 'react-icons/ai';
import type { GetServerSideProps } from 'next';
import { getSession, useSession } from 'next-auth/react';
import NewPostField from "@fdb/ui/posts/NewPostField";
import Post from "@fdb/ui/posts/Post";
import { tryStrikeFetchedUser } from "@fdb/db/models/users";
import { BsExclamationDiamond } from 'react-icons/bs';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  const user = session?.user;

  // @ts-ignore next-auth is stupid and doesn't have a type for this
  const newUser = await tryStrikeFetchedUser(user?.name);
  // @ts-ignore
  if (user && (user.strikes >= 3 || newUser.strikes >= 3)) {
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
      userStrikes: newUser?.strikes || 0,
      // @ts-ignore
      userStreaks: newUser?.streaks || user?.streaks || 0,
    }
  }
}

function StreakStrike({ strikes, streak }: { streak: number, strikes: number }) {
  return (
    <div className='bg-gradient-to-r from-pink-400 to-purple-500'>
      <div className='flex justify-between text-3xl p-2'>
        <div className='flex items-center select-none'>
          <AiFillFire className='text-black w-8 h-8 fill-fuchsia-800 animate-pulse' />
          <span className='font-serif text-fuchsia-900'>{streak}</span>
        </div>


        <div className='flex gap-1 items-center select-none font-serif text-black'>
          <BsExclamationDiamond className='h-7 w-7 pr-1' />
          <span>{strikes}</span>
          <span className='font-extrabold'>/</span>
          <span>3</span>
        </div>
      </div>
    </div>
    // <pre>{`${streak} streak, ${strikes} strikes`}</pre>
  );

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

          <StreakStrike streak={streak} strikes={strikes} />

          <div className="flex flex-col">
            <div className='bg-gradient-to-r from-green-400 to-blue-500 text-white group cursor-pointer'

              onClick={() => setFormShown(!formShown)}>
              <div className='flex flex-row items-center px-2 gap-2 py-2 w-fit'>
                <button
                  className='text-2xl cursor-pointer group-hover:text-rose-500'>
                  {formShown ? <BsChevronDown /> : <BsChevronUp />}
                </button>
                <span className='select-none'>New Post</span>
              </div>
            </div>
            {formShown && <NewPostField />}
          </div>


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