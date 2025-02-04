import { useDroppable } from "@dnd-kit/core";
import { Grid2 } from "@mui/material";
import React from "react";

interface DroppableBoxProps {
  children: React.ReactNode;
  handleAddEvent: (e: React.MouseEvent) => void;
}

const DroppableBox: React.FC<DroppableBoxProps> = ({
  children,
  handleAddEvent,
}) => {
  const { isOver, setNodeRef } = useDroppable({ id: "droppableBox" });

  return (
    <Grid2
      className="droppable-area"
      size={10}
      onClick={(e) => {
        handleAddEvent(e);
      }}
      sx={{ position: "relative" }}
      ref={setNodeRef}
    >
      {children}
    </Grid2>
  );
};

export default DroppableBox;
