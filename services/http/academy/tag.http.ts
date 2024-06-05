import { ITag } from "@/types/tag.type";
import axiosInstance, { fetchData } from "../axios.config";

// Function to get all tags
export async function getAllTags(): Promise<ITag[]> {
  return fetchData<ITag[]>(`${process.env.NEXT_PUBLIC_BLOG_URL}/api/tags`, {
    method: "GET",
  });
}

// Function to find tag by ID
export async function findTagById(id: string): Promise<ITag> {
  return fetchData<ITag>(`${process.env.NEXT_PUBLIC_BLOG_URL}/api/tags/${id}`, {
    method: "GET",
  });
}

// Function to create tag
export async function createTag(tagData: ITag): Promise<ITag> {
  return fetchData<ITag>(`${process.env.NEXT_PUBLIC_BLOG_URL}/api/tags`, {
    method: "POST",
    data: tagData,
  });
}

// Function to update tag
export async function updateTag(id: string, updatedData: ITag): Promise<ITag> {
  return fetchData<ITag>(`${process.env.NEXT_PUBLIC_BLOG_URL}/api/tags/${id}`, {
    method: "PUT",
    data: updatedData,
  });
}

// Function to delete tag
export async function deleteTag(id: string): Promise<ITag> {
  return fetchData<ITag>(`${process.env.NEXT_PUBLIC_BLOG_URL}/api/tags/${id}`, {
    method: "DELETE",
  });
}
