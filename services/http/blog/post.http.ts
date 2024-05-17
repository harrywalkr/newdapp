import { IPost, PostEndpoint, PostsQueryConfig } from "@/types/post.type";
import axiosInstance, { fetchData } from "../axios.config";

// Function to get all posts
export async function getAllPosts(
  options?: PostsQueryConfig
): Promise<PostEndpoint> {
  return fetchData<PostEndpoint>(
    `${process.env.NEXT_PUBLIC_BLOG_URL}/api/posts`,
    { method: 'GET', ...options }
  );
}

// Function to find post by ID
export async function findPostById(
  id: number | string
): Promise<{ data: IPost }> {
  return fetchData<{ data: IPost }>(
    `${process.env.NEXT_PUBLIC_BLOG_URL}/api/posts/${id}`,
    { method: 'GET' }
  );
}

// Function to create post
export async function createPost(postData: IPost): Promise<IPost> {
  return fetchData<IPost>(
    `${process.env.NEXT_PUBLIC_BLOG_URL}/api/posts`,
    {
      method: 'POST',
      data: postData,
    }
  );
}

// Function to update post
export async function updatePost(id: number, updatedData: IPost): Promise<IPost> {
  return fetchData<IPost>(
    `${process.env.NEXT_PUBLIC_BLOG_URL}/api/posts/${id}`,
    {
      method: 'PUT',
      data: updatedData,
    }
  );
}

// Function to delete post
export async function deletePost(id: number): Promise<{ message: string }> {
  return fetchData<{ message: string }>(
    `${process.env.NEXT_PUBLIC_BLOG_URL}/api/posts/${id}`,
    { method: 'DELETE' }
  );
}

// Function to find posts by tag
export async function findPostsByTag(tag: string[]): Promise<PostEndpoint> {
  return fetchData<PostEndpoint>(
    `${process.env.NEXT_PUBLIC_BLOG_URL}/api/tags/${tag.join(',')}`,
    { method: 'GET' }
  );
}

// Function to find posts by category
export async function findPostsByCategory(
  category: string,
  options?: PostsQueryConfig
): Promise<PostEndpoint> {
  return fetchData<PostEndpoint>(
    `${process.env.NEXT_PUBLIC_BLOG_URL}/api/posts/categories/${category}`,
    { method: 'GET', ...options }
  );
}