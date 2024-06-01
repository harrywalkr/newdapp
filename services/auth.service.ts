import { AxiosRequestConfig } from "axios";
import { fetchData } from "./http/axios.config";

// export async function isPaidMember(): Promise<boolean> {
//   const key = localStorage.getItem("LICENSE_KEY");
//   if (!key) {
//     return false;
//   } else {
//     verifyKey(key)
//       .then((data) => {
//         console.log("hello", data);
//         if (data === "OK") return true;
//         return false;
//       })
//       .catch((error: Error) => {
//         console.error("Error fetching key:", error.message);
//         return false;
//       });
//     // FIXME: refactor this code
//     return false;
//   }
//   // FIXME: Backend must implement checkMembership api
// }

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
