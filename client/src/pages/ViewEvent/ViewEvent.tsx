import { Link, useParams } from "react-router-dom";
import { useQuery } from "react-query";

//Types
import { AirtableResponse, ProcessedEvent, ScheduledSlot } from "../../types";
//Components
import { Loading } from "../../components/Loading";
import { VolunteersTable } from "./VolunteersTable";
//Assets
import alert from "../../assets/alert.svg";
import check from "../../assets/check.svg";
import calendar from "../../assets/calendar.svg";
import people from "../../assets/people.svg";
import roster from "../../assets/roster.svg";
import { Messaging } from "./Messaging";
import { API_BASE_URL } from "../../httpUtils";

/* Get a future event by the event id.
 * Uses useFuturePickupEvents under the hood, and then returns the future event whose id matches the eventId parameter.
 * */
function useFutureEventById(eventId: string | undefined) {
  const {
    data: futureEvents,
    status: futureEventsStatus,
    error: futureEventsError,
  } = useQuery(["fetchFutureEvents"], async () => {
    const response = await fetch(`${API_BASE_URL}/api/events`);
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message);
    }
    return response.json() as Promise<ProcessedEvent[]>;
  });

  let event = undefined;
  if (futureEventsStatus === "success") {
    event = futureEvents.filter((fe) => eventId === fe.id)[0];
  }

  return {
    event,
    eventStatus: futureEventsStatus,
    eventError: futureEventsError,
  };
}

const HeaderValueDisplay: React.FC<{
  header: string;
  value: string | number;
}> = (props: { header: string; value: string | number }) => {
  return (
    <div className="flex flex-col">
      <p className="lg:text-xl">{props.header}</p>
      <p className="font-semibold text-newLeafGreen lg:text-xl">
        {props.value}
      </p>
    </div>
  );
};

//Tailwind classes
const sectionHeader =
  "flex items-start gap-3 text-2xl font-bold text-newLeafGreen lg:text-3xl";
const sectionHeaderIcon = "w-8 lg:w-10";

export function ViewEvent() {
  const { eventId } = useParams();
  const { event, eventStatus, eventError } = useFutureEventById(eventId);

  const {
    data: scheduledSlots,
    refetch: refetchScheduledSlots,
    status: scheduledSlotsStatus,
    error: scheduledSlotsError,
  } = useQuery(
    ["fetchScheduledSlotsForEvent", eventId],
    async () => {
      if (typeof event === "undefined") {
        return Promise.reject(new Error("Undefined event"));
      }
      const scheduledSlotsIds = event.scheduledSlots.join(",");
      const response = await fetch(
        `${API_BASE_URL}/api/volunteers/?scheduledSlotsIds=${scheduledSlotsIds}`
      );
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }
      return response.json() as Promise<AirtableResponse<ScheduledSlot>>;
    },
    { enabled: eventStatus === "success" }
  );

  if (scheduledSlotsStatus === "loading" || scheduledSlotsStatus === "idle") {
    return (
      <div style={{ position: "relative", minHeight: "80vh" }}>
        <Loading size="large" thickness="extra-thicc" />
      </div>
    );
  }

  if (scheduledSlotsStatus === "error") {
    const error = eventError || scheduledSlotsError;
    console.error(error);
    return <div>Error...</div>;
  }

  if (event === undefined) {
    console.error(
      `Something went wrong. Event ${event} not found in futureEvents list.`
    );
    return <div>Error...</div>;
  }

  scheduledSlots.records.sort((a, b) =>
    a.fields["First Name"] < b.fields["First Name"] ? -1 : 1
  );

  console.log("scheduledSlots", scheduledSlots);

  //UI

  return (
    <div className="p-6 lg:px-14 lg:py-10">
      {/* Event Info */}
      <h1 className={sectionHeader}>
        <img className={sectionHeaderIcon} src={calendar} alt="calendar" />
        {event.dateDisplay}
      </h1>
      <div className="h-4" />
      <div className="flex flex-col gap-3 md:flex-row md:gap-10">
        <HeaderValueDisplay header="Time" value={event.time} />
        <HeaderValueDisplay header="Main Location" value={event.mainLocation} />
        <HeaderValueDisplay
          header="Total Participants"
          value={event.numtotalParticipants}
        />
      </div>
      <div className="h-12" />
      {/* Participant Breakdown */}
      <h1 className={sectionHeader}>
        <img className={sectionHeaderIcon} src={people} alt="people" />
        Participant Breakdown
      </h1>
      <div className="h-4" />
      <div className="flex flex-col gap-2 md:flex-row md:gap-10">
        <div className="grid gap-2 md:grid-cols-3 md:grid-rows-2">
          <div className="flex flex-col ">
            <p className="lg:text-xl">Total # of Drivers</p>
            <p className="flex gap-4 font-semibold text-newLeafGreen lg:text-xl">
              {event.numDrivers}/30
              <img
                className="mt-1 w-4 md:w-6 lg:w-7"
                src={event.numDrivers >= 30 ? check : alert}
                alt="wut"
              />
            </p>
          </div>
          <HeaderValueDisplay
            header="Total # of Packers"
            value={event.numPackers}
          />
          <HeaderValueDisplay
            header="Both Drivers & Packers"
            value={event.numBothDriversAndPackers}
          />
          <HeaderValueDisplay
            header="Only Drivers"
            value={event.numOnlyDrivers}
          />
          <HeaderValueDisplay
            header="Only Packers"
            value={event.numOnlyPackers}
          />
          <HeaderValueDisplay
            header="# of Special Groups"
            value={event.numSpecialGroups}
          />
        </div>

        <div className="flex flex-col items-start justify-around gap-2 ">
          <button
            className="rounded-full bg-pumpkinOrange px-3 py-2 text-sm font-semibold text-white shadow-md shadow-newLeafGreen transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-newLeafGreen lg:px-5 lg:py-3 lg:text-base lg:font-bold"
            type="button"
          >
            View Special Groups
          </button>
          <button
            className="rounded-full bg-pumpkinOrange px-3 py-2 text-sm font-semibold text-white shadow-md shadow-newLeafGreen transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-newLeafGreen lg:px-5 lg:py-3 lg:text-base lg:font-bold"
            type="button"
          >
            + Add Special Group
          </button>
        </div>
      </div>
      <div className="h-12" />
      <h1 className={sectionHeader}>
        <img className={sectionHeaderIcon} src={roster} alt="roster" />
        Participant Roster
      </h1>
      {/* Volunteer Table */}
      <VolunteersTable
        scheduledSlots={scheduledSlots.records}
        refetchVolunteers={refetchScheduledSlots}
      />
      <div className="h-4" />
      <Link to={`/events/driver-location-info/${eventId}`}>
        <button
          className="rounded-full bg-pumpkinOrange px-3 py-2 text-sm font-semibold text-white shadow-md shadow-newLeafGreen transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-newLeafGreen lg:px-5 lg:py-3 lg:text-base lg:font-bold"
          type="button"
        >
          Delivery and Location Info
        </button>
      </Link>
      <div className="h-12" />
      <Messaging />
      <div className="h-12" />
    </div>
  );
}
