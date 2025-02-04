import React, { useState } from "react";
import {
  Box,
  Button,
  Grid2,
  IconButton,
  TextField,
  useTheme,
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers";
import { IoMdCheckmark, IoMdClose } from "react-icons/io";
import dayjs, { Dayjs } from "dayjs";
import { Event, useEvents } from "../context/EventContext";
import { FaRegTrashAlt } from "react-icons/fa";

interface EventFormProps {
  item: Event;
  expandedEvent: number | null;
  setExpandedEvent: React.Dispatch<React.SetStateAction<number | null>>;
  setAllEvents: React.Dispatch<
    React.SetStateAction<
      {
        id: number;
        title: string;
        dateStart: Dayjs;
        dateEnd: Dayjs;
      }[]
    >
  >;
}

const EventForm: React.FC<EventFormProps> = ({
  item,
  expandedEvent,
  setExpandedEvent,
  setAllEvents,
}) => {
  const theme = useTheme();
  const [title, setTitle] = useState(item?.title || "");
  const [startTime, setStartTime] = useState(item?.dateStart || dayjs());
  const [endTime, setEndTime] = useState(
    item?.dateEnd || dayjs().add(1, "hour")
  );
  const { dispatch } = useEvents();

  const topPercentage =
    ((item.dateStart.hour() * 60 + item.dateStart.minute()) / (24 * 60)) * 100;

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    dispatch({
      type: "ADD_UPDATE_EVENT",
      payload: { id: item.id, title, dateStart: startTime, dateEnd: endTime },
    });
  };

  return (
    <Box
      key={item.id}
      sx={{
        position: "absolute",
        top: topPercentage + "%",
        width: "100%",
        maxWidth: "100%",
        backgroundColor: theme.palette.background.paper,
        borderRadius: "8px",
        padding: 2,
        boxShadow: 2,
        zIndex: 1,
      }}
      onClick={(e) => {
        e.stopPropagation();
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
      onMouseUp={(e) => {
        e.stopPropagation();
      }}
    >
      <form onSubmit={handleSubmit}>
        <Grid2 container rowSpacing={2} spacing={2}>
          {/* Event title input */}
          <Grid2 size={12}>
            <TextField
              sx={{ width: "100%" }}
              label="Event title"
              variant="standard"
              required
              fullWidth
              value={title} // Bind to state
              onChange={(e) => setTitle(e.target.value)} // Update state
            />
          </Grid2>

          {/* Start time picker */}
          <Grid2 size={6}>
            <TimePicker
              label="Start time"
              ampm={false}
              views={["hours", "minutes"]}
              sx={{ width: "100%" }}
              value={startTime} // Bind to state
              onChange={(e) => {
                setStartTime(e!);
              }} // Update state
            />
          </Grid2>

          {/* End time picker */}
          <Grid2 size={6}>
            <TimePicker
              label="End time"
              ampm={false}
              views={["hours", "minutes"]}
              sx={{ width: "100%" }}
              value={endTime} // Bind to state
              onChange={(e: Dayjs | null) => {
                if (e) {
                  if (e.isBefore(startTime!)) {
                    return;
                  }
                  setEndTime(e!);
                }
              }} // Update state
            />
          </Grid2>

          {/* Buttons for save and delete */}
          <Grid2 size={12}>
            <Grid2 container justifyContent="space-between">
              <Grid2>
                <Button
                  type="submit" // This makes the Save button trigger the form submit
                  startIcon={<IoMdCheckmark />}
                  variant="contained"
                  sx={{ padding: "8px 16px" }}
                >
                  Save Event
                </Button>
              </Grid2>
              <Grid2>
                <Button
                  startIcon={<FaRegTrashAlt />}
                  variant="outlined"
                  sx={{ padding: "8px 16px" }}
                  onClick={() => {
                    dispatch({ type: "DELETE_EVENT", payload: item.id });
                  }}
                >
                  Delete Event
                </Button>
              </Grid2>
            </Grid2>
          </Grid2>
        </Grid2>
      </form>

      {/* Close button */}
      <IconButton
        color="inherit"
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          padding: 0,
        }}
        onClick={() => {
          setExpandedEvent(null);
          setAllEvents((prev) =>
            prev.filter(
              (event) => !(event.id === expandedEvent && !event.title)
            )
          );
        }}
      >
        <IoMdClose />
      </IconButton>
    </Box>
  );
};

export default EventForm;
