# Product Migration to Firebase

This guide will help you migrate all products and images from the external API to Firebase.

## Prerequisites

1. Ensure all Firebase environment variables are set in `.env.local`
2. Firebase project must be configured with Firestore and Storage enabled
3. Node.js and npm installed

## Step 1: Install Dependencies for Migration Script

The migration script uses Node.js built-in modules, but you need to ensure TypeScript can compile it:

```bash
npm install --save-dev tsx @types/node
```

## Step 2: Run the Migration Script

Run the migration script to upload all products and images to Firebase:

```bash
npx tsx scripts/migrate-products.ts
```

The script will:
- Fetch products from FakeStore API
- Include mock products from `mockData.ts`
- Download each product image
- Upload images to Firebase Storage (`/products/{productId}.jpg`)
- Create Firestore documents in `/products` collection
- Show progress for each product

## Step 3: Verify Migration

After the migration completes:

1. **Check Firebase Console - Firestore:**
   - Go to: https://console.firebase.google.com/project/clone-d6101/firestore
   - Verify `products` collection has all documents

2. **Check Firebase Console - Storage:**
   - Go to: https://console.firebase.google.com/project/clone-d6101/storage
   - Verify `products/` folder contains all images

3. **Test Locally:**
   ```bash
   npm run dev
   ```
   - Visit http://localhost:3000
   - Verify products are displayed
   - Check that images load correctly

## Step 4: Deploy to Vercel

Once local testing is successful:

```bash
git add .
git commit -m "Migrate products to Firebase for reliable Vercel deployment"
git push
```

Vercel will automatically deploy your changes.

## Troubleshooting

### Migration fails with "Permission Denied"
- Check Firebase rules in `firebase-rules.txt`
- Ensure public read/write is enabled for development
- Run `npm run deploy:rules` if you have that script

### Images don't load
- Verify Firebase Storage CORS is configured
- Check Storage security rules allow public read access
- Verify image URLs in Firestore are public download URLs

### Products not showing on Vercel
- Check Vercel build logs for errors
- Ensure environment variables are set in Vercel settings
- Verify Firebase project allows requests from Vercel domain

## What Changed

- ✅ Products now stored in **Firestore** (`/products` collection)
- ✅ Images now stored in **Firebase Storage** (`/products/` folder)
- ✅ `index.tsx` now fetches from Firestore (not external API)
- ✅ `product/[id].tsx` now uses Firestore for product details
- ✅ Static generation uses Firestore for build-time data
