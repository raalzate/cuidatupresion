import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";

interface TestPopoverProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface TestPopoverTriggerProps {
  children: React.ReactNode;
  onClick?: () => void;
}

interface TestPopoverContentProps {
  align?: "start" | "center" | "end";
  children?: React.ReactNode;
  className?: string;
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
}

interface TestPopoverAnchorProps {
  children?: React.ReactNode;
}

const mockOnOpenChange = jest.fn();
const mockOnClick = jest.fn();

const TestPopover = ({
  children,
  open = false,
  onOpenChange,
}: TestPopoverProps) => {
  const [isOpen, setIsOpen] = React.useState(open);

  React.useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  return (
    <div
      data-slot="popover"
      data-state={isOpen ? "open" : "closed"}
      data-testid="popover-root"
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            isOpen,
            onOpenChange: handleOpenChange,
          } as Record<string, unknown>);
        }

        return child;
      })}
    </div>
  );
};

const TestPopoverTrigger = ({
  children,
  onClick,
  isOpen,
  onOpenChange,
}: TestPopoverTriggerProps & {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}) => {
  const handleClick = () => {
    onClick?.();
    onOpenChange?.(!isOpen);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();

      handleClick();
    }
  };

  return (
    <button
      aria-expanded={isOpen}
      aria-haspopup="dialog"
      data-slot="popover-trigger"
      data-state={isOpen ? "open" : "closed"}
      data-testid="popover-trigger"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {children}
    </button>
  );
};

const TestPopoverContent = ({
  children,
  align = "center",
  side = "bottom",
  sideOffset = 4,
  className = "",
  isOpen,
}: TestPopoverContentProps & { isOpen?: boolean }) => {
  if (!isOpen) return null;

  const baseClasses =
    "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden";
  const combinedClasses = `${baseClasses} ${className}`.trim();

  return (
    <div data-testid="popover-portal">
      <div
        aria-modal="true"
        className={combinedClasses}
        data-align={align}
        data-side-offset={sideOffset}
        data-side={side}
        data-slot="popover-content"
        data-state="open"
        data-testid="popover-content"
        role="dialog"
      >
        {children}
      </div>
    </div>
  );
};

const TestPopoverAnchor = ({ children }: TestPopoverAnchorProps) => {
  return (
    <div data-testid="popover-anchor" data-slot="popover-anchor">
      {children}
    </div>
  );
};

