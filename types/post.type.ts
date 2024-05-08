import { AxiosRequestConfig } from "axios";

export interface PostEndpoint {
  data: IPost[];
  count: number;
  pageSize: number;
  pageNo: number;
}

export interface IPost {
  id: number;
  title: string;
  content: string;
  author: string;
  categories: string[];
  tags: string[];
  summary: string;
  slug: string;
  img: string;
}


export interface PostsQuery {
  pageSize?: number;
  pageNo?: number;
  sortField?: string;
  sortOrder?: string;
}

export interface PostsQueryConfig extends AxiosRequestConfig {
  params?: PostsQuery;
}
