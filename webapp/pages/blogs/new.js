import { useState } from "react";
import { GiHeartPlus } from "react-icons/gi";

function TextField({
  textValidation = () => true,
  onChange = () => { }
} = {}) {
  const [text, setText] = useState("");
  const [isError, setIsError] = useState(false);

  const onText = (newText) => {
    const isValid = textValidation(newText);
    setIsError(!isValid);
    setText(newText);
    if (isValid) onChange(newText);
  }

  const border = isError ? 'border-2 border-red-500' : 'border';

  return (
    <div className="">
      <textarea
        className={`rounded-md bg-white-50 resize-y p-1 w-[100%] ${border}`}
        value={text}
        onChange={(event) => onText(event.target.value)}
      />
    </div>
  )
}

function Button({ children }) {
  return (
    <button className="py-2 px-4 rounded-full bg-pink-500 border-2 border-red-600 text-white">
      {children}
    </button>
  );
}


export default function ContentList() {
  const [text, setText] = useState('');



  return (
    <div className="mx-auto max-w-xl">
      <div className="flex flex-col p-3 gap-2">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl py-1">Blog Text:</h1>
          <TextField
            textValidation={(str) => str.length > 0 && str.length < 1000}
            onChange={setText}
          />
        </div>
        <div className="flex justify-end">
          <Button><GiHeartPlus /></Button>
        </div>
      </div>
    </div>
  )
}
