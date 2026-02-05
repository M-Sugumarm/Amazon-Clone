import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, updateDoc, getDoc } from 'firebase/firestore';

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Firebase configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Fixed image URLs for products 1-22 with high-quality Unsplash images
 */
const fixedImages: { [key: number]: string } = {
    1: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80", // Backpack
    2: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80", // Men's T-shirt
    3: "https://images.unsplash.com/photo-1594938291221-94f18cbb5660?w=800&q=80", // Men's Cotton Jacket
    4: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80", // Men's Casual Slim Fit
    5: "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=800&q=80", // Women's Bracelet
    6: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80", // Solid Gold Petite Micropave
    7: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80", // Princess Diamond Ring
    8: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80", // Gold Plated Princess Ring
    9: "https://images.unsplash.com/photo-1624823183493-ed5832f48f18?w=800&q=80", // External Hard Drive
    10: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&q=80", // SSD 1TB
    11: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&q=80", // SSD 256GB
    12: "https://images.unsplash.com/photo-1624823183493-ed5832f48f18?w=800&q=80", // Gaming Drive
    13: "https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?w=800&q=80", // Samsung 49-Inch Monitor
    14: "https://images.unsplash.com/photo-1551498356-d1dd76d1fce5?w=800&q=80", // BIYLACLESEN Jacket
    15: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80", // Women's Jacket
    16: "https://images.unsplash.com/photo-1566206091558-7f218b696731?w=800&q=80", // Women's Short Sleeve T-shirt
    17: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80", // Women's T-Shirt
    18: "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800&q=80", // Women's Short Sleeve Boat Neck
    19: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80", // Opna Women's Tops
    20: "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&q=80", // Rain Jacket
    21: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80", // Casual Premium Slim Fit
    22: "https://images.unsplash.com/photo-1598032895403-a0a8b5d59c5c?w=800&q=80"  // MBJ Bomber Jacket
};

/**
 * Update product images in Firestore
 */
async function fixProductImages() {
    console.log('🔧 Fixing product images in Firebase...\\n');

    try {
        let successCount = 0;
        let errorCount = 0;

        for (const [productId, imageUrl] of Object.entries(fixedImages)) {
            try {
                console.log(`Updating product ${productId}...`);

                const productRef = doc(db, 'products', String(productId));

                // Check if product exists
                const productDoc = await getDoc(productRef);
                if (!productDoc.exists()) {
                    console.log(`  ⚠️  Product ${productId} not found, skipping`);
                    continue;
                }

                // Update only the image field
                await updateDoc(productRef, {
                    image: imageUrl
                });

                successCount++;
                console.log(`  ✅ Updated image for product ${productId}\\n`);

                // Small delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 200));
            } catch (error) {
                errorCount++;
                console.error(`  ❌ Error updating product ${productId}:`, error);
            }
        }

        console.log('\\n' + '='.repeat(60));
        console.log('🎉 Image update completed!');
        console.log(`✅ Successfully updated: ${successCount} products`);
        console.log(`❌ Failed: ${errorCount} products`);
        console.log('='.repeat(60));

        process.exit(0);
    } catch (error) {
        console.error('❌ Failed to update images:', error);
        process.exit(1);
    }
}

fixProductImages();
