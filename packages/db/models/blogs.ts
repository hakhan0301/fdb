import { prisma } from '../index';
import type { PostContent } from './types';

export async function getBlogs(email: string | undefined | null = '') {
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
        select: { email: true },
        where: { email: email || '' } // is the post liked by the logged in user
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

export async function addBlog(content: PostContent, email: string) {
  return prisma.blogPost.create({
    data: {
      type: content.type,
      text: typeof content.body == 'string' ? content.body : JSON.stringify(content.body),
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

export async function dislikeBlog(blogId: number, email: string) {
  return prisma.blogPost.update({
    data: {
      likes: {
        disconnect: {
          email
        }
      }
    },
    where: { id: blogId },
  });
}


export async function addComment(comment: string, blogId: number, email: string) {

  return prisma.blogPost.update({
    data: {
      comments: {
        create: {
          text: comment,
          author: { connect: { email: email } },
        }
      }
    },
    where: { id: blogId },
  });
}