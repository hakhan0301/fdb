import { prisma } from '../index';

export async function getBlogs() {
  const blogPost = await prisma.blogPost.findMany({
    take: 10,
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      author: { select: { name: true, image: true } },
      _count: {
        select: { likes: true }
      }
    }
  });

  return blogPost.map((blogPost) => ({
    ...blogPost,
    likes: blogPost._count.likes,
    createdAt: blogPost.createdAt.toString(),
  }));
}

export async function addBlog(text: string, email: string) {
  return prisma.blogPost.create({
    data: {
      text,
      author: { connect: { email: email } }
    }
  });
}

export async function likeBlog(blogId: number, email: string) {
  return prisma.blogPost.update({
    where: { id: blogId },
    data: {
      likes: { connect: { email: email } }
    }
  });
}