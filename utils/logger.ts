const isProduction = process.env.NODE_ENV === "production";

export const log = (...args: any) => {
  if (!isProduction) {
    console.log(...args);
  }
};

export const logError = (...args: any) => {
  if (!isProduction) {
    console.error(...args);
  }
};
