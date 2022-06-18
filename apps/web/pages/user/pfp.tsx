import ImageDragArea from "@fdb/ui/common/ImageDragArea";
import Button from "@fdb/ui/common/Button";
import { useState } from "react";
import { useRouter } from "next/router";
import { subscribe } from "@fdb/notifications";
import { useSession } from "next-auth/react";

export default function PFP() {
  const router = useRouter();
  const session = useSession();

  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const submitImage = async () => {
    if (!imageFile) return;

    setSubmitting(true);

    const res = await fetch('/api/images/generateURL');
    const imageUploadURL = await res.text();

    await fetch(imageUploadURL, {
      method: 'PUT',
      headers: { 'Content-Type': 'multipart/form-data' },
      body: imageFile
    });

    await fetch('/api/user/pfp', {
      method: 'POST',
      body: JSON.stringify({ url: imageUploadURL.split('?')[0] })
    });


    // @ts-ignore
    subscribe(session?.data?.user?.id);

    setImageFile(null);
    setSubmitting(false);
    router.push('/');
  };


  return (
    <div className="py-6 text-white">
      <div className="flex justify-center">
        {/* login/signup container */}
        <div className={`
              p-3 flex flex-col gap-2 
              bg-gradient-to-br from-orange-400 to-pink-500 rounded-lg shadow-lg text-white
          `}>
          <div className="text-2xl">Set PFP Here</div>
          <div className="max-w-xl text-black">
            <ImageDragArea
              onChange={(imageFile) => setImageFile(imageFile)}
            />
          </div>

          <div className="flex justify-end">
            <Button onPress={submitImage} isDisabled={submitting}>Post</Button>
          </div>



        </div>
      </div>
    </div >
  );
}