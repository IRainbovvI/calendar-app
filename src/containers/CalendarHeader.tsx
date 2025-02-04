import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  IconButton,
  Grid2,
} from "@mui/material";
import { CgDarkMode } from "react-icons/cg";
import { useLocation, useNavigate } from "react-router";
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
import dayjs from "dayjs";
import { IoMdSearch } from "react-icons/io";
import { useEvents } from "../context/EventContext";

interface CalendarHeaderProps {
  toggleTheme: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ toggleTheme }) => {
  const [filter, setFilter] = useState("");
  const { events, dispatch } = useEvents();

  const navigate = useNavigate();
  const selectedViewName = useLocation().pathname.split("/")[1];

  useEffect(() => {}, []);

  const handleViewChange = (
    e: React.MouseEvent<HTMLElement>,
    value: string | null
  ) => {
    if (value) {
      navigate("/" + value);
    }
  };

  const handleFilterApply = () => {
    dispatch({ type: "FILTER_EVENTS", payload: filter });
  };

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar style={{ minHeight: 0 }}>
          {/* App Name */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Calendar App
          </Typography>

          {/* Button */}
          <IconButton color="inherit" onClick={toggleTheme}>
            <CgDarkMode size={30} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Grid2
        container
        sx={{
          margin: "15px 24px 0 24px ",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Grid2 size="auto">
          <TextField
            label="Filter events"
            size="small"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
            }}
          />
          <IconButton color="primary" onClick={handleFilterApply}>
            <IoMdSearch />
          </IconButton>
        </Grid2>

        <Grid2 size="auto">
          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <IconButton color="inherit" onClick={toggleTheme}>
              <MdKeyboardArrowLeft size={30} />
            </IconButton>
            <Typography>
              {selectedViewName === "month"
                ? dayjs(new Date()).format("MMMM YYYY")
                : dayjs(new Date()).format("D MMMM YYYY")}
            </Typography>
            <IconButton color="inherit" onClick={toggleTheme}>
              <MdKeyboardArrowRight size={30} />
            </IconButton>
          </Stack>
        </Grid2>

        <Grid2 size="auto">
          <ToggleButtonGroup
            exclusive
            value={selectedViewName}
            onChange={handleViewChange}
            color="primary"
            size="small"
          >
            <ToggleButton value="day">Day</ToggleButton>
            <ToggleButton value="week">Week</ToggleButton>
            <ToggleButton value="month">Month</ToggleButton>
          </ToggleButtonGroup>
        </Grid2>
      </Grid2>
    </>
  );
};

export default CalendarHeader;
