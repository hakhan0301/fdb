import { Post } from "@fdb/db/models/blogs";
import { createContext } from "react";

export interface AppContext {
  streaks: number,
  strikes: number,
  posts: Post[],
  addPost: (post: Post) => void,
  resetStreakStrikes: () => Promise<void>,
}

const defaultApp: AppContext = {
  streaks: -1,
  strikes: -1,
  posts: [],
  addPost: () => { },
  resetStreakStrikes: async () => { }
}

const appContext = createContext<AppContext>(defaultApp);

export default appContext;