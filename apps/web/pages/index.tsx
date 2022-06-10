/* eslint-disable @next/next/no-img-element */
import { getBlogs } from '@fdb/db/models/blogs';
import { useState } from 'react';
import { debounce } from 'debounce';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';

import type { GetServerSideProps } from 'next';
import { getSession, useSession } from 'next-auth/react';
import Button from "@fdb/ui/common/Button";
import TextArea from "@fdb/ui/common/TextArea";
import TextField from "@fdb/ui/common/TextField";
import { useRouter } from 'next/router';

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

  return (
    <div className="mx-auto max-w-xl">
      <div className="flex flex-col">
        <NewPostField sessionUser={session?.data?.user} />
        {blogPosts.map((blogPost: any) => <ContentItem
          key={JSON.stringify(blogPost)}
          {...blogPost}
          sessionUser={session?.data?.user}
        />)}
      </div>
    </div>
  )
}

function NewPostField({ sessionUser }: any) {
  const router = useRouter();

  const [formShown, setFormShown] = useState(false);
  const [postValue, setPostValue] = useState('');

  const [submitting, setSubmitting] = useState(false)


  const submitBlogPost = async () => {
    setSubmitting(true);
    await fetch('/api/blogs', {
      method: 'POST',
      body: postValue
    });
    setPostValue('');
    setSubmitting(false);
    router.push('/');
  };

  return (
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
      {formShown && (
        <div className='flex flex-col bg-emerald-100 p-4'>
          <div className='px-1px'>Blog Text</div>
          <div className='flex flex-col md:flex-row items-start gap-2'>
            <TextArea
              className="flex-grow w-[100%]"
              value={postValue} onChange={setPostValue}
            />
            <Button onPress={submitBlogPost} isDisabled={submitting}>Post</Button>
          </div>
        </div>
      )}
    </div>
  )
}

// COMMENTS ----------------------------------

interface Comment {
  text: string;
  createdAt: string;
  author: {
    name: string;
  }
}

function CommentField({ onSubmit }: any) {
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    setComment('');
    onSubmit(comment);
  };

  return (
    <div className='flex flex-row items-center gap-2 justify-start'>
      <TextField
        onChange={setComment}
        value={comment}
        errorMessage={!(comment.length > 3 && comment.length < 20)} />
      <Button onPress={handleSubmit}><span className='text-sm'>Comment</span></Button>
    </div>
  );
}

function Comment({
  text, createdAt, author, index
}: Comment & { index: number }) {
  const bgColor = index % 2 === 0 ? 'bg-amber-50' : 'bg-amber-100';
  return (
    <div className={`flex flex-row items-center gap-2 justify-start py-1 px-2 ${bgColor}`}>
      <div className='text-sm'>{author.name}<span className='select-none'>:</span></div>
      <div>{text}</div>
    </div>
  );
}

function Comments({ comments }: { comments: Comment[] }) {
  const [displayAll, setDisplayAll] = useState(false);
  const displayedComments = displayAll ? comments : comments.slice(-3);
  const shortened = displayedComments.length < comments.length;
  return (
    <div className='flex flex-col'>
      {shortened &&
        <div className='text-sm font-mono select-none px-2'>
          <span
            className='cursor-pointer py-2 hover:text-gray-500'
            onClick={() => setDisplayAll(true)}
          >...</span>
        </div>
      }
      {displayedComments.map((comment: Comment, i: number) => (
        <Comment {...comment}
          key={JSON.stringify(comment)}
          index={i}
        />
      ))}
    </div>
  );
}

function ContentItem(props: any) {
  const {
    id,
    text,
    author,
    createdAt,
    sessionUser,
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
    setComments([...comments, {
      text: comment,
      createdAt: new Date().toISOString(),
      author: { name: sessionUser.name }
    }]);
  }, 300);

  return (
    <div className="flex flex-col py-4 gap-4 bg-amber-100 md:border-x border-y border-yellow-600 border-opacity-20">
      <div
        className='absolute text-sm text-gray-400 cursor-pointer select-none'
        onClick={() => setDebug(!debug)}
      >d</div>

      <pre className={`${!debug && 'hidden'} pl-4 overflow-auto bg-stone-600 text-white`}>
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
        <div className='flex flex-col gap-4 w-[100%]'>
          <p className='whitespace-pre-line'>{text}</p>
          <div className='text-gray-500'>
            <Comments comments={comments} />
            <CommentField onSubmit={addComment} />
          </div>
        </div>


      </div>


    </div >
  )
}