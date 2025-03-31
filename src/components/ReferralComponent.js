import React, { useState, useEffect } from "react";
import { auth, db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    IconButton,
    Tooltip,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const ReferralComponent = () => {
    const [referralLink, setReferralLink] = useState("");
    const [copied, setCopied] = useState(false);
    const [referralCount, setReferralCount] = useState(0);

    useEffect(() => {
        const fetchReferralLink = async () => {
            const user = auth.currentUser;
            if (user) {
                const userDocRef = doc(db, "users", user.uid);
                const userSnapshot = await getDoc(userDocRef);
                if (userSnapshot.exists()) {
                    const data = userSnapshot.data();
                    setReferralLink(`${window.location.origin}/?ref=${data.referralCode}`);
                    setReferralCount(data.referrals || 0);
                }
            }
        };

        fetchReferralLink();
    }, []);

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    };

    return (
        <Box sx={{ p: 3 }}>
            <Paper
                elevation={6}
                sx={{
                    p: 3,
                    borderRadius: 4,
                    textAlign: "center",
                    backgroundColor: "#f4f6f8",
                }}
            >
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    💌 Refer a Friend
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                    Share your referral link and earn free email credits!
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        value={referralLink || "Loading..."}
                        InputProps={{ readOnly: true }}
                        size="small"
                        sx={{ backgroundColor: "white", borderRadius: 2 }}
                    />
                    <Tooltip title={copied ? "Copied!" : "Copy to clipboard"} arrow>
                        <IconButton
                            color={copied ? "success" : "primary"}
                            onClick={handleCopy}
                        >
                            {copied ? <CheckCircleOutlineIcon /> : <ContentCopyIcon />}
                        </IconButton>
                    </Tooltip>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Referrals: <strong>{referralCount}</strong>
                </Typography>

                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{
                        mt: 2,
                        py: 1,
                        fontWeight: "bold",
                        borderRadius: 2,
                        textTransform: "none",
                    }}
                >
                    Invite Friends
                </Button>
            </Paper>
        </Box>
    );
};

export default ReferralComponent;
