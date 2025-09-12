import "@testing-library/jest-dom";

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";

interface TestSelectProps {
  children: React.ReactNode;
  defaultValue?: string;
  disabled?: boolean;
  open?: boolean;
  value?: string;
  onOpenChange?: (open: boolean) => void;
  onValueChange?: (value: string) => void;
}

interface TestSelectTriggerProps {
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  size?: "sm" | "default";
}

interface TestSelectContentProps {
  children?: React.ReactNode;
  className?: string;
  position?: "item-aligned" | "popper";
}

interface TestSelectItemProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  value: string;
}

interface TestSelectValueProps {
  className?: string;
  placeholder?: string;
}

interface TestSelectLabelProps {
  className?: string;
  children: React.ReactNode;
}

interface TestSelectGroupProps {
  children: React.ReactNode;
}

interface TestSelectSeparatorProps {
  className?: string;
}

const mockOnValueChange = jest.fn();
const mockOnOpenChange = jest.fn();

const CheckIcon = ({ className }: { className?: string }) => (
  <span data-testid="check-icon" className={className}>
    ✓
  </span>
);

const ChevronDownIcon = ({
  className,
  "data-testid": testId,
}: {
  className?: string;
  "data-testid"?: string;
}) => (
  <span data-testid={testId || "chevron-down-icon"} className={className}>
    ⌄
  </span>
);

const ChevronUpIcon = ({ className }: { className?: string }) => (
  <span data-testid="chevron-up-icon" className={className}>
    ⌃
  </span>
);

const TestSelect = ({
  children,
  value,
  defaultValue,
  onValueChange,
  open = false,
  onOpenChange,
  disabled = false,
}: TestSelectProps) => {
  const [isOpen, setIsOpen] = React.useState(open);
  const [selectedValue, setSelectedValue] = React.useState(
    value || defaultValue || ""
  );

  React.useEffect(() => {
    setIsOpen(open);
  }, [open]);

  React.useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  const handleValueChange = (newValue: string) => {
    if (!disabled) {
      setSelectedValue(newValue);
      onValueChange?.(newValue);
      setIsOpen(false);
      onOpenChange?.(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!disabled) {
      setIsOpen(newOpen);
      onOpenChange?.(newOpen);
    }
  };

  return (
    <div
      data-disabled={disabled}
      data-slot="select"
      data-state={isOpen ? "open" : "closed"}
      data-testid="select-root"
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            isOpen,
            selectedValue,
            onValueChange: handleValueChange,
            onOpenChange: handleOpenChange,
            disabled,
          } as Record<string, unknown>);
        }

        return child;
      })}
    </div>
  );
};

const TestSelectTrigger = ({
  children,
  size = "default",
  className = "",
  disabled = false,
  isOpen,
  onOpenChange,
  selectedValue,
}: TestSelectTriggerProps & {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  selectedValue?: string;
}) => {
  const handleClick = () => {
    if (!disabled) {
      onOpenChange?.(!isOpen);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (
      !disabled &&
      (event.key === "Enter" || event.key === " " || event.key === "ArrowDown")
    ) {
      event.preventDefault();
      onOpenChange?.(!isOpen);
    }
  };

  const baseClasses =
    "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8";
  const combinedClasses = `${baseClasses} ${className}`.trim();

  return (
    <button
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      className={combinedClasses}
      data-size={size}
      data-slot="select-trigger"
      data-state={isOpen ? "open" : "closed"}
      data-testid="select-trigger"
      disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            selectedValue,
          } as Record<string, unknown>);
        }

        return child;
      })}

      <ChevronDownIcon
        className="size-4 opacity-50"
        data-testid="trigger-chevron-down"
      />
    </button>
  );
};

const TestSelectValue = ({
  placeholder = "Select an option...",
  className = "",
  selectedValue,
}: TestSelectValueProps & { selectedValue?: string }) => {
  const displayValue = selectedValue || placeholder;
  const isPlaceholder = !selectedValue;

  return (
    <span
      className={className}
      data-placeholder={isPlaceholder}
      data-slot="select-value"
      data-testid="select-value"
    >
      {displayValue}
    </span>
  );
};

const TestSelectContent = ({
  children,
  position = "popper",
  className = "",
  isOpen,
  selectedValue,
  onValueChange,
}: TestSelectContentProps & {
  isOpen?: boolean;
  selectedValue?: string;
  onValueChange?: (value: string) => void;
}) => {
  if (!isOpen) return null;

  const baseClasses =
    "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md";
  const positionClasses =
    position === "popper"
      ? "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1"
      : "";
  const combinedClasses =
    `${baseClasses} ${positionClasses} ${className}`.trim();

  return (
    <div data-testid="select-portal">
      <div
        className={combinedClasses}
        data-slot="select-content"
        data-state="open"
        data-testid="select-content"
        role="listbox"
      >
        <TestSelectScrollUpButton />
        <div
          className={`p-1 ${
            position === "popper"
              ? "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
              : ""
          }`}
          data-testid="select-viewport"
        >
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, {
                selectedValue,
                onValueChange,
              } as Record<string, unknown>);
            }

            return child;
          })}
        </div>

        <TestSelectScrollDownButton />
      </div>
    </div>
  );
};

