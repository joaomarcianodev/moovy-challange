import React from "react";
import { Typography } from "@mui/material";
import { NotificationWrapper, OkButton } from "./NotificationBar.styles";

// 1. Definimos as props que o componente espera
interface NotificationBarProps {
  message: string;
  onClose: () => void; // Uma função para "avisar" que o OK foi clicado
}

const NotificationBar: React.FC<NotificationBarProps> = ({
  message,
  onClose,
}) => {
  return (
    <NotificationWrapper>
      {/* 2. Mostra a mensagem dinâmica */}
      <Typography>{message}</Typography>

      {/* 3. Chama a função onClose ao ser clicado */}
      <OkButton variant="outlined" size="small" onClick={onClose}>
        ok
      </OkButton>
    </NotificationWrapper>
  );
};

export default NotificationBar;
