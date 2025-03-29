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
    let orderId;

    if (paymentMethod === "razorpay") {
      const order = await razorpay.orders.create({
        amount: amount * 100, // amount in paise
        currency: "INR",
        receipt: `receipt_${userId}`,
      });
      orderId = order.id;
    } else if (paymentMethod === "phonepe") {
      // PhonePe order creation logic (Assuming PhonePe API integration)
      const phonePeOrderId = `phonepe_${userId}_${Date.now()}`;
      // Save or manage order details as needed
      orderId = phonePeOrderId;
    } else {
      throw new Error("Unsupported payment method");
    }

    // Update user premium status after successful payment
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, { isPremium: true });

    res.status(200).json({ orderId });
  } catch (error) {
    console.error("Payment error:", error);
    res.status(500).json({ error: "Payment failed" });
  }
}
