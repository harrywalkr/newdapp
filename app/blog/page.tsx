import React from 'react'
import BlogHomepage from '@/components/features/blog/BlogHomepage'
import { getAllPosts } from '@/services/http/blog/post.http';
import { getAllCategories } from '@/services/http/blog/category.http';

export default async function Blog() {
    // FIXME: implement seo meta data to all pages

    const posts = await getAllPosts()
    console.log('posts posts posts posts posts posts',posts)
    // const categories = await getAllCategories()

    return (
        <div>
            {/* <BlogHomepage posts={posts} categories={categories} /> */}
        </div>
    )
}
