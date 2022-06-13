import TextArea from "@fdb/ui/common/TextArea";
import TextField from "@fdb/ui/common/TextField";
import Button from "@fdb/ui/common/Button";
import { useRouter } from 'next/router';
import { LegacyRef, useRef, useState } from "react";
import { Tabs, TabItem } from "../common/Tabs";

import { isWebUri } from 'valid-url';


export default function NewPostField({ }: any) {
  return (
    <div className='bg-emerald-100 p-4'>
      <Tabs >
        <TabItem title="Text"><TextContentField /></TabItem>
        <TabItem title="Link"><LinkContentField /></TabItem>
        <TabItem title="Image"><ImageContentField /></TabItem>
      </Tabs>
    </div>
  )
}


function TextContentField({ }: any) {
  const router = useRouter();

  const [postValue, setPostValue] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isValidText = !(postValue.length < 3 || postValue.length > 300);

  const submitBlogPost = async () => {
    if (!isValidText) return;
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
const isValidTitle = (title: string) => !(title.length < 3 || title.length > 100);

function LinkContentField({ }: any) {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isValidURL = isWebUri(url);

  const submitBlogPost = async () => {
    if (!isValidURL || !isValidTitle(title)) return;

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


function ImageContentField({ }: any) {
  const router = useRouter();
  const ref: any = useRef();

  const [title, setTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const submitImage = async () => {

    if (!isValidTitle(title)) return;
    if (!imageFile) return;

    setSubmitting(true);

    const res = await fetch('/api/images/generateURL');
    const imageUploadURL = await res.text();

    await fetch(imageUploadURL, {
      method: 'PUT',
      headers: { 'Content-Type': 'multipart/form-data' },
      body: imageFile
    });


    await fetch('/api/blogs', {
      method: 'POST',
      body: JSON.stringify({
        type: 'image', body: { title, url: imageUploadURL.split('?')[0] }
      })
    });

    setTitle('');
    ref.current.value = "";
    setImageFile(null);
    setSubmitting(false);
    router.push('/');
  };

  const onImage = (imageFile: File | null) => {
    setImageFile(imageFile);
  }


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
        <div className="w-[100%]">
          <input type="file" accept="image/*" ref={ref}
            onChange={(e) => onImage(e.target.files && e.target.files[0])} />
        </div>
        <Button onPress={submitImage} isDisabled={submitting}>Post</Button>
      </div>
    </div>
  );
}