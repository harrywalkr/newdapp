import React from 'react'
import Tab from '@/components/features/blog/tab'
import BlogHomepage from '@/components/features/blog/BlogHomepage'
import { getAllPosts } from '@/http/blog/post.http';
import { getAllCategories } from '@/http/blog/category.http';

export default async function Blog() {
    // FIXME: implement seo meta data to all pages

    const posts = await getAllPosts()
    const categories = await getAllCategories()

    return (
        <div>
            <BlogHomepage posts={posts} categories={categories} />
        </div>
    )
}
