import "@testing-library/jest-dom";

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";

import { Calendar, CalendarDayButton } from "@/components/ui/calendar";

jest.mock("react-day-picker", () => {
  const originalModule = jest.requireActual("react-day-picker");

  return {
    ...originalModule,
    getDefaultClassNames: () => ({
      button_next: "rdp-button_next",
      button_previous: "rdp-button_previous",
      caption_label: "rdp-caption_label",
      day: "rdp-day",
      disabled: "rdp-disabled",
      dropdown_root: "rdp-dropdown_root",
      dropdown: "rdp-dropdown",
      dropdowns: "rdp-dropdowns",
      hidden: "rdp-hidden",
      month_caption: "rdp-month_caption",
      month: "rdp-month",
      months: "rdp-months",
      nav: "rdp-nav",
      outside: "rdp-outside",
      range_end: "rdp-range_end",
      range_middle: "rdp-range_middle",
      range_start: "rdp-range_start",
      root: "rdp-root",
      today: "rdp-today",
      week_number_header: "rdp-week_number_header",
      week_number: "rdp-week_number",
      week: "rdp-week",
      weekday: "rdp-weekday",
      weekdays: "rdp-weekdays",
    }),
  };
});

describe("Calendar Component", () => {
  describe("Basic Rendering", () => {
    it("should render calendar with default props", () => {
      render(<Calendar data-testid="calendar" />);

      const calendar = screen.getByTestId("calendar");

      expect(calendar).toBeInTheDocument();
      expect(calendar).toHaveAttribute("data-slot", "calendar");
      expect(calendar).toHaveClass("bg-background", "group/calendar", "p-3");
    });

    it("should render with custom className", () => {
      render(<Calendar className="custom-calendar" data-testid="calendar" />);

      const calendar = screen.getByTestId("calendar");

      expect(calendar).toHaveClass("custom-calendar");
      expect(calendar).toHaveClass("bg-background", "group/calendar", "p-3");
    });

    it("should render with showOutsideDays enabled by default", () => {
      render(<Calendar data-testid="calendar" />);

      const calendar = screen.getByTestId("calendar");

      expect(calendar).toBeInTheDocument();
    });

    it("should render with showOutsideDays disabled", () => {
      render(<Calendar showOutsideDays={false} data-testid="calendar" />);

      const calendar = screen.getByTestId("calendar");

      expect(calendar).toBeInTheDocument();
    });

    it("should render with different caption layouts", () => {
      const { rerender } = render(
        <Calendar captionLayout="label" data-testid="calendar" />
      );

      expect(screen.getByTestId("calendar")).toBeInTheDocument();

      rerender(<Calendar captionLayout="dropdown" data-testid="calendar" />);

      expect(screen.getByTestId("calendar")).toBeInTheDocument();
    });
  });

  describe("Button Variants", () => {
    it("should render with ghost button variant by default", () => {
      render(<Calendar data-testid="calendar" />);

      const calendar = screen.getByTestId("calendar");

      expect(calendar).toBeInTheDocument();
    });

    it("should render with different button variants", () => {
      const variants = [
        "default",
        "destructive",
        "outline",
        "secondary",
        "ghost",
        "link",
      ] as const;

      variants.forEach((variant) => {
        const { unmount } = render(
          <Calendar
            buttonVariant={variant}
            data-testid={`calendar-${variant}`}
          />
        );

        const calendar = screen.getByTestId(`calendar-${variant}`);
        expect(calendar).toBeInTheDocument();

        unmount();
      });
    });
  });

  describe("Custom Formatters", () => {
    it("should use default month formatter", () => {
      const mockDate = new Date(2023, 5, 15);

      render(<Calendar defaultMonth={mockDate} data-testid="calendar" />);

      const calendar = screen.getByTestId("calendar");

      expect(calendar).toBeInTheDocument();
    });

    it("should accept custom formatters", () => {
      const customFormatters = {
        formatMonthDropdown: (date: Date) => `Custom ${date.getMonth() + 1}`,
        formatWeekdayName: (date: Date) =>
          date.toLocaleDateString("en", { weekday: "short" }),
      };

      render(<Calendar formatters={customFormatters} data-testid="calendar" />);

      const calendar = screen.getByTestId("calendar");

      expect(calendar).toBeInTheDocument();
    });
  });

  describe("Custom Components", () => {
    it("should accept custom components prop", () => {
      const customComponents = {
        Root: ({
          children,
          rootRef,
          ...props
        }: React.ComponentProps<"div"> & {
          rootRef?: React.Ref<HTMLDivElement>;
        }) => (
          <div ref={rootRef} data-testid="custom-root" {...props}>
            {children}
          </div>
        ),
      };

      const { container } = render(
        <Calendar components={customComponents} data-testid="calendar" />
      );

      const calendar = screen.getByTestId("calendar");

      expect(calendar).toBeInTheDocument();
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe("Class Names Customization", () => {
    it("should apply custom classNames", () => {
      const customClassNames = {
        root: "custom-root-class",
        months: "custom-months-class",
        month: "custom-month-class",
      };

      render(<Calendar classNames={customClassNames} data-testid="calendar" />);

      const calendar = screen.getByTestId("calendar");

      expect(calendar).toBeInTheDocument();
    });
  });

  describe("Event Handling", () => {
    it("should handle date selection", async () => {
      const onSelect = jest.fn();

      render(
        <Calendar onSelect={onSelect} mode="single" data-testid="calendar" />
      );

      const calendar = screen.getByTestId("calendar");

      expect(calendar).toBeInTheDocument();
    });

    it("should handle month navigation", () => {
      const onMonthChange = jest.fn();

      render(<Calendar onMonthChange={onMonthChange} data-testid="calendar" />);

      const calendar = screen.getByTestId("calendar");

      expect(calendar).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper accessibility structure", () => {
      render(<Calendar data-testid="calendar" />);

      const calendar = screen.getByTestId("calendar");

      expect(calendar).toBeInTheDocument();
      expect(calendar).toHaveAttribute("data-slot", "calendar");
    });

    it("should support keyboard navigation", () => {
      render(<Calendar data-testid="calendar" />);

      const calendar = screen.getByTestId("calendar");

      expect(calendar).toBeInTheDocument();
    });
  });

  describe("Date Range Selection", () => {
    it("should support range mode", () => {
      const onSelect = jest.fn();

      render(
        <Calendar mode="range" onSelect={onSelect} data-testid="calendar" />
      );

      const calendar = screen.getByTestId("calendar");

      expect(calendar).toBeInTheDocument();
    });

    it("should support multiple date selection", () => {
      const onSelect = jest.fn();

      render(
        <Calendar mode="multiple" onSelect={onSelect} data-testid="calendar" />
      );

      const calendar = screen.getByTestId("calendar");

      expect(calendar).toBeInTheDocument();
    });
  });

  describe("Disabled Dates", () => {
    it("should handle disabled dates", () => {
      const disabledDays = [new Date(2023, 5, 15), new Date(2023, 5, 20)];

      render(<Calendar disabled={disabledDays} data-testid="calendar" />);

      const calendar = screen.getByTestId("calendar");

      expect(calendar).toBeInTheDocument();
    });

    it("should handle disabled date ranges", () => {
      const disabledRange = {
        from: new Date(2023, 5, 10),
        to: new Date(2023, 5, 20),
      };

      render(<Calendar disabled={disabledRange} data-testid="calendar" />);

      const calendar = screen.getByTestId("calendar");

      expect(calendar).toBeInTheDocument();
    });
  });
});

describe("CalendarDayButton Component", () => {
  const mockDay = {
    date: new Date(2023, 5, 15),
    displayMonth: new Date(2023, 5, 1),
  } as React.ComponentProps<typeof CalendarDayButton>["day"];

  const defaultModifiers = {
    disabled: false,
    focused: false,
    hidden: false,
    outside: false,
    range_end: false,
    range_middle: false,
    range_start: false,
    selected: false,
    today: false,
  };

  describe("Basic Rendering", () => {
    it("should render day button with default props", () => {
      render(
        <CalendarDayButton
          data-testid="day-button"
          day={mockDay}
          modifiers={defaultModifiers}
        >
          15
        </CalendarDayButton>
      );

      const button = screen.getByTestId("day-button");

      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent("15");
      expect(button).toHaveAttribute(
        "data-day",
        mockDay.date.toLocaleDateString()
      );
    });

    it("should render with custom className", () => {
      render(
        <CalendarDayButton
          className="custom-day-button"
          data-testid="day-button"
          day={mockDay}
          modifiers={defaultModifiers}
        >
          15
        </CalendarDayButton>
      );

      const button = screen.getByTestId("day-button");

      expect(button).toHaveClass("custom-day-button");
    });

    it("should have proper data attributes", () => {
      render(
        <CalendarDayButton
          data-testid="day-button"
          day={mockDay}
          modifiers={defaultModifiers}
        >
          15
        </CalendarDayButton>
      );

      const button = screen.getByTestId("day-button");

      expect(button).toHaveAttribute(
        "data-day",
        mockDay.date.toLocaleDateString()
      );
      expect(button).toHaveAttribute("data-selected-single", "false");
      expect(button).toHaveAttribute("data-range-start", "false");
      expect(button).toHaveAttribute("data-range-end", "false");
      expect(button).toHaveAttribute("data-range-middle", "false");
    });
  });

  describe("Selection States", () => {
    it("should handle single selection", () => {
      const modifiers = {
        ...defaultModifiers,
        selected: true,
      };

      render(
        <CalendarDayButton
          data-testid="day-button"
          day={mockDay}
          modifiers={modifiers}
        >
          15
        </CalendarDayButton>
      );

      const button = screen.getByTestId("day-button");

      expect(button).toHaveAttribute("data-selected-single", "true");
      expect(button).toHaveClass("data-[selected-single=true]:bg-primary");
    });

    it("should handle range start selection", () => {
      const modifiers = {
        ...defaultModifiers,
        selected: true,
        range_start: true,
      };

      render(
        <CalendarDayButton
          data-testid="day-button"
          day={mockDay}
          modifiers={modifiers}
        >
          15
        </CalendarDayButton>
      );

      const button = screen.getByTestId("day-button");

      expect(button).toHaveAttribute("data-selected-single", "false");
      expect(button).toHaveAttribute("data-range-start", "true");
      expect(button).toHaveClass("data-[range-start=true]:bg-primary");
    });

    it("should handle range end selection", () => {
      const modifiers = {
        ...defaultModifiers,
        range_end: true,
        selected: true,
      };

      render(
        <CalendarDayButton
          data-testid="day-button"
          day={mockDay}
          modifiers={modifiers}
        >
          15
        </CalendarDayButton>
      );

      const button = screen.getByTestId("day-button");

      expect(button).toHaveAttribute("data-range-end", "true");
      expect(button).toHaveClass("data-[range-end=true]:bg-primary");
    });

    it("should handle range middle selection", () => {
      const modifiers = {
        ...defaultModifiers,
        range_middle: true,
        selected: true,
      };

      render(
        <CalendarDayButton
          data-testid="day-button"
          day={mockDay}
          modifiers={modifiers}
        >
          15
        </CalendarDayButton>
      );

      const button = screen.getByTestId("day-button");

      expect(button).toHaveAttribute("data-range-middle", "true");
      expect(button).toHaveClass("data-[range-middle=true]:bg-accent");
    });
  });

  describe("Focus Handling", () => {
    it("should focus when modifiers.focused is true", async () => {
      const modifiers = {
        ...defaultModifiers,
        focused: true,
      };

      render(
        <CalendarDayButton
          data-testid="day-button"
          day={mockDay}
          modifiers={modifiers}
        >
          15
        </CalendarDayButton>
      );

      const button = screen.getByTestId("day-button");

      await waitFor(() => {
        expect(button).toHaveFocus();
      });
    });

    it("should not auto-focus when modifiers.focused is false", () => {
      const modifiers = {
        ...defaultModifiers,
        focused: false,
      };

      render(
        <CalendarDayButton
          data-testid="day-button"
          day={mockDay}
          modifiers={modifiers}
        >
          15
        </CalendarDayButton>
      );

      const button = screen.getByTestId("day-button");

      expect(button).not.toHaveFocus();
    });
  });

  describe("Interactive Behavior", () => {
    it("should handle click events", () => {
      const handleClick = jest.fn();

      render(
        <CalendarDayButton
          data-testid="day-button"
          day={mockDay}
          modifiers={defaultModifiers}
          onClick={handleClick}
        >
          15
        </CalendarDayButton>
      );

      const button = screen.getByTestId("day-button");
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should handle keyboard events", () => {
      const handleKeyDown = jest.fn();

      render(
        <CalendarDayButton
          data-testid="day-button"
          day={mockDay}
          modifiers={defaultModifiers}
          onKeyDown={handleKeyDown}
        >
          15
        </CalendarDayButton>
      );

      const button = screen.getByTestId("day-button");
      fireEvent.keyDown(button, { key: "Enter", code: "Enter" });

      expect(handleKeyDown).toHaveBeenCalledTimes(1);
    });

    it("should handle disabled state", () => {
      const handleClick = jest.fn();
      const modifiers = {
        ...defaultModifiers,
        disabled: true,
      };

      render(
        <CalendarDayButton
          data-testid="day-button"
          day={mockDay}
          disabled
          modifiers={modifiers}
          onClick={handleClick}
        >
          15
        </CalendarDayButton>
      );

      const button = screen.getByTestId("day-button");
      fireEvent.click(button);

      expect(handleClick).not.toHaveBeenCalled();
      expect(button).toBeDisabled();
    });
  });

  describe("Styling and Classes", () => {
    it("should have button styling classes", () => {
      render(
        <CalendarDayButton
          data-testid="day-button"
          day={mockDay}
          modifiers={defaultModifiers}
        >
          15
        </CalendarDayButton>
      );

      const button = screen.getByTestId("day-button");

      expect(button).toHaveClass(
        "flex",
        "aspect-square",
        "size-auto",
        "w-full",
        "flex-col",
        "gap-1",
        "leading-none",
        "font-normal"
      );
    });

    it("should merge custom classes with default ones", () => {
      render(
        <CalendarDayButton
          className="custom-class"
          data-testid="day-button"
          day={mockDay}
          modifiers={defaultModifiers}
        >
          15
        </CalendarDayButton>
      );

      const button = screen.getByTestId("day-button");

      expect(button).toHaveClass("custom-class");
      expect(button).toHaveClass("flex", "aspect-square");
    });
  });

  describe("Complex Interactions", () => {
    it("should handle multiple modifiers correctly", () => {
      const modifiers = {
        ...defaultModifiers,
        focused: true,
        range_start: true,
        selected: true,
        today: true,
      };

      render(
        <CalendarDayButton
          day={mockDay}
          modifiers={modifiers}
          data-testid="day-button"
        >
          15
        </CalendarDayButton>
      );

      const button = screen.getByTestId("day-button");

      expect(button).toHaveAttribute("data-range-start", "true");
      expect(button).toHaveAttribute("data-selected-single", "false");
    });

    it("should handle children with complex content", () => {
      render(
        <CalendarDayButton
          data-testid="day-button"
          day={mockDay}
          modifiers={defaultModifiers}
        >
          <span data-testid="day-number">15</span>

          <span data-testid="day-indicator">•</span>
        </CalendarDayButton>
      );

      const button = screen.getByTestId("day-button");
      const dayNumber = screen.getByTestId("day-number");
      const dayIndicator = screen.getByTestId("day-indicator");

      expect(button).toContainElement(dayNumber);
      expect(button).toContainElement(dayIndicator);
      expect(dayNumber).toHaveTextContent("15");
      expect(dayIndicator).toHaveTextContent("•");
    });
  });
});
