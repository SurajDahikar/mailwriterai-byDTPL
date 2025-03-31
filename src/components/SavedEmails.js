import React, { useState, useEffect } from "react";
import { auth, db } from "../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { jsPDF } from "jspdf";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import DownloadIcon from "@mui/icons-material/Download";

export default function SavedEmails() {
  const [emails, setEmails] = useState([]);
  const [editedEmail, setEditedEmail] = useState({});
  const [isEditing, setIsEditing] = useState(null);

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
    setIsEditing(index);
    setEditedEmail({ ...emails[index] });
  };

  const handleSave = async (index) => {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      const updatedEmails = [...emails];
      updatedEmails[index] = editedEmail;
      await updateDoc(userDocRef, { emails: updatedEmails });
      setEmails(updatedEmails);
      setIsEditing(null);
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

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" align="center" gutterBottom>
          📧 Saved Emails
        </Typography>

        {emails.length === 0 ? (
          <Typography variant="body1" color="textSecondary" align="center">
            No saved emails found.
          </Typography>
        ) : (
          emails.map((email, index) => (
            <Paper
              key={index}
              elevation={3}
              sx={{ p: 3, mb: 2, borderRadius: 2 }}
            >
              <Typography variant="h6">{email.subject}</Typography>
              {isEditing === index ? (
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  margin="normal"
                  value={editedEmail.generatedEmail}
                  onChange={(e) =>
                    setEditedEmail({
                      ...editedEmail,
                      generatedEmail: e.target.value,
                    })
                  }
                />
              ) : (
                <Typography sx={{ whiteSpace: "pre-wrap", mb: 1 }}>
                  {email.generatedEmail}
                </Typography>
              )}
              <Typography variant="body2" color="textSecondary">
                Tone: {email.tone} | Language: {email.language} | Generated:{" "}
                {new Date(email.timestamp).toLocaleString()}
              </Typography>
              <Box mt={2} display="flex" justifyContent="space-between">
                {isEditing === index ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleSave(index)}
                    startIcon={<SaveIcon />}
                  >
                    Save
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEdit(index)}
                  >
                    Edit
                  </Button>
                )}
                <IconButton
                  color="success"
                  onClick={() => handleDownloadPDF(email)}
                >
                  <DownloadIcon />
                </IconButton>
              </Box>
            </Paper>
          ))
        )}
      </Paper>
    </Container>
  );
}
