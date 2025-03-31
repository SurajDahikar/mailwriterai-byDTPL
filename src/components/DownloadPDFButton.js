import React from "react";
import { downloadEmailAsPDF } from "@/lib/downloadPDF";
import Button from "@mui/material/Button";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import Box from "@mui/material/Box";

const DownloadPDFButton = ({ emailContent }) => {
    const handleDownload = () => {
        downloadEmailAsPDF(emailContent);
    };

    return (
        <Box sx={{ textAlign: "center", mt: 2 }}>
            <Button
                variant="contained"
                color="success"
                onClick={handleDownload}
                startIcon={<SaveAltIcon />}
                sx={{
                    px: 3,
                    py: 1,
                    borderRadius: "8px",
                    textTransform: "none",
                    fontWeight: "bold",
                    fontSize: "16px",
                    "&:hover": {
                        backgroundColor: "#388e3c",
                    },
                }}
            >
                Download as PDF
            </Button>
        </Box>
    );
};

export default DownloadPDFButton;
