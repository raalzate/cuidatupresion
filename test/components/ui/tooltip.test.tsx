import "@testing-library/jest-dom";

import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

jest.mock("../../../lib/utils", () => ({
  cn: (...classes: (string | undefined)[]) => classes.filter(Boolean).join(" "),
}));

jest.mock("@radix-ui/react-tooltip", () => ({
  Provider: ({
    children,
    delayDuration,
    skipDelayDuration,
    disableHoverableContent,
    ...props
  }: {
    children: React.ReactNode;
    delayDuration?: number;
    skipDelayDuration?: number;
    disableHoverableContent?: boolean;
  }) => {
    const filteredProps = Object.fromEntries(
      Object.entries(props).filter(
        ([key]) =>
          ![
            "delayDuration",
            "skipDelayDuration",
            "disableHoverableContent",
          ].includes(key)
      )
    );

    return (
      <div
        data-delay-duration={delayDuration}
        data-disable-hoverable-content={disableHoverableContent}
        data-skip-delay-duration={skipDelayDuration}
        data-testid="mock-tooltip-provider"
        {...filteredProps}
      >
        {children}
      </div>
    );
  },
  Root: ({
    children,
    open,
    defaultOpen,
    ...props
  }: {
    children: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    defaultOpen?: boolean;
  }) => {
    const filteredProps = Object.fromEntries(
      Object.entries(props).filter(
        ([key]) => !["open", "onOpenChange", "defaultOpen"].includes(key)
      )
    );

    return (
      <div
        data-default-open={defaultOpen}
        data-open={open}
        data-testid="mock-tooltip-root"
        {...filteredProps}
      >
        {children}
      </div>
    );
  },
  Trigger: React.forwardRef<
    HTMLButtonElement,
    React.ComponentProps<"button"> & { children: React.ReactNode }
  >(function MockTooltipTrigger({ children, ...props }, ref) {
    return (
      <button
        data-testid="mock-tooltip-trigger"
        ref={ref}
        onMouseEnter={() => {
          const event = new CustomEvent("tooltipopen");
          document.dispatchEvent(event);
        }}
        onMouseLeave={() => {
          const event = new CustomEvent("tooltipclose");
          document.dispatchEvent(event);
        }}
        {...props}
      >
        {children}
      </button>
    );
  }),
  Portal: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-tooltip-portal">{children}</div>
  ),
  Content: React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<"div"> & {
      children: React.ReactNode;
      sideOffset?: number;
      side?: "top" | "right" | "bottom" | "left";
    }
  >(function MockTooltipContent({ children, sideOffset, side, ...props }, ref) {
    return (
      <div
        data-side-offset={sideOffset}
        data-side={side}
        data-testid="mock-tooltip-content"
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }),
  Arrow: (props: React.ComponentProps<"div">) => (
    <div data-testid="mock-tooltip-arrow" {...props} />
  ),
}));

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../components/ui/tooltip";

