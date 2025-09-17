import { AlertCircleIcon } from "lucide-react";
import { render, screen } from "@testing-library/react";
import React from "react";

import { AppAlert } from "@/components/shared/alert/alert";

describe("AppAlert", () => {
  it("renders with default variant, title and children", () => {
    render(<AppAlert title="Test Title">Test Description</AppAlert>);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });

  it("renders with destructive variant", () => {
    render(
      <AppAlert title="Danger" variant="destructive">
        Danger description
      </AppAlert>
    );

    const alert = screen.getByRole("alert");

    expect(alert).toHaveClass("text-destructive");
    expect(screen.getByText("Danger")).toBeInTheDocument();
    expect(screen.getByText("Danger description")).toBeInTheDocument();
  });

  it("renders with icon", () => {
    render(
      <AppAlert title="Icon Test" icon={<AlertCircleIcon data-testid="icon" />}>
        Icon description
      </AppAlert>
    );

    expect(screen.getByTestId("icon")).toBeInTheDocument();
    expect(screen.getByText("Icon Test")).toBeInTheDocument();
    expect(screen.getByText("Icon description")).toBeInTheDocument();
  });

  it("applies additional props to Alert", () => {
    render(
      <AppAlert title="Extra" data-testid="app-alert">
        Extra description
      </AppAlert>
    );

    expect(screen.getByTestId("app-alert")).toBeInTheDocument();
  });
});
