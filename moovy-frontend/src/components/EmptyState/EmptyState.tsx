import React from "react";
import { EmptyWrapper, EmptyIcon, EmptyText } from "./EmptyState.styles";

interface EmptyStateProps {
  message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message }) => {
  return (
    <EmptyWrapper>
      <EmptyIcon />
      <EmptyText>{message}</EmptyText>
    </EmptyWrapper>
  );
};

export default EmptyState;
