import { useState } from "react";
import Button, { BaseButton } from "../common/Button";
import TextField from "../common/TextField";
import { BsChat } from 'react-icons/bs';

export interface Comment {
  text: string;
  createdAt: string;
  author: {
    name: string;
  }
}

export function CommentField({ onSubmit }: any) {
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
      <BaseButton className="p-2 rounded-full" onPress={handleSubmit}><BsChat /></BaseButton>
    </div>
  );
}

export function Comment({
  text, createdAt, author, index, className
}: Comment & { index: number, className?: string }) {
  const bgColor = index % 2 === 0 ? 'bg-amber-50' : 'bg-amber-100';
  return (
    <div className={`${className} flex flex-row items-center gap-2 justify-start py-1 px-2 ${bgColor}`}>
      <div className='text-sm'>{author.name}<span className='select-none'>:</span></div>
      <div>{text}</div>
    </div>
  );
}

export function Comments({ comments, className }: { comments: Comment[], className?: string }) {
  const [displayAll, setDisplayAll] = useState(false);
  const displayedComments = displayAll ? comments : comments.slice(-3);
  const shortened = displayedComments.length < comments.length;
  return (
    <div className={`${className} flex flex-col`}>
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
