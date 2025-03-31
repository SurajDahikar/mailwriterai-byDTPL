import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth, login, logout } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import EmailGenerator from "../components/EmailGenerator";
import ReferralComponent from "../components/ReferralComponent";
import UpgradeButton from "../components/UpgradeButton";
import PremiumAd from "../components/PremiumAd";
import VoiceInput from "../components/VoiceInput";
import DownloadPDFButton from "../components/DownloadPDFButton";
import Button from "@mui/material/Button";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#4caf50",
    },
    background: {
      default: "#f4f6f8",
      paper: "#fff",
    },
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          textTransform: "none",
        },
      },
    },
  },
});

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
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

  const handleEmailGenerated = (email) => {
    setGeneratedEmail(email);
  };

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Header */}
      <AppBar position="static" color="primary" elevation={4}>
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            Mail Writer AI
          </Typography>
          {isLoggedIn ? (
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Button color="inherit" onClick={handleLogin}>
              Login with Google
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          py: 8,
          textAlign: "center",
          backgroundColor: "primary.main",
          color: "white",
          borderBottom: "4px solid #1565c0",
        }}
      >
        <Typography variant="h3" gutterBottom>
          Effortless Email Writing with AI
        </Typography>
        <Typography variant="h6" gutterBottom>
          Generate professional emails in seconds with support for English, Hindi, and Hinglish.
        </Typography>
        {!isPremium && (
          <Button
            variant="contained"
            color="secondary"
            onClick={() => router.push("/upgrade")}
            sx={{ mt: 2, px: 4, py: 1 }}
          >
            Upgrade to Premium
          </Button>
        )}
      </Box>

{/* Features Section */}
<Container sx={{ py: 8, textAlign: "center", backgroundColor: "#f4f6f8" }}>
  <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4, fontWeight: "bold", color: "#333" }}>
    Why Choose Mail Writer AI?
  </Typography>
  <Grid container spacing={3} justifyContent="center">
    {[
      {
        title: "Multi-Language Support",
        description: "Generate emails in English, Hindi, and Hinglish effortlessly.",
        icon: "🌐",
      },
      {
        title: "Customizable Tones",
        description: "Adjust the tone to be formal, friendly, apologetic, persuasive, or empathetic.",
        icon: "🎭",
      },
      {
        title: "Voice Input",
        description: "Compose emails using your voice for a hands-free experience.",
        icon: "🎤",
      },
      {
        title: "Download as PDF",
        description: "Save your generated emails as PDF files with one click.",
        icon: "📄",
      },
      {
        title: "Premium Features",
        description: "Get unlimited credits and access to exclusive features.",
        icon: "⭐",
      },
      {
        title: "Referral Rewards",
        description: "Earn free credits by referring your friends.",
        icon: "🤝",
      },
    ].map((feature, index) => (
      <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
        <Paper
          elevation={6}
          sx={{
            p: 2,
            borderRadius: "12px",
            height: "200px",
            textAlign: "center",
            backgroundColor: "#fff",
            transition: "transform 0.4s",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
            },
          }}
        >
          <Box
            sx={{
              fontSize: "40px",
              marginBottom: "8px",
              color: "#1976d2",
            }}
          >
            {feature.icon}
          </Box>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", color: "#333" }}>
            {feature.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ px: 1 }}>
            {feature.description}
          </Typography>
        </Paper>
      </Grid>
    ))}
  </Grid>
  <Box sx={{ mt: 6 }}>
    <Button
      variant="contained"
      color="primary"
      sx={{ px: 5, py: 1.5, borderRadius: "8px", fontWeight: "bold" }}
      onClick={() => router.push("/upgrade")}
    >
      Upgrade to Premium
    </Button>
  </Box>
</Container>


    {/* Main Content */}
<Container sx={{ py: 4 }}>
  {isLoggedIn ? (
    <>
      {!isPremium && (
        <Box sx={{ my: 2 }}>
          <PremiumAd />
        </Box>
      )}
      <Box sx={{ my: 2 }}>
        <VoiceInput />
      </Box>
      <Box sx={{ my: 2 }}>
        <EmailGenerator onEmailGenerated={handleEmailGenerated} />
      </Box>
      {generatedEmail && (
        <Box sx={{ my: 2 }}>
          <DownloadPDFButton emailContent={generatedEmail} />
        </Box>
      )}
      <Box sx={{ my: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push("/saved-emails")}
          sx={{ mb: 2 }}
        >
          View Saved Emails
        </Button>
      </Box>
      <Box sx={{ my: 2 }}>
        <ReferralComponent />
      </Box>
      {isPremium && (
        <Box sx={{ my: 2 }}>
          <UpgradeButton />
        </Box>
      )}
    </>
  ) : (
    <Typography align="center" sx={{ my: 4, color: "text.secondary" }}>
      Please log in to access premium features and generate emails.
    </Typography>
  )}
</Container>

      {/* Footer */}
      <Box
        sx={{
          bgcolor: "grey.900",
          color: "white",
          py: 3,
          textAlign: "center",
          marginTop: "auto",
        }}
      >
        <Typography variant="body2">
          © 2025 Mail Writer AI. All rights reserved.
        </Typography>
        <Typography variant="body2">
          Privacy Policy | Terms of Service | Contact Us
        </Typography>
      </Box>
    </ThemeProvider>
  );
}
