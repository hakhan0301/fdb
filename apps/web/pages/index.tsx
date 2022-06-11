/* eslint-disable @next/next/no-img-element */
import { getBlogs } from '@fdb/db/models/blogs';
import { useState } from 'react';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';

import type { GetServerSideProps } from 'next';
import { getSession, useSession } from 'next-auth/react';
import NewPostField from "@fdb/ui/posts/NewPostField";
import Post from "@fdb/ui/posts/Post";


export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  return {
    props: {
      blogPosts: await getBlogs(session?.user?.email)
    }
  }
}

export default function Home({ blogPosts }: any) {
  const session = useSession();
  const [formShown, setFormShown] = useState(false);

  return (
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
        {blogPosts.map((blogPost: any) => <Post
          key={JSON.stringify(blogPost)}
          {...blogPost}
          sessionUser={session?.data?.user}
        />)}
      </div>
    </div>
  )
}