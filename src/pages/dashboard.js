// src/pages/dashboard.js

import { useState, useEffect } from "react";
import { auth, fetchSavedEmails, logout } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";

export default function Dashboard() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch saved emails on user authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const fetchedEmails = await fetchSavedEmails(user.uid);
        setEmails(fetchedEmails);
        setLoading(false);
      } else {
        router.push("/"); // Redirect to home if not logged in
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Handle Logout
  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (loading) {
    return <p>Loading your saved emails...</p>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Saved Emails</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Logout
        </button>
      </div>
      {emails.length === 0 ? (
        <p>No saved emails found.</p>
      ) : (
        <ul className="space-y-4">
          {emails.map((email) => (
            <li key={email.id} className="p-4 bg-gray-100 rounded">
              <h2 className="text-lg font-semibold">{email.subject}</h2>
              <p className="text-gray-700">{email.content}</p>
              <p className="text-sm text-gray-500">
                Generated on: {new Date(email.timestamp).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
