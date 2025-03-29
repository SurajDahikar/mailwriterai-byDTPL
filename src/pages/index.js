import React, { useEffect, useState } from "react";
import { auth, login, logout } from "../lib/firebase"; // Import login and logout
import { onAuthStateChanged } from "firebase/auth";
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

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsLoggedIn(true);
                // Check if the user is premium from Firestore
                user.getIdTokenResult().then((idTokenResult) => {
                    setIsPremium(!!idTokenResult.claims.premium);
                });
            } else {
                setIsLoggedIn(false);
                setIsPremium(false);
            }
        });
        return () => unsubscribe();
    }, []);

    // Callback to receive generated email from the EmailGenerator component
    const handleEmailGenerated = (email) => {
        setGeneratedEmail(email);
    };

    // Handle login
    const handleLogin = async () => {
        try {
            await login();
        } catch (error) {
            console.error("Login failed:", error);
            alert("Login failed. Please try again.");
        }
    };

    // Handle logout
    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Logout failed:", error);
            alert("Logout failed. Please try again.");
        }
    };

    return (
        <div className="p-4 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-4 text-center">Mail Writer AI</h1>

            {/* Login/Logout Buttons */}
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

            {/* Show the upgrade button if not premium */}
            {!isPremium && isLoggedIn && (
                <div className="mb-4">
                    <UpgradeButton />
                </div>
            )}

            {/* Show an ad for non-premium users */}
            {!isPremium && isLoggedIn && <PremiumAd />}

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
            {generatedEmail && isLoggedIn && (
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
        </div>
    );
}