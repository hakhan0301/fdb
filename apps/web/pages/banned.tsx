// import savage icon from react icons
import { MdGavel } from 'react-icons/md';

export default function BannedPage() {
  return (
    <div className="h-full w-full bg-red-500">
      <div className="h-full flex gap-4 flex-col content-center justify-center items-center">
        <MdGavel className="flex-no-shrink fill-current w-16 h-16" />
        <p className="text-3xl font-bold text-center max-w-xl">
          Your account has been banned
          for missing too many daily posts.
        </p>
      </div>
    </div>
  )
}