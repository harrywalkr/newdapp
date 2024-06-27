import { findPostById } from '@/services/http/academy/post.http';
import Image from 'next/image';
import React from 'react'


interface Props {
  params: params
}

type params = {
  id: string
}


export default async function page({ params }: Props) {

  const { data: post } = await findPostById(params.id)

  // Handle loading state or post not found
  if (!post) return <p>No post found!</p>;

  return (
    <article className=''>
      <h1>{post.title}</h1>
      <Image
        src={process.env.NEXT_PUBLIC_BLOG_URL + '/uploads/' + post.img}
        alt={post.title}
        width={700}
        height={500}
        className='w-full max-h-96 object-cover'
      />
      <p className='mt-3'>Author: {post.author}</p>
      <div className='mt-8' dangerouslySetInnerHTML={{ __html: post.content }} />
      {/* <p>Categories: {post.categories.join(', ')}</p> */}
      {/* <p>Tags: {post.tags.join(', ')}</p> */}
    </article>
  );
}
