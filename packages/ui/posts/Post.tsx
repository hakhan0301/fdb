/* eslint-disable @next/next/no-img-element */
// @ts-ignore
import ModalImage from "react-modal-image-responsive";
import { useState } from "react";
import { debounce } from 'debounce';
import { CommentField, Comments } from "./Comments";
import { FaSearch, } from 'react-icons/fa';

import type { ImagePost, LinkPost, PostContent } from '@fdb/db/models/types';



export default function Post(props: any) {
  const {
    id,
    type,
    text: body,
    author,
    createdAt,
    index,
    comments: initialComments,
    totalLikes: initialLikes,
    likedByUser: initialLikedByUser
  } = props;
  const { name, image } = author;

  const { sessionUser } = props;

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

  try {
    return (
      <div className={`flex flex-col py-4 sm:border-x border-y border-blue-600 border-opacity-20 ${index % 2 ? 'bg-sky-100' : 'bg-sky-50'}`}>
        <div
          className='absolute text-xs text-sky-200 cursor-pointer select-none'
          onClick={() => setDebug(!debug)}><FaSearch /></div>
        <pre className={`${!debug && 'hidden'} pl-4 overflow-auto bg-stone-600 text-white`}>
          {JSON.stringify(props, null, 2)}
        </pre>

        <div className="flex flex-row items-center gap-2 mx-2 px-1 pb-2 border-b">
          <div className="flex flex-col">
            <div className="px-2 justify-self-center shrink-0">
              <h1 onClick={likedByUser ? dislikePost : likePost}
                className={`text-center text-xl cursor-pointer select-none
                      ${likedByUser ? 'text-green-400' : 'text-black'}
                      ${likedByUser ? 'hover:text-red-500' : 'hover:text-green-400 '}          
            `}
              >^</h1>
              <h1 className="text-center text-xl">{totalLikes}</h1>
            </div>
          </div>

          <img alt="user" src={image}
            className="w-12 h-12 rounded-2xl shadow-md object-cover"
          />
          <div className="flex flex-col">
            <h1 className="text-sm text-purple-800">{name}</h1>
            <h1 className="text-xs text-gray-600">{new Date(createdAt).toLocaleDateString()}</h1>
          </div>
        </div>

        <div className="flex flex-row py-1 gap-1 w-[100%]">
          <div className='flex flex-col justify-between gap-4 w-[100%] h-[100%]'>
            <div className="flex-grow">
              <Content body={JSON.parse(body)} type={type} />
            </div>
          </div>
        </div>
        <div className='flex flex-col pt-2 gap-1'>
          <Comments comments={comments} className="sm:px-2" />
          <div className="px-2">
            <CommentField className="flex-grow" onSubmit={addComment} />
          </div>
        </div>
      </div >
    )
  } catch {
    return <p>error</p>;
  }
}

function Content(content: PostContent) {
  switch (content.type) {
    case 'text':
      return <p className='whitespace-pre-line'>{content.body}</p>;
    case 'link':
      return <LinkContent content={content} />;
    case 'image':
      return <ImageContent content={content} />;
    default:
      return <p>EROR</p>
  }
}


function LinkContent({ content }: { content: LinkPost }) {
  return (
    <div className="flex gap-1 items-baselin">
      <div>
        <span>{content.body.title}</span>
        <span className="select-none">:</span>
      </div>
      <div className="text-xs flex items-center bg-orange-300 px-1">
        <span className="select-none">(</span>
        <a href={content.body.url} target="_blank" rel="noreferrer noopener"
          className="text-sky-500 border-b border-opacity-0 border-sky-500 hover:border-opacity-100"
        >
          {content.body.url}
        </a>
        <span className="select-none">)</span>
      </div>
    </div>
  );
}

function ImageContent({ content }: { content: ImagePost }) {
  return (
    <div className="flex flex-col">
      <div className="text-2xl px-2 sm:px-3">
        {content.body.title}
      </div>

      <div className="border-none">
        <ModalImage
          className="w-full h-auto max-h-32 sm:p-1 sm:px-3"
          small={content.body.url}
          large={content.body.url}
          hideDownload
        />
      </div>

    </div>
  );
}