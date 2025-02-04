import { Box, Tooltip, Typography, useTheme } from "@mui/material";
import { useDraggable } from "@dnd-kit/core";
import { Dayjs } from "dayjs";
import { useEffect, useRef, useState } from "react";

interface DraggableEventProps {
  event: {
    id: number;
    title: string;
    dateStart: Dayjs;
    dateEnd: Dayjs;
    selected?: boolean;
  };
  topPercentage: number;
  heightPercentage: number;
  isTooSmall: boolean;
  setExpandedEvent: React.Dispatch<React.SetStateAction<number | null>>;
}

const DraggableEvent: React.FC<DraggableEventProps> = ({
  event,
  topPercentage,
  heightPercentage,
  isTooSmall,
  setExpandedEvent,
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: event.id,
  });
  const [isDragging, setIsDragging] = useState(false);
  const dragTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {}, [event]);

  const handleMouseDown = (e: React.MouseEvent) => {
    dragTimeout.current = setTimeout(() => {
      setIsDragging(true);
    }, 150);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (dragTimeout.current) {
      clearTimeout(dragTimeout.current);
    }
    if (!isDragging) {
      setExpandedEvent(event.id);
    }
    setIsDragging(false);
  };

  const style = transform
    ? { transform: `translate3d(0, ${transform.y}px, 0)` }
    : undefined;
  const theme = useTheme();

  return (
    <Tooltip title={event.title} arrow>
      <Box
        id={event.id.toString()}
        {...listeners}
        {...attributes}
        ref={setNodeRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        style={style}
        key={event.id}
        sx={{
          position: "absolute",
          top: topPercentage + "%",
          width: "100%",
          minHeight: "10px",
          height: heightPercentage + "%",
          maxWidth: "100%",
          backgroundColor: theme.palette.background.paper,
          borderRadius: "8px",
          boxShadow: 2,
          padding: 0.5,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          overflow: "hidden",
          opacity: event.selected ? 1 : 0.5,
        }}
        onClick={(e) => {
          e.stopPropagation();
          setExpandedEvent(event.id);
        }}
      >
        {!isTooSmall && (
          <Typography noWrap sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
            {event.title}
          </Typography>
        )}
      </Box>
    </Tooltip>
  );
};

export default DraggableEvent;
