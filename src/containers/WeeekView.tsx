import React from "react";
import { Box, Typography, useTheme } from "@mui/material";

const WeekView = () => {
  const theme = useTheme();

  const hours = Array.from(
    { length: 25 },
    (_, i) => `${i.toString().padStart(2, "0")}:00`
  );

  return (
    <Box
      sx={{
        width: "100%",
        height: "80vh", // Fixed height to enable scrolling
        overflowY: "auto", // Vertical scrolling enabled
        padding: "0 20px", // Side padding
      }}
    >
      {hours.map((hour, index) => (
        <Box
          key={hour}
          sx={{
            display: "flex",
            alignItems: "center",
            height: 50,
            position: "relative",
          }}
        >
          {/* Hour Label */}
          <Typography
            sx={{ width: "60px", textAlign: "right", marginRight: "10px" }}
          >
            {hour}
          </Typography>

          {/* Thin Line Divider */}
          <Box
            sx={{
              flexGrow: 1,
              borderBottom: "2px solid " + theme.palette.divider,
            }}
          />
        </Box>
      ))}
    </Box>
  );
};

export default WeekView;
