import React, { useState, useEffect } from "react";
import { auth, db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function SavedEmails() {
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    const fetchEmails = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userDocRef);
        if (userSnapshot.exists()) {
          const data = userSnapshot.data();
          setEmails(data.emails || []);
        }
      }
    };

    fetchEmails();
  }, []);

  return (
    <div className="p-4 bg-white rounded-xl shadow-md mb-4">
      <h3 className="text-lg font-bold mb-2">Saved Emails</h3>
      {emails.length === 0 ? (
        <p className="text-gray-600">No saved emails found.</p>
      ) : (
        <ul className="space-y-2">
          {emails.map((email, index) => (
            <li key={index} className="p-2 border rounded">
              <h4 className="font-semibold">{email.subject}</h4>
              <p className="text-sm text-gray-600">{email.content}</p>
              <p className="text-xs text-gray-400">Tone: {email.tone}</p>
              <p className="text-xs text-gray-400">Language: {email.language}</p>
              <p className="text-xs text-gray-400">Generated: {new Date(email.timestamp).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
