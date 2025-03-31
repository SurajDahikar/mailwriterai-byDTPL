import React, { useState, useEffect } from "react";
import { generateEmail } from "../lib/genai";
import { auth, db, applyReferralCode, checkPremiumStatus } from "../lib/firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import jsPDF from "jspdf";
import { useRouter } from "next/router";

export default function EmailGenerator() {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [tone, setTone] = useState("Formal");
  const [language, setLanguage] = useState("English");
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [referralLink, setReferralLink] = useState("");
  const [referralCount, setReferralCount] = useState(0);
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const router = useRouter();

  // Fetch user data (credits, referral count, and premium status)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(db, "users", user.uid);
          const userSnapshot = await getDoc(userDocRef);
          if (userSnapshot.exists()) {
            const data = userSnapshot.data();
            setCredits(data.credits || 0);
            setReferralCount(data.referrals || 0);
            setReferralLink(`${window.location.origin}/?ref=${data.referralCode}`);
            setIsPremium(await checkPremiumStatus(user.uid));
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Failed to fetch user data. Please try again.");
      }
    };
    fetchUserData();
  }, []);

  // Generate Email
  const handleGenerate = async () => {
    if (!subject.trim() || !content.trim()) {
      alert("Please enter a subject and content before generating the email.");
      return;
    }

    if (!isPremium && credits <= 0) {
      alert("You don't have enough credits to generate an email.");
      return;
    }

    setLoading(true);
    const prompt = `Write a ${tone.toLowerCase()} email in ${language} about: ${subject}. Content: ${content}`;

    try {
      const email = await generateEmail(prompt);
      setGeneratedEmail(email);

      // Save the generated email to Firebase
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const emailData = {
          subject,
          content,
          tone,
          language,
          generatedEmail: email,
          timestamp: new Date().toISOString(),
        };
        await updateDoc(userDocRef, {
          emails: arrayUnion(emailData),
        });
      }

      // Deduct 1 credit after successful email generation for non-premium users
      if (!isPremium) {
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(db, "users", user.uid);
          await updateDoc(userDocRef, {
            credits: credits - 1,
          });
          setCredits((prev) => prev - 1);
        }
      }
    } catch (error) {
      console.error("Error generating email:", error);
      alert("An error occurred while generating the email. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Download Email as PDF
  const handleDownloadPDF = () => {
    try {
      const pdfDoc = new jsPDF();
      pdfDoc.setFont("helvetica");
      pdfDoc.setFontSize(12);
      pdfDoc.text(generatedEmail, 10, 20, { maxWidth: 180 });
      pdfDoc.save("generated_email.pdf");
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Failed to download the email as PDF.");
    }
  };

  // Voice Input for Email Content
  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Voice recognition not supported on this browser.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = language === "Hindi" ? "hi-IN" : "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setContent((prev) => prev + " " + spokenText);
    };

    recognition.onerror = (event) => {
      console.error("Voice recognition error:", event.error);
      alert("Voice recognition failed. Please try again.");
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  // Apply Referral Code (from URL)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get("ref");
    if (refCode) {
      applyReferralCode(refCode);
    }
  }, []);

  // Copy Referral Link
  const handleCopyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    alert("Referral link copied to clipboard!");
  };

  // Upgrade to Premium
  const handleUpgrade = () => {
    router.push("/upgrade");
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Mail Writer AI</h2>
      <p className="text-gray-600 mb-2">
        Credits: {isPremium ? "Unlimited (Premium)" : credits}
      </p>
      <p className="text-gray-600 mb-2">Referrals: {referralCount}</p>

      {!isPremium && (
        <button
          onClick={handleUpgrade}
          className="w-full p-2 mb-2 bg-purple-500 text-white rounded"
        >
          Upgrade to Premium
        </button>
      )}

      <input
        type="text"
        placeholder="Subject"
        className="w-full p-2 mb-2 border rounded"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />

      <textarea
        placeholder="Message Content"
        className="w-full p-2 mb-2 border rounded"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button
        onClick={handleVoiceInput}
        className={`w-full p-2 rounded mb-2 ${isRecording ? "bg-red-500" : "bg-blue-500"} text-white`}
      >
        {isRecording ? "Recording..." : "Voice Input"}
      </button>

      <button
        onClick={handleCopyReferralLink}
        className="w-full p-2 mb-2 bg-green-500 text-white rounded"
      >
        Copy Referral Link
      </button>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className={`w-full p-2 rounded mb-2 ${loading ? "bg-gray-400" : "bg-blue-500"} text-white`}
      >
        {loading ? "Generating..." : "Generate Email"}
      </button>

      {generatedEmail && (
        <>
          <textarea
            className="w-full p-2 mb-2 border rounded"
            value={generatedEmail}
            readOnly
          />
          <button
            onClick={handleDownloadPDF}
            className="w-full bg-green-500 text-white p-2 rounded mb-2"
          >
            Download as PDF
          </button>
        </>
      )}
    </div>
  );
}
