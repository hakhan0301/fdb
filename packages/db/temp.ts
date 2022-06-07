import { prisma } from './index';

async function main() {
  await prisma.blogPost.update({
    where: {
      id: 1
    },
    data: {
      likes: {
        connect: {
          email: 'lazohbeem02@gmail.com'
        }
      }
    }
  });
}

main().catch(console.error);