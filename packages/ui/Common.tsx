import { useState } from "react";

export function TextArea({
  textValidation = (str: string) => true,
  onChange = (str: string) => { }
} = {}) {
  const [text, setText] = useState('');
  const [isError, setIsError] = useState(false);

  const onText = (newText: string) => {
    const isValid = textValidation(newText);
    setIsError(!isValid);
    setText(newText);
    if (isValid) onChange(newText);
  }

  const border = isError ? 'border-2 border-red-500' : 'border';

  return (
    <div className="">
      <textarea
        className={`form-textarea rounded-md bg-white-50 resize-y p-1 w-[100%] ${border} text-black`}
        value={text}
        onChange={(event) => onText(event.target.value)}
      />
    </div>
  )
}