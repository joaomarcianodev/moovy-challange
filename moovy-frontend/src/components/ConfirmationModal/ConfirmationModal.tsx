// moovy-frontend/src/components/ConfirmationModal/ConfirmationModal.tsx
import React from "react";
import { Modal, Box, Typography, Button, Stack } from "@mui/material";
import { style } from "./ConfirmationModal.styles";

interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  movieTitle: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  onClose,
  onConfirm,
  movieTitle,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h5" component="h2" fontWeight="bold">
          Remove from your library
        </Typography>
        <Typography variant="body1">
          Are you sure you want to remove "{movieTitle}" from your library?
          <Typography
            component="span" // Usado para aplicar estilos
            color="secondary" // Cor rosa/vermelha do seu tema
            sx={{ display: "block", mt: 1, fontWeight: "500" }}
          >
            It contains an audio review and you will lose it if your remove.
          </Typography>
        </Typography>
        <Stack direction="row" spacing={2} sx={{ mt: 3, width: "100%" }}>
          <Button
            variant="contained"
            onClick={onClose} // Botão de Cancelar
            fullWidth
            sx={{
              backgroundColor: "#b0b0b0", // Cinza
              color: "#fff",
              "&:hover": {
                backgroundColor: "#8e8e8e",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="secondary" // Botão de Remover (rosa/vermelho)
            onClick={onConfirm}
            fullWidth
          >
            Remove
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default ConfirmationModal;
