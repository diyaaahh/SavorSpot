'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import axiosInstance from '../utils/axiosInstance';

// OpenRouteService API configuration
const ORS_API_KEY = process.env.NEXT_PUBLIC_ORS_API_KEY;
const ORS_BASE_URL = 'https://api.openrouteservice.org/v2/directions/foot-walking';

// Fix Leaflet's default marker path
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom red marker for restaurants
const redIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 0C5.6 0 0 5.6 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.6 19.4 0 12.5 0z" fill="#dc2626"/>
      <circle cx="12.5" cy="12.5" r="6" fill="white"/>
      <path d="M12.5 7.5c-1.4 0-2.5 1.1-2.5 2.5s1.1 2.5 2.5 2.5 2.5-1.1 2.5-2.5-1.1-2.5-2.5-2.5z" fill="#dc2626"/>
    </svg>
  `),
  iconSize: [25, 41],
  iconAnchor: [12.5, 41],
  popupAnchor: [0, -41],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41],
  shadowAnchor: [12, 41]
});

// Restaurant Detail Modal Component
const RestaurantModal = ({ restaurant, isOpen, onClose, onShowPaths, loadingPath }) => {
  if (!isOpen || !restaurant) return null;

  const handleCallNow = () => {
    if (restaurant.phone) {
      window.location.href = `tel:${restaurant.phone}`;
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-30 z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-red-50">
          <h2 className="text-2xl font-bold text-red-600 flex items-center gap-2">
            🍽️ {restaurant.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200"
          >
            ×
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="p-6 space-y-6">
            {/* Restaurant Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {restaurant.venue && (
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">Venue</h3>
                  <img
                    src={restaurant.venue}
                    alt={`${restaurant.name} venue`}
                    className="w-full h-48 object-cover rounded-lg shadow-md"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=Venue+Image';
                    }}
                  />
                </div>
              )}
              {restaurant.menu && (
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">Menu</h3>
                  <img
                    src={restaurant.menu}
                    alt={`${restaurant.name} menu`}
                    className="w-full h-48 object-cover rounded-lg shadow-md cursor-pointer hover:scale-105 transition-transform"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=Menu+Image';
                    }}
                    onClick={() => window.open(restaurant.menu, '_blank')}
                  />
                  <p className="text-sm text-gray-500 mt-1">Click to view full menu</p>
                </div>
              )}
            </div>

            {/* Restaurant Details */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-xl">📍</span>
                <div>
                  <h3 className="font-semibold text-gray-800">Address</h3>
                  <p className="text-gray-600">{restaurant.address}</p>
                </div>
              </div>

              {restaurant.phone && (
                <div className="flex items-start gap-3">
                  <span className="text-xl">📞</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">Phone</h3>
                    <p className="text-gray-600">{restaurant.phone}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleCallNow}
              disabled={!restaurant.phone}
              className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all ${
                restaurant.phone
                  ? 'bg-green-600 hover:bg-green-700 text-white hover:shadow-lg transform hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              📞 Call Now
            </button>
            <button
              onClick={() => onShowPaths(restaurant)}
              disabled={loadingPath}
              className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all ${
                loadingPath
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white hover:shadow-lg transform hover:scale-105'
              }`}
            >
              {loadingPath ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Loading Path...
                </>
              ) : (
                <>
                  🗺️ Show Paths
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function MapPage() {
  const [location, setLocation] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [hoveredRestaurant, setHoveredRestaurant] = useState(null);
  const [routePath, setRoutePath] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [loadingPath, setLoadingPath] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = [pos.coords.longitude, pos.coords.latitude];
        setLocation(coords);

        try {
          await axiosInstance.put(
            '/auth/location',
            { location: coords },
            { withCredentials: true }
          );
        } catch (err) {
          console.error('Failed to save location:', err);
          setError('Failed to save location');
        }
      },
      (err) => {
        console.error('Location permission denied:', err);
        setError('Location permission denied');
      }
    );
  }, []);

  const fetchRestaurants = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get('/restaurants/nearby', {
        withCredentials: true
      });
      console.log('Fetched restaurants:', res.data.restaurants);
      setRestaurants(res.data.restaurants || []);
    } catch (err) {
      console.error('Error fetching restaurants:', err);
      setError('Failed to fetch restaurants. Make sure you have location access and try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRouteToRestaurant = async (restaurant) => {
    if (!location || !restaurant.location) {
      setError('Location data not available');
      return;
    }

    setLoadingPath(true);
    setError(null);

    try {
      const response = await axios.get(ORS_BASE_URL, {
        params: {
          api_key: ORS_API_KEY,
          start: `${location[0]},${location[1]}`, // longitude,latitude
          end: `${restaurant.location[0]},${restaurant.location[1]}` // longitude,latitude
        }
      });

      if (response.data && response.data.features && response.data.features.length > 0) {
        const route = response.data.features[0];
        const coordinates = route.geometry.coordinates;
        
        // Convert coordinates from [lng, lat] to [lat, lng] for Leaflet
        const pathCoordinates = coordinates.map(coord => [coord[1], coord[0]]);
        
        // Extract route information
        const routeProperties = route.properties.segments[0];
        
        setRoutePath(pathCoordinates);
        setRouteInfo({
          distance: (routeProperties.distance / 1000).toFixed(2), // Convert to km
          duration: Math.round(routeProperties.duration / 60), // Convert to minutes
        });

        // Close modal to show the route on map
        setShowModal(false);
      } else {
        setError('No route found to this restaurant');
      }
    } catch (err) {
      console.error('Error fetching route:', err);
      setError('Failed to get route. Please try again.');
    } finally {
      setLoadingPath(false);
    }
  };

  const clearRoute = () => {
    setRoutePath(null);
    setRouteInfo(null);
  };

  const handleRestaurantClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRestaurant(null);
  };

  if (!location) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Fetching your location...</p>
          {error && <p className="text-red-600 mt-2">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full">
      <MapContainer
        center={[location[1], location[0]]}
        zoom={13}
        className="h-full w-full z-0"
        scrollWheelZoom
      >
        <TileLayer 
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Your Location - Blue default marker */}
        <Marker position={[location[1], location[0]]}>
          <Popup>
            <div className="text-center">
              <strong>📍 You are here</strong>
            </div>
          </Popup>
        </Marker>

        {/* Route Path */}
        {routePath && (
          <Polyline
            positions={routePath}
            color="#dc2626"
            weight={4}
            opacity={0.8}
          />
        )}

        {/* Nearby Restaurants - Red markers */}
        {restaurants.map((restaurant, index) => (
          <Marker
            key={`restaurant-${restaurant._id || index}`}
            position={[restaurant.location[1], restaurant.location[0]]}
            icon={redIcon}
            eventHandlers={{
              mouseover: (e) => {
                setHoveredRestaurant(restaurant);
                e.target.openPopup();
              },
              mouseout: (e) => {
                setHoveredRestaurant(null);
                e.target.closePopup();
              },
              click: () => handleRestaurantClick(restaurant)
            }}
          >
            <Popup closeButton={false} autoClose={false} closeOnClick={false}>
              <div className="min-w-48">
                <h3 className="font-bold text-lg text-red-600 mb-2">🍽️ {restaurant.name}</h3>
                <p className="text-gray-700 mb-2">{restaurant.address}</p>
                {restaurant.phone && (
                  <p className="text-sm text-gray-600 mb-2">📞 {restaurant.phone}</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Control Panel */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        {/* Get Restaurants Button */}
        <button
          onClick={fetchRestaurants}
          disabled={loading}
          className={`px-4 py-3 rounded-lg shadow-lg font-semibold transition-all ${
            loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-red-600 hover:bg-red-700 text-white hover:shadow-xl transform hover:scale-105'
          }`}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Loading...
            </span>
          ) : (
            '🍴 Find Restaurants'
          )}
        </button>

        {/* Clear Route Button */}
        {routePath && (
          <button
            onClick={clearRoute}
            className="px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg shadow-lg font-semibold transition-all hover:shadow-xl transform hover:scale-105"
          >
            🚫 Clear Route
          </button>
        )}

        {/* Restaurant Count */}
        {restaurants.length > 0 && (
          <div className="bg-white px-3 py-2 rounded-lg shadow-md text-sm font-medium text-gray-700">
            Found {restaurants.length} restaurant{restaurants.length !== 1 ? 's' : ''}
          </div>
        )}

        {/* Route Information */}
        {routeInfo && (
          <div className="bg-white px-4 py-3 rounded-lg shadow-md text-sm">
            <h4 className="font-semibold text-gray-800 mb-1">Route Info</h4>
            <p className="text-gray-600">Distance: {routeInfo.distance} km</p>
            <p className="text-gray-600">Duration: ~{routeInfo.duration} min on foot.</p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="absolute bottom-4 left-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg max-w-sm">
          {error}
        </div>
      )}

      {/* Restaurant Detail Modal */}
      <RestaurantModal
        restaurant={selectedRestaurant}
        isOpen={showModal}
        onClose={closeModal}
        onShowPaths={getRouteToRestaurant}
        loadingPath={loadingPath}
      />
    </div>
  );
}