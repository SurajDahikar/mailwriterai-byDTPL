import React, { useState, useEffect } from "react";
import { auth, db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

const ReferralComponent = () => {
    const [referralLink, setReferralLink] = useState("");
    const [copied, setCopied] = useState(false);
    const [referralCount, setReferralCount] = useState(0);

    useEffect(() => {
        const fetchReferralLink = async () => {
            const user = auth.currentUser;
            if (user) {
                const userDocRef = doc(db, "users", user.uid);
                const userSnapshot = await getDoc(userDocRef);
                if (userSnapshot.exists()) {
                    const data = userSnapshot.data();
                    setReferralLink(`${window.location.origin}/?ref=${data.referralCode}`);
                    setReferralCount(data.referrals || 0);
                }
            }
        };

        fetchReferralLink();
    }, []);

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    };

    return (
        <div className="p-4 bg-white shadow rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Refer a Friend</h2>
            <p className="text-gray-600 mb-4">
                Share your referral link and earn free email credits!
            </p>
            <div className="flex items-center space-x-2">
                <input
                    type="text"
                    value={referralLink || "Loading..."}
                    readOnly
                    className="w-full p-2 border rounded-md"
                />
                <button
                    onClick={handleCopy}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    {copied ? "Copied!" : "Copy"}
                </button>
            </div>
            <p className="text-gray-600 mt-2">Referrals: {referralCount}</p>
        </div>
    );
};

export default ReferralComponent;
