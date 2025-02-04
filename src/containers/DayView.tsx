import { Typography, Grid2, Divider } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useEvents } from "../context/EventContext";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import DraggableEvent from "../components/DraggableEvent";
import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import EventForm from "../components/EventForm";
import DroppableBox from "../components/DroppableBox";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

const DayView: React.FC = () => {
  const { events, dispatch } = useEvents();
  const [allEvents, setAllEvents] = useState<
    {
      id: number;
      title: string;
      dateStart: Dayjs;
      dateEnd: Dayjs;
      selected?: boolean;
    }[]
  >([]);
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null);

  useEffect(() => {
    setAllEvents(events);
  }, [events]);

  const handleAddEvent: (e: React.MouseEvent) => void = (e) => {
    dayjs.extend(isBetween);

    const { height, y } = e.currentTarget.getBoundingClientRect();
    const newDivY = e.pageY - (y + globalThis.scrollY);
    const totalMinutes = Math.round((newDivY / height) * 1440);
    const newStart = dayjs()
      .hour(0)
      .minute(totalMinutes)
      .second(0)
      .millisecond(0);
    let newEnd = newStart.add(60, "minute");

    setAllEvents((prev) =>
      prev.filter((event) => !(event.id === expandedEvent && !event.title))
    );

    const collidingEvent = allEvents.find(
      (event) =>
        newStart.isBetween(event.dateStart, event.dateEnd, null, "[)") ||
        newStart.isSame(event.dateStart)
    );
    if (collidingEvent) {
      console.log("Collision detected, event not created.");
      return;
    }

    const nextEvent = allEvents.find((event) =>
      newEnd.isBetween(event.dateStart, event.dateEnd, null, "[)")
    );
    if (nextEvent) {
      newEnd = nextEvent.dateStart;
    }

    const id = Date.now();
    setExpandedEvent(id);

    setAllEvents((prev) => [
      ...prev,
      {
        id,
        title: "",
        dateStart: newStart,
        dateEnd: newEnd,
      },
    ]);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    if (!active || !delta) return;

    const eventId = Number(active.id);
    const movedEvent = allEvents.find((e) => e.id === eventId);
    if (!movedEvent) return;

    const droppableArea = document.querySelector(".droppable-area");
    if (!droppableArea) return;
    const droppableHeight = droppableArea.clientHeight;

    const minutesMoved = Math.round((delta.y / droppableHeight) * 1440);

    const newStart = movedEvent.dateStart.add(minutesMoved, "minute");
    const newEnd = newStart.add(
      movedEvent.dateEnd.diff(movedEvent.dateStart, "minute"),
      "minute"
    );

    dispatch({
      type: "ADD_UPDATE_EVENT",
      payload: {
        id: eventId,
        title: movedEvent.title,
        dateStart: newStart,
        dateEnd: newEnd,
        selected: movedEvent.selected,
      },
    });
  };

  return (
    <DndContext onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis]}>
      <Grid2 container marginBottom={10}>
        <Grid2 size={10} offset={2}>
          2
        </Grid2>
        <Grid2 container size={2} justifyContent="flex-end">
          <Grid2>
            {Array.from({ length: 24 }, (_, i) => {
              const hour = String(i).padStart(2, "0");
              return `${hour}:00`;
            }).map((h, index) => {
              return (
                <Typography key={index} paddingBottom={5} marginTop={-1.5}>
                  {h}
                </Typography>
              );
            })}
          </Grid2>
          <Grid2 offset={1}>
            <Divider orientation="vertical" sx={{ borderRightWidth: 2 }} />
          </Grid2>
        </Grid2>

        <DroppableBox handleAddEvent={handleAddEvent}>
          {allEvents.map((item) => {
            const topPercentage =
              ((item.dateStart.hour() * 60 + item.dateStart.minute()) /
                (24 * 60)) *
              100;
            const heightPercentage =
              (item.dateEnd.diff(item.dateStart, "minute") / 1440) * 100;

            const isTooSmall = heightPercentage < 2;

            if (expandedEvent === item.id) {
              return (
                <EventForm
                  key={item.id}
                  item={item}
                  expandedEvent={expandedEvent}
                  setExpandedEvent={setExpandedEvent}
                  setAllEvents={setAllEvents}
                ></EventForm>
              );
            } else {
              return (
                <DraggableEvent
                  key={item.id}
                  event={item}
                  heightPercentage={heightPercentage}
                  isTooSmall={isTooSmall}
                  topPercentage={topPercentage}
                  setExpandedEvent={setExpandedEvent}
                ></DraggableEvent>
              );
            }
          })}
        </DroppableBox>
      </Grid2>
    </DndContext>
  );
};

export default DayView;
