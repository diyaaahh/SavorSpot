'use client';

import React, { useState } from 'react';
import { Upload, MapPin, Phone, Building, Image, Check, X, AlertCircle } from 'lucide-react';

const AdminRestaurantForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    location: ['', ''] // [longitude, latitude]
  });
  
  const [files, setFiles] = useState({
    venue: null,
    menu: null
  });
  
  const [previews, setPreviews] = useState({
    venue: null,
    menu: null
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'longitude' || name === 'latitude') {
      const index = name === 'longitude' ? 0 : 1;
      setFormData(prev => ({
        ...prev,
        location: prev.location.map((coord, i) => i === index ? value : coord)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Please select a valid image file.' });
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'File size should be less than 5MB.' });
        return;
      }

      setFiles(prev => ({ ...prev, [type]: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviews(prev => ({ ...prev, [type]: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = (type) => {
    setFiles(prev => ({ ...prev, [type]: null }));
    setPreviews(prev => ({ ...prev, [type]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Validation
      if (!formData.name || !formData.address || !formData.phone) {
        throw new Error('Please fill in all required fields.');
      }
      
      if (!formData.location[0] || !formData.location[1]) {
        throw new Error('Please provide both longitude and latitude.');
      }
      
      if (!files.venue || !files.menu) {
        throw new Error('Please upload both venue and menu images.');
      }

      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('address', formData.address);
      submitData.append('phone', formData.phone);
      submitData.append('location', JSON.stringify([parseFloat(formData.location[0]), parseFloat(formData.location[1])]));
      submitData.append('venue', files.venue);
      submitData.append('menu', files.menu);

      // Make API call
      const response = await fetch('http://localhost:3001/api/restaurants/add', {
        method: 'POST',
        credentials: 'include',
        body: submitData
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to add restaurant');
      }

      setMessage({ type: 'success', text: 'Restaurant added successfully!' });
      
      // Reset state
      setFormData({
        name: '',
        address: '',
        phone: '',
        location: ['', '']
      });
      setFiles({ venue: null, menu: null });
      setPreviews({ venue: null, menu: null });

    } catch (error) {
      console.error('Error adding restaurant:', error);
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-6">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Building className="w-8 h-8" />
              Add New Restaurant
            </h1>
            <p className="text-red-100 mt-2">Fill in the details to add a new restaurant to the system</p>
          </div>

          {/* Message */}
          {message.text && (
            <div className={`mx-8 mt-6 p-4 rounded-lg flex items-center gap-3 ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.type === 'success' ? (
                <Check className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* Form Container */}
          <div className="p-8 space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                Basic Information
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Restaurant Name *
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                      placeholder="Enter restaurant name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors resize-none"
                    placeholder="Enter complete address"
                  />
                </div>
              </div>
            </div>

            {/* Location Coordinates */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                Location Coordinates
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longitude *
                  </label>
                  <input
                    type="number"
                    name="longitude"
                    value={formData.location[0]}
                    onChange={handleInputChange}
                    step="any"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    placeholder="e.g., 85.3240"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Latitude *
                  </label>
                  <input
                    type="number"
                    name="latitude"
                    value={formData.location[1]}
                    onChange={handleInputChange}
                    step="any"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    placeholder="e.g., 27.7172"
                  />
                </div>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-red-700">
                  <strong>Tip:</strong> You can get coordinates from Google Maps by right-clicking on the location and copying the coordinates.
                </p>
              </div>
            </div>

            {/* Image Uploads */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                Images
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Venue Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Venue Image *
                  </label>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-400 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'venue')}
                        className="hidden"
                        id="venue-upload"
                      />
                      <label htmlFor="venue-upload" className="cursor-pointer">
                        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                        <p className="text-sm text-gray-600">Click to upload venue image</p>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                      </label>
                    </div>
                    
                    {previews.venue && (
                      <div className="relative">
                        <img 
                          src={previews.venue} 
                          alt="Venue preview" 
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile('venue')}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Menu Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Menu Image *
                  </label>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-400 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'menu')}
                        className="hidden"
                        id="menu-upload"
                      />
                      <label htmlFor="menu-upload" className="cursor-pointer">
                        <Image className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                        <p className="text-sm text-gray-600">Click to upload menu image</p>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                      </label>
                    </div>
                    
                    {previews.menu && (
                      <div className="relative">
                        <img 
                          src={previews.menu} 
                          alt="Menu preview" 
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile('menu')}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className={`px-8 py-3 rounded-lg font-medium transition-all ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transform hover:scale-105'
                } text-white shadow-lg`}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Adding Restaurant...
                  </div>
                ) : (
                  'Add Restaurant'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRestaurantForm;