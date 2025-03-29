import React, { useEffect, useState } from "react";
import {
    auth,
    db,
    checkPremiumStatus,
    login,
    logout
} from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import EmailGenerator from "../components/EmailGenerator";
import ReferralComponent from "../components/ReferralComponent";
import UpgradeButton from "@/components/UpgradeButton";
import PremiumAd from "@/components/PremiumAd";
import VoiceInput from "@/components/VoiceInput";
import DownloadPDFButton from "@/components/DownloadPDFButton";
import SavedEmails from "../components/SavedEmails";

export default function Home() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isPremium, setIsPremium] = useState(false);
    const [generatedEmail, setGeneratedEmail] = useState("");
    const [credits, setCredits] = useState(0);
    const [referrals, setReferrals] = useState(0);
    const [userName, setUserName] = useState("");
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Handle login
    const handleLogin = async () => {
        try {
            const user = await login();
            if (user) {
                console.log("✅ Login successful!", user.displayName);
                setIsLoggedIn(true);
            } else {
                console.warn("⚠️ Login did not return a user.");
            }
        } catch (error) {
            console.error("❌ Login failed:", error);
        }
    };

    // Handle logout
    const handleLogout = async () => {
        try {
            await logout();
            console.log("🚪 User logged out.");
            setIsLoggedIn(false);
            setIsPremium(false);
            setCredits(0);
            setReferrals(0);
            setUserName("");
        } catch (error) {
            console.error("❌ Logout failed:", error);
        }
    };

    // Fetch user data from Firestore
    const fetchUserData = async (user) => {
        try {
            console.log("🔍 Fetching user data for:", user.uid);
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                setCredits(userData.credits || 0);
                setReferrals(userData.referrals || 0);
                setUserName(user.displayName || "User");
                console.log("ℹ️ User data fetched:", userData);
            } else {
                console.warn("⚠️ No user data found in Firestore for:", user.uid);
            }
        } catch (error) {
            console.error("❌ Failed to fetch user data:", error);
        }
    };

    // Handle authentication state changes
    useEffect(() => {
        console.log("🔄 Checking auth state...");
        setLoading(true);

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                console.log("✅ User logged in:", user.displayName);
                setIsLoggedIn(true);

                try {
                    console.log("🔍 Checking premium status for:", user.uid);
                    const isPremiumUser = await checkPremiumStatus(user.uid);
                    setIsPremium(isPremiumUser);
                    console.log("🏷️ Premium status:", isPremiumUser);

                    console.log("🗃️ Fetching user data...");
                    await fetchUserData(user);
                } catch (error) {
                    console.error("❌ Error during auth state processing:", error);
                } finally {
                    console.log("✅ Auth state processing complete.");
                    setLoading(false);
                }
            } else {
                console.log("🚪 User not logged in.");
                setIsLoggedIn(false);
                setIsPremium(false);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    // Callback to receive generated email from the EmailGenerator component
    const handleEmailGenerated = (email) => {
        setGeneratedEmail(email);
    };

    return (
        <div className="p-4 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-4 text-center">Mail Writer AI</h1>

            {loading ? (
                <div className="text-center text-gray-700">Loading...</div>
            ) : (
                <>
                    {/* Login and Logout Buttons */}
                    <div className="flex justify-center mb-4">
                        {isLoggedIn ? (
                            <button
                                onClick={handleLogout}
                                className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Logout
                            </button>
                        ) : (
                            <button
                                onClick={handleLogin}
                                className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                                Login with Google
                            </button>
                        )}
                    </div>

                    {/* User Info and Credits */}
                    {isLoggedIn && (
                        <div className="text-center mb-4">
                            <p className="text-xl font-semibold">Welcome, {userName}!</p>
                            <p className="text-lg">Credits: {credits}</p>
                            <p className="text-lg">Referrals: {referrals}</p>
                        </div>
                    )}

                    {/* Upgrade Button and Ad for non-premium users */}
                    {!isPremium && isLoggedIn && (
                        <>
                            <div className="mb-4">
                                <UpgradeButton />
                            </div>
                            <PremiumAd />
                        </>
                    )}

                    {/* Voice Input Component */}
                    {isLoggedIn && (
                        <div className="mb-4">
                            <VoiceInput />
                        </div>
                    )}

                    {/* Email Generator Component */}
                    {isLoggedIn ? (
                        <div className="mb-4">
                            <EmailGenerator onEmailGenerated={handleEmailGenerated} />
                        </div>
                    ) : (
                        <div className="text-center text-gray-700">
                            Please log in to access premium features and generate emails.
                        </div>
                    )}

                    {/* Download as PDF Button */}
                    {generatedEmail && (
                        <div className="mb-4">
                            <DownloadPDFButton emailContent={generatedEmail} />
                        </div>
                    )}

                    {/* Saved Emails Component */}
                    {isLoggedIn && (
                        <div className="mb-4">
                            <SavedEmails />
                        </div>
                    )}

                    {/* Referral Component */}
                    {isLoggedIn && (
                        <div className="mb-4">
                            <ReferralComponent />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
