'use client';
import React, { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import Tab from '@/components/features/blog/tab';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getAllPosts } from '@/http/blog/post.http';
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
} from "@/components/ui/card"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

interface Props {
    posts: PostEndpoint,
    categories: ICategory[]
}

function ErrorFallback({ error, resetErrorBoundary }: any) {
    return (
        <div>
            There was an error: {error.message}
            <button onClick={resetErrorBoundary}>Try again</button>
        </div>
    );
}

export default function BlogHomepage({ posts, categories }: Props) {
    const [page, setPage] = useState(1);
    const isDesktop = useMedia('(min-width: 1024px)'); // For desktop
    const isMobile = useMedia('(max-width: 767px)');  // For mobile

    const { data } = useSuspenseQuery<IPost[]>({
        initialData: posts.data,
        queryKey: ['posts', page],
        queryFn: () => getAllPosts({ params: { pageNo: page } }).then(res => res.data)
    });

    return (
        <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => setPage(1)}>
            <React.Suspense fallback={<div>Loading...</div>}>
                <div>
                    <Tab tabItems={['View all', 'Crypto', 'Blockchain', 'NFT']} />
                    <div className="content grid grid-cols-6 gap-6 md:gap-7 lg:gap-8 mt-5 lg:mt-8">
                        {data.map((post, index) => (
                            <Card
                                key={post.id}
                                className={clsx('col-span-6', {
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
                                            clsx("h-full w-full object-cover", {
                                                'flex-col': true, // default flex direction
                                                'md:w-3/5': index === 0, // medium screens, first card only
                                                'lg:w-3/5': index === 0 || index === 1 // large screens, first two cards
                                            })}
                                    />
                                    <div className='py-5 px-5 lg:py-10 w-full md:w-2/5 flex flex-col items-start justify-between h-full'>
                                        <div className='flex flex-col items-start justify-start gap-3 md:gap-4'>
                                            <div className="head flex items-center justify-start gap-2 md:gap-4">
                                                <Badge>Badge</Badge>
                                                {/* FIXME: must come from backend and not hard-coded */}
                                                <h3 className='text-sm whitespace-nowrap'>5 min read</h3>
                                            </div>
                                            <h1 className='text-xl md:text-3xl m-0 mt-1'>{post.title}</h1>
                                            {/* <p className='text-base text-muted-foreground'>{post.summary}</p> */}
                                            <TextTruncate
                                                line={isDesktop ? 3 : isMobile ? 2 : 3}
                                                element="p"
                                                truncateText="…"
                                                text={post.summary}
                                                containerClassName='text-base text-muted-foreground'
                                            />
                                        </div>
                                        <Button variant='outline' className='mt-5'>Read more &gt;</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    <Pagination className='mt-10 md:mt-14 lg:mt-20'>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious href="#" />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#">1</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationNext href="#" />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </React.Suspense>
        </ErrorBoundary>
    );
}
