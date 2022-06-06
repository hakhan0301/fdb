/* eslint-disable @next/next/no-img-element */
import { getBlogs } from '@fdb/db/models/blogs';

import type { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      blogPosts: await getBlogs()
    }
  }
}


export default function Home({ blogPosts }: any) {
  return (
    <div className="mx-auto max-w-xl">
      <div className="flex flex-col">
        {blogPosts.map((blogPost: any) => <ContentItem key={JSON.stringify(blogPost)} {...blogPost} />)}
      </div>
    </div>
  )
}

function ContentItem(props: any) {

  const { text, createdAt, user } = props;

  const { name, image } = user;

  return (
    <div className="flex flex-col py-4 gap-4 bg-amber-100 md:border-x border-y border-yellow-600 border-opacity-20">
      <div className="flex flex-row px-4 items-center gap-4">
        <img
          alt={"user logo"}
          className="w-12 h-12 rounded-2xl shadow-md"
          src={image}
        />

        <div className="flex flex-col">
          <h1 className="text-lg font-bold">{name}</h1>
          <h1 className="text-sm text-gray-600">{new Date(createdAt).toLocaleDateString()}</h1>
        </div>
      </div>

      <div className="flex flex-row gap-4 px-4">
        <div className="w-12 justify-self-center shrink-0">
          <h1 className="text-center text-xl cursor-pointer hover:text-green-400">^</h1>
          <h1 className="text-center text-xl">3</h1>
          <h1 className="text-center text-xl cursor-pointer hover:text-red-500 rotate-180">^</h1>
        </div>
        <p className='whitespace-pre-line'>{text}</p>

      </div>
    </div>
  )
}