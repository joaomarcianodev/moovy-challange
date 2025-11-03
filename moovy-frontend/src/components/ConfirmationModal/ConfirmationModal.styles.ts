// Estilo da caixa do modal
export const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450, // Um pouco mais largo para o texto
  bgcolor: "background.paper",
  borderRadius: 2, // Cantos arredondados
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: 2,
};
