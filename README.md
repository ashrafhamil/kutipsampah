# Kutip Sampah - Community Food Waste Utility

A Next.js MVP application connecting food waste requesters (Pembuang Sampah) with collectors (Pengutip Sampah) in the community.

## Features

- **Role-Based Views**: Switch between requester and collector roles
- **Real-Time Job Matching**: Live updates when jobs are created or accepted
- **Interactive Map**: View pending jobs on a map with clickable markers
- **ACID Transactions**: Atomic job acceptance and wallet transfers
- **Grab-Inspired UI**: Modern, mobile-first design with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore
- **Authentication**: Firebase Anonymous Auth
- **Maps**: React Leaflet
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase project with Firestore and Anonymous Auth enabled

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Firebase:
   - Create a Firebase project
   - Enable Firestore Database
   - Enable Anonymous Authentication
   - Copy your Firebase config to `.env.local` (see `.env.local.example`)

4. Configure Firestore security rules (see `FIRESTORE_SETUP.md`)

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
kutip-sampah/
├── app/                    # Next.js App Router
│   ├── layout.js          # Root layout
│   ├── page.js            # Main application page
│   ├── globals.css        # Global styles
│   └── providers.js       # Auth context provider
├── components/            # React components
│   ├── RoleSwitcher.jsx   # Role toggle component
│   ├── PembuangForm.jsx   # Job creation form
│   ├── PengutipMap.jsx    # Map with job markers
│   └── JobDrawer.jsx      # Job details drawer
├── lib/                   # Core libraries
│   └── firebase.js        # Firebase initialization
├── services/              # Business logic
│   └── jobService.js      # Job and user services
└── constants/             # Constants
    └── jobConstants.js   # Job statuses and pricing
```

## Architecture

The application follows SOLID principles:

- **Single Responsibility**: Each service function has one clear purpose
- **ACID Compliance**: Job acceptance and completion use Firestore transactions
- **DRY Principle**: Constants centralized in `jobConstants.js`
- **Separation of Concerns**: Clear separation between UI, services, and data layers

## Usage

### As Pembuang Sampah (Requester)

1. Switch to "Pembuang Sampah" role
2. Fill out the job form:
   - Select pickup time
   - Enter address (GPS auto-filled)
   - Set number of bags
3. Review total price and click "Bayar & Hantar"
4. Wait for a collector to accept your job

### As Pengutip Sampah (Collector)

1. Switch to "Pengutip Sampah" role
2. View pending jobs on the map
3. Click a marker to see job details
4. Click "TERIMA JOB" to accept
5. After collection, click "Selesai Kutip" to complete and receive payment

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## License

MIT
