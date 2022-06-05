import { TextField, Button } from "@fdb/ui/Common";
import { BsGoogle } from "react-icons/bs";
import { useSession, signIn, signOut } from "next-auth/react";

export default function LoginPage() {

  return (
    <div className="py-6 text-white">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <div className="bg-gradient-to-br from-orange-400 to-pink-500 rounded-lg shadow-lg text-white">
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
                <Button>Submit</Button>
              </div>
            </div>

          </div>

          <div className="bg-green-400 rounded-lg shadow-lg">
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
                <Button>Submit</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-row justify-center gap-2">
          <Button onClick={() => signIn("google")}><BsGoogle /></Button>
          <Button onClick={() => signOut()}>Sign Out</Button>
        </div>

      </div>


    </div >
  );
}

