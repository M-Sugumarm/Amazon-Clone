import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';

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
 * 20 New Products with high-quality Unsplash images
 */
const newProducts = [
    // Gaming PCs & Laptops
    {
        id: 101,
        title: "ASUS ROG Strix G15 Gaming Laptop - AMD Ryzen 9, RTX 3070, 16GB RAM",
        price: 1499.99,
        description: "Dominate the competition with this powerhouse gaming laptop featuring AMD Ryzen 9 5900HX processor, NVIDIA GeForce RTX 3070, 16GB DDR4 RAM, and a stunning 15.6-inch 300Hz display for ultra-smooth gameplay.",
        category: "Gaming",
        image: "https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?w=800&q=80",
        rating: { rate: 4.8, count: 356 }
    },
    {
        id: 102,
        title: "CyberPowerPC Gamer Xtreme VR Gaming Desktop - Intel i7, RTX 4060 Ti",
        price: 1299.99,
        description: "Ready to tackle VR and the latest AAA titles with Intel Core i7-13700F, NVIDIA GeForce RTX 4060 Ti 8GB, 16GB DDR5 RAM, and 1TB NVMe SSD. RGB lighting included.",
        category: "Gaming",
        image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80",
        rating: { rate: 4.7, count: 289 }
    },
    {
        id: 103,
        title: "Razer Blade 15 Advanced Gaming Laptop - Intel i9, RTX 4070, QHD 240Hz",
        price: 2499.99,
        description: "Premium gaming laptop with Intel Core i9-13950HX, RTX 4070 8GB, 32GB RAM, and gorgeous QHD 240Hz display. CNC aluminum chassis for durability and style.",
        category: "Gaming",
        image: "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=800&q=80",
        rating: { rate: 4.9, count: 412 }
    },
    {
        id: 104,
        title: "MSI Aegis RS Gaming Desktop - AMD Ryzen 7, RTX 4080, Liquid Cooled",
        price: 2199.99,
        description: "Extreme gaming performance with AMD Ryzen 7 7700X, NVIDIA RTX 4080 16GB, 32GB DDR5, and advanced liquid cooling system for whisper-quiet operation.",
        category: "Gaming",
        image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&q=80",
        rating: { rate: 4.8, count: 178 }
    },

    // Monitors & Displays
    {
        id: 105,
        title: "LG UltraGear 27\" 4K Gaming Monitor - 144Hz, 1ms, HDR600, G-SYNC",
        price: 599.99,
        description: "Stunning 4K UHD gaming monitor with 144Hz refresh rate, 1ms response time, VESA DisplayHDR 600, and NVIDIA G-SYNC compatibility for tear-free gaming.",
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80",
        rating: { rate: 4.7, count: 543 }
    },
    {
        id: 106,
        title: "Samsung Odyssey G7 32\" Curved Gaming Monitor - 240Hz, QLED, 1000R",
        price: 699.99,
        description: "Immersive 1000R curved QLED display with stunning 240Hz refresh rate, 1ms response time, and Quantum HDR for incredibly vibrant colors.",
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=800&q=80",
        rating: { rate: 4.9, count: 421 }
    },

    // Gaming Peripherals
    {
        id: 107,
        title: "Logitech G Pro X Superlight Wireless Gaming Mouse - 63g Ultra-Light",
        price: 139.99,
        description: "Pro-grade wireless gaming mouse weighing just 63g with HERO 25K sensor, 70-hour battery life, and LIGHTSPEED wireless technology.",
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80",
        rating: { rate: 4.8, count: 892 }
    },
    {
        id: 108,
        title: "Corsair K70 RGB Pro Mechanical Gaming Keyboard - Cherry MX Speed",
        price: 169.99,
        description: "Tournament-grade mechanical keyboard with Cherry MX Speed switches, per-key RGB lighting, aluminum frame, and dedicated media controls.",
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80",
        rating: { rate: 4.7, count: 654 }
    },
    {
        id: 109,
        title: "HyperX Cloud II Wireless Gaming Headset - 7.1 Surround Sound",
        price: 99.99,
        description: "Premium wireless gaming headset with virtual 7.1 surround sound, noise-cancelling microphone, memory foam ear cushions, and 30-hour battery life.",
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcf?w=800&q=80",
        rating: { rate: 4.6, count: 1203 }
    },

    // PC Components
    {
        id: 110,
        title: "NVIDIA GeForce RTX 4090 24GB Graphics Card - Founders Edition",
        price: 1599.99,
        description: "Ultimate gaming GPU with 24GB GDDR6X memory, ray tracing, DLSS 3, and revolutionary performance for 4K gaming and content creation.",
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1591238372338-6ca70878d3fa?w=800&q=80",
        rating: { rate: 5.0, count: 234 }
    },
    {
        id: 111,
        title: "AMD Ryzen 9 7950X 16-Core 32-Thread Desktop Processor",
        price: 549.99,
        description: "Top-tier desktop CPU with 16 cores, 32 threads, 5.7GHz boost clock, and exceptional multi-threaded performance for gaming and productivity.",
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=800&q=80",
        rating: { rate: 4.9, count: 387 }
    },
    {
        id: 112,
        title: "Corsair Vengeance RGB Pro 32GB (2x16GB) DDR4 3600MHz RAM",
        price: 129.99,
        description: "High-performance DDR4 memory with stunning RGB lighting, optimized for Intel and AMD platforms, and hand-sorted memory chips for overclocking.",
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1562976540-1502c2145186?w=800&q=80",
        rating: { rate: 4.8, count: 756 }
    },
    {
        id: 113,
        title: "Samsung 980 PRO 2TB NVMe M.2 SSD - PCIe 4.0, 7000MB/s Read Speed",
        price: 199.99,
        description: "Blazing-fast PCIe 4.0 NVMe SSD with up to 7000MB/s read speeds, perfect for gaming, video editing, and demanding applications.",
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&q=80",
        rating: { rate: 4.9, count: 892 }
    },

    // Productivity & Office
    {
        id: 114,
        title: "Apple MacBook Pro 16\" M3 Max - 36GB RAM, 1TB SSD, Space Black",
        price: 3499.99,
        description: "Professional-grade laptop with M3 Max chip, stunning Liquid Retina XDR display, 36GB unified memory, and exceptional battery life for creators.",
        category: "Computers",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
        rating: { rate: 5.0, count: 567 }
    },
    {
        id: 115,
        title: "Dell XPS 15 Creator Laptop - Intel i9, RTX 4050, 4K OLED Display",
        price: 2299.99,
        description: "Premium creator laptop with 13th Gen Intel Core i9, GeForce RTX 4050, stunning 4K OLED touchscreen, and precision milled aluminum chassis.",
        category: "Computers",
        image: "https://images.unsplash.com/photo-1542393881221-373b15d0d398?w=800&q=80",
        rating: { rate: 4.8, count: 432 }
    },
    {
        id: 116,
        title: "Microsoft Surface Pro 9 - Intel i7, 16GB RAM, 256GB SSD, Platinum",
        price: 1299.99,
        description: "Versatile 2-in-1 tablet with 13-inch PixelSense touchscreen, Intel Core i7, all-day battery life, and included Surface Pen for creators.",
        category: "Computers",
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80",
        rating: { rate: 4.6, count: 678 }
    },

    // Audio Equipment
    {
        id: 117,
        title: "Sony WH-1000XM5 Wireless Noise-Cancelling Headphones - Premium Sound",
        price: 399.99,
        description: "Industry-leading noise cancellation with exceptional sound quality, 30-hour battery life, multipoint connection, and premium comfort.",
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80",
        rating: { rate: 4.9, count: 2341 }
    },
    {
        id: 118,
        title: "Blue Yeti X Professional USB Microphone - Studio Quality",
        price: 169.99,
        description: "Professional condenser microphone with four pickup patterns, high-resolution LED metering, and Blue VO!CE software for broadcast-quality voice recording.",
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&q=80",
        rating: { rate: 4.7, count: 1543 }
    },

    // Smart Home & Accessories
    {
        id: 119,
        title: "Amazon Echo Studio - High-Fidelity Smart Speaker with 3D Audio",
        price: 199.99,
        description: "Premium smart speaker with spatial audio processing, five directional speakers, and Alexa voice control for immersive music experience.",
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1543512214-318c7553f230?w=800&q=80",
        rating: { rate: 4.5, count: 3421 }
    },
    {
        id: 120,
        title: "Elgato Stream Deck XL - 32 Customizable LCD Keys for Streaming",
        price: 249.99,
        description: "Professional stream control with 32 customizable LCD keys, one-touch operation for OBS, Streamlabs, Twitch, and more. Perfect for content creators.",
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&q=80",
        rating: { rate: 4.8, count: 891 }
    }
];

/**
 * Add products to Firestore
 */
async function addProducts() {
    console.log('🚀 Adding 20 new products to Firebase...\\n');

    try {
        let successCount = 0;
        let errorCount = 0;

        for (const product of newProducts) {
            try {
                console.log(`Adding product ${product.id}: ${product.title.substring(0, 50)}...`);

                const productRef = doc(db, 'products', String(product.id));
                await setDoc(productRef, product);

                successCount++;
                console.log(`  ✅ Added successfully\\n`);

                // Small delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 200));
            } catch (error) {
                errorCount++;
                console.error(`  ❌ Error adding product ${product.id}:`, error);
            }
        }

        console.log('\\n' + '='.repeat(60));
        console.log('🎉 Product addition completed!');
        console.log(`✅ Successfully added: ${successCount} products`);
        console.log(`❌ Failed: ${errorCount} products`);
        console.log('='.repeat(60));

        process.exit(0);
    } catch (error) {
        console.error('❌ Failed to add products:', error);
        process.exit(1);
    }
}

addProducts();
