import { dislikeBlog, getBlogs } from "../models/blogs";

async function main() {
  await dislikeBlog(1, 'lazohbeem02@gmail.com');

  const data = await getBlogs('lazohbeem02@gmail.com');
  console.dir(data, { depth: 100 });
}

main().catch(console.error);
