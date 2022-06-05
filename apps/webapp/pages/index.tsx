import ContentList from '../lib/components/ContentList';
import { getBlogs } from '../lib/models/blogs';

import type { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next';


export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      blogPosts: await getBlogs()
    }
  }
}


export default function Home({ blogPosts }) {
  return (
    <div>



      <ContentList blogPosts={blogPosts} />

    </div>
  )
}
