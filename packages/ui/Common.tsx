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


interface FieldInputProps {
  textValidation?: (str: string) => boolean;
  onChange?: (str: string) => void;
  type?: string;
}

export function TextField({
  textValidation = (str: string) => true,
  onChange = (str: string) => { },
  type = 'text'
}: FieldInputProps) {
  const [text, setText] = useState('');
  const [isError, setIsError] = useState(false);

  const onText = (newText: string) => {
    const isValid = textValidation(newText);
    setIsError(!isValid);
    setText(newText);
    if (isValid) onChange(newText);
  }

  const border = isError ? 'border border-red-500' : 'border';

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
      className={`py-1 px-4 rounded-full text-white 
        bg-gradient-to-b from-emerald-400 to-blue-400
        ${disabled && 'bg-slate-500'}
      `} >
      <div className="select-none">
        {children}

      </div>
    </button >
  );
}