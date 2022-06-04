import { PrismaClient } from '@prisma/client';
import type { Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const dateStripped = obj => {
  let newObj = {}
  Object.keys(obj).forEach(key => {
    let value = obj[key]
    if (value !== null) {
      if (Array.isArray(value)) {
        value = value.map(item => dateStripped(item))
      } else if (typeof value === 'object' && typeof value.getMonth === 'function') {
        value = JSON.parse(JSON.stringify(value))
      }
      else if (typeof value === 'object') {
        value = dateStripped(value)
      }
    }
    newObj[key] = value
  })
  return newObj
}

export async function getBlogs() {
  const blogPost = await prisma.blogPost.findMany({
    take: 10,
    orderBy: {
      createdAt: 'desc'
    }
  });

  return blogPost.map(dateStripped);
}

export async function addBlog(blogPost: Prisma.BlogPostCreateInput) {
  await prisma.blogPost.create({
    data: blogPost
  });
}