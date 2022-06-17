import { useTextField } from '@react-aria/textfield';
import { RefObject, useRef } from 'react';
import type { AriaTextFieldProps } from "@react-types/textfield";

export default function TextField(props: AriaTextFieldProps & { className?: string }) {
  let ref = useRef() as RefObject<HTMLTextAreaElement>;
  // @ts-ignore
  let { labelProps, inputProps, descriptionProps, errorMessageProps } = useTextField(props, ref);
  let { label } = props;

  return (
    <div className={`${props.className} flex flex-col`}>
      <label {...labelProps}>{label}</label>
      {/* @ts-ignore */}
      <textarea {...inputProps} ref={ref}
        className={`rounded-md bg-white-50 resize-y p-1 w-[100%] text-black border 
            ${props.errorMessage && 'outline-red-500 border-red-500'}`}
      />
      {props.description && (
        <div {...descriptionProps}>
          {props.description}
        </div>
      )}
    </div>
  );
}
