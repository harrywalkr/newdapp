import { AxiosRequestConfig } from "axios";
import { fetchData } from "./http/axios.config";

export async function isPaidMember(): Promise<boolean> {
  const key = localStorage.getItem("LICENSE_KEY");
  if (!key) {
    return false;
  }
  try {
    const data = await verifyKey(key);
    return data === "OK";
  } catch (error: any) {
    console.error("Error fetching key:", error.message);
    return false;
  }
}

export function isLoggedIn(): string | null {
  const key = localStorage.getItem("LICENSE_KEY");
  return key;
}

export const verifyKey = (
  key: string,
  options?: AxiosRequestConfig
): Promise<any> => {
  const config: AxiosRequestConfig = {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_ACCESS_KEY}`, // Use an environment variable for access key
    },
  };

  return fetchData<any>(
    `${process.env.NEXT_PUBLIC_BASE_URL_TWO}/newAppKeys/${key}`,
    config
  );
};
