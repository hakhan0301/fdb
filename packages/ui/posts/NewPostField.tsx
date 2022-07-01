import TextArea from "@fdb/ui/common/TextArea";
import TextField from "@fdb/ui/common/TextField";
import Button from "@fdb/ui/common/Button";
import { useRouter } from 'next/router';
import { useContext, useState } from "react";
import { Tabs, TabItem } from "../common/Tabs";
import { isWebUri } from 'valid-url';

import { isValidTitle } from "./helpers";
import ImageContentField from './content-fields/ImageContentField';

import appContext from '../contexts/appContext';
import { Post } from "@fdb/db/models/blogs";

export default function NewPostField({ }: any) {
  const app = useContext(appContext);

  const onSubmit = async (post: Post) => {
    app.addPost(post);
    await app.resetStreakStrikes();
  };

  return (
    <div className='bg-emerald-100 p-4'>
      <Tabs >
        <TabItem title="Image"><ImageContentField onSubmit={onSubmit} /></TabItem>
        <TabItem title="Text"><TextContentField onSubmit={onSubmit} /></TabItem>
        <TabItem title="Link"><LinkContentField onSubmit={onSubmit} /></TabItem>
      </Tabs>
    </div>
  )
}

export type ContentFieldProps = {
  onSubmit: (post: Post) => void
}


function TextContentField({ onSubmit }: ContentFieldProps) {
  const router = useRouter();

  const [postValue, setPostValue] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isValidText = !(postValue.length < 3 || postValue.length > 300);

  const submitBlogPost = async () => {
    if (!isValidText) return;
    setSubmitting(true);
    const postRes = await fetch('/api/blogs', {
      method: 'POST',
      body: JSON.stringify({
        type: 'text', body: postValue
      })
    });
    setPostValue('');
    onSubmit(await postRes.json());
    setSubmitting(false);
    router.push('/');
  };


  return (
    <div className="bg-yellow-50 p-4">
      <div className='flex flex-col items-end gap-3'>
        <TextArea
          label="Post Text"
          className="flex-grow w-[100%]"
          value={postValue} onChange={setPostValue}
          errorMessage={!isValidText}
        />
        <Button onPress={submitBlogPost} isDisabled={submitting}>Post</Button>
      </div>
    </div>
  );
}


function LinkContentField({ onSubmit }: ContentFieldProps) {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isValidURL = isWebUri(url);

  const submitBlogPost = async () => {
    if (!isValidURL || !isValidTitle(title)) return;

    setSubmitting(true);
    const postRes = await fetch('/api/blogs', {
      method: 'POST',
      body: JSON.stringify({
        type: 'link', body: { title, url }
      })
    });
    setTitle('');
    setUrl('');
    onSubmit(await postRes.json());
    setSubmitting(false);
    router.push('/');
  };


  return (
    <div className="bg-yellow-50 p-4">
      <div className='flex flex-col items-end gap-3'>
        <div className="flex items-center gap-2 w-[100%]">
          <TextField
            className="flex-grow"
            label="Title"
            errorMessage={!isValidTitle(title)}
            value={title} onChange={setTitle}
          />
        </div>
        <div className="flex items-center gap-2 w-[100%]">
          <TextField
            label="URL"
            className="flex-grow"
            errorMessage={!isValidURL}
            value={url} onChange={setUrl}
          />
        </div>
        <Button onPress={submitBlogPost} isDisabled={submitting}>Post</Button>
      </div>
    </div>
  );
}


