import TextField from "@fdb/ui/common/TextField";
import Button from "@fdb/ui/common/Button";
import { BsGoogle, BsDiscord } from "react-icons/bs";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {

  const [loginSpin, setLoginSpin] = useState(false);
  const [signupSpin, setSignupSpin] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const signUp = async (username: string, password: string) => {
    await fetch('/api/auth/signUp', {
      body: JSON.stringify({ username, password }),
      method: 'POST'
    });
    setUsername("");
    setPassword("");
  };

  return (
    <div className="py-6 text-white">
      <div className="flex flex-col gap-6">
        {/* login/signup container */}
        <div className={`flex flex-col sm:flex-row gap-6 justify-center items-center`}>
          {/* login */}
          <div className={`
              bg-gradient-to-br from-orange-400 to-pink-500 rounded-lg shadow-lg text-white
              ${loginSpin && 'animate-spin relative'}`}
          >
            <div className="flex flex-col gap-4 p-6 pb-6">
              <h1 className="text-3xl">Login</h1>
              <div>
                <h1>Username:</h1>
                <TextField value={username} onChange={setUsername} />
              </div>
              <div>
                <h1>Password:</h1>
                <TextField type='password' value={password} onChange={setPassword} />
              </div>
              <div className="flex justify-end">
                <Button onPress={() => signIn('credentials', { username, password, callbackUrl: '/test' })}>Submit</Button>
                {/* <Button onPress={() => setLoginSpin(!loginSpin)}>Submit</Button> */}
              </div>
            </div>
          </div>
          {/* sign up */}
          <div className={`bg-green-400 rounded-lg shadow-lg ${signupSpin && 'transition-opacity opacity-0 duration-1000'}`}>
            <div className="flex flex-col gap-4 p-6 pb-6 ">
              <h1 className="text-3xl">Sign up</h1>
              <div>
                <h1>Username:</h1>
                <TextField value={username} onChange={setUsername} />
              </div>
              <div>
                <h1>Password:</h1>
                <TextField type='password' value={password} onChange={setPassword} />
              </div>
              <div className="flex justify-end">
                <Button onPress={() => signUp(username, password)}>Submit</Button>
                {/* <Button onPress={() => setSignupSpin(!signupSpin)}>Submit</Button> */}
              </div>
            </div>
          </div>
        </div>
      </div>


    </div >
  );
}

