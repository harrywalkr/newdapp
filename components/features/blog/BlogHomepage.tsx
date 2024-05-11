'use client'
import React, { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useQuery } from '@tanstack/react-query';
import { getAllPosts, findPostsByCategory } from '@/http/blog/post.http';
import { getAllCategories } from '@/http/blog/category.http';
import { IPost, PostEndpoint } from '@/types/post.type';
import { ICategory } from '@/types/category.type';
import clsx from 'clsx';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import TextTruncate from 'react-text-truncate';
import { useMedia } from 'react-use';
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter } from 'next/navigation';
import Tab from '@/components/ui/tab';

function ErrorFallback({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) {
    return (
        <div>
            There was an error: {error.message}
            <button onClick={resetErrorBoundary}>Try again</button>
        </div>
    );
}

interface Props {
    posts: PostEndpoint,
    categories: ICategory[]
}


export default function BlogHomepage(props: Props) {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const router = useRouter();
    const isDesktop = useMedia('(min-width: 1024px)');
    const isMobile = useMedia('(max-width: 767px)');

    const categoryQuery = useQuery({ initialData: props.categories, queryKey: ['categories'], queryFn: getAllCategories });
    const postsQuery = useQuery(
        {
            initialData: props.posts,
            queryKey: ['posts', selectedCategory, currentPage],
            queryFn: () => {
                if (selectedCategory === 'All') {
                    return getAllPosts({
                        params: {
                            pageNo: currentPage
                        }
                    });
                } else {
                    return findPostsByCategory(selectedCategory,
                        {
                            params: {
                                pageNo: currentPage
                            }
                        }
                    );
                }
            },
        }
    );

    const categories = categoryQuery.data ?? [];
    const posts = postsQuery.data?.data ?? [];
    const totalPages = postsQuery.data?.totalPages ?? 1;
    //FIXME: add total pages to backend

    const handleCategorySelect = (category: string) => {
        setSelectedCategory(category);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => {
            setSelectedCategory('All');
            setCurrentPage(1);
        }}>
            <React.Suspense fallback={<div>Loading...</div>}>
                <div>
                    <Tab tabItems={['All', ...categories.map(cat => cat.name)]} onClick={handleCategorySelect} />
                    <div className="content grid grid-cols-6 gap-6 md:gap-7 lg:gap-10 mt-5 lg:mt-8">
                        {posts.map((post: IPost, index: number) => (
                            <Card key={post.id} className={clsx('col-span-6', {
                                'md:col-span-6': index === 0,
                                'md:col-span-3': index !== 0,
                                'lg:col-span-3': index === 0 || index === 1,
                                'lg:col-span-2': index > 1
                            })}>
                                <CardContent className={
                                    clsx("!p-0 flex items-start justify-start rounded-md overflow-hidden h-full", {
                                        'flex-col': true, // default flex direction
                                        'md:flex-row': index === 0, // medium screens, first card only
                                        'lg:flex-row': index === 0 || index === 1 // large screens, first two cards
                                    })}
                                >
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_BLOG_URL}/uploads/${post.img}`}
                                        alt={post.title} //FIXME: add image alt tag to backend entity
                                        width={500}
                                        height={400}
                                        objectFit="cover"
                                        className={
                                            clsx("h-full w-full object-cover flex-col", {
                                                'md:w-3/5': index === 0, // medium screens, first card only
                                                'lg:w-3/5': index === 0 || index === 1 // large screens, first two cards
                                            })}
                                    />
                                    <div className='py-5 px-5 md:px-7 lg:px-8 lg:py-10 w-full flex flex-col items-start justify-between h-full'>
                                        <div className='flex flex-col items-start justify-start gap-3 md:gap-4'>
                                            <div className="head flex items-center justify-start gap-2 md:gap-4">
                                                <Badge>Badge</Badge>
                                                {/* FIXME: must come from backend and not hard-coded */}
                                                <h3 className='text-sm whitespace-nowrap'>5 min read</h3>
                                            </div>
                                            <h1 className='text-xl md:text-3xl m-0 mt-1'>{post.title}</h1>
                                            <TextTruncate
                                                line={isDesktop ? 3 : isMobile ? 2 : 3}
                                                element="p"
                                                truncateText="…"
                                                text={post.summary}
                                                containerClassName='text-base text-muted-foreground'
                                            />
                                        </div>
                                        <Button variant='outline' className='mt-5'
                                            onClick={() => router.push(`/blog/${post.id.toString()}`)}
                                        >Read more &gt;</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    <Pagination className='mt-10 md:mt-14 lg:mt-20'>
                        <PaginationContent>
                            {[...Array(totalPages)].map((_, index) => (
                                <PaginationItem key={index}>
                                    <PaginationLink href="#" onClick={() => handlePageChange(index + 1)}>
                                        {index + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                        </PaginationContent>
                    </Pagination>
                </div>
            </React.Suspense>
        </ErrorBoundary>
    );
}
