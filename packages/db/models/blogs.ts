import { prisma } from '../index';
import type { PostContent } from './types';

export async function getBlogs(userId: string | undefined | null = '') {
  const blogPost = await prisma.blogPost.findMany({
    take: 10,
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      author: { select: { name: true, image: true } },
      comments: {
        select: {
          createdAt: true,
          text: true,
          author: { select: { name: true } }
        },
        orderBy: { createdAt: 'asc' }
      },
      likes: {
        select: { name: true },
        where: { id: userId || '' } // is the post liked by the logged in user
      },
      _count: { select: { likes: true } }
    }
  });

  return blogPost.map((blogPost) => {
    const formattedFields = {
      totalLikes: blogPost._count.likes,
      likedByUser: blogPost.likes.length > 0,
      createdAt: blogPost.createdAt.toString(),
      comments: blogPost.comments.map((comment) => ({
        ...comment,
        createdAt: comment.createdAt.toString(),
      })),
    };

    const out = {
      ...blogPost,
      ...formattedFields
    };

    return out;
  });
}

export async function addBlog(content: PostContent, userId: string) {
  return prisma.blogPost.create({
    data: {
      type: content.type,
      text: JSON.stringify(content.body),
      author: { connect: { id: userId } }
    }
  });
}

export async function likeBlog(blogId: number, userId: string) {
  return prisma.blogPost.update({
    where: { id: blogId },
    data: {
      likes: { connect: { id: userId } }
    }
  });
}

export async function dislikeBlog(blogId: number, userId: string) {
  return prisma.blogPost.update({
    data: {
      likes: {
        disconnect: {
          id: userId
        }
      }
    },
    where: { id: blogId },
  });
}


export async function addComment(comment: string, blogId: number, userId: string) {

  return prisma.blogPost.update({
    data: {
      comments: {
        create: {
          text: comment,
          author: { connect: { id: userId } },
        }
      }
    },
    where: { id: blogId },
  });
}