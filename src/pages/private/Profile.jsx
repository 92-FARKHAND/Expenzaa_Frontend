import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  (async () => {
    try {
      const res = await axios.get("/api/user/profile");
      const userData = res.data.data;
      setUser(userData);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch user data");
      setLoading(false);
    }
    
    
  })();
}, []);



  if (loading)
    return (
      <div className="h-screen flex justify-center items-center bg-gray-900 text-white">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="h-screen flex justify-center items-center bg-gray-900 text-white">
        {error}
      </div>
    );

  return (
      <div className="bg-gray-900 rounded-lg shadow-lg p-8 max-w-sm w-full text-center text-white">
        <img
          src={user.avatar}
          alt="Profile"
          className="mx-auto mb-6 rounded-full w-32 h-32 object-cover border-4 border-gray-700"
        />
        <h2 className="text-2xl font-semibold mb-2 text-gray-400">{user.fullName}</h2>
        <p className="mb-1">
          <span className="font-semibold text-gray-400">Username:</span> {user.username}
       </p>
       <p className="mb-1">
         <span className="font-semibold text-gray-400">Email:</span> {user.email}
       </p>
       <p className="mb-1">
         <span className="font-semibold text-gray-400">Role:</span> {user.role}
       </p>
       <p className="text-sm text-gray-400">
         Created At: {new Date(user.createdAt).toLocaleDateString()}
       </p>
     </div>
  );
}
