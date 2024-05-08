import { ITag } from "@/types/tag.type";
import axiosInstance from "../axios.config";

// findAll
export async function getAllTags(): Promise<ITag[]> {
  try {
    const response = await axiosInstance.get("/tags");
    return response.data;
  } catch (error) {
    console.error("Error fetching tags:", error);
    throw error;
  }
}

// findOne (assuming there might be a use case)
export async function findTagById(id: string): Promise<ITag> {
  try {
    const response = await axiosInstance.get(`/api/tags/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tag by ID:", error);
    throw error;
  }
}

// create
export async function createTag(tagData: ITag): Promise<ITag> {
  try {
    const response = await axiosInstance.post("/api/tags", tagData);
    return response.data;
  } catch (error) {
    console.error("Error creating tag:", error);
    throw error;
  }
}

// update
export async function updateTag(id: string, updatedData: ITag): Promise<ITag> {
  try {
    const response = await axiosInstance.put(`/api/tags/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating tag:", error);
    throw error;
  }
}

// remove
export async function deleteTag(id: string): Promise<ITag> {
  try {
    const response = await axiosInstance.delete(`/api/tags/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting tag:", error);
    throw error;
  }
}
