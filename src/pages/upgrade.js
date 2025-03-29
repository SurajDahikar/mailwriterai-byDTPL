import React from 'react';
import { auth } from '../lib/firebase'; // Corrected import path

export default function Upgrade() {
    const handleUpgrade = async (paymentMethod) => {
        try {
            const user = auth.currentUser;
            if (user) {
                const response = await fetch('/api/upgrade', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: user.uid,
                        amount: 10, // Example amount
                        paymentMethod: paymentMethod,
                    }),
                });

                if (!response.ok) {
                    // Log the full response for debugging
                    const text = await response.text();
                    console.error('API Error Response:', text);
                    alert('Upgrade failed. Please check the console for details.');
                    return; // Exit the function to prevent further errors
                }

                const data = await response.json();
                console.log('API Response Data:', data); // Log the JSON response

                if (data.orderId) {
                    alert('Upgrade successful!');
                    // Redirect or update UI (e.g., router.push('/premium-features'))
                } else {
                    alert('Upgrade failed: ' + data.error);
                }
            }
        } catch (error) {
            console.error('Upgrade error:', error);
            alert('An error occurred during upgrade.');
        }
    };

    return (
        <div className="p-4 bg-white rounded-xl shadow-md max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Upgrade to Premium</h1>
            <p>Choose your payment method:</p>
            <button
                className="bg-blue-500 text-white p-2 rounded mb-2"
                onClick={() => handleUpgrade('razorpay')}
            >
                Pay with Razorpay
            </button>
            <button
                className="bg-green-500 text-white p-2 rounded"
                onClick={() => handleUpgrade('phonepe')}
            >
                Pay with PhonePe
            </button>
        </div>
    );
}