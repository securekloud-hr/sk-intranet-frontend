
import React from "react";

export default function HomePage({ user }) {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Welcome to SecureKloud Intranet</h1>
        <div className="flex items-center gap-3">
          <img
            src={user.profilePic}
            className="w-10 h-10 rounded-full"
            alt={user.name}
          />
          <span className="font-medium">{user.name}</span>
        </div>
      </div>

      <p><strong>Department:</strong> {user.department}</p>
      <p><strong>Skills:</strong> {user.skills.join(", ")}</p>

      <button
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
        onClick={() => {
          localStorage.removeItem("userId");
          window.location.reload();
        }}
      >
        Logout
      </button>
    </div>
  );
}
