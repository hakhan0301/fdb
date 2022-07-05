import { createContext } from "react";
import { User } from "../pages/api/auth/signIn";

const defaultUser: User = {
  id: "null",
  name: "null",
  image: "null",
  streaks: -1,
  strikes: -1,
  lastPost: new Date(),
  lastStrike: new Date(),
}

const userContext = createContext<User>(defaultUser);

export default userContext;