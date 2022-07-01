import TextField from "@fdb/ui/common/TextField";
import Button from "@fdb/ui/common/Button";
import { useRouter } from 'next/router';
import { useState } from "react";

import { isValidTitle } from "../helpers";
import ImageDragArea from "../../common/ImageDragArea";
import { ContentFieldProps } from "../NewPostField";


export default function ImageContentField({ onSubmit }: ContentFieldProps) {
  const router = useRouter();

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


    const postRes = await fetch('/api/blogs', {
      method: 'POST',
      body: JSON.stringify({
        type: 'image', body: { title, url: imageUploadURL.split('?')[0] }
      })
    });

    setTitle('');
    setImageFile(null);
    onSubmit(await postRes.json());
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

        <ImageDragArea onChange={onImage} />

        <Button onPress={submitImage} isDisabled={submitting}>Post</Button>
      </div>
    </div>
  );
}