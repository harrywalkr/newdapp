import React from 'react';
import { getAllPosts } from '@/services/http/academy/post.http';
import { getAllCategories } from '@/services/http/academy/category.http';
import AcademyHomepage from '@/components/features/academy/Homepage';

export const metadata = {
    title: 'Dextrading Academy',
    description: 'Explore Dextrading latest posts and categories in the Academy.',
    keywords: 'academy, blog, posts, categories, education',
    author: 'Dextrading Academy Team'
};

export default async function Blog() {
    // const posts = await getAllPosts();
    // const categories = await getAllCategories();

    return <AcademyHomepage />;
}
