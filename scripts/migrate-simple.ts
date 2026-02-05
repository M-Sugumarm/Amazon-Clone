import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDocs } from 'firebase/firestore';
import { ProductProps } from '../type';

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
 * Fetch products from FakeStore API
 */
async function fetchProducts(): Promise<ProductProps[]> {
    try {
        console.log('📡 Fetching products from FakeStore API...');
        const response = await fetch('https://fakestoreapi.com/products');

        if (!response.ok) {
            throw new Error(`API request failed: ${response.statusText}`);
        }

        const products = await response.json();
        console.log(`✅ Fetched ${products.length} products`);
        return products;
    } catch (error) {
        console.error('❌ Error fetching products:', error);
        return [];
    }
}

/**
 * Save product to Firestore (simplified version)
 */
async function saveProduct(product: any): Promise<boolean> {
    try {
        // Create minimal, clean product data
        const cleanProduct = {
            id: Number(product.id),
            title: String(product.title),
            price: Number(product.price),
            description: String(product.description),
            category: String(product.category),
            image: String(product.image),
            rating: {
                rate: Number(product.rating?.rate || 0),
                count: Number(product.rating?.count || 0)
            }
        };

        const productRef = doc(db, 'products', String(product.id));
        await setDoc(productRef, cleanProduct);
        console.log(`  ✅ Saved product ${product.id}: ${product.title}`);
        return true;
    } catch (error) {
        console.error(`  ❌ Error saving product ${product.id}:`, error);
        return false;
    }
}

/**
 * Main migration function
 */
async function migrate() {
    console.log('🚀 Starting simplified product migration...\\n');

    try {
        const products = await fetchProducts();
        console.log(`\\n📦 Migrating ${products.length} products...\\n`);

        let successCount = 0;
        let errorCount = 0;

        for (const product of products) {
            const success = await saveProduct(product);
            if (success) {
                successCount++;
            } else {
                errorCount++;
            }

            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 300));
        }

        console.log('\\n' + '='.repeat(60));
        console.log('🎉 Migration completed!');
        console.log(`✅ Successfully migrated: ${successCount} products`);
        console.log(`❌ Failed: ${errorCount} products`);
        console.log('='.repeat(60) + '\\n');

        // Verify
        const snapshot = await getDocs(collection(db, 'products'));
        console.log(`📊 Total products in Firestore: ${snapshot.size}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

migrate();
