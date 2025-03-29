// src/pages/api/upgrade.js
import Razorpay from "razorpay";
import { db } from "../../lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET_KEY,
});

export default async function handler(req, res) {
    const { userId, amount, paymentMethod } = req.body;

    try {
        console.log("API Request:", { userId, amount, paymentMethod }); // Log the request

        let orderId;

        if (paymentMethod === "razorpay") {
            const order = await razorpay.orders.create({
                amount: amount * 100,
                currency: "INR",
                receipt: `receipt_${userId}`,
            });
            orderId = order.id;
            console.log("Razorpay Order ID:", orderId); // Log the order ID
        } else if (paymentMethod === "phonepe") {
            // PhonePe order creation logic (Assuming PhonePe API integration)
            const phonePeOrderId = `phonepe_${userId}_${Date.now()}`;
            // Save or manage order details as needed
            orderId = phonePeOrderId;
            console.log("PhonePe Order ID:", phonePeOrderId);
        } else {
            throw new Error("Unsupported payment method");
        }

        const userDocRef = doc(db, "users", userId);
        await updateDoc(userDocRef, { isPremium: true });

        res.status(200).json({ orderId });
        console.log("API Success Response:", { orderId });

    } catch (error) {
        console.error("API Error:", error);
        res.status(500).json({ error: "Payment failed" });
        console.log("API Error Response:", { error: "Payment failed" }, error);
    }
}