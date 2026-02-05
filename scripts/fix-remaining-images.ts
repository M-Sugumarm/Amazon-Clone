import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, updateDoc, getDoc, getDocs } from 'firebase/firestore';

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
 * Final image fixes for remaining products
 */
const finalImageFixes: { [key: number]: string } = {
    9: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&q=80", // External Hard Drive
    13: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80", // Samsung 49-Inch Monitor
    109: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcf?w=800&q=80", // HyperX Cloud II Headset
    110: "https://images.unsplash.com/photo-1591238372338-6ca70878d3fa?w=800&q=80", // NVIDIA RTX 4090
    114: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80", // MacBook Pro
    115: "https://images.unsplash.com/photo-1542393881221-373b15d0d398?w=800&q=80", // Dell XPS 15
};

/**
 * Fix remaining product images
 */
async function fixRemainingImages() {
    console.log('🔧 Fixing remaining product images...\\n');

    try {
        // First, let's check all products to find any with missing or broken images
        console.log('📋 Scanning all products for issues...\\n');
        const productsSnapshot = await getDocs(collection(db, 'products'));

        const productsToFix: any[] = [];

        productsSnapshot.forEach((doc) => {
            const data = doc.data();
            const productId = parseInt(doc.id);

            // Check if image is from fakestoreapi.com (likely broken)
            if (data.image && data.image.includes('fakestoreapi.com')) {
                console.log(`⚠️  Product ${productId} (${data.title?.substring(0, 40)}...) has fakestoreapi image`);
                productsToFix.push({ id: productId, title: data.title });
            }

            // Check if image is empty or undefined
            if (!data.image || data.image.trim() === '') {
                console.log(`⚠️  Product ${productId} (${data.title?.substring(0, 40)}...) has no image`);
                productsToFix.push({ id: productId, title: data.title });
            }
        });

        console.log(`\\n Found ${productsToFix.length} products that need fixing\\n`);

        // Now fix the specific products
        let successCount = 0;
        let errorCount = 0;

        for (const [productId, imageUrl] of Object.entries(finalImageFixes)) {
            try {
                console.log(`Updating product ${productId}...`);

                const productRef = doc(db, 'products', String(productId));
                const productDoc = await getDoc(productRef);

                if (!productDoc.exists()) {
                    console.log(`  ⚠️  Product ${productId} not found, skipping\\n`);
                    continue;
                }

                await updateDoc(productRef, {
                    image: imageUrl
                });

                successCount++;
                console.log(`  ✅ Fixed image for product ${productId}\\n`);

                await new Promise(resolve => setTimeout(resolve, 200));
            } catch (error) {
                errorCount++;
                console.error(`  ❌ Error updating product ${productId}:`, error);
            }
        }

        console.log('\\n' + '='.repeat(60));
        console.log('🎉 Final image fixes completed!');
        console.log(`✅ Successfully fixed: ${successCount} products`);
        console.log(`❌ Failed: ${errorCount} products`);
        console.log('='.repeat(60));

        process.exit(0);
    } catch (error) {
        console.error('❌ Failed to fix images:', error);
        process.exit(1);
    }
}

fixRemainingImages();
