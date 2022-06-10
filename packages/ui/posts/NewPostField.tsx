import TextArea from "@fdb/ui/common/TextArea";
import Button from "@fdb/ui/common/Button";
import { useRouter } from 'next/router';
import { useState } from "react";

export default function NewPostField({ }: any) {
  const router = useRouter();

  const [postValue, setPostValue] = useState('');
  const [submitting, setSubmitting] = useState(false)

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
  )
}