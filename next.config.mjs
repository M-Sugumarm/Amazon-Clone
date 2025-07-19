/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "fakestoreapi.com",
      "lh3.googleusercontent.com",
      "lh4.googleusercontent.com",
      "lh5.googleusercontent.com",
      "lh6.googleusercontent.com",
      "avatars.githubusercontent.com",
      "firebasestorage.googleapis.com",
      "images.unsplash.com",
      "m.media-amazon.com"
    ],
  }
};

export default nextConfig;
