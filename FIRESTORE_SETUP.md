# Firestore Setup Instructions

## 1. Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable **Firestore Database** (start in test mode initially)
4. Enable **Authentication** → **Anonymous** sign-in method

## 2. Firestore Security Rules

Copy and paste these rules into your Firestore Database → Rules section:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Jobs collection - readable by all authenticated users, writable by authenticated users
    match /jobs/{jobId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
    }
    
    // Users collection - users can only read/write their own document
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Feedback collection - read allowed without auth (so server can load list for /feedback page); create requires auth
    match /feedback/{feedbackId} {
      allow read: if true;
      allow create: if request.auth != null;
    }

    // Stats: visitor count - anyone can read; only authenticated clients can write (increment)
    match /stats/visitorCount {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 3. Data Schema

### Jobs Collection (`/jobs/{jobId}`)

```javascript
{
  id: string (auto-generated),
  requesterId: string (user.uid),
  address: string,
  gps: {
    lat: number,
    lng: number
  },
  pickupTime: string (time format),
  bagCount: number,
  totalPrice: number (bagCount * PRICE_PER_BAG),
  status: 'PENDING' | 'COLLECTING' | 'DONE',
  collectorId: string | null (user.uid when accepted),
  createdAt: Timestamp
}
```

### Users Collection (`/users/{userId}`)

```javascript
{
  id: string (user.uid),
  role: 'PEMBUANG' | 'PENGUTIP' | undefined,
  displayName: string
}
```

### Feedback Collection (`/feedback/{feedbackId}`)

```javascript
{
  id: string (auto-generated),
  name: string | null (optional),
  message: string (required),
  createdAt: Timestamp
}
```

### Stats / visitor count (`/stats/visitorCount`)

Single document holding the main-page visitor count. Anyone can read; only authenticated users (including anonymous) can write. You can create this document manually in Firebase Console with `total: 0` if desired; otherwise the first client increment will create it.

```javascript
{
  total: number  // incremented by 1 each time the main page (/) is loaded
}
```

## 4. Environment Variables

1. Go to Firebase Console → Project Settings → General
2. Scroll down to "Your apps" section
3. Click on the web app icon (`</>`) or create a new web app
4. Copy the Firebase configuration object
5. Create a `.env.local` file in the project root with:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 5. Indexes (Optional)

If you plan to query jobs by status and other fields together, you may need to create composite indexes. Firestore will prompt you with a link if an index is needed.

For the Feedback page, queries use `orderBy('createdAt', 'desc')`. Firestore may prompt you to create a single-field index on `createdAt` for the `feedback` collection; use the link in the error message to create it.

## 6. Testing

After setup:
1. Run `npm install` to install dependencies
2. Run `npm run dev` to start the development server
3. The app will automatically sign in users anonymously
4. Users will be created in Firestore automatically when they first use the app

## Notes

- Anonymous authentication allows users to use the app without registration
- Payment system is a dummy flow - collectors can click "Success" or "Cancel" to complete jobs
- All transactions use Firestore `runTransaction()` for ACID compliance
- Jobs are automatically removed from pending view when accepted (status changes to COLLECTING)
- When a collector cancels a job, it returns to PENDING status and becomes available for other collectors
