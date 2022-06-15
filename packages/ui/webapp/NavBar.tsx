import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { GiSettingsKnobs, GiChalkOutlineMurder } from "react-icons/gi";
import Link from 'next/link';
import { useSession } from "next-auth/react";

import { signOut } from "next-auth/react";
import { useRedirect } from "../lib/authHelpers";

export default function NavBar() {
  const [menuHidden, setMenuHidden] = useState(true);

  const toggleMenu = () => setMenuHidden(!menuHidden);
  const session = useSession();

  useRedirect({ session });

  return (
    <div>
      {/* nav */}
      <div className="py-4 px-4 bg-purple-900 text-3xl text-pink-50">
        <div className="flex flex-row justify-between items-center">
          <Link href="/"><div className="cursor-pointer select-none">susy bakas</div></Link>

          <div className="flex flex-row gap-3 items-center">
            <Link href="/test"><div className="text-sm cursor-pointer">dev</div></Link>

            {session.data?.user
              ? <div className="cursor-pointer select-none" onClick={toggleMenu}><GiHamburgerMenu /></div>
              : <></>
            }
          </div>
        </div>
      </div>
      {/* menu */}
      <div className={`${menuHidden ? 'hidden' : 'fixed'} right-0`}>
        <div className="text-2xl text-pink-50">
          <div className="flex flex-col bg-purple-700 py-2 gap-1">
            {/* <Link href="/blogs/new" >
              <div onClick={toggleMenu} className="flex gap-2 items-center select-none cursor-pointer pl-3 pr-16 py-2 bg-purple-600">
                <GiHeartPlus /> Add Blog
              </div>
            </Link> */}
            <Link href="/user/pfp" >
              <div onClick={toggleMenu} className="flex gap-2 items-center select-none cursor-pointer pl-3 pr-16 py-2 bg-purple-600">
                <GiSettingsKnobs /> Set PFP
              </div>
            </Link>
            <div onClick={() => { signOut(); toggleMenu(); }} className="flex gap-2 items-center select-none cursor-pointer pl-3 pr-16 py-2 bg-purple-600">
              <GiChalkOutlineMurder /> Sign Out
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}