export interface AirtableResponse<FieldsType> {
  records: Record<FieldsType>[];
}
export interface Record<T> {
  id: string;
  fields: T;
  createdTime: string;
}

export interface ProcessedEvent {
  id: string;
  dateDisplay: string;
  date: Date;
  time: string;
  mainLocation: string;
  numDrivers: number;
  numPackers: number;
  numtotalParticipants: number;
  numOnlyDrivers: number;
  numOnlyPackers: number;
  numBothDriversAndPackers: number;
  numSpecialGroups: number;
  scheduledSlots: string[];
}

export interface ScheduledSlot {
  "First Name": string;
  "Last Name": string;
  "Correct slot time": any;
  Type: string[];
  "Confirmed?": boolean;
  "Volunteer Status": string;
  Email: string;
  "Volunteer Group (for MAKE)": string;
  "Can't Come": boolean
}
export interface ProcessedDriver {
  id: string;
  firstName: string;
  lastName: string;
  timeSlot: string;
  deliveryCount: number;
  zipCode: string;
  vehicle: string;
  restrictedLocations: string[];
}

export interface Neighborhood {
  Name: string;
}
