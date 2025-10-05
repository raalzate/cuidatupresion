import { render, screen } from "@testing-library/react";
import React from "react";

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

describe("Alert", () => {
  it("renders with default variant and children", () => {
    render(
      <Alert>
        <AlertTitle>Title</AlertTitle>

        <AlertDescription>Description</AlertDescription>
      </Alert>
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
  });

  it("renders with destructive variant", () => {
    render(<Alert variant="destructive">Destructive alert</Alert>);

    const alert = screen.getByRole("alert");

    expect(alert).toHaveClass("text-destructive");
    expect(screen.getByText("Destructive alert")).toBeInTheDocument();
  });

  it("renders with info variant", () => {
    render(<Alert variant="info">Info alert</Alert>);

    const alert = screen.getByRole("alert");

    expect(alert).toHaveClass("text-accent-foreground");
    expect(screen.getByText("Info alert")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<Alert className="custom-class">Custom</Alert>);

    expect(screen.getByRole("alert")).toHaveClass("custom-class");
  });

  it("spreads additional props", () => {
    render(<Alert data-testid="my-alert">Test</Alert>);

    expect(screen.getByTestId("my-alert")).toBeInTheDocument();
  });
});

describe("AlertTitle", () => {
  it("renders children and applies className", () => {
    render(<AlertTitle className="title-class">My Title</AlertTitle>);

    const title = screen.getByText("My Title");

    expect(title).toHaveClass("title-class");
    expect(title).toHaveAttribute("data-slot", "alert-title");
  });

  it("spreads additional props", () => {
    render(<AlertTitle data-testid="my-title">Title</AlertTitle>);

    expect(screen.getByTestId("my-title")).toBeInTheDocument();
  });
});

describe("AlertDescription", () => {
  it("renders children and applies className", () => {
    render(
      <AlertDescription className="desc-class">
        <p>Desc</p>
      </AlertDescription>
    );

    const desc = screen.getByText("Desc");

    expect(desc.parentElement).toHaveClass("desc-class");
    expect(desc.parentElement).toHaveAttribute(
      "data-slot",
      "alert-description"
    );
  });

  it("spreads additional props", () => {
    render(<AlertDescription data-testid="my-desc">Desc</AlertDescription>);

    expect(screen.getByTestId("my-desc")).toBeInTheDocument();
  });
});
