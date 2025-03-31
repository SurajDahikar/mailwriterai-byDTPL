import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { useRouter } from "next/router";

const PremiumAd = () => {
    const router = useRouter();

    const handleUpgrade = () => {
        // Navigate to the upgrade page
        router.push("/upgrade");
    };

    return (
        <Paper
            elevation={6}
            sx={{
                backgroundColor: "#fff7e6",
                p: 3,
                borderRadius: 4,
                textAlign: "center",
                mb: 3,
                border: "1px solid #f5c35a",
            }}
        >
            <Typography variant="h5" fontWeight="bold" color="#d48806" gutterBottom>
                🚀 Unlock Premium Features!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Upgrade to the premium version to enjoy unlimited email generation, priority support, and more!
            </Typography>
            <Button
                variant="contained"
                color="warning"
                size="large"
                sx={{ borderRadius: 20, textTransform: "none", fontWeight: "bold" }}
                onClick={handleUpgrade}
            >
                Upgrade Now
            </Button>
        </Paper>
    );
};

export default PremiumAd;
