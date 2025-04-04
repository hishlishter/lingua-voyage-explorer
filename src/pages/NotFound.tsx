
import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-300 to-purple-500">
      <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md">
        <h1 className="text-4xl font-bold mb-4 text-purple-800">404</h1>
        <p className="text-xl text-gray-700 mb-6">
          Страница не найдена
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
