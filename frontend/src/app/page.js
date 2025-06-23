'use client';

import Image from 'next/image';
import Navbar from './components/Navbar';
import Card from './components/Card';
import { FaMapMarkerAlt, FaPhoneAlt, FaUtensils } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function HomePage() {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);

  const handleGetStarted = () => {
    const user = localStorage.getItem('user');
    if (user) {
      router.push('/map');
    } else {
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000); // Hide after 2 seconds
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="flex flex-col min-h-screen pt-20 px-6 ">
        {/* Main Content Container with Border and White Background */}
        <div className="bg-white border border-gray-300 rounded-xl shadow-lg overflow-hidden p-5">
          <div className="flex w-full h-[70vh]">
            {/* Left: Image */}
            <div className="w-1/2 h-full relative">
              <Image
                src="/Red.png"
                alt="Location Illustration"
                fill
                className="object-contain pl-10"
              />

              {/* Button Overlay */}
              <div className="absolute bottom-4 right-6">
                <button
                  className="bg-red-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-red-700 shadow-md transition 
                           hover:shadow-[0_4px_12px_rgba(237,39,37,0.6)]"
                  onClick={handleGetStarted}
                >
                  Get Started
                </button>
                {showPopup && (
                  <div className="absolute bottom-16 right-0 bg-white border border-red-500 text-red-600 px-4 py-2 rounded shadow">
                    Please login first
                  </div>
                )}
              </div>
            </div>

            {/* Right: 3 vertical cards */}
            <div className="w-1/2 h-full flex flex-col justify-center gap-6 px-6 overflow-y-auto">
              <Card
                title="Find Nearby Restaurants"
                description="Discover the best spots to eat near you."
                icon={<FaMapMarkerAlt />}
              />
              <Card
                title="Call for delivery"
                description="Easily contact restaurants for information."
                icon={<FaPhoneAlt />}
              />
              <Card
                title="Get Paths to Restaurants"
                description="Navigate to your favorite restaurants with ease."
                icon={<FaUtensils />}
              />
            </div>
          </div>
        </div>

        {/* Simple How SavorSpot Works Section */}
        <div className="mt-8 px-8 py-12 bg-white rounded-xl border border-gray-300 shadow-lg">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 tracking-tight">How SavorSpot Works</h2>
            <div className="text-gray-700 max-w-3xl mx-auto text-lg leading-relaxed">
              <span className="font-semibold text-red-600">Search</span> for restaurants near you 
              <span className="text-red-400 mx-2">→</span> 
              <span className="font-semibold text-red-600">Browse</span> menus 
              <span className="text-red-400 mx-2">→</span> 
              <span className="font-semibold text-red-600">Call or visit using shortest path</span> instantly
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}