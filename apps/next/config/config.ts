type config = {
  environment?: "development" | "production" | "test";
  apiUrl?: string;
};

export const config: config = {
  environment:
    (process.env.NEXT_PUBLIC_ENV as "development" | "production" | "test") ||
    "development",
  apiUrl: process.env.NEXT_PUBLIC_API_URL,
};