describe("Tooltip Components", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("TooltipProvider", () => {
    it("should render with default props", () => {
      render(
        <TooltipProvider data-testid="tooltip-provider">
          <div>Test Content</div>
        </TooltipProvider>
      );

      const provider = screen.getByTestId("tooltip-provider");

      expect(provider).toBeInTheDocument();
      expect(provider).toHaveAttribute("data-slot", "tooltip-provider");
      expect(screen.getByText("Test Content")).toBeInTheDocument();
    });

    it("should handle delayDuration prop", () => {
      render(
        <TooltipProvider delayDuration={500} data-testid="tooltip-provider">
          <div>Test Content</div>
        </TooltipProvider>
      );

      const provider = screen.getByTestId("tooltip-provider");

      expect(provider).toBeInTheDocument();
      expect(provider).toHaveAttribute("data-delay-duration", "500");
    });

    it("should use default delayDuration of 0", () => {
      render(
        <TooltipProvider data-testid="tooltip-provider">
          <div>Test Content</div>
        </TooltipProvider>
      );

      const provider = screen.getByTestId("tooltip-provider");
      expect(provider).toHaveAttribute("data-delay-duration", "0");
    });

    it("should accept additional props", () => {
      render(
        <TooltipProvider
          skipDelayDuration={300}
          disableHoverableContent={false}
          data-testid="tooltip-provider"
        >
          <div>Test Content</div>
        </TooltipProvider>
      );

      const provider = screen.getByTestId("tooltip-provider");

      expect(provider).toBeInTheDocument();
      expect(provider).toHaveAttribute("data-skip-delay-duration", "300");
      expect(provider).toHaveAttribute(
        "data-disable-hoverable-content",
        "false"
      );
    });
  });

  describe("Tooltip", () => {
    it("should render with TooltipProvider wrapper", () => {
      render(
        <Tooltip data-testid="tooltip">
          <div>Tooltip Content</div>
        </Tooltip>
      );

      expect(screen.getByTestId("mock-tooltip-provider")).toBeInTheDocument();
      expect(screen.getByTestId("tooltip")).toBeInTheDocument();
      expect(screen.getByText("Tooltip Content")).toBeInTheDocument();
    });

    it("should have correct data attribute", () => {
      render(
        <Tooltip data-testid="tooltip">
          <div>Tooltip Content</div>
        </Tooltip>
      );

      const tooltip = screen.getByTestId("tooltip");
      expect(tooltip).toHaveAttribute("data-slot", "tooltip");
    });

    it("should handle controlled open state", () => {
      const mockOnOpenChange = jest.fn();

      render(
        <Tooltip
          data-testid="tooltip"
          onOpenChange={mockOnOpenChange}
          open={true}
        >
          <div>Tooltip Content</div>
        </Tooltip>
      );

      const tooltip = screen.getByTestId("tooltip");
      expect(tooltip).toHaveAttribute("data-open", "true");
    });

    it("should handle additional props", () => {
      render(
        <Tooltip defaultOpen={false} data-testid="tooltip">
          <div>Tooltip Content</div>
        </Tooltip>
      );

      const tooltip = screen.getByTestId("tooltip");
      expect(tooltip).toHaveAttribute("data-default-open", "false");
    });
  });

  describe("TooltipTrigger", () => {
    it("should render with correct attributes", () => {
      render(
        <Tooltip>
          <TooltipTrigger data-testid="tooltip-trigger">
            Hover me
          </TooltipTrigger>
        </Tooltip>
      );

      const trigger = screen.getByTestId("tooltip-trigger");

      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveAttribute("data-slot", "tooltip-trigger");
      expect(screen.getByText("Hover me")).toBeInTheDocument();
    });

    it("should handle click events", () => {
      const mockOnClick = jest.fn();

      render(
        <Tooltip>
          <TooltipTrigger onClick={mockOnClick} data-testid="tooltip-trigger">
            Click me
          </TooltipTrigger>
        </Tooltip>
      );

      const trigger = screen.getByTestId("tooltip-trigger");
      fireEvent.click(trigger);

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it("should work as a button by default", () => {
      render(
        <Tooltip>
          <TooltipTrigger data-testid="tooltip-trigger">
            Button Trigger
          </TooltipTrigger>
        </Tooltip>
      );

      const trigger = screen.getByTestId("tooltip-trigger");
      expect(trigger.tagName).toBe("BUTTON");
    });

    it("should handle hover events", async () => {
      render(
        <Tooltip>
          <TooltipTrigger data-testid="tooltip-trigger">
            Hover me
          </TooltipTrigger>
        </Tooltip>
      );

      const trigger = screen.getByTestId("tooltip-trigger");

      fireEvent.mouseEnter(trigger);

      expect(trigger).toBeInTheDocument();
    });

    it("should accept additional props", () => {
      render(
        <Tooltip>
          <TooltipTrigger
            className="custom-trigger"
            data-testid="tooltip-trigger"
            disabled
          >
            Disabled Trigger
          </TooltipTrigger>
        </Tooltip>
      );

      const trigger = screen.getByTestId("tooltip-trigger");

      expect(trigger).toHaveAttribute("disabled");
      expect(trigger).toHaveClass("custom-trigger");
    });
  });

  describe("TooltipContent", () => {
    it("should render with correct attributes", () => {
      render(
        <Tooltip>
          <TooltipTrigger>Trigger</TooltipTrigger>

          <TooltipContent data-testid="tooltip-content">
            Tooltip text
          </TooltipContent>
        </Tooltip>
      );

      const content = screen.getByTestId("tooltip-content");

      expect(content).toBeInTheDocument();
      expect(content).toHaveAttribute("data-slot", "tooltip-content");
      expect(screen.getByText("Tooltip text")).toBeInTheDocument();
    });

    it("should handle sideOffset prop", () => {
      render(
        <Tooltip>
          <TooltipTrigger>Trigger</TooltipTrigger>

          <TooltipContent sideOffset={10} data-testid="tooltip-content">
            Tooltip text
          </TooltipContent>
        </Tooltip>
      );

      const content = screen.getByTestId("tooltip-content");
      expect(content).toHaveAttribute("data-side-offset", "10");
    });

    it("should use default sideOffset of 0", () => {
      render(
        <Tooltip>
          <TooltipTrigger>Trigger</TooltipTrigger>

          <TooltipContent data-testid="tooltip-content">
            Tooltip text
          </TooltipContent>
        </Tooltip>
      );

      const content = screen.getByTestId("tooltip-content");
      expect(content).toHaveAttribute("data-side-offset", "0");
    });

    it("should apply custom className", () => {
      render(
        <Tooltip>
          <TooltipTrigger>Trigger</TooltipTrigger>

          <TooltipContent
            className="custom-tooltip"
            data-testid="tooltip-content"
          >
            Tooltip text
          </TooltipContent>
        </Tooltip>
      );

      const content = screen.getByTestId("tooltip-content");
      expect(content).toHaveClass("custom-tooltip");
    });

    it("should render with default styling classes", () => {
      render(
        <Tooltip>
          <TooltipTrigger>Trigger</TooltipTrigger>

          <TooltipContent data-testid="tooltip-content">
            Tooltip text
          </TooltipContent>
        </Tooltip>
      );

      const content = screen.getByTestId("tooltip-content");

      expect(content).toHaveClass(
        "bg-primary",
        "text-primary-foreground",
        "animate-in",
        "fade-in-0",
        "zoom-in-95",
        "z-50",
        "rounded-md",
        "px-3",
        "py-1.5",
        "text-xs"
      );
    });

    it("should render arrow component", () => {
      render(
        <Tooltip>
          <TooltipTrigger>Trigger</TooltipTrigger>

          <TooltipContent data-testid="tooltip-content">
            Tooltip text
          </TooltipContent>
        </Tooltip>
      );

      expect(screen.getByTestId("mock-tooltip-arrow")).toBeInTheDocument();
    });

    it("should handle different sides", () => {
      const sides = ["top", "right", "bottom", "left"] as const;

      sides.forEach((side) => {
        const { unmount } = render(
          <Tooltip>
            <TooltipTrigger>Trigger</TooltipTrigger>

            <TooltipContent side={side} data-testid="tooltip-content">
              Tooltip text
            </TooltipContent>
          </Tooltip>
        );

        const content = screen.getByTestId("tooltip-content");
        expect(content).toHaveAttribute("data-side", side);

        unmount();
      });
    });

    it("should render within portal", () => {
      render(
        <Tooltip>
          <TooltipTrigger>Trigger</TooltipTrigger>

          <TooltipContent data-testid="tooltip-content">
            Tooltip text
          </TooltipContent>
        </Tooltip>
      );

      expect(screen.getByTestId("mock-tooltip-portal")).toBeInTheDocument();
      expect(screen.getByTestId("tooltip-content")).toBeInTheDocument();
    });

    it("should handle complex content", () => {
      render(
        <Tooltip>
          <TooltipTrigger>Trigger</TooltipTrigger>

          <TooltipContent data-testid="tooltip-content">
            <div>
              <strong>Bold text</strong>

              <p>Description text</p>
            </div>
          </TooltipContent>
        </Tooltip>
      );

      const content = screen.getByTestId("tooltip-content");

      expect(content).toBeInTheDocument();
      expect(screen.getByText("Bold text")).toBeInTheDocument();
      expect(screen.getByText("Description text")).toBeInTheDocument();
    });
  });

  describe("Integration Tests", () => {
    it("should work with complete tooltip structure", () => {
      render(
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger data-testid="tooltip-trigger">
              Hover me
            </TooltipTrigger>

            <TooltipContent data-testid="tooltip-content">
              This is a tooltip
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );

      expect(screen.getByTestId("tooltip-trigger")).toBeInTheDocument();
      expect(screen.getByTestId("tooltip-content")).toBeInTheDocument();
      expect(screen.getByText("Hover me")).toBeInTheDocument();
      expect(screen.getByText("This is a tooltip")).toBeInTheDocument();
    });

    it("should handle multiple tooltips", () => {
      render(
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger data-testid="tooltip-trigger-1">
              First trigger
            </TooltipTrigger>

            <TooltipContent data-testid="tooltip-content-1">
              First tooltip
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger data-testid="tooltip-trigger-2">
              Second trigger
            </TooltipTrigger>

            <TooltipContent data-testid="tooltip-content-2">
              Second tooltip
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );

      expect(screen.getByTestId("tooltip-trigger-1")).toBeInTheDocument();
      expect(screen.getByTestId("tooltip-content-1")).toBeInTheDocument();
      expect(screen.getByTestId("tooltip-trigger-2")).toBeInTheDocument();
      expect(screen.getByTestId("tooltip-content-2")).toBeInTheDocument();
    });

    it("should work without explicit TooltipProvider", () => {
      render(
        <Tooltip>
          <TooltipTrigger data-testid="tooltip-trigger">Trigger</TooltipTrigger>

          <TooltipContent data-testid="tooltip-content">Content</TooltipContent>
        </Tooltip>
      );

      expect(screen.getByTestId("mock-tooltip-provider")).toBeInTheDocument();
      expect(screen.getByTestId("tooltip-trigger")).toBeInTheDocument();
      expect(screen.getByTestId("tooltip-content")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA attributes", () => {
      render(
        <Tooltip>
          <TooltipTrigger
            aria-describedby="tooltip-content"
            data-testid="tooltip-trigger"
          >
            Accessible trigger
          </TooltipTrigger>

          <TooltipContent
            data-testid="tooltip-content"
            id="tooltip-content"
            role="tooltip"
          >
            Accessible tooltip
          </TooltipContent>
        </Tooltip>
      );

      const trigger = screen.getByTestId("tooltip-trigger");
      const content = screen.getByTestId("tooltip-content");

      expect(trigger).toHaveAttribute("aria-describedby", "tooltip-content");
      expect(content).toHaveAttribute("id", "tooltip-content");
      expect(content).toHaveAttribute("role", "tooltip");
    });

    it("should be keyboard accessible", () => {
      render(
        <Tooltip>
          <TooltipTrigger data-testid="tooltip-trigger">
            Keyboard accessible
          </TooltipTrigger>

          <TooltipContent data-testid="tooltip-content">
            Tooltip content
          </TooltipContent>
        </Tooltip>
      );

      const trigger = screen.getByTestId("tooltip-trigger");

      trigger.focus();
      expect(trigger).toHaveFocus();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty content", () => {
      render(
        <Tooltip>
          <TooltipTrigger data-testid="tooltip-trigger">Trigger</TooltipTrigger>

          <TooltipContent data-testid="tooltip-content"></TooltipContent>
        </Tooltip>
      );

      expect(screen.getByTestId("tooltip-content")).toBeInTheDocument();
    });

    it("should handle conditional content", () => {
      const showContent = false;

      render(
        <Tooltip>
          <TooltipTrigger data-testid="tooltip-trigger">Trigger</TooltipTrigger>

          <TooltipContent data-testid="tooltip-content">
            {showContent && "Conditional content"}
          </TooltipContent>
        </Tooltip>
      );

      const content = screen.getByTestId("tooltip-content");

      expect(content).toBeInTheDocument();
      expect(screen.queryByText("Conditional content")).not.toBeInTheDocument();
    });

    it("should handle null children", () => {
      render(
        <Tooltip>
          <TooltipTrigger data-testid="tooltip-trigger">Trigger</TooltipTrigger>

          <TooltipContent data-testid="tooltip-content">{null}</TooltipContent>
        </Tooltip>
      );

      expect(screen.getByTestId("tooltip-content")).toBeInTheDocument();
    });
  });
});
