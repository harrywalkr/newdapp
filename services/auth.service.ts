import { AxiosRequestConfig } from "axios";
import { fetchData } from "./http/axios.config";

// FIXME: Ask backend to add function to this
export async function isPaidMember(): Promise<boolean> {
  const key = localStorage.getItem("LICENSE_KEY");
  if (!key) {
    return false;
  } else return true;
  // FIXME: Backend must implement checkMembership api
  // try {
  //   const response = await fetchData<{ status: boolean }>(
  //     `${process.env.NEXT_PUBLIC_MEMBERSHIP_URL}/checkMembership`, // FIXME: Ask backend to add this endpoint
  //     {
  //       headers: { Authorization: `Bearer ${key}` },
  //     }
  //   );
  //   return response.status;
  // } catch (error) {
  //   console.error("Error checking membership status:", error);
  //   return false;
  // }
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
