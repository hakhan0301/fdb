import TextArea from "@fdb/ui/common/TextArea";
import TextField from "@fdb/ui/common/TextField";
import Button from "@fdb/ui/common/Button";
import { useRouter } from 'next/router';
import { useState } from "react";
import { Tabs, TabItem } from "../common/Tabs";

import { isWebUri } from 'valid-url';


export default function NewPostField({ }: any) {
  return (
    <div className='bg-emerald-100 p-4'>
      <Tabs >
        <TabItem title="Text"><TextContentField /></TabItem>
        <TabItem title="Link"><LinkContentField /></TabItem>
      </Tabs>
    </div>
  )
}


function LinkContentField({ }: any) {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submitBlogPost = async () => {
    setSubmitting(true);
    await fetch('/api/blogs', {
      method: 'POST',
      body: JSON.stringify({
        type: 'link', body: { title, url }
      })
    });
    setTitle('');
    setUrl('');
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
            errorMessage={title.length < 3 || title.length > 200}
            value={title} onChange={setTitle}
          />
        </div>
        <div className="flex items-center gap-2 w-[100%]">
          <TextField
            label="URL"
            className="flex-grow"
            errorMessage={!isWebUri(url)}
            value={url} onChange={setUrl}
          />
        </div>
        <Button onPress={submitBlogPost} isDisabled={submitting}>Post</Button>
      </div>
    </div>
  );
}

function TextContentField({ }: any) {
  const router = useRouter();

  const [postValue, setPostValue] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submitBlogPost = async () => {
    setSubmitting(true);
    await fetch('/api/blogs', {
      method: 'POST',
      body: JSON.stringify({
        type: 'text', body: postValue
      })
    });
    setPostValue('');
    setSubmitting(false);
    router.push('/');
  };


  return (
    <div className="bg-yellow-50 p-2 pb-3">
      <div className='px-1px'>Post Text</div>
      <div className='flex flex-col md:flex-row items-start gap-2'>
        <TextArea
          className="flex-grow w-[100%]"
          value={postValue} onChange={setPostValue}
        />
        <Button onPress={submitBlogPost} isDisabled={submitting}>Post</Button>
      </div>
    </div>
  );
}