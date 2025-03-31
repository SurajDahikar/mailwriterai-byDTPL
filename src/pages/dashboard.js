// src/pages/dashboard.js

import { useState, useEffect } from "react";
import { auth, fetchSavedEmails, logout } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import {
  Container,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Box,
  Divider,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import EmailIcon from "@mui/icons-material/Email";

export default function Dashboard() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch saved emails on user authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const fetchedEmails = await fetchSavedEmails(user.uid);
        setEmails(fetchedEmails);
        setLoading(false);
      } else {
        router.push("/"); // Redirect to home if not logged in
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Handle Logout
  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading your saved emails...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" fontWeight="bold">
          Saved Emails
        </Typography>
        <Button
          variant="contained"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{ textTransform: "none" }}
        >
          Logout
        </Button>
      </Box>
      {emails.length === 0 ? (
        <Typography variant="body1" color="text.secondary" align="center">
          No saved emails found.
        </Typography>
      ) : (
        <Box display="flex" flexDirection="column" gap={2}>
          {emails.map((email) => (
            <Paper
              key={email.id}
              elevation={3}
              sx={{ p: 3, borderRadius: 3, position: "relative" }}
            >
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <EmailIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  {email.subject}
                </Typography>
              </Box>
              <Divider sx={{ mb: 1 }} />
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ whiteSpace: "pre-wrap", mb: 1 }}
              >
                {email.content}
              </Typography>
              <Typography variant="body2" color="text.disabled">
                Generated on: {new Date(email.timestamp).toLocaleString()}
              </Typography>
            </Paper>
          ))}
        </Box>
      )}
    </Container>
  );
}