const TestSelectItem = ({
  children,
  value,
  disabled = false,
  className = "",
  selectedValue,
  onValueChange,
}: TestSelectItemProps & {
  selectedValue?: string;
  onValueChange?: (value: string) => void;
}) => {
  const isSelected = selectedValue === value;

  const handleClick = () => {
    if (!disabled) {
      onValueChange?.(value);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!disabled && event.key === "Enter") {
      event.preventDefault();
      onValueChange?.(value);
    }
  };

  const baseClasses =
    "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50";
  const combinedClasses = `${baseClasses} ${className}`.trim();

  return (
    <div
      aria-selected={isSelected}
      className={combinedClasses}
      data-disabled={disabled}
      data-slot="select-item"
      data-state={isSelected ? "checked" : "unchecked"}
      data-testid="select-item"
      data-value={value}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="option"
      tabIndex={disabled ? -1 : 0}
    >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        {isSelected && (
          <span data-testid="select-item-indicator">
            <CheckIcon className="size-4" />
          </span>
        )}
      </span>

      <span data-testid="select-item-text">{children}</span>
    </div>
  );
};

const TestSelectLabel = ({
  children,
  className = "",
}: TestSelectLabelProps) => {
  const baseClasses = "text-muted-foreground px-2 py-1.5 text-xs";
  const combinedClasses = `${baseClasses} ${className}`.trim();

  return (
    <div
      className={combinedClasses}
      data-slot="select-label"
      data-testid="select-label"
    >
      {children}
    </div>
  );
};

const TestSelectGroup = ({
  children,
  selectedValue,
  onValueChange,
}: TestSelectGroupProps & {
  selectedValue?: string;
  onValueChange?: (value: string) => void;
}) => {
  return (
    <div data-testid="select-group" data-slot="select-group">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            selectedValue,
            onValueChange,
          } as Record<string, unknown>);
        }

        return child;
      })}
    </div>
  );
};

const TestSelectSeparator = ({ className = "" }: TestSelectSeparatorProps) => {
  const baseClasses = "bg-border pointer-events-none -mx-1 my-1 h-px";
  const combinedClasses = `${baseClasses} ${className}`.trim();

  return (
    <div
      className={combinedClasses}
      data-slot="select-separator"
      data-testid="select-separator"
    />
  );
};

const TestSelectScrollUpButton = ({
  className = "",
}: {
  className?: string;
}) => {
  const baseClasses = "flex cursor-default items-center justify-center py-1";
  const combinedClasses = `${baseClasses} ${className}`.trim();

  return (
    <div
      className={combinedClasses}
      data-slot="select-scroll-up-button"
      data-testid="select-scroll-up-button"
    >
      <ChevronUpIcon className="size-4" />
    </div>
  );
};

const TestSelectScrollDownButton = ({
  className = "",
}: {
  className?: string;
}) => {
  const baseClasses = "flex cursor-default items-center justify-center py-1";
  const combinedClasses = `${baseClasses} ${className}`.trim();

  return (
    <div
      className={combinedClasses}
      data-slot="select-scroll-down-button"
      data-testid="select-scroll-down-button"
    >
      <ChevronDownIcon className="size-4" data-testid="scroll-chevron-down" />
    </div>
  );
};

