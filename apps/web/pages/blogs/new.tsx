import { useState } from "react";
import { GiHeartPlus } from "react-icons/gi";
import { useRouter } from 'next/router';
import TextArea from '@fdb/ui/common/TextArea';
import Button from "@fdb/ui/common/Button";


export default function ContentList() {
  const [text, setText] = useState('SUSSSY BAKA');
  const [disabledSubmit, setDisabledSubmit] = useState(false)
  const router = useRouter();

  const submitBlogPost = async () => {
    setDisabledSubmit(true);
    await fetch('/api/blogs', {
      method: 'POST',
      body: text
    });
    router.push('/');
  };

  return (
    <div className="h-[100%] bg-gray-800 ">
      <div className="mx-auto max-w-xl text-white">
        <div className="flex flex-col p-3 gap-2">
          <div className="flex flex-col gap-2">
            <h1 className="text-xl py-1">Blog Text:</h1>
            <TextArea
              textValidation={(str) => str.length > 0 && str.length < 1000}
              onChange={setText}
            />
          </div>
          <div className="flex justify-end">
            <Button onPress={submitBlogPost} isDisabled={disabledSubmit}>
              <GiHeartPlus />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
