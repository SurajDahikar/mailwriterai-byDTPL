import { jsPDF } from "jspdf";

export const downloadEmailAsPDF = (emailContent, fileName = "email.pdf") => {
    const doc = new jsPDF();
    doc.setFont("helvetica");
    doc.setFontSize(12);
    doc.text(emailContent, 10, 20, { maxWidth: 180 });
    doc.save(fileName);
};
