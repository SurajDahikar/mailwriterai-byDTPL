import React, { useState, useEffect } from "react";
import { generateEmail } from "../lib/gemini";
import { auth, db, checkPremiumStatus } from "../lib/firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import jsPDF from "jspdf";
import { useRouter } from "next/router";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  CircularProgress,
  Paper,
} from "@mui/material";

export default function EmailGenerator() {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [tone, setTone] = useState("Formal");
  const [language, setLanguage] = useState("English");
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const router = useRouter();

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

        if (!isPremium) {
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

  return (
    <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
          ✉️ Mail Writer AI
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" gutterBottom>
          {isPremium ? "Unlimited Credits (Premium)" : `Credits: ${credits}`}
        </Typography>

        <Box sx={{ mt: 3 }}>
          <TextField
            label="Email Subject"
            variant="outlined"
            fullWidth
            margin="normal"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Box display="flex" gap={2} mt={2} justifyContent="space-between">
            <Select
              fullWidth
              variant="outlined"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              sx={{ mb: 2 }}
            >
              {["Formal", "Friendly", "Apologetic", "Persuasive", "Empathetic"].map((toneOption) => (
                <MenuItem key={toneOption} value={toneOption}>
                  {toneOption}
                </MenuItem>
              ))}
            </Select>

            <Select
              fullWidth
              variant="outlined"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              sx={{ mb: 2 }}
            >
              {["English", "Hindi", "Hinglish"].map((lang) => (
                <MenuItem key={lang} value={lang}>
                  {lang}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <TextField
            label="Message Content"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleGenerate}
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
            sx={{
              mt: 2,
              py: 1.5,
              fontWeight: "bold",
              borderRadius: 3,
              textTransform: "none",
            }}
          >
            {loading ? "Generating..." : "Generate Email"}
          </Button>

          {generatedEmail && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Generated Email:
              </Typography>
              <Paper elevation={3} sx={{ p: 2, mt: 1, whiteSpace: "pre-wrap", borderRadius: 3 }}>
                {generatedEmail}
              </Paper>
              <Button
                variant="contained"
                color="success"
                fullWidth
                sx={{ mt: 2, py: 1.5, fontWeight: "bold", textTransform: "none" }}
                onClick={handleDownloadPDF}
              >
                📄 Download as PDF
              </Button>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
}
