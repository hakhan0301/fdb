import ModalImage from "react-modal-image-responsive";
import TextField from "@fdb/ui/common/TextField";
import Button from "@fdb/ui/common/Button";
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import { useDropzone } from 'react-dropzone';

//import cross from react icons
import { AiOutlineClose } from 'react-icons/ai';
import { AiOutlinePlus } from 'react-icons/ai';

import { isValidTitle } from "../helpers";


function OuterDragArea({ onChange }: { onChange: (image: File) => void }) {
  const { getRootProps, getInputProps, isFocused, acceptedFiles } = useDropzone({
    multiple: false,
    maxSize: 10000000,
    accept: { 'image/*': [] },
  });

  useEffect(() => {
    if (acceptedFiles.length == 0) return;
    onChange(acceptedFiles[0]);
  }, [acceptedFiles, onChange]);

  return (
    <>
      <div {...getRootProps({ className: 'w-[100%]', onChange: console.log })}>
        <div className={`flex items-center justify-center bg-pink-100 p-10 cursor-pointer
          ${isFocused ? '' : 'hover:border-emerald-200'}
          border-dashed border-2 ${isFocused ? 'border-emerald-400' : 'border-red-400'}`}
        >
          <input {...getInputProps()} onChange={() => console.log('susy')} />
          <AiOutlinePlus className={`${isFocused ? 'text-emerald-400' : 'text-red-400'} text-2xl`} />
        </div>
      </div>
    </>
  );
}


export default function ImageContentField({ }: any) {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (!imageFile) {
      setImagePreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(imageFile);
    setImagePreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile])

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


        {imagePreview
          ? (<div className="flex flex-col gap-1 items-end">
            <AiOutlineClose
              className="cursor-pointer hover:text-red-600"
              onClick={() => setImageFile(null)}
            />
            <ModalImage
              className="w-full h-auto max-h-32"
              small={imagePreview}
              large={imagePreview}
              hideDownload hideZoom
            />
          </div>)
          : <OuterDragArea onChange={onImage} />
        }

        <Button onPress={submitImage} isDisabled={submitting}>Post</Button>
      </div>
    </div>
  );
}