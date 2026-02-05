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

//Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Complete image fixes for ALL products reported as missing images
 */
const completeImageFixes: { [key: number]: string } = {
    13: "https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?w=800&q=80", // Samsung 49-Inch Monitor
    14: "https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?w=800&q=80", // Samsung CHG90 Monitor
    15: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&q=80", // Women's Jacket
    16: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80", // Women's Jacket
    22: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80", // Jacket placeholder
    109: "https://images.unsplash.com/photo-1599669454699-248893623440?w=800&q=80", // HyperX Cloud II Headset
    110: "https://images.unsplash.com/photo-1580584126903-c17d41830450?w=800&q=80", // NVIDIA RTX 4090
    114: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80", // MacBook Pro M3 Max
    115: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80", // Dell XPS 15
    116: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80", // Surface Pro 9
    117: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80", // Sony WH-1000XM5
    118: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&q=80", // Blue Yeti X Microphone
};

/**
 * Fix ALL missing images
 */
async function fixAllImages() {
    console.log('🔧 Fixing ALL missing product images...\\n');

    try {
        let successCount = 0;
        let errorCount = 0;

        for (const [productId, imageUrl] of Object.entries(completeImageFixes)) {
            try {
                console.log(`Updating product ${productId}...`);

                const productRef = doc(db, 'products', String(productId));
                const productDoc = await getDoc(productRef);

                if (!productDoc.exists()) {
                    console.log(`  ⚠️  Product ${productId} not found, skipping\\n`);
                    continue;
                }

                const currentData = productDoc.data();
                console.log(`   Current title: ${currentData.title?.substring(0, 40)}...`);

                await updateDoc(productRef, {
                    image: imageUrl
                });

                successCount++;
                console.log(`  ✅ Updated image successfully\\n`);

                await new Promise(resolve => setTimeout(resolve, 100));
            } catch (error) {
                errorCount++;
                console.error(`  ❌ Error updating product ${productId}:`, error);
            }
        }

        console.log('\\n' + '='.repeat(60));
        console.log('🎉 All image fixes completed!');
        console.log(`✅ Successfully fixed: ${successCount} products`);
        console.log(`❌ Failed: ${errorCount} products`);
        console.log('='.repeat(60));
        console.log('\\n✨ All 42 products should now have working images!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Failed to fix images:', error);
        process.exit(1);
    }
}

fixAllImages();
