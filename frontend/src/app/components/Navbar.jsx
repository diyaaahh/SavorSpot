'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ChefHat, User, LogOut, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50 border-b border-red-100">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-2 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
              SavorSpot
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <ul className="flex items-center space-x-6">
              <li>
                <Link 
                  href="/" 
                  className="text-gray-700 hover:text-red-600 font-medium transition-colors duration-200 relative group"
                >
                  Home
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-gray-700 hover:text-red-600 font-medium transition-colors duration-200 relative group"
                >
                  About
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
            </ul>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <Link 
                    href="/profile" 
                    className="flex items-center space-x-2 bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 px-4 py-2 rounded-full transition-all duration-300 hover:shadow-md"
                  >
                    <User className="w-4 h-4 text-red-600" />
                    <span className="text-gray-800 font-medium">{user.fullName}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 bg-gray-100 hover:bg-red-50 px-4 py-2 rounded-full transition-all duration-300 hover:shadow-md group"
                  >
                    <LogOut className="w-4 h-4 text-gray-600 group-hover:text-red-600" />
                    <span className="text-gray-700 group-hover:text-red-600 font-medium">Logout</span>
                  </button>
                </div>
              ) : (
                <Link 
                  href="/login" 
                  className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white px-6 py-2.5 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg bg-gray-100 hover:bg-red-50 transition-colors duration-200"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 space-y-4">
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-gray-700 hover:text-red-600 font-medium py-2 px-3 rounded-lg hover:bg-red-50 transition-all duration-200"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-gray-700 hover:text-red-600 font-medium py-2 px-3 rounded-lg hover:bg-red-50 transition-all duration-200"
                >
                  About
                </Link>
              </li>
            </ul>

            <div className="border-t border-gray-200 pt-4">
              {user ? (
                <div className="space-y-3">
                  <Link 
                    href="/profile" 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 text-gray-800 font-medium py-2 px-3 rounded-lg hover:bg-red-50 transition-all duration-200"
                  >
                    <User className="w-4 h-4 text-red-600" />
                    <span>{user.fullName}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 text-gray-700 font-medium py-2 px-3 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all duration-200 w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <Link 
                  href="/login" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white px-6 py-3 rounded-lg font-semibold text-center shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}