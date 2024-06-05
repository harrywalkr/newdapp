import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { ICategory } from "@/types/category.type";
import { fetchData } from "../axios.config";

// findAll
export async function getAllCategories(): Promise<ICategory[]> {
  return fetchData<ICategory[]>(
    `${process.env.NEXT_PUBLIC_BLOG_URL}/api/category`
  );
}

// findOne
export async function findCategoryById(id: string): Promise<ICategory> {
  return fetchData<ICategory>(
    `${process.env.NEXT_PUBLIC_BLOG_URL}/api/category/${id}`
  );
}

// Function to create category
export async function createCategory(
  categoryData: ICategory
): Promise<ICategory> {
  return fetchData<ICategory>(
    `${process.env.NEXT_PUBLIC_BLOG_URL}/api/category`,
    {
      method: "POST",
      data: categoryData,
    }
  );
}

// Function to update category
export async function updateCategory(
  id: string,
  updatedData: ICategory
): Promise<ICategory> {
  return fetchData<ICategory>(
    `${process.env.NEXT_PUBLIC_BLOG_URL}/api/category/${id}`,
    {
      method: "PUT",
      data: updatedData,
    }
  );
}
// Function to delete category
export async function deleteCategory(id: string): Promise<{ message: string }> {
  return fetchData<{ message: string }>(
    `${process.env.NEXT_PUBLIC_BLOG_URL}/api/category/${id}`,
    {
      method: 'DELETE',
    }
  );
}
