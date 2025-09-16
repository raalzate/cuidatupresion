import React from "react";
import { render, screen } from "@testing-library/react";
import { Separator } from "../../../../components/shared/separator/separator";

jest.mock("@radix-ui/react-separator", () => {
  const MockRoot = React.forwardRef<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<"div"> & {
      orientation?: "horizontal" | "vertical";
      decorative?: boolean;
    }
  >(({ children, className, orientation, decorative, ...props }, ref) => (
    <div
      ref={ref}
      data-testid="mock-separator"
      data-orientation={orientation}
      data-decorative={decorative}
      className={className}
      role={decorative ? "none" : "separator"}
      aria-orientation={orientation}
      {...props}
    >
      {children}
    </div>
  ));

  MockRoot.displayName = "MockSeparatorRoot";

  return {
    Root: MockRoot,
  };
});

jest.mock("../../../../lib/utils", () => ({
  cn: (...classes: (string | undefined)[]) => classes.filter(Boolean).join(" "),
}));

describe("Separator", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Basic Rendering", () => {
    it("should render separator with default props", () => {
      render(<Separator />);

      const separator = screen.getByTestId("mock-separator");

      expect(separator).toBeInTheDocument();
      expect(separator).toHaveAttribute("data-orientation", "horizontal");
      expect(separator).toHaveAttribute("data-decorative", "true");
      expect(separator).toHaveAttribute("role", "none");
    });

    it("should apply default classes", () => {
      render(<Separator />);

      const separator = screen.getByTestId("mock-separator");

      expect(separator).toHaveClass(
        "shrink-0",
        "bg-border",
        "h-[1px]",
        "w-full"
      );
    });

    it("should have correct display name", () => {
      expect(Separator.displayName).toBeDefined();
    });
  });

  describe("Orientation Props", () => {
    it("should render horizontal separator", () => {
      render(<Separator orientation="horizontal" />);

      const separator = screen.getByTestId("mock-separator");

      expect(separator).toHaveAttribute("data-orientation", "horizontal");
      expect(separator).toHaveAttribute("aria-orientation", "horizontal");
      expect(separator).toHaveClass("h-[1px]", "w-full");
    });

    it("should render vertical separator", () => {
      render(<Separator orientation="vertical" />);

      const separator = screen.getByTestId("mock-separator");

      expect(separator).toHaveAttribute("data-orientation", "vertical");
      expect(separator).toHaveAttribute("aria-orientation", "vertical");
      expect(separator).toHaveClass("h-full", "w-[1px]");
    });

    it("should default to horizontal when orientation is not provided", () => {
      render(<Separator />);

      const separator = screen.getByTestId("mock-separator");

      expect(separator).toHaveAttribute("data-orientation", "horizontal");
      expect(separator).toHaveClass("h-[1px]", "w-full");
    });
  });

  describe("Decorative Props", () => {
    it("should render as decorative by default", () => {
      render(<Separator />);

      const separator = screen.getByTestId("mock-separator");

      expect(separator).toHaveAttribute("data-decorative", "true");
      expect(separator).toHaveAttribute("role", "none");
    });

    it("should render as non-decorative when decorative is false", () => {
      render(<Separator decorative={false} />);

      const separator = screen.getByTestId("mock-separator");

      expect(separator).toHaveAttribute("data-decorative", "false");
      expect(separator).toHaveAttribute("role", "separator");
    });

    it("should render as decorative when explicitly set to true", () => {
      render(<Separator decorative={true} />);

      const separator = screen.getByTestId("mock-separator");

      expect(separator).toHaveAttribute("data-decorative", "true");
      expect(separator).toHaveAttribute("role", "none");
    });
  });

  describe("Custom Classes", () => {
    it("should apply custom className", () => {
      render(<Separator className="custom-class" />);

      const separator = screen.getByTestId("mock-separator");

      expect(separator).toHaveClass(
        "shrink-0",
        "bg-border",
        "h-[1px]",
        "w-full",
        "custom-class"
      );
    });

    it("should merge multiple custom classes", () => {
      render(<Separator className="custom-1 custom-2" />);

      const separator = screen.getByTestId("mock-separator");

      expect(separator).toHaveClass(
        "shrink-0",
        "bg-border",
        "h-[1px]",
        "w-full",
        "custom-1",
        "custom-2"
      );
    });

    it("should handle empty className", () => {
      render(<Separator className="" />);

      const separator = screen.getByTestId("mock-separator");

      expect(separator).toHaveClass(
        "shrink-0",
        "bg-border",
        "h-[1px]",
        "w-full"
      );
    });

    it("should handle undefined className", () => {
      render(<Separator className={undefined} />);

      const separator = screen.getByTestId("mock-separator");

      expect(separator).toHaveClass(
        "shrink-0",
        "bg-border",
        "h-[1px]",
        "w-full"
      );
    });
  });

  describe("Combined Props", () => {
    it("should handle horizontal orientation with custom class", () => {
      render(
        <Separator orientation="horizontal" className="custom-horizontal" />
      );

      const separator = screen.getByTestId("mock-separator");

      expect(separator).toHaveAttribute("data-orientation", "horizontal");
      expect(separator).toHaveClass(
        "shrink-0",
        "bg-border",
        "h-[1px]",
        "w-full",
        "custom-horizontal"
      );
    });

    it("should handle vertical orientation with custom class", () => {
      render(<Separator orientation="vertical" className="custom-vertical" />);

      const separator = screen.getByTestId("mock-separator");

      expect(separator).toHaveAttribute("data-orientation", "vertical");
      expect(separator).toHaveClass(
        "shrink-0",
        "bg-border",
        "h-full",
        "w-[1px]",
        "custom-vertical"
      );
    });

    it("should handle all props together", () => {
      render(
        <Separator
          className="all-props-test"
          decorative={false}
          orientation="vertical"
        />
      );

      const separator = screen.getByTestId("mock-separator");

      expect(separator).toHaveAttribute("data-orientation", "vertical");
      expect(separator).toHaveAttribute("data-decorative", "false");
      expect(separator).toHaveAttribute("role", "separator");
      expect(separator).toHaveClass(
        "shrink-0",
        "bg-border",
        "h-full",
        "w-[1px]",
        "all-props-test"
      );
    });
  });

  describe("HTML Attributes", () => {
    it("should forward additional props", () => {
      render(
        <Separator
          data-custom="test"
          id="separator-id"
          title="Separator title"
        />
      );

      const separator = screen.getByTestId("mock-separator");

      expect(separator).toHaveAttribute("data-custom", "test");
      expect(separator).toHaveAttribute("id", "separator-id");
      expect(separator).toHaveAttribute("title", "Separator title");
    });

    it("should handle onClick events", () => {
      const handleClick = jest.fn();
      render(<Separator onClick={handleClick} />);

      const separator = screen.getByTestId("mock-separator");

      separator.click();

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should handle style prop", () => {
      const customStyle = { backgroundColor: "rgb(255, 0, 0)", margin: "10px" };
      render(<Separator style={customStyle} />);

      const separator = screen.getByTestId("mock-separator");

      expect(separator).toHaveStyle("background-color: rgb(255, 0, 0)");
      expect(separator).toHaveStyle("margin: 10px");
    });
  });

  describe("Ref Forwarding", () => {
    it("should forward ref correctly", () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Separator ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveAttribute("data-testid", "mock-separator");
    });

    it("should work with callback ref", () => {
      let refElement: HTMLDivElement | null = null;
      const callbackRef = (element: HTMLDivElement | null) => {
        refElement = element;
      };

      render(<Separator ref={callbackRef} />);

      expect(refElement).toBeInstanceOf(HTMLDivElement);
      expect(refElement).toHaveAttribute("data-testid", "mock-separator");
    });
  });

  describe("Accessibility", () => {
    it("should have proper accessibility attributes for decorative separator", () => {
      render(<Separator decorative={true} orientation="horizontal" />);

      const separator = screen.getByTestId("mock-separator");

      expect(separator).toHaveAttribute("role", "none");
      expect(separator).toHaveAttribute("aria-orientation", "horizontal");
    });

    it("should have proper accessibility attributes for semantic separator", () => {
      render(<Separator decorative={false} orientation="vertical" />);

      const separator = screen.getByTestId("mock-separator");

      expect(separator).toHaveAttribute("role", "separator");
      expect(separator).toHaveAttribute("aria-orientation", "vertical");
    });

    it("should support aria-label for semantic separators", () => {
      render(<Separator decorative={false} aria-label="Section divider" />);

      const separator = screen.getByTestId("mock-separator");
      expect(separator).toHaveAttribute("aria-label", "Section divider");
    });
  });

  describe("Edge Cases", () => {
    it("should handle null children gracefully", () => {
      render(<Separator>{null}</Separator>);

      const separator = screen.getByTestId("mock-separator");

      expect(separator).toBeInTheDocument();
      expect(separator).toBeEmptyDOMElement();
    });

    it("should handle undefined props gracefully", () => {
      const props = {
        orientation: undefined as "horizontal" | "vertical" | undefined,
        decorative: undefined as boolean | undefined,
        className: undefined as string | undefined,
      };

      render(<Separator {...props} />);

      const separator = screen.getByTestId("mock-separator");

      expect(separator).toBeInTheDocument();
      expect(separator).toHaveAttribute("data-orientation", "horizontal");
      expect(separator).toHaveAttribute("data-decorative", "true");
    });

    it("should work in different container contexts", () => {
      render(
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div>Content above</div>
          <Separator />
          <div>Content below</div>
        </div>
      );

      const separator = screen.getByTestId("mock-separator");

      expect(separator).toBeInTheDocument();
      expect(screen.getByText("Content above")).toBeInTheDocument();
      expect(screen.getByText("Content below")).toBeInTheDocument();
    });
  });

  describe("Integration Scenarios", () => {
    it("should work as horizontal divider between content", () => {
      render(
        <div>
          <section data-testid="section-1">Section 1</section>

          <Separator orientation="horizontal" />

          <section data-testid="section-2">Section 2</section>
        </div>
      );

      const separator = screen.getByTestId("mock-separator");
      const section1 = screen.getByTestId("section-1");
      const section2 = screen.getByTestId("section-2");

      expect(separator).toBeInTheDocument();
      expect(section1).toBeInTheDocument();
      expect(section2).toBeInTheDocument();
      expect(separator).toHaveAttribute("data-orientation", "horizontal");
    });

    it("should work as vertical divider in flex layout", () => {
      render(
        <div style={{ display: "flex" }}>
          <div data-testid="left-panel">Left Panel</div>

          <Separator orientation="vertical" />

          <div data-testid="right-panel">Right Panel</div>
        </div>
      );

      const separator = screen.getByTestId("mock-separator");

      expect(separator).toHaveAttribute("data-orientation", "vertical");
      expect(separator).toHaveClass("h-full", "w-[1px]");
    });

    it("should support multiple separators in the same container", () => {
      render(
        <div>
          <div>Item 1</div>

          <Separator className="separator-1" />

          <div>Item 2</div>

          <Separator className="separator-2" />

          <div>Item 3</div>
        </div>
      );

      const separators = screen.getAllByTestId("mock-separator");

      expect(separators).toHaveLength(2);
      expect(separators[0]).toHaveClass("separator-1");
      expect(separators[1]).toHaveClass("separator-2");
    });
  });
});
