type config = {
  environment?: "development" | "production" | "test";
  apiUrl?: string;
  socketUrl?: string;
  googleMapsApiKey?: string;
};

export const config: config = {
  environment:
    (process.env.NEXT_PUBLIC_ENV as "development" | "production" | "test") ||
    "development",
  apiUrl: process.env.NEXT_PUBLIC_API_URL,
  socketUrl: process.env.NEXT_PUBLIC_SOCKET_URL,
  googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
};
