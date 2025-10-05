import "@testing-library/jest-dom";

import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

import { Button, buttonVariants } from "@/components/ui/button";

describe("Button Component", () => {
  describe("Basic Rendering", () => {
    it("should render as button by default", () => {
      render(<Button data-testid="button">Click me</Button>);

      const button = screen.getByTestId("button");

      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute("data-slot", "button");
      expect(button.tagName).toBe("BUTTON");
      expect(button).toHaveTextContent("Click me");
    });

    it("should render with default variant and size classes", () => {
      render(<Button data-testid="button">Default Button</Button>);

      const button = screen.getByTestId("button");

      expect(button).toHaveClass(
        "inline-flex",
        "items-center",
        "justify-center",
        "gap-3",
        "whitespace-nowrap",
        "rounded-lg",
        "text-base",
        "font-semibold",
        "tracking-wide",
        "transition-all",
        "bg-primary",
        "text-primary-foreground",
        "shadow-xs",
        "h-12",
        "px-6",
        "py-3"
      );
    });

    it("should render as Slot when asChild is true", () => {
      render(
        <Button asChild data-testid="button">
          <a href="https://example.com">Link Button</a>
        </Button>
      );

      const button = screen.getByTestId("button");

      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute("data-slot", "button");
      expect(button.tagName).toBe("A");
      expect(button).toHaveAttribute("href", "https://example.com");
      expect(button).toHaveTextContent("Link Button");
    });

    it("should pass through additional props", () => {
      render(
        <Button
          aria-label="Submit form"
          data-testid="button"
          disabled
          id="test-button"
          type="submit"
        >
          Submit
        </Button>
      );

      const button = screen.getByTestId("button");

      expect(button).toHaveAttribute("id", "test-button");
      expect(button).toHaveAttribute("type", "submit");
      expect(button).toHaveAttribute("disabled");
      expect(button).toHaveAttribute("aria-label", "Submit form");
    });

    it("should render with custom className", () => {
      render(
        <Button className="custom-class" data-testid="button">
          Custom Button
        </Button>
      );

      const button = screen.getByTestId("button");

      expect(button).toHaveClass("custom-class");
      expect(button).toHaveClass("inline-flex", "items-center");
    });
  });

  describe("Variant Props", () => {
    it("should render default variant correctly", () => {
      render(
        <Button variant="default" data-testid="button">
          Default
        </Button>
      );

      const button = screen.getByTestId("button");

      expect(button).toHaveClass(
        "bg-primary",
        "text-primary-foreground",
        "shadow-xs"
      );
    });

    it("should render destructive variant correctly", () => {
      render(
        <Button variant="destructive" data-testid="button">
          Delete
        </Button>
      );

      const button = screen.getByTestId("button");

      expect(button).toHaveClass("bg-destructive", "text-white", "shadow-xs");
    });

    it("should render outline variant correctly", () => {
      render(
        <Button variant="outline" data-testid="button">
          Outline
        </Button>
      );

      const button = screen.getByTestId("button");

      expect(button).toHaveClass(
        "border",
        "border-[rgba(64,169,68,0.6)]",
        "bg-background",
        "shadow-xs"
      );
    });

    it("should render secondary variant correctly", () => {
      render(
        <Button variant="secondary" data-testid="button">
          Secondary
        </Button>
      );

      const button = screen.getByTestId("button");

      expect(button).toHaveClass(
        "bg-secondary",
        "text-secondary-foreground",
        "shadow-xs"
      );
    });

    it("should render ghost variant correctly", () => {
      render(
        <Button variant="ghost" data-testid="button">
          Ghost
        </Button>
      );

      const button = screen.getByTestId("button");

      expect(button).toHaveClass(
        "hover:bg-[rgba(212,239,223,0.85)]",
        "hover:text-accent-foreground"
      );
      expect(button).not.toHaveClass("bg-primary", "shadow-xs");
    });

    it("should render link variant correctly", () => {
      render(
        <Button variant="link" data-testid="button">
          Link
        </Button>
      );

      const button = screen.getByTestId("button");

      expect(button).toHaveClass(
        "text-primary",
        "underline-offset-4",
        "hover:text-[#1C6F2E]"
      );
      expect(button).not.toHaveClass("bg-primary", "shadow-xs");
    });
  });

  describe("Size Props", () => {
    it("should render default size correctly", () => {
      render(
        <Button size="default" data-testid="button">
          Default Size
        </Button>
      );

      const button = screen.getByTestId("button");

      expect(button).toHaveClass("h-12", "px-6", "py-3");
    });

    it("should render sm size correctly", () => {
      render(
        <Button size="sm" data-testid="button">
          Small
        </Button>
      );

      const button = screen.getByTestId("button");

      expect(button).toHaveClass(
        "h-10",
        "rounded-md",
        "gap-2",
        "px-4",
        "text-base"
      );
    });

    it("should render lg size correctly", () => {
      render(
        <Button size="lg" data-testid="button">
          Large
        </Button>
      );

      const button = screen.getByTestId("button");

      expect(button).toHaveClass("h-14", "rounded-xl", "px-8", "text-lg");
    });

    it("should render icon size correctly", () => {
      render(
        <Button size="icon" data-testid="button">
          🔥
        </Button>
      );

      const button = screen.getByTestId("button");

      expect(button).toHaveClass("size-12");
      expect(button).not.toHaveClass("px-4", "py-2");
    });
  });

  describe("Variant and Size Combinations", () => {
    it("should render destructive small button correctly", () => {
      render(
        <Button variant="destructive" size="sm" data-testid="button">
          Delete
        </Button>
      );

      const button = screen.getByTestId("button");

      expect(button).toHaveClass(
        "bg-destructive",
        "text-white",
        "h-10",
        "px-4"
      );
    });

    it("should render outline large button correctly", () => {
      render(
        <Button variant="outline" size="lg" data-testid="button">
          Outline Large
        </Button>
      );

      const button = screen.getByTestId("button");

      expect(button).toHaveClass(
        "border",
        "border-[rgba(64,169,68,0.6)]",
        "bg-background",
        "h-14",
        "px-8"
      );
    });

    it("should render ghost icon button correctly", () => {
      render(
        <Button variant="ghost" size="icon" data-testid="button">
          ✕
        </Button>
      );

      const button = screen.getByTestId("button");

      expect(button).toHaveClass(
        "hover:bg-[rgba(212,239,223,0.85)]",
        "size-12"
      );
      expect(button).not.toHaveClass("bg-primary", "px-4");
    });
  });

  describe("Interactive Behavior", () => {
    it("should handle click events", () => {
      const handleClick = jest.fn();

      render(
        <Button onClick={handleClick} data-testid="button">
          Click me
        </Button>
      );

      const button = screen.getByTestId("button");
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should not trigger click when disabled", () => {
      const handleClick = jest.fn();

      render(
        <Button onClick={handleClick} disabled data-testid="button">
          Disabled
        </Button>
      );

      const button = screen.getByTestId("button");
      fireEvent.click(button);

      expect(handleClick).not.toHaveBeenCalled();
      expect(button).toHaveClass(
        "disabled:pointer-events-none",
        "disabled:opacity-50"
      );
    });

    it("should handle focus and blur events", () => {
      const handleFocus = jest.fn();
      const handleBlur = jest.fn();

      render(
        <Button onFocus={handleFocus} onBlur={handleBlur} data-testid="button">
          Focus me
        </Button>
      );

      const button = screen.getByTestId("button");

      fireEvent.focus(button);
      expect(handleFocus).toHaveBeenCalledTimes(1);

      fireEvent.blur(button);
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it("should handle keyboard events", () => {
      const handleKeyDown = jest.fn();

      render(
        <Button onKeyDown={handleKeyDown} data-testid="button">
          Keyboard
        </Button>
      );

      const button = screen.getByTestId("button");
      fireEvent.keyDown(button, { key: "Enter", code: "Enter" });

      expect(handleKeyDown).toHaveBeenCalledTimes(1);
    });
  });

  describe("Accessibility", () => {
    it("should have proper accessibility attributes", () => {
      render(
        <Button
          aria-describedby="form-help"
          aria-label="Submit form"
          data-testid="button"
        >
          Submit
        </Button>
      );

      const button = screen.getByTestId("button");

      expect(button).toHaveAttribute("aria-label", "Submit form");
      expect(button).toHaveAttribute("aria-describedby", "form-help");
    });

    it("should have focus styles", () => {
      render(<Button data-testid="button">Focus me</Button>);

      const button = screen.getByTestId("button");

      expect(button).toHaveClass(
        "outline-none",
        "focus-visible:border-[rgba(30,86,49,0.7)]",
        "focus-visible:ring-[rgba(30,86,49,0.4)]",
        "focus-visible:ring-[4px]"
      );
    });

    it("should have aria-invalid styles", () => {
      render(
        <Button aria-invalid="true" data-testid="button">
          Invalid
        </Button>
      );

      const button = screen.getByTestId("button");

      expect(button).toHaveClass(
        "aria-invalid:ring-[rgba(199,54,47,0.25)]",
        "aria-invalid:border-destructive"
      );
    });
  });

  describe("Children and Content", () => {
    it("should render text children", () => {
      render(<Button data-testid="button">Text Button</Button>);

      const button = screen.getByTestId("button");

      expect(button).toHaveTextContent("Text Button");
    });

    it("should render with icon children", () => {
      render(
        <Button data-testid="button">
          <svg data-testid="icon" width="16" height="16">
            <circle cx="8" cy="8" r="4" />
          </svg>
          With Icon
        </Button>
      );

      const button = screen.getByTestId("button");
      const icon = screen.getByTestId("icon");

      expect(button).toContainElement(icon);
      expect(button).toHaveTextContent("With Icon");
    });

    it("should render icon-only button", () => {
      render(
        <Button size="icon" data-testid="button">
          <svg data-testid="icon" width="16" height="16">
            <circle cx="8" cy="8" r="4" />
          </svg>
        </Button>
      );

      const button = screen.getByTestId("button");
      const icon = screen.getByTestId("icon");

    expect(button).toContainElement(icon);
    expect(button).toHaveClass("size-12");
    });

    it("should render complex children", () => {
      render(
        <Button data-testid="button">
          <span data-testid="complex-child">
            Complex <strong>Content</strong>
          </span>
        </Button>
      );

      const button = screen.getByTestId("button");
      const complexChild = screen.getByTestId("complex-child");

      expect(button).toContainElement(complexChild);
      expect(complexChild).toHaveTextContent("Complex Content");
    });
  });

  describe("AsChild with Different Elements", () => {
    it("should render as link with asChild", () => {
      render(
        <Button asChild data-testid="button">
          <a href="https://example.com" target="_blank" rel="noopener">
            External Link
          </a>
        </Button>
      );

      const button = screen.getByTestId("button");

      expect(button.tagName).toBe("A");
      expect(button).toHaveAttribute("href", "https://example.com");
      expect(button).toHaveAttribute("target", "_blank");
      expect(button).toHaveAttribute("rel", "noopener");
    });

    it("should render as div with asChild", () => {
      render(
        <Button asChild data-testid="button">
          <div role="button" tabIndex={0}>
            Div Button
          </div>
        </Button>
      );

      const button = screen.getByTestId("button");

      expect(button.tagName).toBe("DIV");
      expect(button).toHaveAttribute("role", "button");
      expect(button).toHaveAttribute("tabIndex", "0");
    });
  });

  describe("Button Variants Function", () => {
    it("should generate correct classes for default variant and size", () => {
      const classes = buttonVariants();

      expect(classes).toContain("bg-primary");
      expect(classes).toContain("text-primary-foreground");
    expect(classes).toContain("h-12");
    expect(classes).toContain("px-6");
    });

    it("should generate correct classes for destructive variant", () => {
      const classes = buttonVariants({ variant: "destructive" });

      expect(classes).toContain("bg-destructive");
      expect(classes).toContain("text-white");
    });

    it("should generate correct classes for small size", () => {
      const classes = buttonVariants({ size: "sm" });

    expect(classes).toContain("h-10");
    expect(classes).toContain("px-4");
    });

    it("should generate correct classes with custom className", () => {
      const classes = buttonVariants({
        variant: "outline",
        size: "lg",
        className: "custom-class",
      });

      expect(classes).toContain("border");
      expect(classes).toContain("h-14");
      expect(classes).toContain("custom-class");
    });
  });
});
