import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

import { Textarea } from "@/components/ui/textarea";

describe("Textarea", () => {
  it("should render correctly", () => {
    render(<Textarea placeholder="Enter text here" />);

    const textarea = screen.getByPlaceholderText("Enter text here");

    expect(textarea).toBeInTheDocument();
    expect(textarea.tagName).toBe("TEXTAREA");
  });

  it("should apply default classes", () => {
    render(<Textarea data-testid="textarea" />);

    const textarea = screen.getByTestId("textarea");

  expect(textarea).toHaveClass("border-input");
  expect(textarea).toHaveClass("min-h-20");
  expect(textarea).toHaveClass("w-full");
  expect(textarea).toHaveClass("rounded-lg");
  expect(textarea).toHaveClass("bg-white");
  expect(textarea).toHaveClass("px-4", "py-3");
  expect(textarea).toHaveClass("text-base", "font-semibold");
  expect(textarea).toHaveClass("shadow-xs");
  });

  it("should merge custom className with default classes", () => {
    render(<Textarea className="custom-class" data-testid="textarea" />);

    const textarea = screen.getByTestId("textarea");

    expect(textarea).toHaveClass("custom-class");
  expect(textarea).toHaveClass("border-input");
  expect(textarea).toHaveClass("rounded-lg");
  });

  it("should handle value prop", () => {
    render(<Textarea value="Test content" readOnly />);

    const textarea = screen.getByDisplayValue("Test content");

    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveValue("Test content");
  });

  it("should handle placeholder prop", () => {
    const placeholder = "Type your message...";

    render(<Textarea placeholder={placeholder} />);

    const textarea = screen.getByPlaceholderText(placeholder);

    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute("placeholder", placeholder);
  });

  it("should handle disabled state", () => {
    render(<Textarea disabled data-testid="textarea" />);

    const textarea = screen.getByTestId("textarea");

    expect(textarea).toBeDisabled();
    expect(textarea).toHaveClass("disabled:cursor-not-allowed");
    expect(textarea).toHaveClass("disabled:opacity-50");
  });

  it("should handle onChange event", () => {
    const handleChange = jest.fn();
    render(<Textarea onChange={handleChange} data-testid="textarea" />);

    const textarea = screen.getByTestId("textarea");
    fireEvent.change(textarea, { target: { value: "New text" } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          value: "New text",
        }),
      })
    );
  });

  it("should handle onFocus event", () => {
    const handleFocus = jest.fn();
    render(<Textarea onFocus={handleFocus} data-testid="textarea" />);

    const textarea = screen.getByTestId("textarea");
    fireEvent.focus(textarea);

    expect(handleFocus).toHaveBeenCalledTimes(1);
  });

  it("should handle onBlur event", () => {
    const handleBlur = jest.fn();
    render(<Textarea onBlur={handleBlur} data-testid="textarea" />);

    const textarea = screen.getByTestId("textarea");
    fireEvent.focus(textarea);
    fireEvent.blur(textarea);

    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it("should support rows prop", () => {
    render(<Textarea rows={5} data-testid="textarea" />);

    const textarea = screen.getByTestId("textarea");
    expect(textarea).toHaveAttribute("rows", "5");
  });

  it("should support cols prop", () => {
    render(<Textarea cols={40} data-testid="textarea" />);

    const textarea = screen.getByTestId("textarea");
    expect(textarea).toHaveAttribute("cols", "40");
  });

  it("should support maxLength prop", () => {
    render(<Textarea maxLength={100} data-testid="textarea" />);

    const textarea = screen.getByTestId("textarea");
    expect(textarea).toHaveAttribute("maxLength", "100");
  });

  it("should support readOnly prop", () => {
    render(<Textarea readOnly data-testid="textarea" />);

    const textarea = screen.getByTestId("textarea");
    expect(textarea).toHaveAttribute("readOnly");
  });

  it("should support required prop", () => {
    render(<Textarea required data-testid="textarea" />);

    const textarea = screen.getByTestId("textarea");
    expect(textarea).toHaveAttribute("required");
  });

  it("should have data-slot attribute", () => {
    render(<Textarea data-testid="textarea" />);

    const textarea = screen.getByTestId("textarea");
    expect(textarea).toHaveAttribute("data-slot", "textarea");
  });

  it("should be focusable", () => {
    render(<Textarea data-testid="textarea" />);

    const textarea = screen.getByTestId("textarea");
    textarea.focus();

    expect(document.activeElement).toBe(textarea);
  });

  it("should handle multiple lines of text", () => {
    const multilineText = "Line 1\nLine 2\nLine 3";
    render(<Textarea value={multilineText} readOnly data-testid="textarea" />);

    const textarea = screen.getByTestId("textarea");
    expect(textarea).toHaveValue(multilineText);
  });

  it("should support name prop for form submission", () => {
    render(<Textarea name="message" data-testid="textarea" />);

    const textarea = screen.getByTestId("textarea");
    expect(textarea).toHaveAttribute("name", "message");
  });

  it("should support id prop", () => {
    render(<Textarea id="textarea-id" data-testid="textarea" />);

    const textarea = screen.getByTestId("textarea");
    expect(textarea).toHaveAttribute("id", "textarea-id");
  });

  it("should support aria-label for accessibility", () => {
    render(<Textarea aria-label="Message input" data-testid="textarea" />);

    const textarea = screen.getByTestId("textarea");
    expect(textarea).toHaveAttribute("aria-label", "Message input");
  });

  it("should support aria-describedby for accessibility", () => {
    render(<Textarea aria-describedby="help-text" data-testid="textarea" />);

    const textarea = screen.getByTestId("textarea");
    expect(textarea).toHaveAttribute("aria-describedby", "help-text");
  });

  it("should apply focus-visible styles when focused", () => {
    render(<Textarea data-testid="textarea" />);

    const textarea = screen.getByTestId("textarea");

  expect(textarea).toHaveClass("focus-visible:border-[rgba(30,86,49,0.7)]");
  expect(textarea).toHaveClass("focus-visible:ring-[rgba(30,86,49,0.4)]");
  expect(textarea).toHaveClass("focus-visible:ring-[4px]");
  });

  it("should apply aria-invalid styles", () => {
    render(<Textarea aria-invalid="true" data-testid="textarea" />);

    const textarea = screen.getByTestId("textarea");

  expect(textarea).toHaveClass("aria-invalid:ring-[rgba(199,54,47,0.25)]");
  expect(textarea).toHaveClass("dark:aria-invalid:ring-[rgba(241,106,106,0.4)]");
    expect(textarea).toHaveClass("aria-invalid:border-destructive");
  });

  it("should forward ref correctly", () => {
    const ref = React.createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });
});
