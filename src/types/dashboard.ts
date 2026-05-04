export type ManagerDashboardMetrics = {
  totalEmployees: number;
  totalEmployeesOnLeaveToday: number;
  totalEmployeesOnLeaveTomorrow: number;
};

export type EmployeeDashboardMetrics = {
  totalAnnualLeaves: number;
  remainingAnnualLeaves: number;
  leavesTaken: number;
  pendingRequests: number;
};
