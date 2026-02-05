import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDocs } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as https from 'https';
import * as http from 'http';
import { ProductProps } from '../type';
import { additionalProducts } from '../src/constants/mockData';

// Firebase configuration from environment
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
const storage = getStorage(app);

/**
 * Download image from URL and return as Buffer
 */
async function downloadImage(url: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;

        protocol.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download image: ${response.statusCode}`));
                return;
            }

            const chunks: Buffer[] = [];
            response.on('data', (chunk) => chunks.push(chunk));
            response.on('end', () => resolve(Buffer.concat(chunks)));
            response.on('error', reject);
        }).on('error', reject);
    });
}

/**
 * Upload image to Firebase Storage
 */
async function uploadImageToStorage(productId: number, imageUrl: string): Promise<string> {
    try {
        console.log(`  ⬇️  Downloading image for product ${productId}...`);
        const imageBuffer = await downloadImage(imageUrl);

        // Determine file extension from URL or default to jpg
        const extension = imageUrl.match(/\.(jpg|jpeg|png|gif|webp)(\?|$)/i)?.[1] || 'jpg';
        const storagePath = `products/${productId}.${extension}`;

        console.log(`  ⬆️  Uploading to Firebase Storage: ${storagePath}...`);
        const storageRef = ref(storage, storagePath);

        // Upload with metadata
        const metadata = {
            contentType: `image/${extension}`,
            cacheControl: 'public, max-age=31536000',
        };

        await uploadBytes(storageRef, imageBuffer, metadata);

        // Get public download URL
        const downloadURL = await getDownloadURL(storageRef);
        console.log(`  ✅ Uploaded successfully!`);

        return downloadURL;
    } catch (error) {
        console.error(`  ❌ Error uploading image for product ${productId}:`, error);
        // Return original URL as fallback
        return imageUrl;
    }
}

/**
 * Save product to Firestore
 */
async function saveProductToFirestore(product: ProductProps, firebaseImageUrl: string): Promise<void> {
    try {
        // Create clean product data - remove any undefined or problematic fields
        const productData: any = {
            id: product.id,
            title: product.title,
            price: product.price,
            description: product.description,
            category: product.category,
            image: firebaseImageUrl,
            rating: product.rating || { rate: 0, count: 0 }
        };

        const productRef = doc(db, 'products', product.id.toString());
        await setDoc(productRef, productData);
        console.log(`  💾 Saved to Firestore: ${product.title}`);
    } catch (error) {
        console.error(`  ❌ Error saving product ${product.id} to Firestore:`, error);
        throw error;
    }
}

/**
 * Fetch products from FakeStore API
 */
async function fetchFakeStoreProducts(): Promise<ProductProps[]> {
    try {
        console.log('📡 Fetching products from FakeStore API...');
        const response = await fetch('https://fakestoreapi.com/products');

        if (!response.ok) {
            throw new Error(`API request failed: ${response.statusText}`);
        }

        const products = await response.json();
        console.log(`✅ Fetched ${products.length} products from FakeStore API`);
        return products;
    } catch (error) {
        console.error('❌ Error fetching from FakeStore API:', error);
        return [];
    }
}

/**
 * Main migration function
 */
async function migrateProducts() {
    console.log('🚀 Starting product migration to Firebase...\n');

    try {
        // Fetch all products
        const apiProducts = await fetchFakeStoreProducts();
        const allProducts = [...apiProducts, ...additionalProducts];

        console.log(`\n📦 Total products to migrate: ${allProducts.length}\n`);

        let successCount = 0;
        let errorCount = 0;

        // Process each product
        for (let i = 0; i < allProducts.length; i++) {
            const product = allProducts[i];
            console.log(`\n[${i + 1}/${allProducts.length}] Processing: ${product.title}`);
            console.log(`  ID: ${product.id}, Category: ${product.category}`);

            try {
                // Upload image to Firebase Storage
                const firebaseImageUrl = await uploadImageToStorage(product.id, product.image);

                // Save product to Firestore with Firebase image URL
                await saveProductToFirestore(product, firebaseImageUrl);

                successCount++;
                console.log(`  ✨ Product ${product.id} migrated successfully!`);
            } catch (error) {
                errorCount++;
                console.error(`  ❌ Failed to migrate product ${product.id}:`, error);
            }

            // Add small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        console.log('\n' + '='.repeat(60));
        console.log('🎉 Migration completed!');
        console.log(`✅ Successfully migrated: ${successCount} products`);
        console.log(`❌ Failed: ${errorCount} products`);
        console.log('='.repeat(60) + '\n');

        // Verify migration
        console.log('🔍 Verifying migration...');
        const productsSnapshot = await getDocs(collection(db, 'products'));
        console.log(`📊 Total products in Firestore: ${productsSnapshot.size}`);

    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

// Run migration
migrateProducts()
    .then(() => {
        console.log('✅ Script completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Script failed:', error);
        process.exit(1);
    });
