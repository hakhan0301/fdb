/* eslint-disable @next/next/no-img-element */
import { getBlogs } from '@fdb/db/models/blogs';
import { useEffect, useState } from 'react';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import type { GetServerSideProps } from 'next';
import { getSession, useSession } from 'next-auth/react';
import NewPostField from "@fdb/ui/posts/NewPostField";
import Post from "@fdb/ui/posts/Post";
import { tryResetStreaks, tryStrikeFetchedUser, tryStrikeUser } from "@fdb/db/models/users";
import StreakStrike from "@fdb/ui/posts/StreakStrike";
import Button from '@fdb/ui/common/Button';
import { User } from '@fdb/db/types';

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

  // next js funky wierdness
  user.lastPost = new Date(user.lastPost as unknown as string);
  user.lastStrike = new Date(user.lastStrike as unknown as string);

  const isUserStriked = await tryStrikeUser({ ...user });
  user.strikes += isUserStriked ? 1 : 0;

  const isStreaksReset = await tryResetStreaks({ ...user });
  user.streaks = isStreaksReset ? 1 : user.streaks;

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
      // @ts-ignore
      blogPosts: await getBlogs(session?.user?.id),
      userStrikes: user.strikes,
      userStreaks: user.streaks
    }
  }
}

export default function Home({ blogPosts, userStrikes, userStreaks }: any) {
  const session = useSession();
  const [formShown, setFormShown] = useState(false);

  const [streak, setStreak] = useState(userStreaks);
  const [strikes, setStrikes] = useState(userStrikes);

  async function du() {
    const res = await fetch('/api/notifications/send/test');
    console.log(await res.text());
  }

  return (
    <div className='flex-grow'>
      <Button onPress={du}>click me</Button>
      <div className="mx-auto max-w-xl">
        <div className="flex flex-col">

          <StreakStrike streak={streak} strikes={strikes} />

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