export type EmployeeLeaveRecord = {
  employeeId: string;
  employeeName: string;
  totalLeavesAvailable: number;
  leavesTaken: number;
  leavesRemaining: number;
};

export type SingleEmployeeLeaveRecord = Omit<EmployeeLeaveRecord, 'employeeId' | 'employeeName'> & {
  leaveId: string;
  leaveType: string;
};
