import "@testing-library/jest-dom";

import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

import { Label } from "@/components/ui/label";

describe("Label Component", () => {
  describe("Rendering", () => {
    it("should render label with default props", () => {
      render(<Label data-testid="test-label">Test Label</Label>);

      const label = screen.getByTestId("test-label");

      expect(label).toBeInTheDocument();
      expect(label.tagName).toBe("LABEL");
    });

    it("should render with default styling classes", () => {
      render(<Label data-testid="test-label">Test Label</Label>);

      const label = screen.getByTestId("test-label");

      expect(label).toHaveClass(
        "text-sm",
        "font-medium",
        "leading-none",
        "peer-disabled:cursor-not-allowed",
        "peer-disabled:opacity-70"
      );
    });

    it("should render children content", () => {
      render(<Label data-testid="test-label">Username Label</Label>);

      const label = screen.getByTestId("test-label");
      expect(label).toHaveTextContent("Username Label");
    });

    it("should render with React nodes as children", () => {
      render(
        <Label data-testid="test-label">
          <span>Username</span> <em>required</em>
        </Label>
      );

      const label = screen.getByTestId("test-label");
      expect(label).toContainHTML("<span>Username</span> <em>required</em>");
    });

    it("should render empty label", () => {
      render(<Label data-testid="test-label" />);

      const label = screen.getByTestId("test-label");

      expect(label).toBeInTheDocument();
      expect(label).toBeEmptyDOMElement();
    });
  });

  describe("Props Handling", () => {
    it("should accept htmlFor prop", () => {
      render(
        <Label htmlFor="username-input" data-testid="test-label">
          Username
        </Label>
      );

      const label = screen.getByTestId("test-label");
      expect(label).toHaveAttribute("for", "username-input");
    });

    it("should accept id prop", () => {
      render(
        <Label id="username-label" data-testid="test-label">
          Username
        </Label>
      );

      const label = screen.getByTestId("test-label");
      expect(label).toHaveAttribute("id", "username-label");
    });

    it("should accept aria attributes", () => {
      render(
        <Label
          aria-label="Form label"
          aria-describedby="label-help"
          data-testid="test-label"
        >
          Username
        </Label>
      );

      const label = screen.getByTestId("test-label");

      expect(label).toHaveAttribute("aria-label", "Form label");
      expect(label).toHaveAttribute("aria-describedby", "label-help");
    });

    it("should accept data attributes", () => {
      render(
        <Label data-cy="username-label" data-testid="test-label">
          Username
        </Label>
      );

      const label = screen.getByTestId("test-label");
      expect(label).toHaveAttribute("data-cy", "username-label");
    });

    it("should accept title attribute", () => {
      render(
        <Label title="This is the username field" data-testid="test-label">
          Username
        </Label>
      );

      const label = screen.getByTestId("test-label");
      expect(label).toHaveAttribute("title", "This is the username field");
    });

    it("should accept form attribute", () => {
      render(
        <Label form="login-form" data-testid="test-label">
          Username
        </Label>
      );

      const label = screen.getByTestId("test-label");
      expect(label).toHaveAttribute("form", "login-form");
    });

    it("should handle boolean attributes", () => {
      render(
        <Label hidden data-testid="test-label">
          Hidden Label
        </Label>
      );

      const label = screen.getByTestId("test-label");
      expect(label).toHaveAttribute("hidden");
    });
  });

  describe("Custom Styling", () => {
    it("should merge custom className with default classes", () => {
      render(
        <Label className="custom-class text-red-500" data-testid="test-label">
          Custom Label
        </Label>
      );

      const label = screen.getByTestId("test-label");

      expect(label).toHaveClass("custom-class", "text-red-500");
      expect(label).toHaveClass(
        "text-sm",
        "font-medium",
        "leading-none",
        "peer-disabled:cursor-not-allowed",
        "peer-disabled:opacity-70"
      );
    });

    it("should allow overriding default classes", () => {
      render(
        <Label className="text-lg font-bold" data-testid="test-label">
          Large Bold Label
        </Label>
      );

      const label = screen.getByTestId("test-label");

      expect(label).toHaveClass("text-lg", "font-bold");
      expect(label).toHaveClass(
        "peer-disabled:cursor-not-allowed",
        "peer-disabled:opacity-70"
      );
    });

    it("should handle empty className", () => {
      render(
        <Label className="" data-testid="test-label">
          Default Styled Label
        </Label>
      );

      const label = screen.getByTestId("test-label");

      expect(label).toHaveClass(
        "text-sm",
        "font-medium",
        "leading-none",
        "peer-disabled:cursor-not-allowed",
        "peer-disabled:opacity-70"
      );
    });

    it("should handle undefined className", () => {
      render(
        <Label className={undefined} data-testid="test-label">
          Default Styled Label
        </Label>
      );

      const label = screen.getByTestId("test-label");

      expect(label).toHaveClass(
        "text-sm",
        "font-medium",
        "leading-none",
        "peer-disabled:cursor-not-allowed",
        "peer-disabled:opacity-70"
      );
    });
  });

  describe("User Interactions", () => {
    it("should handle onClick events", () => {
      const handleClick = jest.fn();
      render(
        <Label onClick={handleClick} data-testid="test-label">
          Clickable Label
        </Label>
      );

      const label = screen.getByTestId("test-label");
      fireEvent.click(label);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should handle onMouseEnter events", () => {
      const handleMouseEnter = jest.fn();
      render(
        <Label onMouseEnter={handleMouseEnter} data-testid="test-label">
          Hoverable Label
        </Label>
      );

      const label = screen.getByTestId("test-label");
      fireEvent.mouseEnter(label);

      expect(handleMouseEnter).toHaveBeenCalledTimes(1);
    });

    it("should handle onMouseLeave events", () => {
      const handleMouseLeave = jest.fn();
      render(
        <Label onMouseLeave={handleMouseLeave} data-testid="test-label">
          Hoverable Label
        </Label>
      );

      const label = screen.getByTestId("test-label");
      fireEvent.mouseLeave(label);

      expect(handleMouseLeave).toHaveBeenCalledTimes(1);
    });

    it("should handle onFocus events", () => {
      const handleFocus = jest.fn();
      render(
        <Label tabIndex={0} onFocus={handleFocus} data-testid="test-label">
          Focusable Label
        </Label>
      );

      const label = screen.getByTestId("test-label");
      fireEvent.focus(label);

      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it("should handle onBlur events", () => {
      const handleBlur = jest.fn();
      render(
        <Label tabIndex={0} onBlur={handleBlur} data-testid="test-label">
          Focusable Label
        </Label>
      );

      const label = screen.getByTestId("test-label");

      fireEvent.focus(label);
      fireEvent.blur(label);

      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it("should handle keyboard events", () => {
      const handleKeyDown = jest.fn();
      render(
        <Label tabIndex={0} onKeyDown={handleKeyDown} data-testid="test-label">
          Keyboard Label
        </Label>
      );

      const label = screen.getByTestId("test-label");
      fireEvent.keyDown(label, { key: "Enter", code: "Enter" });

      expect(handleKeyDown).toHaveBeenCalledTimes(1);
      expect(handleKeyDown).toHaveBeenCalledWith(
        expect.objectContaining({
          key: "Enter",
          code: "Enter",
        })
      );
    });

    it("should handle multiple events together", () => {
      const handleClick = jest.fn();
      const handleMouseEnter = jest.fn();
      const handleMouseLeave = jest.fn();

      render(
        <Label
          data-testid="test-label"
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Interactive Label
        </Label>
      );

      const label = screen.getByTestId("test-label");

      fireEvent.mouseEnter(label);
      expect(handleMouseEnter).toHaveBeenCalledTimes(1);

      fireEvent.click(label);
      expect(handleClick).toHaveBeenCalledTimes(1);

      fireEvent.mouseLeave(label);
      expect(handleMouseLeave).toHaveBeenCalledTimes(1);
    });
  });

  describe("Form Association", () => {
    it("should associate with input element via htmlFor", () => {
      render(
        <div>
          <Label htmlFor="username-input" data-testid="test-label">
            Username
          </Label>

          <input id="username-input" data-testid="test-input" />
        </div>
      );

      const label = screen.getByTestId("test-label");
      const input = screen.getByTestId("test-input");

      expect(label).toHaveAttribute("for", "username-input");
      expect(input).toHaveAttribute("id", "username-input");
    });

    it("should focus associated input when clicked", () => {
      render(
        <div>
          <Label htmlFor="username-input" data-testid="test-label">
            Username
          </Label>

          <input id="username-input" data-testid="test-input" />
        </div>
      );

      const label = screen.getByTestId("test-label");
      const input = screen.getByTestId("test-input");

      expect(label).toHaveAttribute("for", "username-input");
      expect(input).toHaveAttribute("id", "username-input");

      input.focus();
      expect(input).toHaveFocus();
    });

    it("should work with nested input elements", () => {
      render(
        <Label data-testid="test-label">
          Username
          <input data-testid="test-input" />
        </Label>
      );

      const label = screen.getByTestId("test-label");
      const input = screen.getByTestId("test-input");

      expect(label).toContainElement(input);

      input.focus();
      expect(input).toHaveFocus();
    });

    it("should work with multiple input types", () => {
      const { rerender } = render(
        <div>
          <Label htmlFor="test-input" data-testid="test-label">
            Test Input
          </Label>

          <input type="text" id="test-input" data-testid="test-input" />
        </div>
      );

      let label = screen.getByTestId("test-label");
      let input = screen.getByTestId("test-input");

      expect(label).toHaveAttribute("for", "test-input");
      expect(input).toHaveAttribute("id", "test-input");
      expect(input).toHaveAttribute("type", "text");

      rerender(
        <div>
          <Label htmlFor="test-checkbox" data-testid="test-label">
            Test Checkbox
          </Label>

          <input type="checkbox" id="test-checkbox" data-testid="test-input" />
        </div>
      );

      label = screen.getByTestId("test-label");
      input = screen.getByTestId("test-input");

      expect(label).toHaveAttribute("for", "test-checkbox");
      expect(input).toHaveAttribute("id", "test-checkbox");
      expect(input).toHaveAttribute("type", "checkbox");
    });

    it("should work with textarea elements", () => {
      render(
        <div>
          <Label htmlFor="description-textarea" data-testid="test-label">
            Description
          </Label>

          <textarea id="description-textarea" data-testid="test-textarea" />
        </div>
      );

      const label = screen.getByTestId("test-label");
      const textarea = screen.getByTestId("test-textarea");

      expect(label).toHaveAttribute("for", "description-textarea");
      expect(textarea).toHaveAttribute("id", "description-textarea");

      textarea.focus();
      expect(textarea).toHaveFocus();
    });
  });

  describe("Ref Forwarding", () => {
    it("should forward ref to label element", () => {
      const ref = React.createRef<HTMLLabelElement>();

      render(
        <Label ref={ref} data-testid="test-label">
          Ref Label
        </Label>
      );

      expect(ref.current).toBeInstanceOf(HTMLLabelElement);
      expect(ref.current).toBe(screen.getByTestId("test-label"));
    });

    it("should allow ref methods to be called", () => {
      const ref = React.createRef<HTMLLabelElement>();
      render(
        <Label ref={ref} tabIndex={0} data-testid="test-label">
          Focusable Label
        </Label>
      );

      ref.current?.focus();
      expect(ref.current).toHaveFocus();

      ref.current?.blur();
      expect(ref.current).not.toHaveFocus();
    });

    it("should allow accessing element properties via ref", () => {
      const ref = React.createRef<HTMLLabelElement>();
      render(
        <Label ref={ref} data-testid="test-label">
          Test Content
        </Label>
      );

      expect(ref.current?.textContent).toBe("Test Content");
      expect(ref.current?.tagName).toBe("LABEL");
    });
  });

  describe("Accessibility", () => {
    it("should be accessible by screen readers", () => {
      render(
        <Label aria-label="Username field label" data-testid="test-label">
          Username
        </Label>
      );

      const label = screen.getByTestId("test-label");
      expect(label).toHaveAccessibleName("Username field label");
    });

    it("should support role attribute", () => {
      render(
        <Label role="heading" data-testid="test-label">
          Form Section
        </Label>
      );

      const label = screen.getByTestId("test-label");
      expect(label).toHaveAttribute("role", "heading");
    });

    it("should support aria-labelledby", () => {
      render(
        <div>
          <div id="section-title">Personal Information</div>

          <Label aria-labelledby="section-title" data-testid="test-label">
            Name
          </Label>
        </div>
      );

      const label = screen.getByTestId("test-label");
      expect(label).toHaveAttribute("aria-labelledby", "section-title");
    });

    it("should support aria-describedby", () => {
      render(
        <div>
          <Label aria-describedby="name-help" data-testid="test-label">
            Full Name
          </Label>

          <div id="name-help">Enter your first and last name</div>
        </div>
      );

      const label = screen.getByTestId("test-label");
      expect(label).toHaveAttribute("aria-describedby", "name-help");
    });

    it("should handle aria-required correctly", () => {
      render(
        <Label aria-required="true" data-testid="test-label">
          Required Field
        </Label>
      );

      const label = screen.getByTestId("test-label");
      expect(label).toHaveAttribute("aria-required", "true");
    });

    it("should be keyboard navigable when focusable", () => {
      render(
        <Label tabIndex={0} data-testid="test-label">
          Focusable Label
        </Label>
      );

      const label = screen.getByTestId("test-label");

      label.focus();
      expect(label).toHaveFocus();

      fireEvent.keyDown(label, { key: "Tab" });
    });
  });

  describe("Disabled State Styling", () => {
    it("should apply peer-disabled styles when used with disabled peer", () => {
      render(
        <div>
          <input disabled className="peer" data-testid="disabled-input" />

          <Label
            className="peer-disabled:text-gray-400"
            data-testid="test-label"
          >
            Disabled Field
          </Label>
        </div>
      );

      const label = screen.getByTestId("test-label");
      const input = screen.getByTestId("disabled-input");

      expect(input).toBeDisabled();
      expect(label).toHaveClass("peer-disabled:cursor-not-allowed");
      expect(label).toHaveClass("peer-disabled:opacity-70");
    });

    it("should maintain peer-disabled classes from variants", () => {
      render(
        <Label data-testid="test-label">Field with Peer Disabled Styles</Label>
      );

      const label = screen.getByTestId("test-label");

      expect(label).toHaveClass(
        "peer-disabled:cursor-not-allowed",
        "peer-disabled:opacity-70"
      );
    });
  });

  describe("Edge Cases", () => {
    it("should handle null and undefined props gracefully", () => {
      render(
        <Label
          className={undefined}
          data-testid="test-label"
          htmlFor={undefined}
          onClick={undefined}
        >
          Graceful Label
        </Label>
      );

      const label = screen.getByTestId("test-label");

      expect(label).toBeInTheDocument();
      expect(label).toHaveTextContent("Graceful Label");
    });

    it("should handle very long text content", () => {
      const longText = "A".repeat(1000);
      render(<Label data-testid="test-label">{longText}</Label>);

      const label = screen.getByTestId("test-label");
      expect(label).toHaveTextContent(longText);
    });

    it("should handle special characters in text", () => {
      const specialText =
        "Label with special chars: !@#$%^&*()_+-=[]{}|;:,.<>?";
      render(<Label data-testid="test-label">{specialText}</Label>);

      const label = screen.getByTestId("test-label");
      expect(label).toHaveTextContent(specialText);
    });

    it("should handle unicode characters", () => {
      const unicodeText = "ラベル 🏷️ étiquette";
      render(<Label data-testid="test-label">{unicodeText}</Label>);

      const label = screen.getByTestId("test-label");
      expect(label).toHaveTextContent(unicodeText);
    });

    it("should maintain ref stability across renders", () => {
      const ref = React.createRef<HTMLLabelElement>();

      const { rerender } = render(
        <Label ref={ref} data-testid="test-label">
          First Text
        </Label>
      );

      const firstRef = ref.current;

      rerender(
        <Label ref={ref} data-testid="test-label">
          Second Text
        </Label>
      );

      expect(ref.current).toBe(firstRef);
    });

    it("should handle dynamic className changes", () => {
      const { rerender } = render(
        <Label className="text-blue-500" data-testid="test-label">
          Dynamic Label
        </Label>
      );

      const label = screen.getByTestId("test-label");
      expect(label).toHaveClass("text-blue-500");

      rerender(
        <Label className="text-red-500" data-testid="test-label">
          Dynamic Label
        </Label>
      );

      expect(label).toHaveClass("text-red-500");
      expect(label).not.toHaveClass("text-blue-500");
    });
  });

  describe("Integration with Forms", () => {
    it("should work in complex form structures", () => {
      render(
        <form data-testid="test-form">
          <fieldset>
            <legend>User Information</legend>

            <div>
              <Label htmlFor="firstName" data-testid="first-name-label">
                First Name
              </Label>

              <input id="firstName" name="firstName" required />
            </div>

            <div>
              <Label htmlFor="lastName" data-testid="last-name-label">
                Last Name
              </Label>

              <input id="lastName" name="lastName" required />
            </div>
          </fieldset>
        </form>
      );

      const firstNameLabel = screen.getByTestId("first-name-label");
      const lastNameLabel = screen.getByTestId("last-name-label");

      expect(firstNameLabel).toBeInTheDocument();
      expect(lastNameLabel).toBeInTheDocument();
      expect(firstNameLabel).toHaveAttribute("for", "firstName");
      expect(lastNameLabel).toHaveAttribute("for", "lastName");
    });

    it("should work with form validation states", () => {
      render(
        <div>
          <Label
            className="text-red-500"
            data-testid="test-label"
            htmlFor="email"
          >
            Email (invalid)
          </Label>

          <input
            aria-describedby="email-error"
            aria-invalid="true"
            id="email"
            type="email"
          />

          <div id="email-error">Please enter a valid email address</div>
        </div>
      );

      const label = screen.getByTestId("test-label");

      expect(label).toHaveClass("text-red-500");
      expect(label).toHaveTextContent("Email (invalid)");
    });
  });
});
