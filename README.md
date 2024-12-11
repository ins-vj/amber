# Amber 🎓🎥

## Overview
Amber is an advanced e-learning platform designed to provide an immersive and flexible video learning experience. Leveraging modern cloud technologies, Amber offers seamless video hosting, adaptive streaming, and a user-friendly interface.

## Key Features

### 📤 Video Upload
- Direct video uploads to Cloudinary
- Automatic cloud storage and management
- Efficient video processing and optimization

### 🔗 Database Integration
- Video metadata stored in Neon database
- Robust link management and tracking
- Scalable and performant database solution

### 🎥 Advanced Video Player
- M3U8 streaming support
- Dynamic quality adjustment
- Playback speed control
- Sound/volume management

### 🌈 Immersive User Interface
- 3D elements powered by Spline
- Modern, responsive design
- Intuitive user experience
- Smooth interactions and transitions

## Tech Stack

### Frontend
- **Framework**: Next.js 14
- **Language**: TypeScript
- **3D Graphics**: Spline

### Backend
- **Framework**: Express.js
- **Video Hosting**: Cloudinary
- **Database**: Neon
- **Streaming**: M3U8 protocol

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm/yarn
- Cloudinary Account
- Neon Database account

### Installation
```bash
# Clone the repository
git clone https://github.com/ins-vj/amber.git
cd amber

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### Configuration
1. Create `.env` files in both frontend and backend directories
2. Add required environment variables:
   - Cloudinary credentials
   - Neon database connection string
   - Other necessary configuration

### Running the Project
```bash
# Start backend (from backend directory)
npm run dev

# Start frontend (from frontend directory)
npm run dev
```

## Project Structure
```
amber/
│
├── frontend/           # Next.js 14 TypeScript project
│   ├── components/
│   ├── app/
│   └── public/
│
├── backend/            # Express.js backend
│   ├── routes/
│   ├── controllers/
│   └── models/
```

## Contributors
- **Vikrant** (Roll No: 230001082)
- **Param Saxena** (Roll No: 230001060)
- **Yash Kumbhkarn** (Roll No: 230001083)
- **Tripti Anand** (Roll No: 230001078)



## Acknowledgments
- Cloudinary for video hosting
- Neon for database solutions
- Spline for 3D graphics integration
- Next.js and Express.js for powerful web technologies
