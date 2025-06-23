# SavorSpot

SavorSpot is a full-stack web application for discovering nearby restaurants, viewing their menus and venues, and navigating to them. It features user authentication, admin management for adding restaurants, and interactive maps with real-time geolocation.

---

## Features

- **User Authentication:** Sign up, log in, and secure session management using JWT and httpOnly cookies.
- **Admin Panel:** Admins can add new restaurants with images (venue & menu).
- **Restaurant Discovery:** Users can view nearby restaurants based on their location.
- **Interactive Map:** Uses Leaflet for map display and OpenRouteService for directions.
- **Restaurant Details:** View venue, menu, address, and call directly from the app.
- **Responsive UI:** Built with React, Next.js, and Tailwind CSS.

---

## Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS, React-Leaflet
- **Backend:** Node.js, Express.js, MongoDB (Mongoose)
- **Authentication:** JWT, httpOnly cookies
- **Image Hosting:** Cloudinary
- **Maps & Directions:** Leaflet, OpenRouteService API

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)
- OpenRouteService API key

### Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/diyaaahh/SavorSpot.git
    cd SavorSpot
    ```

2. **Install dependencies:**
    ```bash
    # Backend
    cd backend
    npm install

    # Frontend
    cd ../frontend
    npm install
    ```

3. **Set up environment variables:**

    - **Backend (`backend/.env`):**
        ```
        MONGO_URI=your_mongodb_connection_string
        ACCESS_TOKEN_SECRET=your_jwt_secret
        REFRESH_TOKEN_SECRET=your_jwt_refresh_secret
        CLOUDINARY_CLOUD_NAME=your_cloudinary_name
        CLOUDINARY_API_KEY=your_cloudinary_api_key
        CLOUDINARY_API_SECRET=your_cloudinary_api_secret
        ```

    - **Frontend (`frontend/.env.local`):**
        ```
        NEXT_PUBLIC_ORS_API_KEY=your_openrouteservice_api_key
        ```

4. **Start the backend server:**
    ```bash
    cd backend
    npm run dev
    # or
    npm start
    ```

5. **Start the frontend dev server:**
    ```bash
    cd frontend
    npm run dev
    ```

6. **Visit the app:**
    - Frontend: [http://localhost:3000](http://localhost:3000)
    - Backend: [http://localhost:3001](http://localhost:3001)

---

## Usage

- **Sign up / Log in** as a user to discover restaurants.
- **Admins** can log in and access `/admin` to add new restaurants.
- **On the map page**, allow location access to see nearby restaurants and get directions.

---

## Acknowledgements

- [Leaflet](https://leafletjs.com/)
- [OpenRouteService](https://openrouteservice.org/)
- [Cloudinary](https://cloudinary.com/)
- [Next.js](https://nextjs.org/)
- [MongoDB](https://www.mongodb.com/)
