import { AiFillFire } from 'react-icons/ai';
import { BsExclamationDiamond } from 'react-icons/bs';

export default function StreakStrike({ strikes, streak }: { streak: number, strikes: number }) {
  return (
    <div className='bg-gradient-to-r from-pink-400 to-purple-500'>
      <div className='flex justify-between text-3xl p-2'>
        <div className='flex items-center select-none'>
          <AiFillFire className='text-black w-8 h-8 fill-fuchsia-800 animate-pulse' />
          <span className='font-serif text-fuchsia-900'>{streak}</span>
        </div>


        <div className='flex gap-1 items-center select-none font-serif text-black'>
          <BsExclamationDiamond className='h-7 w-7 pr-1' />
          <span>{strikes}</span>
          <span className='font-extrabold'>/</span>
          <span>3</span>
        </div>
      </div>
    </div>
    // <pre>{`${streak} streak, ${strikes} strikes`}</pre>
  );
}