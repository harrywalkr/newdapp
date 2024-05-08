'use client';
import React, { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import Tab from '@/components/features/blog/tab';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getAllPosts } from '@/http/blog/post.http';
import { IPost, PostEndpoint } from '@/types/post.type';
import { ICategory } from '@/types/category.type';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import clsx from 'clsx';


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
                    <div className="content grid grid-cols-6 gap-4 mt-8">
                        {data.map((post, index) => (
                            <Card
                                key={post.id}
                                className={clsx('col-span-6', {
                                    'md:col-span-6': index === 0,
                                    'md:col-span-3': index !== 0,
                                    'lg:col-span-3': index === 0 || index === 1,
                                    'lg:col-span-2': index > 1
                                })}>
                                <CardContent className="mt-5">
                                    <h3>{post.title}</h3>
                                    <p>{post.summary}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </React.Suspense>
        </ErrorBoundary>
    );
}
