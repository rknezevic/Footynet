# FootyNet Frontend

Football player recruitment platform frontend built with Next.js 15, React 19, and TypeScript.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Create a `.env.local` file:
```
NEXT_PUBLIC_API_URL=https://localhost:7163/api
```

3. Run development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Features

### Player Features
- Register and login
- Complete profile (name, age, city, preferred foot, etc.)
- Browse job opportunities
- Apply to jobs with cover letter
- View application status
- Manage profile

### Club Features
- Register and login
- Complete club profile (name, league, county, description)
- Create job advertisements
- View and manage job ads
- Review player applications
- Accept/reject applications
- Manage profile

## Project Structure

```
app/
├── login/          # Login page
├── register/       # Registration page
├── player/         # Player-specific pages
│   ├── dashboard/  # Player dashboard
│   ├── profile/    # Player profile management
│   ├── jobs/       # Browse job opportunities
│   └── applications/ # View applications
└── club/           # Club-specific pages
    ├── dashboard/  # Club dashboard
    ├── profile/    # Club profile management
    └── job-ads/    # Manage job advertisements

lib/                # API service layer
├── api.ts          # Axios configuration
├── auth.ts         # Authentication service
├── player.ts       # Player API calls
├── club.ts         # Club API calls
├── jobAds.ts       # Job ads API calls
└── message.ts      # Messaging service

types/              # TypeScript type definitions
contexts/           # React contexts (Auth)
```

## API Integration

The frontend integrates with the FootyNet backend API:
- Authentication (JWT)
- Player profile management
- Club profile management
- Job advertisement CRUD
- Application management
- Messaging (future feature)

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Axios
