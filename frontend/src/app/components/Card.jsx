'use client';

import React from 'react';

const Card = ({ title, description, icon }) => {
  return (
    <div
      className="bg-white rounded-lg p-6 border border-gray-100"
      style={{
        transition: 'box-shadow 0.3s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(237, 39, 37, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div className="flex flex-col items-center text-center">
        {/* Icon */}
        <div className="mb-4 text-4xl text-red-600">
          {icon}
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

export default Card;
