import { AxiosRequestConfig } from "axios";

export interface PostEndpoint {
  data: IPost[];
  count: number;
  pageSize: number;
  pageNo: number;
  totalPages?: string;
  //FIXME: add total pages to backend
}

//FIXME: make all of the below not null and make them mandatory in the backend
export interface IPost {
  id: number;
  title: string;
  content: string;
  contentHtml: string;
  author: string;
  categories: string[] | null;
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
