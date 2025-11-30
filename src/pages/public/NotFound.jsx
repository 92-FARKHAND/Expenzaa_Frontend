
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-gray-200">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl mb-6">Oops! Page not found</h2>
      <p className="text-gray-300 mb-6">
        The page you are looking for does not exist or you don’t have access.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-gray-800 text-white rounded hover:bg-gray-700 transition"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
