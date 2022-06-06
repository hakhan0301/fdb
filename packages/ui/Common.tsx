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


export function TextField({
  textValidation = (str: string) => true,
  onChange = (str: string) => { },
  type = 'text'
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
      <input
        type={type}
        className={`rounded-md bg-white-50 resize-y p-1 w-[100%] text-black ${border}`}
        value={text}
        onChange={(event) => onText(event.target.value)}
      />
    </div>
  )
}



export function Button({ children, onClick = () => { }, disabled = false }: any) {
  return (
    <button onClick={onClick} disabled={disabled}
      className={`py-2 px-4 rounded-full 
        ${disabled ? 'bg-slate-500 border-white' : 'bg-pink-500 border-red-600'} 
        border-2 text-white 
        hover:animate-bounce 
      `} >
      {children}
    </button >
  );
}