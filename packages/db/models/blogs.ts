import { prisma } from '../index';
import type { Prisma } from '@prisma/client';

export async function getBlogs(email: string = '') {
  const blogPost = await prisma.blogPost.findMany({
    take: 10,
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      author: { select: { name: true, image: true } },
      likes: {
        select: { email: true },
        where: { email: email }
      },
      _count: { select: { likes: true } }
    }
  });

  return blogPost.map((blogPost) => {
    const formattedFields = {
      totalLikes: blogPost._count.likes,
      likedByUser: blogPost.likes.length > 0,
      createdAt: blogPost.createdAt.toString(),
    };

    const out = {
      ...blogPost,
      ...formattedFields
    };

    return out;
  });
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