// moovy-frontend/src/components/AudioRecorderModal/AudioRecorderModal.tsx
import React, { useState, useRef, useEffect } from "react"; // 1. Adicionar useEffect
import {
  Modal,
  Box,
  Typography,
  Button,
  IconButton,
  CircularProgress,
} from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import SaveIcon from "@mui/icons-material/Save";
import { style } from "./AudioRecorderModal.styles";

interface AudioRecorderModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (audioBlob: Blob) => void;
  movieTitle: string;
  existingAudioPath?: string | null;
}

const AudioRecorderModal: React.FC<AudioRecorderModalProps> = ({
  open,
  onClose,
  onSave,
  movieTitle,
  existingAudioPath,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (open) {
      if (existingAudioPath) {
        setAudioUrl(`http://localhost:3000${existingAudioPath}`);
        setAudioBlob(null);
      } else {
        setAudioUrl(null);
        setAudioBlob(null);
      }
      setIsRecording(false);
      setIsProcessing(false);
    }
  }, [open, existingAudioPath]);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        audioChunksRef.current = [];
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setAudioBlob(null);
      setAudioUrl(null);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSave = async () => {
    if (audioBlob) {
      setIsProcessing(true);
      try {
        await onSave(audioBlob);
      } catch (error) {
        console.error("Upload failed", error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleClose = () => {
    if (isRecording) {
      handleStopRecording();
    }
    setAudioBlob(null);
    setAudioUrl(null);
    setIsRecording(false);
    setIsProcessing(false);
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">
          {existingAudioPath && !isRecording && !audioBlob
            ? "Play Audio"
            : "Record Audio"}
        </Typography>
        <Typography variant="subtitle1" sx={{ fontStyle: "italic" }}>
          {movieTitle}
        </Typography>

        {/* Estado 1: Gravando */}
        {isRecording && (
          <IconButton
            color="secondary"
            onClick={handleStopRecording}
            sx={{ transform: "scale(2.0)" }}
          >
            <StopIcon />
          </IconButton>
        )}

        {/* Estado 2: Player visível (áudio existente ou áudio recém-gravado) */}
        {!isRecording && audioUrl && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <audio src={audioUrl} controls autoPlay={!!existingAudioPath} />
            <Button
              startIcon={<MicIcon />}
              onClick={handleStartRecording}
              sx={{ mt: 1 }}
            >
              Record Again
            </Button>
          </Box>
        )}

        {/* Estado 3: Inicial (pronto para gravar) */}
        {!isRecording && !audioUrl && (
          <IconButton
            color="primary"
            onClick={handleStartRecording}
            sx={{ transform: "scale(2.0)" }}
          >
            <MicIcon />
          </IconButton>
        )}

        <Box sx={{ display: "flex", gap: 2, width: "100%", mt: 2 }}>
          <Button variant="outlined" onClick={handleClose} fullWidth>
            {audioBlob ? "Cancel" : "Close"}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={!audioBlob || isProcessing}
            startIcon={
              isProcessing ? <CircularProgress size={20} /> : <SaveIcon />
            }
            fullWidth
          >
            {isProcessing ? "Saving..." : "Save Audio"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AudioRecorderModal;
