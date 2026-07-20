const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-gray-700"></div>
        <div className="absolute inset-0 rounded-full border-4 border-white border-t-transparent animate-spin"></div>
      </div>

      <h2 className="mt-6 text-xl font-semibold text-white">
        {text}
      </h2>

      <p className="mt-2 text-gray-400">
        Please wait a moment...
      </p>
    </div>
  );
};

export default Loader;