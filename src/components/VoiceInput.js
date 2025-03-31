import React, { useState } from "react";
import Button from "@mui/material/Button";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import CircularProgress from "@mui/material/CircularProgress";

const VoiceInput = ({ onVoiceInput }) => {
    const [isListening, setIsListening] = useState(false);
    const [recognition, setRecognition] = useState(null);

    const startListening = () => {
        if (!("webkitSpeechRecognition" in window)) {
            alert("Your browser does not support speech recognition.");
            return;
        }

        const SpeechRecognition = window.webkitSpeechRecognition;
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = false;
        recognitionInstance.lang = "en-IN";

        recognitionInstance.onstart = () => {
            setIsListening(true);
        };

        recognitionInstance.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            onVoiceInput(transcript);
            setIsListening(false);
        };

        recognitionInstance.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            setIsListening(false);
            alert("Voice input failed. Please try again.");
        };

        recognitionInstance.onend = () => {
            setIsListening(false);
        };

        setRecognition(recognitionInstance);
        recognitionInstance.start();
    };

    const stopListening = () => {
        if (recognition) {
            recognition.stop();
            setIsListening(false);
        }
    };

    return (
        <Button
            variant="contained"
            color={isListening ? "error" : "primary"}
            onClick={isListening ? stopListening : startListening}
            startIcon={isListening ? <StopIcon /> : <MicIcon />}
            sx={{ marginTop: 2, marginBottom: 2 }}
        >
            {isListening ? (
                <>
                    Listening... <CircularProgress size={20} sx={{ marginLeft: 1 }} />
                </>
            ) : (
                "Voice Input"
            )}
        </Button>
    );
};

export default VoiceInput;
