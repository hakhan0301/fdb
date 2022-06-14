// @ts-ignore
import ModalImage from "react-modal-image-responsive";
import { AiOutlineClose, AiOutlinePlus } from 'react-icons/ai';
import { useEffect, useState } from "react";
import { useDropzone } from 'react-dropzone';
import { BrowserView, MobileView } from 'react-device-detect';

interface Props {
  onChange?: ((image: File) => void) | null
}

export default function ImageDragArea({ onChange = null }: Props = {}) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { getRootProps, getInputProps, isFocused, acceptedFiles } = useDropzone({
    multiple: false,
    maxSize: 10000000,
    accept: { 'image/*': [] },
  });

  useEffect(() => {
    if (!imageFile) {
      setImagePreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(imageFile);
    setImagePreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  useEffect(() => {
    if (acceptedFiles.length == 0) return;
    setImageFile(acceptedFiles[0]);
  }, [acceptedFiles]);

  useEffect(() => {
    if (!imageFile) return;
    if (onChange)
      onChange(imageFile);
  }, [imageFile, onChange]);

  return (
    <div className="w-full">
      <BrowserView>
        {imagePreview

          ? (<div className={`flex flex-col p-2 gap-1 items-end w-[100%] bg-pink-100 border border-pink-300 shadow-lg`}>
            <AiOutlineClose
              className="cursor-pointer hover:text-red-600"
              onClick={() => setImageFile(null)}
            />
            <div className="flex justify-center w-full h-auto">
              <ModalImage
                className="w-full h-auto"
                small={imagePreview}
                large={imagePreview}
                hideDownload hideZoom
              />
            </div>
          </div>)
          : (<div className="w-full shadow-lg">
            <div {...getRootProps({ className: 'w-[100%]', onChange: console.log })}>
              <div className={`flex items-center justify-center bg-pink-100 p-10 cursor-pointer
        ${isFocused ? '' : 'hover:border-emerald-200'}
        border-dashed border-2 ${isFocused ? 'border-emerald-400' : 'border-red-400'}`}
              >
                <input {...getInputProps()} onChange={() => console.log('susy')} />
                <AiOutlinePlus className={`${isFocused ? 'text-emerald-400' : 'text-red-400'} text-2xl`} />
              </div>
            </div>
          </div>)
        }
      </BrowserView>

      <MobileView>
        <div>
          <input type="file" accept="image/*"
            onChange={(e) => setImageFile(e.target.files && e.target.files[0])} />
        </div>
      </MobileView>
    </div>
  );
}