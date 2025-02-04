import { createContext, useContext, useReducer, ReactNode } from "react";
import { Dayjs } from "dayjs";

export interface Event {
  id: number;
  title: string;
  dateStart: Dayjs;
  dateEnd: Dayjs;
  selected?: boolean;
}

type EventAction =
  | { type: "ADD_UPDATE_EVENT"; payload: Event }
  | { type: "FILTER_EVENTS"; payload: string }
  | { type: "DELETE_EVENT"; payload: number };

interface EventContextType {
  events: Event[];
  dispatch: React.Dispatch<EventAction>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

const eventReducer = (state: Event[], action: EventAction): Event[] => {
  switch (action.type) {
    case "ADD_UPDATE_EVENT":
      if (state.find((el) => el.id === action.payload.id)) {
        return state.map((event) =>
          event.id === action.payload.id ? action.payload : event
        );
      }
      return [...state, action.payload];
    case "FILTER_EVENTS":
      if (action.payload === "") {
        return state.map((event) => {
          event.selected = true;
          return event;
        });
      }
      return state.map((event) => {
        event.selected = event.title.includes(action.payload);
        return event;
      });
    case "DELETE_EVENT":
      return state.filter((event) => event.id !== action.payload);
    default:
      return state;
  }
};

const initialState: Event[] = [];

interface EventProviderProps {
  children: ReactNode;
}

export const EventProvider: React.FC<EventProviderProps> = ({ children }) => {
  const [events, dispatch] = useReducer(eventReducer, initialState);

  return (
    <EventContext.Provider value={{ events, dispatch }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = (): EventContextType => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEvents must be used within an EventProvider");
  }
  return context;
};
