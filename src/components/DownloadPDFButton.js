import React from "react";
import { downloadEmailAsPDF } from "@/lib/downloadPDF";

const DownloadPDFButton = ({ emailContent }) => {
    const handleDownload = () => {
        downloadEmailAsPDF(emailContent);
    };

    return (
        <button
            onClick={handleDownload}
            className="bg-green-500 text-white px-4 py-2 rounded mt-4"
        >
            📄 Download as PDF
        </button>
    );
};

export default DownloadPDFButton;
