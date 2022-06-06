import { TextField, Button } from "@fdb/ui/Common";
import { BsGoogle } from "react-icons/bs";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {

  const [loginSpin, setLoginSpin] = useState(false);
  const [signupSpin, setSignupSpin] = useState(false);

  return (
    <div className="py-6 text-white">
      <div className="flex flex-col gap-6">
        {/* login/signup container */}
        <div className={`flex flex-col sm:flex-row gap-6 justify-center items-center`}>
          {/* login */}
          <div className={`
              bg-gradient-to-br from-orange-400 to-pink-500 rounded-lg shadow-lg text-white
              ${loginSpin && 'animate-spin'}`}
          >
            <div className="flex flex-col gap-4 p-6 pb-6">
              <h1 className="text-3xl">Login</h1>
              <div>
                <h1>Username:</h1>
                <TextField />
              </div>
              <div>
                <h1>Password:</h1>
                <TextField type='password' />
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setLoginSpin(!loginSpin)}>Submit</Button>
              </div>
            </div>
          </div>
          {/* sign up */}
          <div className={`bg-green-400 rounded-lg shadow-lg ${signupSpin && 'animate-spin'}`}>
            <div className="flex flex-col gap-4 p-6 pb-6 ">
              <h1 className="text-3xl">Sign up</h1>
              <div>
                <h1>Username:</h1>
                <TextField />
              </div>
              <div>
                <h1>Password:</h1>
                <TextField type='password' />
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setSignupSpin(!signupSpin)}>Submit</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-row justify-center gap-2">
          <Button onClick={() => signIn("google", { callbackUrl: '/' })}><BsGoogle /></Button>
        </div>

      </div>


    </div >
  );
}

