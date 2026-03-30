export type LeaveStatus = "upcoming" | "ongoing" | "completed" | "all";

export type LeaveResponse = {
  id: string;
  date: string;
  employeeName: string;
  type: string;
  duration: "FULL_DAY" | "HALF_DAY";
  startTime: string;
  applyOn: string;
  reason: string;
};
