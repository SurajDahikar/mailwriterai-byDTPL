import React, { useState, useEffect } from "react";
import { auth, db } from "../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import jsPDF from "jspdf";
import {
  Container,
  Typography,
  Paper,
  Button,
  Box,
  TextField,
  IconButton,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import CancelIcon from "@mui/icons-material/Cancel";

export default function SavedEmailsPage() {
  const [emails, setEmails] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedContent, setEditedContent] = useState("");

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

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditedContent(emails[index].generatedEmail);
  };

  const handleSave = async (index) => {
    try {
      const updatedEmails = [...emails];
      updatedEmails[index].generatedEmail = editedContent;
      setEmails(updatedEmails);

      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, {
          emails: updatedEmails,
        });
        alert("Email updated successfully!");
      }

      setEditingIndex(null);
      setEditedContent("");
    } catch (error) {
      console.error("Error updating email:", error);
      alert("Failed to update the email.");
    }
  };

  const handleDownloadPDF = (email) => {
    try {
      const pdfDoc = new jsPDF();
      pdfDoc.setFont("helvetica");
      pdfDoc.setFontSize(12);
      pdfDoc.text(email.generatedEmail, 10, 20, { maxWidth: 180 });
      pdfDoc.save(`${email.subject}.pdf`);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Failed to download the email as PDF.");
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={handleBack} color="primary">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" fontWeight="bold" sx={{ ml: 1 }}>
          Saved Emails
        </Typography>
      </Box>

      {emails.length === 0 ? (
        <Typography variant="body1" color="text.secondary" align="center">
          No saved emails found.
        </Typography>
      ) : (
        emails.map((email, index) => (
          <Paper
            key={index}
            elevation={3}
            sx={{ p: 3, mb: 2, borderRadius: 3, position: "relative" }}
          >
            <Typography variant="h6" fontWeight="bold">
              {email.subject}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Tone: {email.tone} | Language: {email.language} | Generated:{" "}
              {new Date(email.timestamp).toLocaleString()}
            </Typography>
            <Divider sx={{ my: 1 }} />
            {editingIndex === index ? (
              <Box sx={{ mt: 2 }}>
                <TextField
                  label="Edit Email"
                  multiline
                  rows={6}
                  fullWidth
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                <Box display="flex" gap={1}>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<SaveIcon />}
                    onClick={() => handleSave(index)}
                    sx={{ textTransform: "none" }}
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<CancelIcon />}
                    onClick={() => setEditingIndex(null)}
                    sx={{ textTransform: "none" }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            ) : (
              <>
                <Typography
                  variant="body1"
                  sx={{ mt: 2, whiteSpace: "pre-wrap" }}
                >
                  {email.generatedEmail}
                </Typography>
                <Box sx={{ mt: 2 }} display="flex" gap={1}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<EditIcon />}
                    onClick={() => handleEdit(index)}
                    sx={{ textTransform: "none" }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<PictureAsPdfIcon />}
                    onClick={() => handleDownloadPDF(email)}
                    sx={{ textTransform: "none" }}
                  >
                    Export to PDF
                  </Button>
                </Box>
              </>
            )}
          </Paper>
        ))
      )}
    </Container>
  );
}
