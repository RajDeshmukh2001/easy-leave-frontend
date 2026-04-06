import { MemoryRouter } from "react-router-dom";
import AllEmployeeDetails from "./AllEmployeeDetails";
import { render, screen, waitFor } from "@testing-library/react";
import type { UserResponse } from "@/types/Users";
import * as userApi from "@/api/employee.api";

const renderEmployeeDetails = () => {
  return render(
    <MemoryRouter>
      <AllEmployeeDetails />
    </MemoryRouter>
  );
}


const mockUsers: UserResponse[] = [
  {
    id: '1',
    name: 'Priyansh Saxena',
    email: 'priyansh.saxena@example.com',
    role: 'Employee',
  },
]


describe("AllEmployeeDetails Component", () => {

  beforeEach(() => {
    vi.spyOn(userApi, 'getEmployees').mockResolvedValue(mockUsers);
  })
  test("renders page header", () => {
    renderEmployeeDetails();
    expect(screen.getByText("Employees")).toBeInTheDocument();
    expect(screen.getByText("Manage all employees and their roles")).toBeInTheDocument();
  });

  test("show loading state initially", () => {
    renderEmployeeDetails();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("renders table columns", async () => {
    renderEmployeeDetails();
    await waitFor(() => {
      expect(screen.getByText("Name")).toBeInTheDocument();
      expect(screen.getByText("Email")).toBeInTheDocument();
      expect(screen.getByText("Role")).toBeInTheDocument();
    })
  });

  test("renders employee data in table", async () => {
    renderEmployeeDetails();
    await waitFor(() => {
      expect(screen.getByText("Priyansh Saxena")).toBeInTheDocument();
      expect(screen.getByText("priyansh.saxena@example.com")).toBeInTheDocument();
      expect(screen.getByText("Employee")).toBeInTheDocument();
    })
  });

  test("renders error message on API failure", async () => {
    vi.spyOn(userApi, 'getEmployees').mockRejectedValue(new Error("Failed to fetch employees"));
    renderEmployeeDetails();
    await waitFor(() => {
      expect(screen.getByText("Failed to fetch employees")).toBeInTheDocument();
    })
  });

  test("renders error message on network error", async () => {
    vi.spyOn(userApi, 'getEmployees').mockRejectedValue("Failed to load employees");
    renderEmployeeDetails();
    await waitFor(() => {
      expect(screen.getByText("Failed to load employees")).toBeInTheDocument();
    })
  });
})