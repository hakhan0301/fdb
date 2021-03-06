import { useButton } from '@react-aria/button';
import { RefObject, useRef } from 'react';
import type { AriaButtonProps } from "@react-types/button";

export default function Button(props: AriaButtonProps<"button">) {
  let { children } = props;

  return (
    <BaseButton {...props}
      className={`py-2 px-4 rounded-full `}>
      {children}
    </BaseButton>
  );
}


export function BaseButton(props: AriaButtonProps<"button"> & { className?: string }) {
  let ref = useRef() as RefObject<HTMLButtonElement>;
  let { buttonProps } = useButton(props, ref);
  let { children } = props;

  return (
    <button {...buttonProps} ref={ref} type="button"
      aria-label='sussy button'
      className={`${props.className} text-white border-0 outline-none
        bg-gradient-to-b from-emerald-400 to-cyan-400
        disabled:from-slate-400 disabled:to-slate-500
        hover:from-orange-300 hover:to-rose-300
        hover:shadow-lg
      `}>
      {children}
    </button>
  );
}