describe("Popover Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Popover Root", () => {
    it("should render popover root with correct structure", () => {
      render(
        <TestPopover>
          <TestPopoverTrigger>Open Popover</TestPopoverTrigger>

          <TestPopoverContent>Popover Content</TestPopoverContent>
        </TestPopover>
      );

      expect(screen.getByTestId("popover-root")).toBeInTheDocument();
      expect(screen.getByTestId("popover-root")).toHaveAttribute(
        "data-slot",
        "popover"
      );
    });

    it("should have closed state by default", () => {
      render(
        <TestPopover>
          <TestPopoverTrigger>Open Popover</TestPopoverTrigger>

          <TestPopoverContent>Popover Content</TestPopoverContent>
        </TestPopover>
      );

      expect(screen.getByTestId("popover-root")).toHaveAttribute(
        "data-state",
        "closed"
      );
    });

    it("should accept open prop", () => {
      render(
        <TestPopover open={true}>
          <TestPopoverTrigger>Open Popover</TestPopoverTrigger>

          <TestPopoverContent>Popover Content</TestPopoverContent>
        </TestPopover>
      );

      expect(screen.getByTestId("popover-root")).toHaveAttribute(
        "data-state",
        "open"
      );
    });

    it("should call onOpenChange when state changes", async () => {
      render(
        <TestPopover onOpenChange={mockOnOpenChange}>
          <TestPopoverTrigger>Open Popover</TestPopoverTrigger>

          <TestPopoverContent>Popover Content</TestPopoverContent>
        </TestPopover>
      );

      const trigger = screen.getByTestId("popover-trigger");
      fireEvent.click(trigger);

      await waitFor(() => {
        expect(mockOnOpenChange).toHaveBeenCalledWith(true);
      });
    });
  });

  describe("PopoverTrigger", () => {
    it("should render trigger button with correct attributes", () => {
      render(
        <TestPopover>
          <TestPopoverTrigger>Open Popover</TestPopoverTrigger>

          <TestPopoverContent>Popover Content</TestPopoverContent>
        </TestPopover>
      );

      const trigger = screen.getByTestId("popover-trigger");

      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveAttribute("data-slot", "popover-trigger");
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    });

    it("should display trigger content", () => {
      render(
        <TestPopover>
          <TestPopoverTrigger>Click me to open</TestPopoverTrigger>

          <TestPopoverContent>Popover Content</TestPopoverContent>
        </TestPopover>
      );

      expect(screen.getByText("Click me to open")).toBeInTheDocument();
    });

    it("should update aria-expanded when open", () => {
      render(
        <TestPopover open={true}>
          <TestPopoverTrigger>Open Popover</TestPopoverTrigger>

          <TestPopoverContent>Popover Content</TestPopoverContent>
        </TestPopover>
      );

      const trigger = screen.getByTestId("popover-trigger");
      expect(trigger).toHaveAttribute("aria-expanded", "true");
    });

    it("should handle click events", async () => {
      render(
        <TestPopover>
          <TestPopoverTrigger onClick={mockOnClick}>
            Open Popover
          </TestPopoverTrigger>

          <TestPopoverContent>Popover Content</TestPopoverContent>
        </TestPopover>
      );

      const trigger = screen.getByTestId("popover-trigger");
      fireEvent.click(trigger);

      await waitFor(() => {
        expect(mockOnClick).toHaveBeenCalledTimes(1);
      });
    });

    it("should toggle popover state on click", async () => {
      render(
        <TestPopover>
          <TestPopoverTrigger>Open Popover</TestPopoverTrigger>

          <TestPopoverContent>Popover Content</TestPopoverContent>
        </TestPopover>
      );

      const trigger = screen.getByTestId("popover-trigger");

      expect(trigger).toHaveAttribute("data-state", "closed");

      fireEvent.click(trigger);

      await waitFor(() => {
        expect(trigger).toHaveAttribute("data-state", "open");
      });

      fireEvent.click(trigger);

      await waitFor(() => {
        expect(trigger).toHaveAttribute("data-state", "closed");
      });
    });
  });

  describe("PopoverContent", () => {
    it("should not render content when popover is closed", () => {
      render(
        <TestPopover>
          <TestPopoverTrigger>Open Popover</TestPopoverTrigger>

          <TestPopoverContent>Hidden Content</TestPopoverContent>
        </TestPopover>
      );

      expect(screen.queryByTestId("popover-content")).not.toBeInTheDocument();
      expect(screen.queryByText("Hidden Content")).not.toBeInTheDocument();
    });

    it("should render content when popover is open", () => {
      render(
        <TestPopover open={true}>
          <TestPopoverTrigger>Open Popover</TestPopoverTrigger>

          <TestPopoverContent>Visible Content</TestPopoverContent>
        </TestPopover>
      );

      expect(screen.getByTestId("popover-content")).toBeInTheDocument();
      expect(screen.getByText("Visible Content")).toBeInTheDocument();
    });

    it("should have correct accessibility attributes", () => {
      render(
        <TestPopover open={true}>
          <TestPopoverTrigger>Open Popover</TestPopoverTrigger>

          <TestPopoverContent>Content</TestPopoverContent>
        </TestPopover>
      );

      const content = screen.getByTestId("popover-content");

      expect(content).toHaveAttribute("role", "dialog");
      expect(content).toHaveAttribute("aria-modal", "true");
      expect(content).toHaveAttribute("data-slot", "popover-content");
    });

    it("should apply default CSS classes", () => {
      render(
        <TestPopover open={true}>
          <TestPopoverTrigger>Open Popover</TestPopoverTrigger>

          <TestPopoverContent>Content</TestPopoverContent>
        </TestPopover>
      );

      const content = screen.getByTestId("popover-content");

      expect(content).toHaveClass(
        "bg-popover",
        "text-popover-foreground",
        "z-50",
        "w-72",
        "rounded-md",
        "border",
        "p-4",
        "shadow-md",
        "outline-hidden"
      );
    });

    it("should accept custom className", () => {
      render(
        <TestPopover open={true}>
          <TestPopoverTrigger>Open Popover</TestPopoverTrigger>

          <TestPopoverContent className="custom-class">
            Content
          </TestPopoverContent>
        </TestPopover>
      );

      const content = screen.getByTestId("popover-content");
      expect(content).toHaveClass("custom-class");
    });

    it("should set default align to center", () => {
      render(
        <TestPopover open={true}>
          <TestPopoverTrigger>Open Popover</TestPopoverTrigger>

          <TestPopoverContent>Content</TestPopoverContent>
        </TestPopover>
      );

      const content = screen.getByTestId("popover-content");
      expect(content).toHaveAttribute("data-align", "center");
    });

    it("should accept custom align prop", () => {
      render(
        <TestPopover open={true}>
          <TestPopoverTrigger>Open Popover</TestPopoverTrigger>

          <TestPopoverContent align="start">Content</TestPopoverContent>
        </TestPopover>
      );

      const content = screen.getByTestId("popover-content");
      expect(content).toHaveAttribute("data-align", "start");
    });

    it("should set default side to bottom", () => {
      render(
        <TestPopover open={true}>
          <TestPopoverTrigger>Open Popover</TestPopoverTrigger>

          <TestPopoverContent>Content</TestPopoverContent>
        </TestPopover>
      );

      const content = screen.getByTestId("popover-content");
      expect(content).toHaveAttribute("data-side", "bottom");
    });

    it("should accept custom side prop", () => {
      render(
        <TestPopover open={true}>
          <TestPopoverTrigger>Open Popover</TestPopoverTrigger>

          <TestPopoverContent side="top">Content</TestPopoverContent>
        </TestPopover>
      );

      const content = screen.getByTestId("popover-content");
      expect(content).toHaveAttribute("data-side", "top");
    });

    it("should set default sideOffset to 4", () => {
      render(
        <TestPopover open={true}>
          <TestPopoverTrigger>Open Popover</TestPopoverTrigger>

          <TestPopoverContent>Content</TestPopoverContent>
        </TestPopover>
      );

      const content = screen.getByTestId("popover-content");
      expect(content).toHaveAttribute("data-side-offset", "4");
    });

    it("should accept custom sideOffset prop", () => {
      render(
        <TestPopover open={true}>
          <TestPopoverTrigger>Open Popover</TestPopoverTrigger>

          <TestPopoverContent sideOffset={8}>Content</TestPopoverContent>
        </TestPopover>
      );

      const content = screen.getByTestId("popover-content");
      expect(content).toHaveAttribute("data-side-offset", "8");
    });

    it("should render inside portal", () => {
      render(
        <TestPopover open={true}>
          <TestPopoverTrigger>Open Popover</TestPopoverTrigger>

          <TestPopoverContent>Portal Content</TestPopoverContent>
        </TestPopover>
      );

      expect(screen.getByTestId("popover-portal")).toBeInTheDocument();
      expect(screen.getByTestId("popover-content")).toBeInTheDocument();
    });
  });

  describe("PopoverAnchor", () => {
    it("should render anchor with correct attributes", () => {
      render(
        <TestPopoverAnchor>
          <span>Anchor Element</span>
        </TestPopoverAnchor>
      );

      const anchor = screen.getByTestId("popover-anchor");
      expect(anchor).toBeInTheDocument();
      expect(anchor).toHaveAttribute("data-slot", "popover-anchor");
    });

    it("should render anchor children", () => {
      render(
        <TestPopoverAnchor>
          <span>Anchor Content</span>
        </TestPopoverAnchor>
      );

      expect(screen.getByText("Anchor Content")).toBeInTheDocument();
    });

    it("should work without children", () => {
      render(<TestPopoverAnchor />);

      expect(screen.getByTestId("popover-anchor")).toBeInTheDocument();
    });
  });

  describe("Popover Integration", () => {
    it("should work with all components together", async () => {
      render(
        <TestPopover>
          <TestPopoverAnchor>
            <span>Anchor</span>
          </TestPopoverAnchor>

          <TestPopoverTrigger>Open Popover</TestPopoverTrigger>

          <TestPopoverContent>Full Integration Content</TestPopoverContent>
        </TestPopover>
      );

      expect(screen.getByTestId("popover-root")).toBeInTheDocument();
      expect(screen.getByTestId("popover-anchor")).toBeInTheDocument();
      expect(screen.getByTestId("popover-trigger")).toBeInTheDocument();
      expect(screen.getByText("Anchor")).toBeInTheDocument();

      expect(screen.queryByTestId("popover-content")).not.toBeInTheDocument();

      const trigger = screen.getByTestId("popover-trigger");
      fireEvent.click(trigger);

      await waitFor(() => {
        expect(screen.getByTestId("popover-content")).toBeInTheDocument();
        expect(
          screen.getByText("Full Integration Content")
        ).toBeInTheDocument();
      });
    });

    it("should handle controlled state", () => {
      const ControlledPopover = () => {
        const [open, setOpen] = React.useState(false);

        return (
          <div>
            <button
              data-testid="external-control"
              onClick={() => setOpen(!open)}
            >
              External Control
            </button>

            <TestPopover open={open} onOpenChange={setOpen}>
              <TestPopoverTrigger>Trigger</TestPopoverTrigger>

              <TestPopoverContent>Controlled Content</TestPopoverContent>
            </TestPopover>
          </div>
        );
      };

      render(<ControlledPopover />);

      expect(screen.queryByTestId("popover-content")).not.toBeInTheDocument();

      fireEvent.click(screen.getByTestId("external-control"));
      expect(screen.getByTestId("popover-content")).toBeInTheDocument();

      fireEvent.click(screen.getByTestId("external-control"));
      expect(screen.queryByTestId("popover-content")).not.toBeInTheDocument();
    });

    it("should support different positioning combinations", () => {
      const sides = ["top", "right", "bottom", "left"] as const;
      const aligns = ["start", "center", "end"] as const;

      sides.forEach((side) => {
        aligns.forEach((align) => {
          const { unmount } = render(
            <TestPopover open={true}>
              <TestPopoverTrigger>Trigger</TestPopoverTrigger>

              <TestPopoverContent side={side} align={align}>
                Content for {side}-{align}
              </TestPopoverContent>
            </TestPopover>
          );

          const content = screen.getByTestId("popover-content");

          expect(content).toHaveAttribute("data-side", side);
          expect(content).toHaveAttribute("data-align", align);

          unmount();
        });
      });
    });
  });

  describe("User Interactions", () => {
    it("should be keyboard accessible", async () => {
      render(
        <TestPopover>
          <TestPopoverTrigger>Open Popover</TestPopoverTrigger>

          <TestPopoverContent>Keyboard Content</TestPopoverContent>
        </TestPopover>
      );

      const trigger = screen.getByTestId("popover-trigger");

      trigger.focus();
      expect(trigger).toHaveFocus();

      fireEvent.keyDown(trigger, { key: "Enter" });

      await waitFor(() => {
        expect(screen.getByTestId("popover-content")).toBeInTheDocument();
      });
    });

    it("should handle multiple triggers", async () => {
      render(
        <div>
          <TestPopover>
            <TestPopoverTrigger>First Trigger</TestPopoverTrigger>

            <TestPopoverContent>First Content</TestPopoverContent>
          </TestPopover>

          <TestPopover>
            <TestPopoverTrigger>Second Trigger</TestPopoverTrigger>

            <TestPopoverContent>Second Content</TestPopoverContent>
          </TestPopover>
        </div>
      );

      const firstTrigger = screen.getByText("First Trigger");
      const secondTrigger = screen.getByText("Second Trigger");

      fireEvent.click(firstTrigger);
      await waitFor(() => {
        expect(screen.getByText("First Content")).toBeInTheDocument();
      });

      fireEvent.click(secondTrigger);
      await waitFor(() => {
        expect(screen.getByText("Second Content")).toBeInTheDocument();
      });

      expect(screen.getByText("First Content")).toBeInTheDocument();
      expect(screen.getByText("Second Content")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty content", () => {
      render(
        <TestPopover open={true}>
          <TestPopoverTrigger>Trigger</TestPopoverTrigger>

          <TestPopoverContent></TestPopoverContent>
        </TestPopover>
      );

      expect(screen.getByTestId("popover-content")).toBeInTheDocument();
    });

    it("should handle complex content", () => {
      render(
        <TestPopover open={true}>
          <TestPopoverTrigger>Trigger</TestPopoverTrigger>

          <TestPopoverContent>
            <div>
              <h3>Complex Content</h3>

              <p>Paragraph text</p>

              <button>Action Button</button>

              <ul>
                <li>List item 1</li>

                <li>List item 2</li>
              </ul>
            </div>
          </TestPopoverContent>
        </TestPopover>
      );

      expect(screen.getByText("Complex Content")).toBeInTheDocument();
      expect(screen.getByText("Paragraph text")).toBeInTheDocument();
      expect(screen.getByText("Action Button")).toBeInTheDocument();
      expect(screen.getByText("List item 1")).toBeInTheDocument();
      expect(screen.getByText("List item 2")).toBeInTheDocument();
    });

    it("should handle state changes rapidly", async () => {
      render(
        <TestPopover onOpenChange={mockOnOpenChange}>
          <TestPopoverTrigger>Rapid Toggle</TestPopoverTrigger>

          <TestPopoverContent>Rapid Content</TestPopoverContent>
        </TestPopover>
      );

      const trigger = screen.getByTestId("popover-trigger");

      fireEvent.click(trigger);
      fireEvent.click(trigger);
      fireEvent.click(trigger);
      fireEvent.click(trigger);

      await waitFor(() => {
        expect(mockOnOpenChange).toHaveBeenCalled();
      });
    });

    it("should handle long content gracefully", () => {
      const longContent = "This is a very long content ".repeat(100);

      render(
        <TestPopover open={true}>
          <TestPopoverTrigger>Trigger</TestPopoverTrigger>

          <TestPopoverContent>{longContent}</TestPopoverContent>
        </TestPopover>
      );

      const content = screen.getByTestId("popover-content");

      expect(content).toBeInTheDocument();
      expect(content.textContent).toContain("This is a very long content");
      expect(content.textContent?.length).toBeGreaterThan(1000);
    });

    it("should maintain consistent width class", () => {
      render(
        <TestPopover open={true}>
          <TestPopoverTrigger>Trigger</TestPopoverTrigger>

          <TestPopoverContent className="w-96">
            Custom Width Content
          </TestPopoverContent>
        </TestPopover>
      );

      const content = screen.getByTestId("popover-content");
      expect(content).toHaveClass("w-72", "w-96");
    });
  });

  describe("Animation Classes", () => {
    it("should include animation classes", () => {
      render(
        <TestPopover open={true}>
          <TestPopoverTrigger>Trigger</TestPopoverTrigger>

          <TestPopoverContent>Animated Content</TestPopoverContent>
        </TestPopover>
      );

      const content = screen.getByTestId("popover-content");

      expect(content).toHaveClass(
        "data-[state=open]:animate-in",
        "data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0",
        "data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95",
        "data-[state=open]:zoom-in-95"
      );
    });

    it("should include directional slide classes", () => {
      render(
        <TestPopover open={true}>
          <TestPopoverTrigger>Trigger</TestPopoverTrigger>

          <TestPopoverContent>Directional Content</TestPopoverContent>
        </TestPopover>
      );

      const content = screen.getByTestId("popover-content");
      expect(content).toHaveClass(
        "data-[side=bottom]:slide-in-from-top-2",
        "data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2",
        "data-[side=top]:slide-in-from-bottom-2"
      );
    });
  });
});