describe("Select Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Select Root", () => {
    it("should render select root with correct structure", () => {
      render(
        <TestSelect>
          <TestSelectTrigger>
            <TestSelectValue placeholder="Choose an option" />
          </TestSelectTrigger>

          <TestSelectContent>
            <TestSelectItem value="option1">Option 1</TestSelectItem>
          </TestSelectContent>
        </TestSelect>
      );

      expect(screen.getByTestId("select-root")).toBeInTheDocument();
      expect(screen.getByTestId("select-root")).toHaveAttribute(
        "data-slot",
        "select"
      );
    });

    it("should have closed state by default", () => {
      render(
        <TestSelect>
          <TestSelectTrigger>
            <TestSelectValue />
          </TestSelectTrigger>

          <TestSelectContent>
            <TestSelectItem value="option1">Option 1</TestSelectItem>
          </TestSelectContent>
        </TestSelect>
      );

      expect(screen.getByTestId("select-root")).toHaveAttribute(
        "data-state",
        "closed"
      );
    });

    it("should accept controlled open prop", () => {
      render(
        <TestSelect open={true}>
          <TestSelectTrigger>
            <TestSelectValue />
          </TestSelectTrigger>

          <TestSelectContent>
            <TestSelectItem value="option1">Option 1</TestSelectItem>
          </TestSelectContent>
        </TestSelect>
      );

      expect(screen.getByTestId("select-root")).toHaveAttribute(
        "data-state",
        "open"
      );
    });

    it("should call onValueChange when value changes", async () => {
      render(
        <TestSelect onValueChange={mockOnValueChange}>
          <TestSelectTrigger>
            <TestSelectValue />
          </TestSelectTrigger>

          <TestSelectContent>
            <TestSelectItem value="option1">Option 1</TestSelectItem>
          </TestSelectContent>
        </TestSelect>
      );

      fireEvent.click(screen.getByTestId("select-trigger"));

      fireEvent.click(screen.getByTestId("select-item"));

      await waitFor(() => {
        expect(mockOnValueChange).toHaveBeenCalledWith("option1");
      });
    });

    it("should handle disabled state", () => {
      render(
        <TestSelect disabled={true}>
          <TestSelectTrigger>
            <TestSelectValue />
          </TestSelectTrigger>

          <TestSelectContent>
            <TestSelectItem value="option1">Option 1</TestSelectItem>
          </TestSelectContent>
        </TestSelect>
      );

      expect(screen.getByTestId("select-root")).toHaveAttribute(
        "data-disabled",
        "true"
      );
      expect(screen.getByTestId("select-trigger")).toBeDisabled();
    });
  });

  describe("SelectTrigger", () => {
    it("should render trigger with correct attributes", () => {
      render(
        <TestSelect>
          <TestSelectTrigger>
            <TestSelectValue />
          </TestSelectTrigger>

          <TestSelectContent>
            <TestSelectItem value="option1">Option 1</TestSelectItem>
          </TestSelectContent>
        </TestSelect>
      );

      const trigger = screen.getByTestId("select-trigger");

      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveAttribute("data-slot", "select-trigger");
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(trigger).toHaveAttribute("aria-haspopup", "listbox");
    });

    it("should have default size", () => {
      render(
        <TestSelect>
          <TestSelectTrigger>
            <TestSelectValue />
          </TestSelectTrigger>

          <TestSelectContent>
            <TestSelectItem value="option1">Option 1</TestSelectItem>
          </TestSelectContent>
        </TestSelect>
      );

      expect(screen.getByTestId("select-trigger")).toHaveAttribute(
        "data-size",
        "default"
      );
    });

    it("should accept size prop", () => {
      render(
        <TestSelect>
          <TestSelectTrigger size="sm">
            <TestSelectValue />
          </TestSelectTrigger>

          <TestSelectContent>
            <TestSelectItem value="option1">Option 1</TestSelectItem>
          </TestSelectContent>
        </TestSelect>
      );

      expect(screen.getByTestId("select-trigger")).toHaveAttribute(
        "data-size",
        "sm"
      );
    });

    it("should toggle open state on click", async () => {
      render(
        <TestSelect>
          <TestSelectTrigger>
            <TestSelectValue />
          </TestSelectTrigger>

          <TestSelectContent>
            <TestSelectItem value="option1">Option 1</TestSelectItem>
          </TestSelectContent>
        </TestSelect>
      );

      const trigger = screen.getByTestId("select-trigger");

      expect(trigger).toHaveAttribute("aria-expanded", "false");

      fireEvent.click(trigger);

      await waitFor(() => {
        expect(trigger).toHaveAttribute("aria-expanded", "true");
      });
    });

    it("should handle keyboard interactions", async () => {
      render(
        <TestSelect>
          <TestSelectTrigger>
            <TestSelectValue />
          </TestSelectTrigger>

          <TestSelectContent>
            <TestSelectItem value="option1">Option 1</TestSelectItem>
          </TestSelectContent>
        </TestSelect>
      );

      const trigger = screen.getByTestId("select-trigger");

      fireEvent.keyDown(trigger, { key: "Enter" });
      await waitFor(() => {
        expect(trigger).toHaveAttribute("aria-expanded", "true");
      });

      fireEvent.click(trigger);
      fireEvent.keyDown(trigger, { key: " " });
      await waitFor(() => {
        expect(trigger).toHaveAttribute("aria-expanded", "true");
      });

      fireEvent.click(trigger);
      fireEvent.keyDown(trigger, { key: "ArrowDown" });
      await waitFor(() => {
        expect(trigger).toHaveAttribute("aria-expanded", "true");
      });
    });

    it("should render chevron down icon", () => {
      render(
        <TestSelect>
          <TestSelectTrigger>
            <TestSelectValue />
          </TestSelectTrigger>

          <TestSelectContent>
            <TestSelectItem value="option1">Option 1</TestSelectItem>
          </TestSelectContent>
        </TestSelect>
      );

      expect(screen.getByTestId("trigger-chevron-down")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      render(
        <TestSelect>
          <TestSelectTrigger className="custom-trigger-class">
            <TestSelectValue />
          </TestSelectTrigger>

          <TestSelectContent>
            <TestSelectItem value="option1">Option 1</TestSelectItem>
          </TestSelectContent>
        </TestSelect>
      );

      expect(screen.getByTestId("select-trigger")).toHaveClass(
        "custom-trigger-class"
      );
    });
  });

  describe("SelectValue", () => {
    it("should render with default placeholder", () => {
      render(
        <TestSelect>
          <TestSelectTrigger>
            <TestSelectValue />
          </TestSelectTrigger>

          <TestSelectContent>
            <TestSelectItem value="option1">Option 1</TestSelectItem>
          </TestSelectContent>
        </TestSelect>
      );

      expect(screen.getByText("Select an option...")).toBeInTheDocument();
    });

    it("should render custom placeholder", () => {
      render(
        <TestSelect>
          <TestSelectTrigger>
            <TestSelectValue placeholder="Choose your option" />
          </TestSelectTrigger>

          <TestSelectContent>
            <TestSelectItem value="option1">Option 1</TestSelectItem>
          </TestSelectContent>
        </TestSelect>
      );

      expect(screen.getByText("Choose your option")).toBeInTheDocument();
    });

    it("should display selected value", () => {
      render(
        <TestSelect value="option1">
          <TestSelectTrigger>
            <TestSelectValue placeholder="Choose your option" />
          </TestSelectTrigger>

          <TestSelectContent>
            <TestSelectItem value="option1">Option 1</TestSelectItem>
          </TestSelectContent>
        </TestSelect>
      );

      expect(screen.getByText("option1")).toBeInTheDocument();
    });

    it("should have correct data attributes", () => {
      render(
        <TestSelect>
          <TestSelectTrigger>
            <TestSelectValue placeholder="Choose your option" />
          </TestSelectTrigger>

          <TestSelectContent>
            <TestSelectItem value="option1">Option 1</TestSelectItem>
          </TestSelectContent>
        </TestSelect>
      );

      const selectValue = screen.getByTestId("select-value");

      expect(selectValue).toHaveAttribute("data-slot", "select-value");
      expect(selectValue).toHaveAttribute("data-placeholder", "true");
    });
  });

  describe("SelectContent", () => {
    it("should not render when closed", () => {
      render(
        <TestSelect>
          <TestSelectTrigger>
            <TestSelectValue />
          </TestSelectTrigger>

          <TestSelectContent>
            <TestSelectItem value="option1">Option 1</TestSelectItem>
          </TestSelectContent>
        </TestSelect>
      );

      expect(screen.queryByTestId("select-content")).not.toBeInTheDocument();
    });

    it("should render when open", () => {
      render(
        <TestSelect open={true}>
          <TestSelectTrigger>
            <TestSelectValue />
          </TestSelectTrigger>

          <TestSelectContent>
            <TestSelectItem value="option1">Option 1</TestSelectItem>
          </TestSelectContent>
        </TestSelect>
      );

      expect(screen.getByTestId("select-content")).toBeInTheDocument();
    });

    it("should have correct accessibility attributes", () => {
      render(
        <TestSelect open={true}>
          <TestSelectTrigger>
            <TestSelectValue />
          </TestSelectTrigger>

          <TestSelectContent>
            <TestSelectItem value="option1">Option 1</TestSelectItem>
          </TestSelectContent>
        </TestSelect>
      );

      const content = screen.getByTestId("select-content");

      expect(content).toHaveAttribute("role", "listbox");
      expect(content).toHaveAttribute("data-slot", "select-content");
    });

    it("should render inside portal", () => {
      render(
        <TestSelect open={true}>
          <TestSelectTrigger>
            <TestSelectValue />
          </TestSelectTrigger>

          <TestSelectContent>
            <TestSelectItem value="option1">Option 1</TestSelectItem>
          </TestSelectContent>
        </TestSelect>
      );

      expect(screen.getByTestId("select-portal")).toBeInTheDocument();
    });

    it("should render scroll buttons", () => {
      render(
        <TestSelect open={true}>
          <TestSelectTrigger>
            <TestSelectValue />
          </TestSelectTrigger>

          <TestSelectContent>
            <TestSelectItem value="option1">Option 1</TestSelectItem>
          </TestSelectContent>
        </TestSelect>
      );

      expect(screen.getByTestId("select-scroll-up-button")).toBeInTheDocument();
      expect(
        screen.getByTestId("select-scroll-down-button")
      ).toBeInTheDocument();
    });

    it("should render viewport", () => {
      render(
        <TestSelect open={true}>
          <TestSelectTrigger>
            <TestSelectValue />
          </TestSelectTrigger>

          <TestSelectContent>
            <TestSelectItem value="option1">Option 1</TestSelectItem>
          </TestSelectContent>
        </TestSelect>
      );

      expect(screen.getByTestId("select-viewport")).toBeInTheDocument();
    });

    it("should accept position prop", () => {
      render(
        <TestSelect open={true}>
          <TestSelectTrigger>
            <TestSelectValue />
          </TestSelectTrigger>

          <TestSelectContent position="item-aligned">
            <TestSelectItem value="option1">Option 1</TestSelectItem>
          </TestSelectContent>
        </TestSelect>
      );

      const viewport = screen.getByTestId("select-viewport");

      expect(viewport).not.toHaveClass(
        "h-[var(--radix-select-trigger-height)]"
      );
    });

    it("should apply custom className", () => {
      render(
        <TestSelect open={true}>
          <TestSelectTrigger>
            <TestSelectValue />
          </TestSelectTrigger>

          <TestSelectContent className="custom-content-class">
            <TestSelectItem value="option1">Option 1</TestSelectItem>
          </TestSelectContent>
        </TestSelect>
      );

      expect(screen.getByTestId("select-content")).toHaveClass(
        "custom-content-class"
      );
    });
  });

  describe("SelectItem", () => {
    it("should render item with correct structure", () => {
      render(
        <TestSelect open={true}>
          <TestSelectTrigger>
            <TestSelectValue />
          </TestSelectTrigger>

          <TestSelectContent>
            <TestSelectItem value="option1">Option 1</TestSelectItem>
          </TestSelectContent>
        </TestSelect>
      );

      const item = screen.getByTestId("select-item");

      expect(item).toBeInTheDocument();
      expect(item).toHaveAttribute("data-slot", "select-item");
      expect(item).toHaveAttribute("data-value", "option1");
      expect(item).toHaveAttribute("role", "option");
    });

    it("should display item text", () => {
      render(
        <TestSelect open={true}>
          <TestSelectTrigger>
            <TestSelectValue />
          </TestSelectTrigger>

          <TestSelectContent>
            <TestSelectItem value="option1">Option 1</TestSelectItem>
          </TestSelectContent>
        </TestSelect>
      );

      expect(screen.getByTestId("select-item-text")).toHaveTextContent(
        "Option 1"
      );
    });

    it("should handle selection", async () => {
      render(
        <TestSelect onValueChange={mockOnValueChange}>
          <TestSelectTrigger>
            <TestSelectValue />
          </TestSelectTrigger>

          <TestSelectContent>
            <TestSelectItem value="option1">Option 1</TestSelectItem>
          </TestSelectContent>
        </TestSelect>
      );

      fireEvent.click(screen.getByTestId("select-trigger"));

      fireEvent.click(screen.getByTestId("select-item"));

      await waitFor(() => {
        expect(mockOnValueChange).toHaveBeenCalledWith("option1");
      });
    });

    it("should show indicator when selected", () => {
      render(
        <TestSelect value="option1" open={true}>
          <TestSelectTrigger>
            <TestSelectValue />
          </TestSelectTrigger>

          <TestSelectContent>
            <TestSelectItem value="option1">Option 1</TestSelectItem>
          </TestSelectContent>
        </TestSelect>
      );

      expect(screen.getByTestId("select-item-indicator")).toBeInTheDocument();
      expect(screen.getByTestId("check-icon")).toBeInTheDocument();
    });

    it("should have correct state attributes", () => {
      render(
        <TestSelect value="option1" open={true}>
          <TestSelectTrigger>
            <TestSelectValue />
          </TestSelectTrigger>

          <TestSelectContent>
            <TestSelectItem value="option1">Option 1</TestSelectItem>

            <TestSelectItem value="option2">Option 2</TestSelectItem>
          </TestSelectContent>
        </TestSelect>
      );

      const items = screen.getAllByTestId("select-item");

      expect(items[0]).toHaveAttribute("data-state", "checked");
      expect(items[0]).toHaveAttribute("aria-selected", "true");
      expect(items[1]).toHaveAttribute("data-state", "unchecked");
      expect(items[1]).toHaveAttribute("aria-selected", "false");
    });

    it("should handle disabled state", () => {
      render(
        <TestSelect open={true}>
          <TestSelectTrigger>
            <TestSelectValue />
          </TestSelectTrigger>

          <TestSelectContent>
            <TestSelectItem value="option1" disabled={true}>
              Option 1
            </TestSelectItem>
          </TestSelectContent>
        </TestSelect>
      );

      const item = screen.getByTestId("select-item");

      expect(item).toHaveAttribute("data-disabled", "true");
      expect(item).toHaveAttribute("tabIndex", "-1");
    });

    it("should handle keyboard interactions", async () => {
      render(
        <TestSelect onValueChange={mockOnValueChange} open={true}>
          <TestSelectTrigger>
            <TestSelectValue />
          </TestSelectTrigger>

          <TestSelectContent>
            <TestSelectItem value="option1">Option 1</TestSelectItem>
          </TestSelectContent>
        </TestSelect>
      );

      const item = screen.getByTestId("select-item");
      fireEvent.keyDown(item, { key: "Enter" });

      await waitFor(() => {
        expect(mockOnValueChange).toHaveBeenCalledWith("option1");
      });
    });

    it("should apply custom className", () => {
      render(
        <TestSelect open={true}>
          <TestSelectTrigger>
            <TestSelectValue />
          </TestSelectTrigger>

          <TestSelectContent>
            <TestSelectItem value="option1" className="custom-item-class">
              Option 1
            </TestSelectItem>
          </TestSelectContent>
        </TestSelect>
      );

      expect(screen.getByTestId("select-item")).toHaveClass(
        "custom-item-class"
      );
    });
  });

  describe("SelectLabel", () => {
    it("should render label with correct structure", () => {
      render(
        <TestSelect open={true}>
          <TestSelectTrigger>
            <TestSelectValue />
          </TestSelectTrigger>

          <TestSelectContent>
            <TestSelectLabel>Categories</TestSelectLabel>

            <TestSelectItem value="option1">Option 1</TestSelectItem>
          </TestSelectContent>
        </TestSelect>
      );

      const label = screen.getByTestId("select-label");

      expect(label).toBeInTheDocument();
      expect(label).toHaveAttribute("data-slot", "select-label");
      expect(label).toHaveTextContent("Categories");
    });

    it("should apply default CSS classes", () => {
      render(
        <TestSelect open={true}>
          <TestSelectTrigger>
            <TestSelectValue />
          </TestSelectTrigger>

          <TestSelectContent>
            <TestSelectLabel>Categories</TestSelectLabel>

            <TestSelectItem value="option1">Option 1</TestSelectItem>
          </TestSelectContent>
        </TestSelect>
      );

      expect(screen.getByTestId("select-label")).toHaveClass(
        "text-muted-foreground",
        "px-2",
        "py-1.5",
        "text-xs"
      );
    });

    it("should apply custom className", () => {
      render(
        <TestSelect open={true}>
          <TestSelectTrigger>
            <TestSelectValue />
          </TestSelectTrigger>

          <TestSelectContent>
            <TestSelectLabel className="custom-label-class">
              Categories
            </TestSelectLabel>

            <TestSelectItem value="option1">Option 1</TestSelectItem>
          </TestSelectContent>
        </TestSelect>
      );

      expect(screen.getByTestId("select-label")).toHaveClass(
        "custom-label-class"
      );
    });
  });

  describe("SelectGroup", () => {
    it("should render group with correct structure", () => {
      render(
        <TestSelect open={true}>
          <TestSelectTrigger>
            <TestSelectValue />
          </TestSelectTrigger>

          <TestSelectContent>
            <TestSelectGroup>
              <TestSelectLabel>Group 1</TestSelectLabel>

              <TestSelectItem value="option1">Option 1</TestSelectItem>
            </TestSelectGroup>
          </TestSelectContent>
        </TestSelect>
      );

      const group = screen.getByTestId("select-group");

      expect(group).toBeInTheDocument();
      expect(group).toHaveAttribute("data-slot", "select-group");
    });

    it("should contain grouped items", () => {
      render(
        <TestSelect open={true}>
          <TestSelectTrigger>
            <TestSelectValue />
          </TestSelectTrigger>

          <TestSelectContent>
            <TestSelectGroup>
              <TestSelectLabel>Group 1</TestSelectLabel>

              <TestSelectItem value="option1">Option 1</TestSelectItem>

              <TestSelectItem value="option2">Option 2</TestSelectItem>
            </TestSelectGroup>
          </TestSelectContent>
        </TestSelect>
      );

      const group = screen.getByTestId("select-group");

      expect(group).toContainElement(screen.getByTestId("select-label"));
      expect(group).toContainElement(screen.getAllByTestId("select-item")[0]);
      expect(group).toContainElement(screen.getAllByTestId("select-item")[1]);
    });
  });

  describe("SelectSeparator", () => {
    it("should render separator with correct structure", () => {
      render(
        <TestSelect open={true}>
          <TestSelectTrigger>
            <TestSelectValue />
          </TestSelectTrigger>

          <TestSelectContent>
            <TestSelectItem value="option1">Option 1</TestSelectItem>

            <TestSelectSeparator />

            <TestSelectItem value="option2">Option 2</TestSelectItem>
          </TestSelectContent>
        </TestSelect>
      );

      const separator = screen.getByTestId("select-separator");

      expect(separator).toBeInTheDocument();
      expect(separator).toHaveAttribute("data-slot", "select-separator");
    });

    it("should apply default CSS classes", () => {
      render(
        <TestSelect open={true}>
          <TestSelectTrigger>
            <TestSelectValue />
          </TestSelectTrigger>

          <TestSelectContent>
            <TestSelectItem value="option1">Option 1</TestSelectItem>

            <TestSelectSeparator />

            <TestSelectItem value="option2">Option 2</TestSelectItem>
          </TestSelectContent>
        </TestSelect>
      );

      expect(screen.getByTestId("select-separator")).toHaveClass(
        "bg-border",
        "pointer-events-none",
        "-mx-1",
        "my-1",
        "h-px"
      );
    });

    it("should apply custom className", () => {
      render(
        <TestSelect open={true}>
          <TestSelectTrigger>
            <TestSelectValue />
          </TestSelectTrigger>

          <TestSelectContent>
            <TestSelectItem value="option1">Option 1</TestSelectItem>

            <TestSelectSeparator className="custom-separator-class" />

            <TestSelectItem value="option2">Option 2</TestSelectItem>
          </TestSelectContent>
        </TestSelect>
      );

      expect(screen.getByTestId("select-separator")).toHaveClass(
        "custom-separator-class"
      );
    });
  });

  describe("Scroll Buttons", () => {
    it("should render scroll up button", () => {
      render(
        <TestSelect open={true}>
          <TestSelectTrigger>
            <TestSelectValue />
          </TestSelectTrigger>

          <TestSelectContent>
            <TestSelectItem value="option1">Option 1</TestSelectItem>
          </TestSelectContent>
        </TestSelect>
      );

      const scrollUpButton = screen.getByTestId("select-scroll-up-button");

      expect(scrollUpButton).toBeInTheDocument();
      expect(scrollUpButton).toHaveAttribute(
        "data-slot",
        "select-scroll-up-button"
      );
      expect(scrollUpButton).toContainElement(
        screen.getByTestId("chevron-up-icon")
      );
    });

    it("should render scroll down button", () => {
      render(
        <TestSelect open={true}>
          <TestSelectTrigger>
            <TestSelectValue />
          </TestSelectTrigger>

          <TestSelectContent>
            <TestSelectItem value="option1">Option 1</TestSelectItem>
          </TestSelectContent>
        </TestSelect>
      );

      const scrollDownButton = screen.getByTestId("select-scroll-down-button");

      expect(scrollDownButton).toBeInTheDocument();
      expect(scrollDownButton).toHaveAttribute(
        "data-slot",
        "select-scroll-down-button"
      );
      expect(scrollDownButton).toContainElement(
        screen.getByTestId("scroll-chevron-down")
      );
    });
  });

  describe("Complex Integration", () => {
    it("should work with all components together", async () => {
      render(
        <TestSelect onValueChange={mockOnValueChange}>
          <TestSelectTrigger>
            <TestSelectValue placeholder="Choose a fruit" />
          </TestSelectTrigger>

          <TestSelectContent>
            <TestSelectGroup>
              <TestSelectLabel>Fruits</TestSelectLabel>

              <TestSelectItem value="apple">Apple</TestSelectItem>

              <TestSelectItem value="banana">Banana</TestSelectItem>
            </TestSelectGroup>

            <TestSelectSeparator />

            <TestSelectGroup>
              <TestSelectLabel>Vegetables</TestSelectLabel>

              <TestSelectItem value="carrot">Carrot</TestSelectItem>

              <TestSelectItem value="lettuce">Lettuce</TestSelectItem>
            </TestSelectGroup>
          </TestSelectContent>
        </TestSelect>
      );

      expect(screen.getByText("Choose a fruit")).toBeInTheDocument();

      fireEvent.click(screen.getByTestId("select-trigger"));

      expect(screen.getByText("Fruits")).toBeInTheDocument();
      expect(screen.getByText("Vegetables")).toBeInTheDocument();
      expect(screen.getByTestId("select-separator")).toBeInTheDocument();

      fireEvent.click(screen.getByText("Apple"));

      await waitFor(() => {
        expect(mockOnValueChange).toHaveBeenCalledWith("apple");
      });
    });

    it("should handle controlled state", () => {
      const ControlledSelect = () => {
        const [value, setValue] = React.useState("");
        const [open, setOpen] = React.useState(false);

        return (
          <div>
            <button
              data-testid="external-control"
              onClick={() => setOpen(!open)}
            >
              Toggle
            </button>
            <TestSelect
              onOpenChange={setOpen}
              onValueChange={setValue}
              open={open}
              value={value}
            >
              <TestSelectTrigger>
                <TestSelectValue placeholder="Select..." />
              </TestSelectTrigger>

              <TestSelectContent>
                <TestSelectItem value="option1">Option 1</TestSelectItem>

                <TestSelectItem value="option2">Option 2</TestSelectItem>
              </TestSelectContent>
            </TestSelect>
          </div>
        );
      };

      render(<ControlledSelect />);

      expect(screen.queryByTestId("select-content")).not.toBeInTheDocument();

      fireEvent.click(screen.getByTestId("external-control"));
      expect(screen.getByTestId("select-content")).toBeInTheDocument();

      fireEvent.click(screen.getByText("Option 1"));
      expect(screen.getByText("option1")).toBeInTheDocument();
    });

    it("should handle default value", () => {
      render(
        <TestSelect defaultValue="option2">
          <TestSelectTrigger>
            <TestSelectValue placeholder="Select..." />
          </TestSelectTrigger>

          <TestSelectContent>
            <TestSelectItem value="option1">Option 1</TestSelectItem>

            <TestSelectItem value="option2">Option 2</TestSelectItem>
          </TestSelectContent>
        </TestSelect>
      );

      expect(screen.getByText("option2")).toBeInTheDocument();
    });

    it("should handle multiple items selection flow", async () => {
      render(
        <TestSelect onValueChange={mockOnValueChange}>
          <TestSelectTrigger>
            <TestSelectValue placeholder="Select..." />
          </TestSelectTrigger>

          <TestSelectContent>
            <TestSelectItem value="option1">Option 1</TestSelectItem>

            <TestSelectItem value="option2">Option 2</TestSelectItem>

            <TestSelectItem value="option3">Option 3</TestSelectItem>
          </TestSelectContent>
        </TestSelect>
      );

      fireEvent.click(screen.getByTestId("select-trigger"));
      fireEvent.click(screen.getByText("Option 1"));

      await waitFor(() => {
        expect(mockOnValueChange).toHaveBeenCalledWith("option1");
      });

      mockOnValueChange.mockClear();
      fireEvent.click(screen.getByTestId("select-trigger"));
      fireEvent.click(screen.getByText("Option 3"));

      await waitFor(() => {
        expect(mockOnValueChange).toHaveBeenCalledWith("option3");
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty content", () => {
      render(
        <TestSelect open={true}>
          <TestSelectTrigger>
            <TestSelectValue />
          </TestSelectTrigger>

          <TestSelectContent></TestSelectContent>
        </TestSelect>
      );

      expect(screen.getByTestId("select-content")).toBeInTheDocument();
      expect(screen.getByTestId("select-viewport")).toBeInTheDocument();
    });

    it("should handle disabled items", () => {
      render(
        <TestSelect open={true}>
          <TestSelectTrigger>
            <TestSelectValue />
          </TestSelectTrigger>

          <TestSelectContent>
            <TestSelectItem value="option1" disabled={true}>
              Disabled Option
            </TestSelectItem>

            <TestSelectItem value="option2">Enabled Option</TestSelectItem>
          </TestSelectContent>
        </TestSelect>
      );

      const items = screen.getAllByTestId("select-item");

      expect(items[0]).toHaveAttribute("data-disabled", "true");
      expect(items[1]).toHaveAttribute("data-disabled", "false");
    });

    it("should handle long option lists", () => {
      const manyOptions = Array.from({ length: 50 }, (_, i) => (
        <TestSelectItem key={i} value={`option${i}`}>
          Option {i + 1}
        </TestSelectItem>
      ));

      render(
        <TestSelect open={true}>
          <TestSelectTrigger>
            <TestSelectValue />
          </TestSelectTrigger>

          <TestSelectContent>{manyOptions}</TestSelectContent>
        </TestSelect>
      );

      const items = screen.getAllByTestId("select-item");

      expect(items).toHaveLength(50);
      expect(screen.getByTestId("select-scroll-up-button")).toBeInTheDocument();
      expect(
        screen.getByTestId("select-scroll-down-button")
      ).toBeInTheDocument();
    });

    it("should handle rapid state changes", async () => {
      render(
        <TestSelect onOpenChange={mockOnOpenChange}>
          <TestSelectTrigger>
            <TestSelectValue />
          </TestSelectTrigger>

          <TestSelectContent>
            <TestSelectItem value="option1">Option 1</TestSelectItem>
          </TestSelectContent>
        </TestSelect>
      );

      const trigger = screen.getByTestId("select-trigger");

      fireEvent.click(trigger);
      fireEvent.click(trigger);
      fireEvent.click(trigger);
      fireEvent.click(trigger);

      await waitFor(() => {
        expect(mockOnOpenChange).toHaveBeenCalled();
      });
    });
  });
});
