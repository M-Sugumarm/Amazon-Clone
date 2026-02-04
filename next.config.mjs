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
      "m.media-amazon.com",
      "images-eu.ssl-images-amazon.com",
      "images-na.ssl-images-amazon.com"
    ],
  },
  eslint: {
    // Don't fail build on ESLint warnings/errors during production builds
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
