import "@testing-library/jest-dom";

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

describe("Collapsible Component", () => {
  describe("Basic Rendering", () => {
    it("should render collapsible with default props", () => {
      render(
        <Collapsible data-testid="collapsible">
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>

          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );

      const collapsible = screen.getByTestId("collapsible");

      expect(collapsible).toBeInTheDocument();
      expect(collapsible).toHaveAttribute("data-slot", "collapsible");
    });

    it("should render with custom className", () => {
      render(
        <Collapsible className="custom-collapsible" data-testid="collapsible">
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>

          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );

      const collapsible = screen.getByTestId("collapsible");

      expect(collapsible).toHaveClass("custom-collapsible");
    });

    it("should pass through additional props", () => {
      render(
        <Collapsible
          aria-label="Test collapsible"
          data-testid="collapsible"
          id="test-collapsible"
        >
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>

          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );

      const collapsible = screen.getByTestId("collapsible");

      expect(collapsible).toHaveAttribute("id", "test-collapsible");
      expect(collapsible).toHaveAttribute("aria-label", "Test collapsible");
    });

    it("should render in closed state by default", () => {
      render(
        <Collapsible data-testid="collapsible">
          <CollapsibleTrigger data-testid="trigger">Toggle</CollapsibleTrigger>

          <CollapsibleContent data-testid="content">Content</CollapsibleContent>
        </Collapsible>
      );

      const trigger = screen.getByTestId("trigger");

      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(trigger).toHaveAttribute("data-state", "closed");
    });

    it("should render in open state when defaultOpen is true", () => {
      render(
        <Collapsible defaultOpen data-testid="collapsible">
          <CollapsibleTrigger data-testid="trigger">Toggle</CollapsibleTrigger>

          <CollapsibleContent data-testid="content">Content</CollapsibleContent>
        </Collapsible>
      );

      const trigger = screen.getByTestId("trigger");

      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(trigger).toHaveAttribute("data-state", "open");
    });
  });

  describe("Controlled State", () => {
    it("should handle controlled open state", () => {
      const onOpenChange = jest.fn();

      const { rerender } = render(
        <Collapsible
          data-testid="collapsible"
          onOpenChange={onOpenChange}
          open={false}
        >
          <CollapsibleTrigger data-testid="trigger">Toggle</CollapsibleTrigger>

          <CollapsibleContent data-testid="content">Content</CollapsibleContent>
        </Collapsible>
      );

      const trigger = screen.getByTestId("trigger");

      expect(trigger).toHaveAttribute("aria-expanded", "false");

      rerender(
        <Collapsible
          data-testid="collapsible"
          onOpenChange={onOpenChange}
          open={true}
        >
          <CollapsibleTrigger data-testid="trigger">Toggle</CollapsibleTrigger>

          <CollapsibleContent data-testid="content">Content</CollapsibleContent>
        </Collapsible>
      );

      expect(trigger).toHaveAttribute("aria-expanded", "true");
    });

    it("should call onOpenChange when state changes", () => {
      const onOpenChange = jest.fn();

      render(
        <Collapsible onOpenChange={onOpenChange} data-testid="collapsible">
          <CollapsibleTrigger data-testid="trigger">Toggle</CollapsibleTrigger>

          <CollapsibleContent data-testid="content">Content</CollapsibleContent>
        </Collapsible>
      );

      const trigger = screen.getByTestId("trigger");
      fireEvent.click(trigger);

      expect(onOpenChange).toHaveBeenCalledWith(true);
    });
  });

  describe("Disabled State", () => {
    it("should handle disabled state", () => {
      render(
        <Collapsible disabled data-testid="collapsible">
          <CollapsibleTrigger data-testid="trigger">Toggle</CollapsibleTrigger>

          <CollapsibleContent data-testid="content">Content</CollapsibleContent>
        </Collapsible>
      );

      const collapsible = screen.getByTestId("collapsible");
      const trigger = screen.getByTestId("trigger");

      expect(collapsible).toHaveAttribute("data-disabled");
      expect(trigger).toHaveAttribute("data-disabled");
      expect(trigger).toBeDisabled();
    });

    it("should not toggle when disabled", () => {
      const onOpenChange = jest.fn();

      render(
        <Collapsible
          data-testid="collapsible"
          disabled
          onOpenChange={onOpenChange}
        >
          <CollapsibleTrigger data-testid="trigger">Toggle</CollapsibleTrigger>

          <CollapsibleContent data-testid="content">Content</CollapsibleContent>
        </Collapsible>
      );

      const trigger = screen.getByTestId("trigger");
      fireEvent.click(trigger);

      expect(onOpenChange).not.toHaveBeenCalled();
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });
  });
});

