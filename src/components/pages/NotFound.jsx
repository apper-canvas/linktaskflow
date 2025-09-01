import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">404</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Page not found</p>
        <Link 
          to="/" 
          className="mt-4 inline-block px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;