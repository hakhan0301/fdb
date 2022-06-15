import { AiFillFire } from 'react-icons/ai';
import { BsExclamationDiamond } from 'react-icons/bs';
import Popup from 'reactjs-popup';
import './styles/StreakStrike.css';


function StreakInfoPopup() {
  return (
    <div className='bg-black text-fuchsia-300 rounded-md'>
      <div className='p-2 text-center'>
        Your current streak.
      </div>
    </div>
  );
};


function StrikesInfoPopup() {
  return (
    <div className='bg-black text-fuchsia-300 rounded-md'>
      <div className='p-2 text-center'>
        You must post every day. <br />
      </div>
    </div>
  );
};

export default function StreakStrike({ strikes, streak }: { streak: number, strikes: number }) {
  return (
    <div className='bg-gradient-to-r from-pink-400 to-purple-500'>
      <div className='flex justify-between text-3xl p-2'>
        <div className='flex gap-1 items-center select-none'>

          <Popup position="bottom left" on={['hover', 'click']} trigger={
            <button>
              <AiFillFire className='text-black w-8 h-8 fill-red-700 animate-pulse' />
            </button>} >
            <StreakInfoPopup />
          </Popup>

          <span className='font-serif text-fuchsia-900'>{streak}</span>
        </div>


        <div className='flex gap-1 items-center select-none font-serif text-black'>
          <span>{strikes}</span>
          <span className='font-extrabold'>/</span>
          <span className='pr-1'>3</span>
          <Popup position="bottom right" on={['hover', 'click']} trigger={
            <button>
              <BsExclamationDiamond className='h-7 w-7 pr-1' />
            </button>} >
            <StrikesInfoPopup />
          </Popup>
        </div>
      </div>
    </div>
    // <pre>{`${streak} streak, ${strikes} strikes`}</pre>
  );
}