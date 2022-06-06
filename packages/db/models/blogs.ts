import { prisma } from '../index';
import type { Prisma } from '@prisma/client';
import type { DefaultSession } from 'next-auth';

export async function getBlogs() {
  const blogPost = await prisma.blogPost.findMany({
    take: 10,
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      user: { select: { name: true, image: true } }
    }
  });

  return blogPost.map((blogPost) => ({
    ...blogPost,
    createdAt: blogPost.createdAt.toString()
  }));
}

export async function addBlog(text: string, email: string) {
  await prisma.blogPost.create({
    data: {
      text,
      user: {
        connect: { email: email }
      }
    }
  });
}