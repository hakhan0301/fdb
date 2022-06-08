/* eslint-disable @next/next/no-img-element */
import { getBlogs } from '@fdb/db/models/blogs';
import { useState } from 'react';
import { debounce } from 'debounce';

import type { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { Button, TextArea, TextField } from '@fdb/ui';
export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  return {
    props: {
      blogPosts: await getBlogs(session?.user?.email)
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

function CommentField({ onSubmit }: any) {
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    onSubmit(comment);
    setComment('');
  };

  return (
    <div className='flex flex-row items-center gap-2 justify-start px-6'>
      <TextField onChange={setComment}
        textValidation={str => str.length > 3 && str.length < 20} />
      <Button onClick={handleSubmit}>Submit</Button>
    </div>
  );
}

interface Comment {
  text: string;
  createdAt: string;
  author: {
    name: string;
  }
}

function Comment({
  text, createdAt, author, index
}: Comment & { index: number }) {
  const bgColor = index % 2 === 0 ? 'bg-amber-50' : 'bg-amber-100';
  return (
    <div className={`flex flex-row items-center gap-2 justify-start px-6 py-1 ${bgColor}`}>
      <div className='text-sm'>{author.name}<span className='select-none'>:</span></div>
      <div>{text}</div>
    </div>
  );
}

function ContentItem(props: any) {
  const {
    id,
    text,
    author,
    createdAt,
    comments: initialComments,
    totalLikes: initialLikes,
    likedByUser: initialLikedByUser
  } = props;
  const { name, image } = author;

  const [debug, setDebug] = useState(false);
  const [totalLikes, setTotalLikes] = useState(initialLikes);
  const [likedByUser, setLikedByUser] = useState(initialLikedByUser);
  const [comments, setComments] = useState(initialComments);

  const likePost = debounce(async () => {
    try {
      await fetch(`/api/blogs/like/${id}`, {
        method: 'POST'
      });
      setTotalLikes(totalLikes + 1);
      setLikedByUser(true);
    } catch { }
  }, 300);

  const dislikePost = debounce(async () => {
    try {
      await fetch(`/api/blogs/dislike/${id}`, {
        method: 'POST'
      });
      setTotalLikes(totalLikes - 1);
      setLikedByUser(false);
    } catch { }
  }, 300);

  const addComment = debounce(async (comment: string) => {
    if (comment == '') return;

    await fetch(`/api/blogs/${id}/comment`, {
      method: 'POST',
      body: comment
    });
    setComments([...comments, { text: comment, createdAt: new Date().toISOString(), author: { name } }]);
  }, 300);

  return (
    <div className="flex flex-col py-4 gap-4 bg-amber-100 md:border-x border-y border-yellow-600 border-opacity-20">
      <div
        className='absolute text-sm text-gray-400 cursor-pointer'
        onClick={() => setDebug(!debug)}
      >d</div>

      <pre className={`${!debug && 'hidden'} pl-4`}>
        {JSON.stringify(props, null, 2)}
      </pre>

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
          <h1 onClick={likedByUser ? dislikePost : likePost}
            className={`text-center text-xl cursor-pointer select-none
                      ${likedByUser ? 'text-green-400' : 'text-black'}
                      ${likedByUser ? 'hover:text-red-500' : 'hover:text-green-400 '}          
            `}
          >^</h1>
          <h1 className="text-center text-xl">{totalLikes}</h1>
          {/* <h1 className="text-center text-xl cursor-pointer hover:text-red-500 rotate-180">^</h1> */}
        </div>
        <p className='whitespace-pre-line'>{text}</p>

      </div>

      <div className='flex flex-col'>
        {comments.map((comment: any, i: number) => (
          <Comment {...comment}
            key={JSON.stringify(comment)}
            index={i}
          />
        ))}
      </div>

      <CommentField onSubmit={addComment} />
    </div >
  )
}