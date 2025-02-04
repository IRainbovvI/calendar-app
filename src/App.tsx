import React, { useState } from "react";
import "./styles.css";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import MonthView from "./containers/MonthView";
import WeeekView from "./containers/WeeekView";
import DayView from "./containers/DayView";
import CalendarHeader from "./containers/CalendarHeader";
import { EventProvider } from "./context/EventContext";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#f57c00", // Bright orange for accents
      light: "#F79633",
      dark: "#AB5600",
      contrastText: "rgba(0,0,0,0.87)",
    },
    secondary: {
      main: "#1976d2", // Blue for highlights (optional)
      light: "#4791db",
      dark: "#115293",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f5f5f5", // Light gray for calendar background
      paper: "#ffffff", // White for cards
    },
    text: {
      primary: "#000000", // Black text
      secondary: "#666666", // Gray text for less emphasis
    },
    divider: "#e0e0e0", // Light gray divider
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    h6: {
      fontWeight: 500,
      color: "#333", // Dark gray for card titles
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#ffb74d", // Muted orange for accents
      light: "#ffc570",
      dark: "#b28035",
      contrastText: "rgba(0,0,0,0.87)",
    },
    secondary: {
      main: "#90caf9", // Muted blue for highlights (optional)
      light: "#a6d4fa",
      dark: "#648dae",
      contrastText: "rgba(0,0,0,0.87)",
    },
    background: {
      default: "#121212", // Dark background for the calendar
      paper: "#1e1e1e", // Slightly lighter gray for cards
    },
    text: {
      primary: "#ffffff", // White text
      secondary: "#aaaaaa", // Light gray text for less emphasis
    },
    divider: "#333333", // Dark gray divider
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    h6: {
      fontWeight: 500,
      color: "#ffffff", // White for card titles
    },
  },
});

function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <EventProvider>
        <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
          <CssBaseline />
          <BrowserRouter>
            <CalendarHeader toggleTheme={toggleTheme} />
            <Routes>
              <Route path="/" element={<Navigate to="/month" replace />} />
              <Route path="/month" element={<MonthView />} />
              <Route path="/week" element={<WeeekView />} />
              <Route path="/day" element={<DayView />} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </EventProvider>
    </LocalizationProvider>
  );
}

export default App;
