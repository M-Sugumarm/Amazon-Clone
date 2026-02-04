# Amazon Clone MERN Stack

A fully functional Amazon clone built with Next.js, Firebase, and Stripe.

## Features

- User authentication with NextAuth and Google Sign-in
- Product browsing and searching
- Shopping cart functionality
- Checkout with Stripe integration
- Order tracking
- User reviews and ratings
- Admin dashboard with product and order management

## Setup Instructions

### Prerequisites

- Node.js and npm installed
- Firebase account
- Stripe account

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables:
   Create a `.env.local` file with the following variables:
   ```
   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_secret_key
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret

   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

   # Stripe Configuration
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   ```

4. Run the development server:
   ```
   npm run dev
   ```

### Firebase Setup

1. Create a new Firebase project
2. Enable Authentication with Google provider
3. Create a Firestore database
4. Deploy Firebase rules:

   ```
   # Install Firebase CLI if not already installed
   npm install -g firebase-tools

   # Login to Firebase
   firebase login

   # Initialize Firebase in your project (if not already done)
   firebase init

   # Deploy rules
   firebase deploy --only firestore,storage
   ```

### Firebase Rules

The project includes Firebase security rules in the `firebase-rules.txt` file. These rules control access to Firestore and Storage, ensuring proper security.

To fix permission issues:

1. Make sure your Firebase project is properly set up
2. Deploy the rules using the Firebase CLI
3. Ensure you're properly signed in as an admin user (email should be 'vikashspidey@gmail.com' or end with '@admin.com')

## Admin Access

The admin panel is accessible at `/admin`. Only users with email 'vikashspidey@gmail.com' or emails ending with '@admin.com' can access the admin features.

Admin features include:
- Managing products (add, edit, activate/deactivate)
- Managing reviews
- Viewing and managing orders
- Analytics dashboard

## Payment Processing

Payments are processed through Stripe. The checkout process:
1. Captures shipping and billing information
2. Creates a new order in Firebase
3. Redirects to Stripe Checkout for secure payment
4. Returns to success page upon completion

## Troubleshooting

### Common Issues

1. **Firebase Permission Errors**:
   - Ensure Firebase rules are properly deployed
   - Check that you are signed in with the correct account
   - Verify your Firebase configuration in `.env.local`

2. **Image Loading Issues**:
   - Ensure domains are properly configured in `next.config.mjs`
   - Check that image paths are correct

3. **Stripe Checkout Issues**:
   - Verify Stripe API keys in `.env.local`
   - Ensure products have proper price data

# Screenshots

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/f5c33284-6e59-4229-9e21-42c4d6451d02" />


