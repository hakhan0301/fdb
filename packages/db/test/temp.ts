import { getBlogs } from "../models/blogs";

getBlogs('lazohbeem02@gmail.com').then(
  data => console.dir(data, { depth: 100 })
);