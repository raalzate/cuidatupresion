import "@testing-library/jest-dom";

import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

import { Input } from "@/components/ui/input";

describe("Input Component", () => {
  describe("Rendering", () => {
    it("should render input with default props", () => {
      render(<Input data-testid="test-input" />);

      const input = screen.getByTestId("test-input");

      expect(input).toBeInTheDocument();
      expect(input).toHaveProperty("type", "text");
    });

    it("should render input with wrapper div", () => {
      render(<Input data-testid="test-input" />);

      const input = screen.getByTestId("test-input");
      const wrapper = input.parentElement;

      expect(wrapper).toHaveClass("relative", "w-full");
    });

    it("should render with default styling classes", () => {
      render(<Input data-testid="test-input" />);

      const input = screen.getByTestId("test-input");

      expect(input).toHaveClass(
        "flex",
        "h-10",
        "w-full",
        "rounded-md",
        "border",
        "border-input",
        "bg-background",
        "px-3",
        "py-2",
        "pr-10",
        "text-sm",
        "ring-offset-background"
      );
    });

    it("should render with focus and state classes", () => {
      render(<Input data-testid="test-input" />);

      const input = screen.getByTestId("test-input");

      expect(input).toHaveClass(
        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-ring",
        "focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed",
        "disabled:opacity-50"
      );
    });

    it("should render with file input specific classes", () => {
      render(<Input data-testid="test-input" />);

      const input = screen.getByTestId("test-input");

      expect(input).toHaveClass(
        "file:border-0",
        "file:bg-transparent",
        "file:text-sm",
        "file:font-medium"
      );
    });

    it("should render with placeholder styling", () => {
      render(<Input data-testid="test-input" />);

      const input = screen.getByTestId("test-input");

      expect(input).toHaveClass("placeholder:text-muted-foreground");
    });
  });

  describe("Props Handling", () => {
    it("should accept and render different input types", () => {
      const { rerender } = render(
        <Input type="email" data-testid="test-input" />
      );

      expect(screen.getByTestId("test-input")).toHaveAttribute("type", "email");

      rerender(<Input type="password" data-testid="test-input" />);
      expect(screen.getByTestId("test-input")).toHaveAttribute(
        "type",
        "password"
      );

      rerender(<Input type="number" data-testid="test-input" />);
      expect(screen.getByTestId("test-input")).toHaveAttribute(
        "type",
        "number"
      );

      rerender(<Input type="tel" data-testid="test-input" />);
      expect(screen.getByTestId("test-input")).toHaveAttribute("type", "tel");

      rerender(<Input type="url" data-testid="test-input" />);
      expect(screen.getByTestId("test-input")).toHaveAttribute("type", "url");

      rerender(<Input type="search" data-testid="test-input" />);
      expect(screen.getByTestId("test-input")).toHaveAttribute(
        "type",
        "search"
      );
    });

    it("should accept placeholder prop", () => {
      render(<Input placeholder="Enter text here" data-testid="test-input" />);

      const input = screen.getByTestId("test-input");

      expect(input).toHaveAttribute("placeholder", "Enter text here");
      expect(input).toHaveAttribute("placeholder", "Enter text here");
    });

    it("should accept value prop", () => {
      render(<Input value="test value" data-testid="test-input" readOnly />);

      const input = screen.getByTestId("test-input");
      expect(input).toHaveValue("test value");
    });

    it("should accept defaultValue prop", () => {
      render(<Input defaultValue="default test" data-testid="test-input" />);

      const input = screen.getByTestId("test-input");
      expect(input).toHaveValue("default test");
    });

    it("should accept disabled prop", () => {
      render(<Input disabled data-testid="test-input" />);

      const input = screen.getByTestId("test-input");
      expect(input).toBeDisabled();
    });

    it("should accept readOnly prop", () => {
      render(<Input readOnly data-testid="test-input" />);

      const input = screen.getByTestId("test-input");
      expect(input).toHaveAttribute("readonly");
    });

    it("should accept required prop", () => {
      render(<Input required data-testid="test-input" />);

      const input = screen.getByTestId("test-input");
      expect(input).toBeRequired();
    });

    it("should accept name prop", () => {
      render(<Input name="username" data-testid="test-input" />);

      const input = screen.getByTestId("test-input");
      expect(input).toHaveAttribute("name", "username");
    });

    it("should accept id prop", () => {
      render(<Input id="username-input" data-testid="test-input" />);

      const input = screen.getByTestId("test-input");
      expect(input).toHaveAttribute("id", "username-input");
    });

    it("should accept aria attributes", () => {
      render(
        <Input
          aria-describedby="username-help"
          aria-invalid="true"
          aria-label="Username input"
          data-testid="test-input"
        />
      );

      const input = screen.getByTestId("test-input");

      expect(input).toHaveAttribute("aria-label", "Username input");
      expect(input).toHaveAttribute("aria-describedby", "username-help");
      expect(input).toHaveAttribute("aria-invalid", "true");
    });

    it("should accept data attributes", () => {
      render(<Input data-cy="username-input" data-testid="test-input" />);

      const input = screen.getByTestId("test-input");
      expect(input).toHaveAttribute("data-cy", "username-input");
    });
  });

  describe("Custom Styling", () => {
    it("should merge custom className with default classes", () => {
      render(
        <Input
          className="custom-class border-red-500"
          data-testid="test-input"
        />
      );

      const input = screen.getByTestId("test-input");

      expect(input).toHaveClass("custom-class", "border-red-500");
      expect(input).toHaveClass("flex", "h-10", "w-full", "rounded-md");
    });

    it("should allow overriding default classes", () => {
      render(<Input className="h-12 bg-red-100" data-testid="test-input" />);

      const input = screen.getByTestId("test-input");

      expect(input).toHaveClass("h-12", "bg-red-100");
      expect(input).toHaveClass("flex", "w-full", "rounded-md");
    });

    it("should handle empty className", () => {
      render(<Input className="" data-testid="test-input" />);

      const input = screen.getByTestId("test-input");
      expect(input).toHaveClass("flex", "h-10", "w-full", "rounded-md");
    });

    it("should handle undefined className", () => {
      render(<Input className={undefined} data-testid="test-input" />);

      const input = screen.getByTestId("test-input");
      expect(input).toHaveClass("flex", "h-10", "w-full", "rounded-md");
    });
  });

  describe("User Interactions", () => {
    it("should handle onChange events", () => {
      const handleChange = jest.fn();

      render(<Input onChange={handleChange} data-testid="test-input" />);

      const input = screen.getByTestId("test-input");
      fireEvent.change(input, { target: { value: "new value" } });

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({ value: "new value" }),
        })
      );
    });

    it("should handle onFocus events", () => {
      const handleFocus = jest.fn();

      render(<Input onFocus={handleFocus} data-testid="test-input" />);

      const input = screen.getByTestId("test-input");
      fireEvent.focus(input);

      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it("should handle onBlur events", () => {
      const handleBlur = jest.fn();

      render(<Input onBlur={handleBlur} data-testid="test-input" />);

      const input = screen.getByTestId("test-input");
      fireEvent.focus(input);
      fireEvent.blur(input);

      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it("should handle onKeyDown events", () => {
      const handleKeyDown = jest.fn();

      render(<Input onKeyDown={handleKeyDown} data-testid="test-input" />);

      const input = screen.getByTestId("test-input");
      fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

      expect(handleKeyDown).toHaveBeenCalledTimes(1);
      expect(handleKeyDown).toHaveBeenCalledWith(
        expect.objectContaining({
          key: "Enter",
          code: "Enter",
        })
      );
    });

    it("should handle onKeyUp events", () => {
      const handleKeyUp = jest.fn();

      render(<Input onKeyUp={handleKeyUp} data-testid="test-input" />);

      const input = screen.getByTestId("test-input");
      fireEvent.keyUp(input, { key: "a" });

      expect(handleKeyUp).toHaveBeenCalledTimes(1);
    });

    it("should handle multiple events together", () => {
      const handleChange = jest.fn();
      const handleFocus = jest.fn();
      const handleBlur = jest.fn();

      render(
        <Input
          data-testid="test-input"
          onBlur={handleBlur}
          onChange={handleChange}
          onFocus={handleFocus}
        />
      );

      const input = screen.getByTestId("test-input");

      fireEvent.focus(input);
      expect(handleFocus).toHaveBeenCalledTimes(1);

      fireEvent.change(input, { target: { value: "test" } });
      expect(handleChange).toHaveBeenCalledTimes(1);

      fireEvent.blur(input);
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it("should not trigger events when disabled", () => {
      const handleChange = jest.fn();
      const handleFocus = jest.fn();

      render(
        <Input
          data-testid="test-input"
          disabled
          onChange={handleChange}
          onFocus={handleFocus}
        />
      );

      const input = screen.getByTestId("test-input");

      fireEvent.change(input, { target: { value: "test" } });
      fireEvent.focus(input);

      expect(input).toBeDisabled();
      expect(input).not.toHaveFocus();
    });
  });

  describe("Ref Forwarding", () => {
    it("should forward ref to input element", () => {
      const ref = React.createRef<HTMLInputElement>();

      render(<Input ref={ref} data-testid="test-input" />);

      expect(ref.current).toBeInstanceOf(HTMLInputElement);
      expect(ref.current).toBe(screen.getByTestId("test-input"));
    });

    it("should allow ref methods to be called", () => {
      const ref = React.createRef<HTMLInputElement>();

      render(<Input ref={ref} data-testid="test-input" />);

      ref.current?.focus();
      expect(ref.current).toHaveFocus();

      ref.current?.blur();
      expect(ref.current).not.toHaveFocus();
    });

    it("should allow setting value via ref", () => {
      const ref = React.createRef<HTMLInputElement>();

      render(<Input ref={ref} data-testid="test-input" />);

      if (ref.current) {
        ref.current.value = "ref value";
      }

      expect(ref.current).toHaveValue("ref value");
    });
  });

  describe("Special Input Types", () => {
    it("should handle file input type", () => {
      render(<Input type="file" accept=".jpg,.png" data-testid="test-input" />);

      const input = screen.getByTestId("test-input");

      expect(input).toHaveAttribute("type", "file");
      expect(input).toHaveAttribute("accept", ".jpg,.png");
    });

    it("should handle number input with min/max", () => {
      render(
        <Input
          data-testid="test-input"
          max="100"
          min="0"
          step="5"
          type="number"
        />
      );

      const input = screen.getByTestId("test-input");

      expect(input).toHaveAttribute("type", "number");
      expect(input).toHaveAttribute("min", "0");
      expect(input).toHaveAttribute("max", "100");
      expect(input).toHaveAttribute("step", "5");
    });

    it("should handle password input", () => {
      render(<Input type="password" data-testid="test-input" />);

      const input = screen.getByTestId("test-input");
      expect(input).toHaveAttribute("type", "password");
    });

    it("should handle email input", () => {
      render(<Input type="email" data-testid="test-input" />);

      const input = screen.getByTestId("test-input");
      expect(input).toHaveAttribute("type", "email");
    });

    it("should handle tel input", () => {
      render(
        <Input
          data-testid="test-input"
          pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
          type="tel"
        />
      );

      const input = screen.getByTestId("test-input");

      expect(input).toHaveAttribute("type", "tel");
      expect(input).toHaveAttribute("pattern", "[0-9]{3}-[0-9]{3}-[0-9]{4}");
    });

    it("should handle url input", () => {
      render(<Input type="url" data-testid="test-input" />);

      const input = screen.getByTestId("test-input");
      expect(input).toHaveAttribute("type", "url");
    });

    it("should handle search input", () => {
      render(<Input type="search" data-testid="test-input" />);

      const input = screen.getByTestId("test-input");
      expect(input).toHaveAttribute("type", "search");
    });

    it("should handle date input", () => {
      render(<Input type="date" data-testid="test-input" />);

      const input = screen.getByTestId("test-input");
      expect(input).toHaveAttribute("type", "date");
    });

    it("should handle time input", () => {
      render(<Input type="time" data-testid="test-input" />);

      const input = screen.getByTestId("test-input");
      expect(input).toHaveAttribute("type", "time");
    });
  });

  describe("Validation", () => {
    it("should handle HTML5 validation attributes", () => {
      render(
        <Input
          data-testid="test-input"
          maxLength={20}
          minLength={3}
          pattern="[A-Za-z]+"
          required
        />
      );

      const input = screen.getByTestId("test-input");

      expect(input).toBeRequired();
      expect(input).toHaveAttribute("minlength", "3");
      expect(input).toHaveAttribute("maxlength", "20");
      expect(input).toHaveAttribute("pattern", "[A-Za-z]+");
    });

    it("should work with form validation", () => {
      render(
        <form data-testid="test-form">
          <Input
            data-testid="test-input"
            minLength={3}
            name="username"
            required
          />
          <button type="submit">Submit</button>
        </form>
      );

      const form = screen.getByTestId("test-form");
      const input = screen.getByTestId("test-input");

      fireEvent.submit(form);

      expect(input).toBeInvalid();
    });
  });

  describe("Accessibility", () => {
    it("should be accessible by screen readers", () => {
      render(
        <Input
          aria-describedby="username-help"
          aria-label="Username"
          data-testid="test-input"
        />
      );

      const input = screen.getByTestId("test-input");

      expect(input).toHaveAccessibleName("Username");
      expect(input).toHaveAttribute("aria-describedby", "username-help");
    });

    it("should work with label elements", () => {
      render(
        <div>
          <label htmlFor="username-input">Username</label>

          <Input id="username-input" data-testid="test-input" />
        </div>
      );

      const input = screen.getByTestId("test-input");
      expect(input).toHaveAccessibleName("Username");
    });

    it("should support keyboard navigation", () => {
      render(<Input data-testid="test-input" />);

      const input = screen.getByTestId("test-input");

      input.focus();
      expect(input).toHaveFocus();

      fireEvent.keyDown(input, { key: "Tab" });
    });

    it("should handle aria-invalid correctly", () => {
      const { rerender } = render(
        <Input aria-invalid="false" data-testid="test-input" />
      );

      const input = screen.getByTestId("test-input");
      expect(input).toHaveAttribute("aria-invalid", "false");

      rerender(<Input aria-invalid="true" data-testid="test-input" />);
      expect(input).toHaveAttribute("aria-invalid", "true");
    });
  });

  describe("Edge Cases", () => {
    it("should handle null and undefined props gracefully", () => {
      render(
        <Input
          className={undefined}
          data-testid="test-input"
          onChange={undefined}
          value={undefined}
        />
      );

      const input = screen.getByTestId("test-input");
      expect(input).toBeInTheDocument();
    });

    it("should handle very long values", () => {
      const longValue = "a".repeat(1000);
      render(<Input defaultValue={longValue} data-testid="test-input" />);

      const input = screen.getByTestId("test-input");
      expect(input).toHaveValue(longValue);
    });

    it("should handle special characters in values", () => {
      const specialValue = "!@#$%^&*()_+-=[]{}|;:,.<>?";
      render(<Input defaultValue={specialValue} data-testid="test-input" />);

      const input = screen.getByTestId("test-input");
      expect(input).toHaveValue(specialValue);
    });

    it("should handle unicode characters", () => {
      const unicodeValue = "こんにちは 🌟 ñáéíóú";
      render(<Input defaultValue={unicodeValue} data-testid="test-input" />);

      const input = screen.getByTestId("test-input");
      expect(input).toHaveValue(unicodeValue);
    });

    it("should maintain ref stability across renders", () => {
      const ref = React.createRef<HTMLInputElement>();
      const { rerender } = render(<Input ref={ref} value="test1" readOnly />);

      const firstRef = ref.current;

      rerender(<Input ref={ref} value="test2" readOnly />);

      expect(ref.current).toBe(firstRef);
    });
  });
});
