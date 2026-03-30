import { render } from "@testing-library/react";
import { describe, test } from "vitest";
import Layout from "./Layout";
import { MemoryRouter } from "react-router-dom";

const renderLayout = () => {
  render(
    <MemoryRouter>
        <Layout />
    </MemoryRouter>
  );
};

describe("Leave Component", () => {
  test("renders Leave component content", () => {
    renderLayout();
  });
});
