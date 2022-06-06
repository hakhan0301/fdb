import { prisma } from '../index';
import type { Prisma } from '@prisma/client';

export async function getBlogs() {
  const blogPost = await prisma.blogPost.findMany({
    take: 10,
    orderBy: {
      createdAt: 'desc'
    }
  });

  return blogPost.map((blogPost) => ({
    ...blogPost,
    createdAt: blogPost.createdAt.toString()
  }));
}

export async function addBlog(blogPost: Prisma.BlogPostCreateInput) {
  await prisma.blogPost.create({
    data: blogPost
  });
}