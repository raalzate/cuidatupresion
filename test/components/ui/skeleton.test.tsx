import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";
import React from "react";

jest.mock("../../../lib/utils", () => ({
  cn: (...classes: (string | undefined)[]) => classes.filter(Boolean).join(" "),
}));

import { Skeleton } from "../../../components/ui/skeleton";

describe("Skeleton Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Basic Rendering", () => {
    it("should render with default props", () => {
      render(<Skeleton data-testid="skeleton" />);

      const skeleton = screen.getByTestId("skeleton");

      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveAttribute("data-slot", "skeleton");
      expect(skeleton.tagName).toBe("DIV");
    });

    it("should apply default classes", () => {
      render(<Skeleton data-testid="skeleton" />);

      const skeleton = screen.getByTestId("skeleton");
      expect(skeleton).toHaveClass("bg-accent", "animate-pulse", "rounded-md");
    });

    it("should be an empty div by default", () => {
      render(<Skeleton data-testid="skeleton" />);

      const skeleton = screen.getByTestId("skeleton");
      expect(skeleton).toBeEmptyDOMElement();
    });
  });

  describe("Custom Props", () => {
    it("should apply custom className", () => {
      render(<Skeleton className="custom-skeleton" data-testid="skeleton" />);

      const skeleton = screen.getByTestId("skeleton");

      expect(skeleton).toHaveClass(
        "bg-accent",
        "animate-pulse",
        "rounded-md",
        "custom-skeleton"
      );
    });

    it("should override default classes with custom className", () => {
      render(
        <Skeleton className="bg-red-500 w-full h-4" data-testid="skeleton" />
      );

      const skeleton = screen.getByTestId("skeleton");

      expect(skeleton).toHaveClass(
        "bg-accent",
        "animate-pulse",
        "rounded-md",
        "bg-red-500",
        "w-full",
        "h-4"
      );
    });

    it("should accept and apply custom styles", () => {
      const customStyle = {
        width: "200px",
        height: "20px",
        backgroundColor: "rgb(255, 0, 0)",
      };

      render(<Skeleton style={customStyle} data-testid="skeleton" />);

      const skeleton = screen.getByTestId("skeleton");

      expect(skeleton).toHaveStyle("width: 200px");
      expect(skeleton).toHaveStyle("height: 20px");
      expect(skeleton).toHaveStyle("background-color: rgb(255, 0, 0)");
    });

    it("should accept custom HTML attributes", () => {
      render(
        <Skeleton
          aria-label="Loading content"
          data-testid="skeleton"
          id="custom-skeleton"
          role="status"
        />
      );

      const skeleton = screen.getByTestId("skeleton");

      expect(skeleton).toHaveAttribute("id", "custom-skeleton");
      expect(skeleton).toHaveAttribute("role", "status");
      expect(skeleton).toHaveAttribute("aria-label", "Loading content");
    });

    it("should accept and render children", () => {
      render(
        <Skeleton data-testid="skeleton">
          <span>Loading...</span>
        </Skeleton>
      );

      const skeleton = screen.getByTestId("skeleton");

      expect(skeleton).toBeInTheDocument();
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("should handle multiple children", () => {
      render(
        <Skeleton data-testid="skeleton">
          <div>Child 1</div>

          <div>Child 2</div>

          <span>Child 3</span>
        </Skeleton>
      );

      const skeleton = screen.getByTestId("skeleton");

      expect(skeleton).toBeInTheDocument();
      expect(screen.getByText("Child 1")).toBeInTheDocument();
      expect(screen.getByText("Child 2")).toBeInTheDocument();
      expect(screen.getByText("Child 3")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should be accessible with proper ARIA attributes", () => {
      render(
        <Skeleton
          aria-label="Loading content"
          data-testid="skeleton"
          role="status"
        />
      );

      const skeleton = screen.getByTestId("skeleton");

      expect(skeleton).toHaveAttribute("role", "status");
      expect(skeleton).toHaveAttribute("aria-label", "Loading content");
    });

    it("should support aria-hidden for decorative skeletons", () => {
      render(<Skeleton aria-hidden="true" data-testid="skeleton" />);

      const skeleton = screen.getByTestId("skeleton");
      expect(skeleton).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("Common Use Cases", () => {
    it("should render as text skeleton", () => {
      render(<Skeleton className="h-4 w-full" data-testid="text-skeleton" />);

      const skeleton = screen.getByTestId("text-skeleton");
      expect(skeleton).toHaveClass("h-4", "w-full");
    });

    it("should render as avatar skeleton", () => {
      render(
        <Skeleton
          className="h-12 w-12 rounded-full"
          data-testid="avatar-skeleton"
        />
      );

      const skeleton = screen.getByTestId("avatar-skeleton");
      expect(skeleton).toHaveClass("h-12", "w-12", "rounded-full");
    });

    it("should render as button skeleton", () => {
      render(
        <Skeleton
          className="h-10 w-24 rounded-md"
          data-testid="button-skeleton"
        />
      );

      const skeleton = screen.getByTestId("button-skeleton");
      expect(skeleton).toHaveClass("h-10", "w-24", "rounded-md");
    });

    it("should render as card skeleton", () => {
      render(
        <Skeleton
          className="h-32 w-full rounded-lg"
          data-testid="card-skeleton"
        />
      );

      const skeleton = screen.getByTestId("card-skeleton");
      expect(skeleton).toHaveClass("h-32", "w-full", "rounded-lg");
    });
  });

  describe("Multiple Skeletons", () => {
    it("should render multiple skeleton elements", () => {
      render(
        <div>
          <Skeleton className="h-4 w-full mb-2" data-testid="skeleton-1" />

          <Skeleton className="h-4 w-3/4 mb-2" data-testid="skeleton-2" />

          <Skeleton className="h-4 w-1/2" data-testid="skeleton-3" />
        </div>
      );

      expect(screen.getByTestId("skeleton-1")).toBeInTheDocument();
      expect(screen.getByTestId("skeleton-2")).toBeInTheDocument();
      expect(screen.getByTestId("skeleton-3")).toBeInTheDocument();

      expect(screen.getByTestId("skeleton-1")).toHaveClass(
        "h-4",
        "w-full",
        "mb-2"
      );
      expect(screen.getByTestId("skeleton-2")).toHaveClass(
        "h-4",
        "w-3/4",
        "mb-2"
      );
      expect(screen.getByTestId("skeleton-3")).toHaveClass("h-4", "w-1/2");
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty className", () => {
      render(<Skeleton className="" data-testid="skeleton" />);

      const skeleton = screen.getByTestId("skeleton");
      expect(skeleton).toHaveClass("bg-accent", "animate-pulse", "rounded-md");
    });

    it("should handle undefined className", () => {
      render(<Skeleton className={undefined} data-testid="skeleton" />);

      const skeleton = screen.getByTestId("skeleton");
      expect(skeleton).toHaveClass("bg-accent", "animate-pulse", "rounded-md");
    });

    it("should handle null children", () => {
      render(<Skeleton data-testid="skeleton">{null}</Skeleton>);

      const skeleton = screen.getByTestId("skeleton");
      expect(skeleton).toBeInTheDocument();
    });

    it("should handle conditional children", () => {
      const showContent = false;

      render(
        <Skeleton data-testid="skeleton">
          {showContent && <span>Content</span>}
        </Skeleton>
      );

      const skeleton = screen.getByTestId("skeleton");

      expect(skeleton).toBeInTheDocument();
      expect(screen.queryByText("Content")).not.toBeInTheDocument();
    });
  });

  describe("Component Structure", () => {
    it("should maintain correct DOM structure", () => {
      render(
        <div data-testid="container">
          <Skeleton data-testid="skeleton">
            <span data-testid="child">Content</span>
          </Skeleton>
        </div>
      );

      const container = screen.getByTestId("container");
      const skeleton = screen.getByTestId("skeleton");
      const child = screen.getByTestId("child");

      expect(container).toContainElement(skeleton);
      expect(skeleton).toContainElement(child);
    });

    it("should preserve HTML hierarchy", () => {
      render(
        <Skeleton data-testid="skeleton">
          <div data-testid="wrapper">
            <p data-testid="text">Loading text</p>

            <button data-testid="button">Loading button</button>
          </div>
        </Skeleton>
      );

      const skeleton = screen.getByTestId("skeleton");
      const wrapper = screen.getByTestId("wrapper");
      const text = screen.getByTestId("text");
      const button = screen.getByTestId("button");

      expect(skeleton).toContainElement(wrapper);
      expect(wrapper).toContainElement(text);
      expect(wrapper).toContainElement(button);
    });
  });
});