describe("CollapsibleTrigger Component", () => {
  describe("Basic Rendering", () => {
    it("should render trigger with default props", () => {
      render(
        <Collapsible>
          <CollapsibleTrigger data-testid="trigger">Toggle</CollapsibleTrigger>

          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );

      const trigger = screen.getByTestId("trigger");

      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveAttribute("data-slot", "collapsible-trigger");
      expect(trigger).toHaveTextContent("Toggle");
    });

    it("should render as button by default", () => {
      render(
        <Collapsible>
          <CollapsibleTrigger data-testid="trigger">Toggle</CollapsibleTrigger>

          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );

      const trigger = screen.getByTestId("trigger");

      expect(trigger.tagName).toBe("BUTTON");
      expect(trigger).toHaveAttribute("type", "button");
    });

    it("should render with custom className", () => {
      render(
        <Collapsible>
          <CollapsibleTrigger className="custom-trigger" data-testid="trigger">
            Toggle
          </CollapsibleTrigger>

          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );

      const trigger = screen.getByTestId("trigger");

      expect(trigger).toHaveClass("custom-trigger");
    });

    it("should pass through additional props", () => {
      render(
        <Collapsible>
          <CollapsibleTrigger
            aria-label="Toggle content"
            data-testid="trigger"
            id="test-trigger"
          >
            Toggle
          </CollapsibleTrigger>

          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );

      const trigger = screen.getByTestId("trigger");

      expect(trigger).toHaveAttribute("id", "test-trigger");
      expect(trigger).toHaveAttribute("aria-label", "Toggle content");
    });

    it("should render as custom element with asChild", () => {
      render(
        <Collapsible>
          <CollapsibleTrigger asChild data-testid="trigger">
            <div role="button">Custom Trigger</div>
          </CollapsibleTrigger>

          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );

      const trigger = screen.getByTestId("trigger");

      expect(trigger.tagName).toBe("DIV");
      expect(trigger).toHaveAttribute("role", "button");
      expect(trigger).toHaveTextContent("Custom Trigger");
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA attributes", () => {
      render(
        <Collapsible>
          <CollapsibleTrigger data-testid="trigger">Toggle</CollapsibleTrigger>

          <CollapsibleContent data-testid="content">Content</CollapsibleContent>
        </Collapsible>
      );

      const trigger = screen.getByTestId("trigger");
      const content = screen.getByTestId("content");

      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(trigger).toHaveAttribute("aria-controls", content.id);
      expect(trigger).toHaveAttribute("data-state", "closed");
    });

    it("should update ARIA attributes when opened", async () => {
      render(
        <Collapsible>
          <CollapsibleTrigger data-testid="trigger">Toggle</CollapsibleTrigger>

          <CollapsibleContent data-testid="content">Content</CollapsibleContent>
        </Collapsible>
      );

      const trigger = screen.getByTestId("trigger");

      fireEvent.click(trigger);

      await waitFor(() => {
        expect(trigger).toHaveAttribute("aria-expanded", "true");
        expect(trigger).toHaveAttribute("data-state", "open");
      });
    });

    it("should support keyboard navigation", async () => {
      render(
        <Collapsible>
          <CollapsibleTrigger data-testid="trigger">Toggle</CollapsibleTrigger>

          <CollapsibleContent data-testid="content">Content</CollapsibleContent>
        </Collapsible>
      );

      const trigger = screen.getByTestId("trigger");

      expect(trigger).toHaveAttribute("type", "button");
      expect(trigger).not.toHaveAttribute("disabled");

      trigger.focus();
      expect(trigger).toHaveFocus();

      fireEvent.click(trigger);

      await waitFor(() => {
        expect(trigger).toHaveAttribute("aria-expanded", "true");
      });
    });
  });

  describe("Interactive Behavior", () => {
    it("should toggle collapsible on click", async () => {
      render(
        <Collapsible>
          <CollapsibleTrigger data-testid="trigger">Toggle</CollapsibleTrigger>

          <CollapsibleContent data-testid="content">Content</CollapsibleContent>
        </Collapsible>
      );

      const trigger = screen.getByTestId("trigger");

      expect(trigger).toHaveAttribute("aria-expanded", "false");

      fireEvent.click(trigger);

      await waitFor(() => {
        expect(trigger).toHaveAttribute("aria-expanded", "true");
      });

      fireEvent.click(trigger);

      await waitFor(() => {
        expect(trigger).toHaveAttribute("aria-expanded", "false");
      });
    });

    it("should handle custom click events", () => {
      const handleClick = jest.fn();

      render(
        <Collapsible>
          <CollapsibleTrigger onClick={handleClick} data-testid="trigger">
            Toggle
          </CollapsibleTrigger>

          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );

      const trigger = screen.getByTestId("trigger");
      fireEvent.click(trigger);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });
});

describe("CollapsibleContent Component", () => {
  describe("Basic Rendering", () => {
    it("should render content with default props", () => {
      render(
        <Collapsible defaultOpen>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>

          <CollapsibleContent data-testid="content">
            Content text
          </CollapsibleContent>
        </Collapsible>
      );

      const content = screen.getByTestId("content");

      expect(content).toBeInTheDocument();
      expect(content).toHaveAttribute("data-slot", "collapsible-content");
      expect(content).toHaveTextContent("Content text");
    });

    it("should render with custom className", () => {
      render(
        <Collapsible defaultOpen>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>

          <CollapsibleContent className="custom-content" data-testid="content">
            Content
          </CollapsibleContent>
        </Collapsible>
      );

      const content = screen.getByTestId("content");

      expect(content).toHaveClass("custom-content");
    });

    it("should pass through additional props", () => {
      render(
        <Collapsible defaultOpen>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>

          <CollapsibleContent
            data-testid="content"
            id="test-content"
            role="region"
          >
            Content
          </CollapsibleContent>
        </Collapsible>
      );

      const content = screen.getByTestId("content");

      expect(content).toHaveAttribute("id", "test-content");
      expect(content).toHaveAttribute("role", "region");
    });

    it("should be hidden when collapsible is closed", () => {
      render(
        <Collapsible>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>

          <CollapsibleContent data-testid="content">Content</CollapsibleContent>
        </Collapsible>
      );

      const content = screen.getByTestId("content");

      expect(content).toHaveAttribute("data-state", "closed");
      expect(content).toHaveStyle({ display: "none" });
    });

    it("should be visible when collapsible is open", () => {
      render(
        <Collapsible defaultOpen>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>

          <CollapsibleContent data-testid="content">Content</CollapsibleContent>
        </Collapsible>
      );

      const content = screen.getByTestId("content");

      expect(content).toHaveAttribute("data-state", "open");
      expect(content).not.toHaveStyle({ display: "none" });
    });
  });

  describe("Animation and Transitions", () => {
    it("should handle opening animation", async () => {
      render(
        <Collapsible>
          <CollapsibleTrigger data-testid="trigger">Toggle</CollapsibleTrigger>

          <CollapsibleContent data-testid="content">Content</CollapsibleContent>
        </Collapsible>
      );

      const trigger = screen.getByTestId("trigger");
      const content = screen.getByTestId("content");

      expect(content).toHaveAttribute("data-state", "closed");

      fireEvent.click(trigger);

      await waitFor(() => {
        expect(content).toHaveAttribute("data-state", "open");
      });
    });

    it("should handle closing animation", async () => {
      render(
        <Collapsible defaultOpen>
          <CollapsibleTrigger data-testid="trigger">Toggle</CollapsibleTrigger>

          <CollapsibleContent data-testid="content">Content</CollapsibleContent>
        </Collapsible>
      );

      const trigger = screen.getByTestId("trigger");
      const content = screen.getByTestId("content");

      expect(content).toHaveAttribute("data-state", "open");

      fireEvent.click(trigger);

      await waitFor(() => {
        expect(content).toHaveAttribute("data-state", "closed");
      });
    });
  });

  describe("Content Types", () => {
    it("should render text content", () => {
      render(
        <Collapsible defaultOpen>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>

          <CollapsibleContent data-testid="content">
            Simple text content
          </CollapsibleContent>
        </Collapsible>
      );

      const content = screen.getByTestId("content");

      expect(content).toHaveTextContent("Simple text content");
    });

    it("should render complex JSX content", () => {
      render(
        <Collapsible defaultOpen>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>

          <CollapsibleContent data-testid="content">
            <div data-testid="complex-content">
              <h3>Heading</h3>

              <p>Paragraph content</p>

              <ul>
                <li>List item 1</li>

                <li>List item 2</li>
              </ul>
            </div>
          </CollapsibleContent>
        </Collapsible>
      );

      const content = screen.getByTestId("content");
      const complexContent = screen.getByTestId("complex-content");

      expect(content).toContainElement(complexContent);
      expect(complexContent).toHaveTextContent("Heading");
      expect(complexContent).toHaveTextContent("Paragraph content");
      expect(complexContent).toHaveTextContent("List item 1");
    });
  });
});

describe("Collapsible Integration", () => {
  describe("Complete Collapsible Structure", () => {
    it("should render a complete collapsible with proper relationships", async () => {
      render(
        <Collapsible data-testid="collapsible">
          <CollapsibleTrigger data-testid="trigger">
            Show Details
          </CollapsibleTrigger>

          <CollapsibleContent data-testid="content">
            <div data-testid="details">
              <h3>Details Section</h3>

              <p>This is the collapsible content area.</p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      );

      const collapsible = screen.getByTestId("collapsible");
      const trigger = screen.getByTestId("trigger");
      const content = screen.getByTestId("content");

      expect(collapsible).toContainElement(trigger);
      expect(collapsible).toContainElement(content);

      expect(trigger).toHaveAttribute("aria-controls", content.id);
      expect(trigger).toHaveAttribute("aria-expanded", "false");

      fireEvent.click(trigger);

      await waitFor(() => {
        expect(trigger).toHaveAttribute("aria-expanded", "true");
      });

      const details = screen.getByTestId("details");
      expect(content).toContainElement(details);
    });

    it("should handle multiple collapsibles independently", () => {
      render(
        <div>
          <Collapsible data-testid="collapsible-1">
            <CollapsibleTrigger data-testid="trigger-1">
              Toggle 1
            </CollapsibleTrigger>

            <CollapsibleContent data-testid="content-1">
              Content 1
            </CollapsibleContent>
          </Collapsible>

          <Collapsible data-testid="collapsible-2">
            <CollapsibleTrigger data-testid="trigger-2">
              Toggle 2
            </CollapsibleTrigger>

            <CollapsibleContent data-testid="content-2">
              Content 2
            </CollapsibleContent>
          </Collapsible>
        </div>
      );

      const trigger1 = screen.getByTestId("trigger-1");
      const trigger2 = screen.getByTestId("trigger-2");

      expect(trigger1).toHaveAttribute("aria-expanded", "false");
      expect(trigger2).toHaveAttribute("aria-expanded", "false");

      fireEvent.click(trigger1);

      expect(trigger1).toHaveAttribute("aria-expanded", "true");
      expect(trigger2).toHaveAttribute("aria-expanded", "false");

      fireEvent.click(trigger2);

      expect(trigger1).toHaveAttribute("aria-expanded", "true");
      expect(trigger2).toHaveAttribute("aria-expanded", "true");
    });
  });

  describe("Complex Interactions", () => {
    it("should handle nested collapsibles", async () => {
      render(
        <Collapsible data-testid="outer-collapsible">
          <CollapsibleTrigger data-testid="outer-trigger">
            Outer Toggle
          </CollapsibleTrigger>

          <CollapsibleContent data-testid="outer-content">
            <div>Outer content</div>

            <Collapsible data-testid="inner-collapsible">
              <CollapsibleTrigger data-testid="inner-trigger">
                Inner Toggle
              </CollapsibleTrigger>

              <CollapsibleContent data-testid="inner-content">
                Inner content
              </CollapsibleContent>
            </Collapsible>
          </CollapsibleContent>
        </Collapsible>
      );

      const outerTrigger = screen.getByTestId("outer-trigger");

      fireEvent.click(outerTrigger);

      await waitFor(() => {
        expect(outerTrigger).toHaveAttribute("aria-expanded", "true");
      });

      const innerTrigger = screen.getByTestId("inner-trigger");

      fireEvent.click(innerTrigger);

      await waitFor(() => {
        expect(innerTrigger).toHaveAttribute("aria-expanded", "true");
      });

      expect(outerTrigger).toHaveAttribute("aria-expanded", "true");
      expect(innerTrigger).toHaveAttribute("aria-expanded", "true");
    });

    it("should handle form elements within content", async () => {
      const handleSubmit = jest.fn((e) => {
        e.preventDefault();
      });

      render(
        <Collapsible defaultOpen>
          <CollapsibleTrigger data-testid="trigger">
            Show Form
          </CollapsibleTrigger>

          <CollapsibleContent data-testid="content">
            <form onSubmit={handleSubmit} data-testid="form">
              <input type="text" placeholder="Enter text" data-testid="input" />

              <button type="submit" data-testid="submit">
                Submit
              </button>
            </form>
          </CollapsibleContent>
        </Collapsible>
      );

      const input = screen.getByTestId("input");
      const submit = screen.getByTestId("submit");

      fireEvent.change(input, { target: { value: "test value" } });

      expect(input).toHaveValue("test value");

      fireEvent.click(submit);

      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });
  });

  describe("Performance and Edge Cases", () => {
    it("should handle rapid toggle operations", async () => {
      render(
        <Collapsible>
          <CollapsibleTrigger data-testid="trigger">Toggle</CollapsibleTrigger>

          <CollapsibleContent data-testid="content">Content</CollapsibleContent>
        </Collapsible>
      );

      const trigger = screen.getByTestId("trigger");

      fireEvent.click(trigger);
      fireEvent.click(trigger);
      fireEvent.click(trigger);

      await waitFor(() => {
        expect(trigger).toHaveAttribute("aria-expanded", "true");
      });
    });

    it("should handle content updates while open", () => {
      const { rerender } = render(
        <Collapsible defaultOpen>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>

          <CollapsibleContent data-testid="content">
            Initial content
          </CollapsibleContent>
        </Collapsible>
      );

      expect(screen.getByText("Initial content")).toBeInTheDocument();

      rerender(
        <Collapsible defaultOpen>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>

          <CollapsibleContent data-testid="content">
            Updated content
          </CollapsibleContent>
        </Collapsible>
      );

      expect(screen.getByText("Updated content")).toBeInTheDocument();
      expect(screen.queryByText("Initial content")).not.toBeInTheDocument();
    });
  });
});
