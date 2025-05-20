import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mt-4">Page Not Found</h2>
        <p className="mt-2 text-gray-600">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link to="/" className="btn btn-primary">
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
