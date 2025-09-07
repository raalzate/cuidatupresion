import "@testing-library/jest-dom";

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

describe("Dialog Component", () => {
  describe("Basic Rendering", () => {
    it("should render dialog with default props", () => {
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog Title</DialogTitle>

              <DialogDescription>Dialog Description</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      );

      const trigger = screen.getByText("Open Dialog");

      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveAttribute("data-slot", "dialog-trigger");
    });

    it("should render with custom props", () => {
      render(
        <Dialog defaultOpen data-testid="dialog">
          <DialogTrigger>Open Dialog</DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog Title</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      );

      const dialogContent = screen.getByRole("dialog");

      expect(dialogContent).toBeInTheDocument();
    });
  });

  describe("Dialog Trigger", () => {
    it("should render trigger with correct attributes", () => {
      render(
        <Dialog>
          <DialogTrigger className="custom-trigger" data-testid="trigger">
            Open Dialog
          </DialogTrigger>

          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      const trigger = screen.getByTestId("trigger");

      expect(trigger).toHaveAttribute("data-slot", "dialog-trigger");
      expect(trigger).toHaveClass("custom-trigger");
    });

    it("should handle click events", () => {
      render(
        <Dialog>
          <DialogTrigger data-testid="trigger">Open Dialog</DialogTrigger>

          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>

            <p>Dialog content</p>
          </DialogContent>
        </Dialog>
      );

      const trigger = screen.getByTestId("trigger");
      fireEvent.click(trigger);

      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("should work as different elements", () => {
      render(
        <Dialog>
          <DialogTrigger asChild>
            <button data-testid="custom-trigger">Custom Button</button>
          </DialogTrigger>

          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      const trigger = screen.getByTestId("custom-trigger");

      expect(trigger.tagName).toBe("BUTTON");
    });
  });

  describe("Dialog Content", () => {
    it("should render content with proper structure", () => {
      render(
        <Dialog defaultOpen>
          <DialogContent data-testid="content">
            <DialogTitle>Test Title</DialogTitle>

            <p>Content text</p>
          </DialogContent>
        </Dialog>
      );

      const content = screen.getByTestId("content");

      expect(content).toHaveAttribute("data-slot", "dialog-content");
      expect(content).toHaveClass(
        "bg-background",
        "fixed",
        "top-[50%]",
        "left-[50%]",
        "z-50"
      );
    });

    it("should render with custom className", () => {
      render(
        <Dialog defaultOpen>
          <DialogContent className="custom-dialog" data-testid="content">
            <DialogTitle>Test Title</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      const content = screen.getByTestId("content");

      expect(content).toHaveClass("custom-dialog");
    });

    it("should show close button by default", () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Test Title</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      const closeButton = screen.getByRole("button", { name: /close/i });

      expect(closeButton).toBeInTheDocument();
      expect(closeButton).toHaveAttribute("data-slot", "dialog-close");
    });

    it("should hide close button when showCloseButton is false", () => {
      render(
        <Dialog defaultOpen>
          <DialogContent showCloseButton={false}>
            <DialogTitle>Test Title</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      const closeButton = screen.queryByRole("button", { name: /close/i });

      expect(closeButton).not.toBeInTheDocument();
    });

    it("should include overlay", () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Test Title</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      const overlay = document.querySelector('[data-slot="dialog-overlay"]');

      expect(overlay).toBeInTheDocument();
      expect(overlay).toHaveClass("fixed", "inset-0", "z-50", "bg-black/50");
    });
  });

  describe("Dialog Header", () => {
    it("should render header with correct structure", () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogHeader data-testid="header">
              <DialogTitle>Test Title</DialogTitle>

              <DialogDescription>Test Description</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      );

      const header = screen.getByTestId("header");

      expect(header).toHaveAttribute("data-slot", "dialog-header");
      expect(header).toHaveClass("flex", "flex-col", "gap-2");
    });

    it("should render with custom className", () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogHeader className="custom-header" data-testid="header">
              <DialogTitle>Test Title</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      );

      const header = screen.getByTestId("header");

      expect(header).toHaveClass("custom-header");
    });
  });

  describe("Dialog Title", () => {
    it("should render title with correct attributes", () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle data-testid="title">Test Title</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      const title = screen.getByTestId("title");

      expect(title).toHaveAttribute("data-slot", "dialog-title");
      expect(title).toHaveClass("text-lg", "leading-none", "font-semibold");
      expect(title).toHaveTextContent("Test Title");
    });

    it("should render with custom className", () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle className="custom-title" data-testid="title">
              Custom Title
            </DialogTitle>
          </DialogContent>
        </Dialog>
      );

      const title = screen.getByTestId("title");

      expect(title).toHaveClass("custom-title");
    });

    it("should be accessible as dialog title", () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Accessible Title</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      const dialog = screen.getByRole("dialog");

      expect(dialog).toHaveAccessibleName("Accessible Title");
    });
  });

  describe("Dialog Description", () => {
    it("should render description with correct attributes", () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Test Title</DialogTitle>

            <DialogDescription data-testid="description">
              Test Description
            </DialogDescription>
          </DialogContent>
        </Dialog>
      );

      const description = screen.getByTestId("description");

      expect(description).toHaveAttribute("data-slot", "dialog-description");
      expect(description).toHaveClass("text-muted-foreground", "text-sm");
      expect(description).toHaveTextContent("Test Description");
    });

    it("should render with custom className", () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Test Title</DialogTitle>

            <DialogDescription
              className="custom-description"
              data-testid="description"
            >
              Custom Description
            </DialogDescription>
          </DialogContent>
        </Dialog>
      );

      const description = screen.getByTestId("description");

      expect(description).toHaveClass("custom-description");
    });

    it("should be accessible as dialog description", () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Test Title</DialogTitle>

            <DialogDescription>This is a test description</DialogDescription>
          </DialogContent>
        </Dialog>
      );

      const dialog = screen.getByRole("dialog");

      expect(dialog).toHaveAccessibleDescription("This is a test description");
    });
  });

  describe("Dialog Footer", () => {
    it("should render footer with correct structure", () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Test Title</DialogTitle>

            <DialogFooter data-testid="footer">
              <button>Cancel</button>

              <button>Confirm</button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );

      const footer = screen.getByTestId("footer");

      expect(footer).toHaveAttribute("data-slot", "dialog-footer");
      expect(footer).toHaveClass("flex", "flex-col-reverse", "gap-2");
    });

    it("should render with custom className", () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Test Title</DialogTitle>

            <DialogFooter className="custom-footer" data-testid="footer">
              <button>OK</button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );

      const footer = screen.getByTestId("footer");

      expect(footer).toHaveClass("custom-footer");
    });
  });

  describe("Dialog Close", () => {
    it("should render close button with correct attributes", () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Test Title</DialogTitle>

            <DialogClose data-testid="close-button">Custom Close</DialogClose>
          </DialogContent>
        </Dialog>
      );

      const closeButton = screen.getByTestId("close-button");

      expect(closeButton).toHaveAttribute("data-slot", "dialog-close");
      expect(closeButton).toHaveTextContent("Custom Close");
    });

    it("should close dialog when clicked", async () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Test Title</DialogTitle>

            <DialogClose data-testid="close-button">Close</DialogClose>
          </DialogContent>
        </Dialog>
      );

      const closeButton = screen.getByTestId("close-button");
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });

    it("should work with asChild", () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Test Title</DialogTitle>

            <DialogClose asChild>
              <button data-testid="custom-close">Custom Close Button</button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      );

      const closeButton = screen.getByTestId("custom-close");

      expect(closeButton.tagName).toBe("BUTTON");
    });
  });

  describe("Dialog Overlay", () => {
    it("should render overlay with correct attributes", () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Test Title</DialogTitle>

            <DialogOverlay data-testid="overlay" />
          </DialogContent>
        </Dialog>
      );

      const overlay = screen.getByTestId("overlay");

      expect(overlay).toHaveAttribute("data-slot", "dialog-overlay");
      expect(overlay).toHaveClass("fixed", "inset-0", "z-50", "bg-black/50");
    });

    it("should render with custom className", () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Test Title</DialogTitle>

            <DialogOverlay className="custom-overlay" data-testid="overlay" />
          </DialogContent>
        </Dialog>
      );

      const overlay = screen.getByTestId("overlay");

      expect(overlay).toHaveClass("custom-overlay");
    });
  });

  describe("Dialog Portal", () => {
    it("should render portal with correct attributes", () => {
      render(
        <Dialog defaultOpen>
          <DialogPortal>
            <DialogOverlay />

            <DialogContent>
              <DialogTitle>Test Title</DialogTitle>

              <div data-testid="portal-content">Portal content</div>
            </DialogContent>
          </DialogPortal>
        </Dialog>
      );

      const portalContent = screen.getByTestId("portal-content");

      expect(portalContent).toBeInTheDocument();
      expect(portalContent).toHaveTextContent("Portal content");

      const dialog = screen.getByRole("dialog");

      expect(dialog).toBeInTheDocument();
    });
  });

  describe("Interaction and State Management", () => {
    it("should handle controlled state", () => {
      const TestComponent = () => {
        const [open, setOpen] = React.useState(false);

        return (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger data-testid="trigger">Open</DialogTrigger>

            <DialogContent>
              <DialogTitle>Controlled Dialog</DialogTitle>

              <button onClick={() => setOpen(false)} data-testid="custom-close">
                Close
              </button>
            </DialogContent>
          </Dialog>
        );
      };

      render(<TestComponent />);

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

      fireEvent.click(screen.getByTestId("trigger"));
      expect(screen.getByRole("dialog")).toBeInTheDocument();

      fireEvent.click(screen.getByTestId("custom-close"));
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("should handle keyboard interactions", async () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Test Dialog</DialogTitle>

            <p>Content</p>
          </DialogContent>
        </Dialog>
      );

      const dialog = screen.getByRole("dialog");

      expect(dialog).toBeInTheDocument();

      fireEvent.keyDown(dialog, { key: "Escape", code: "Escape" });

      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });

    it("should trap focus within dialog", () => {
      render(
        <div>
          <button data-testid="outside-button">Outside</button>
          <Dialog defaultOpen>
            <DialogContent>
              <DialogTitle>Focus Test</DialogTitle>

              <button data-testid="inside-button">Inside</button>
            </DialogContent>
          </Dialog>
        </div>
      );

      const dialog = screen.getByRole("dialog");
      expect(dialog).toBeInTheDocument();

      const insideButton = screen.getByTestId("inside-button");
      const outsideButton = screen.getByTestId("outside-button");

      insideButton.focus();
      expect(document.activeElement).toBe(insideButton);

      expect(document.activeElement).not.toBe(outsideButton);
    });

    it("should restore focus after closing", async () => {
      render(
        <div>
          <Dialog>
            <DialogTrigger data-testid="trigger">Open Dialog</DialogTrigger>

            <DialogContent>
              <DialogTitle>Test Dialog</DialogTitle>

              <DialogClose data-testid="close">Close</DialogClose>
            </DialogContent>
          </Dialog>
        </div>
      );

      const trigger = screen.getByTestId("trigger");

      trigger.focus();
      expect(document.activeElement).toBe(trigger);

      fireEvent.click(trigger);
      expect(screen.getByRole("dialog")).toBeInTheDocument();

      const closeButton = screen.getByTestId("close");
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });

      expect(document.activeElement).toBe(trigger);
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA attributes", () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Accessible Dialog</DialogTitle>

            <DialogDescription>This is an accessible dialog</DialogDescription>
          </DialogContent>
        </Dialog>
      );

      const dialog = screen.getByRole("dialog");

      expect(dialog).toHaveAttribute("role", "dialog");
      expect(dialog).toHaveAccessibleName("Accessible Dialog");
      expect(dialog).toHaveAccessibleDescription(
        "This is an accessible dialog"
      );
    });

    it("should have proper close button accessibility", () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Test Dialog</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      const closeButton = screen.getByRole("button", { name: /close/i });
      expect(closeButton).toBeInTheDocument();

      const srText = closeButton.querySelector(".sr-only");
      expect(srText).toHaveTextContent("Close");

      expect(closeButton).toHaveAttribute("data-slot", "dialog-close");
    });

    it("should work with screen readers", () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Screen Reader Test</DialogTitle>

            <DialogDescription>
              This dialog should be properly announced to screen readers
            </DialogDescription>
          </DialogContent>
        </Dialog>
      );

      const dialog = screen.getByRole("dialog");

      expect(dialog).toHaveAccessibleName("Screen Reader Test");
      expect(dialog).toHaveAccessibleDescription(
        "This dialog should be properly announced to screen readers"
      );
    });
  });

  describe("Complex Scenarios", () => {
    it("should handle nested dialogs", () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Parent Dialog</DialogTitle>

            <Dialog>
              <DialogTrigger data-testid="nested-trigger">
                Open Nested
              </DialogTrigger>

              <DialogContent>
                <DialogTitle>Nested Dialog</DialogTitle>
              </DialogContent>
            </Dialog>
          </DialogContent>
        </Dialog>
      );

      expect(screen.getByText("Parent Dialog")).toBeInTheDocument();

      fireEvent.click(screen.getByTestId("nested-trigger"));
      expect(screen.getByText("Nested Dialog")).toBeInTheDocument();
    });

    it("should handle dialog with form", async () => {
      const handleSubmit = jest.fn((e) => e.preventDefault());

      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Form Dialog</DialogTitle>

            <form onSubmit={handleSubmit} data-testid="dialog-form">
              <input data-testid="form-input" placeholder="Enter text" />

              <DialogFooter>
                <DialogClose asChild>
                  <button type="button">Cancel</button>
                </DialogClose>

                <button type="submit" data-testid="submit-button">
                  Submit
                </button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      );

      const input = screen.getByTestId("form-input");
      fireEvent.change(input, { target: { value: "test input" } });

      const submitButton = screen.getByTestId("submit-button");
      fireEvent.click(submitButton);

      expect(handleSubmit).toHaveBeenCalled();
    });

    it("should handle dialog with dynamic content", () => {
      const TestComponent = () => {
        const [content, setContent] = React.useState("Initial content");

        return (
          <Dialog defaultOpen>
            <DialogContent>
              <DialogTitle>Dynamic Dialog</DialogTitle>

              <p data-testid="dynamic-content">{content}</p>

              <button
                data-testid="update-button"
                onClick={() => setContent("Updated content")}
              >
                Update Content
              </button>
            </DialogContent>
          </Dialog>
        );
      };

      render(<TestComponent />);

      expect(screen.getByTestId("dynamic-content")).toHaveTextContent(
        "Initial content"
      );

      fireEvent.click(screen.getByTestId("update-button"));
      expect(screen.getByTestId("dynamic-content")).toHaveTextContent(
        "Updated content"
      );
    });

    it("should handle dialog with custom animations", () => {
      render(
        <Dialog defaultOpen>
          <DialogContent className="custom-animation">
            <DialogTitle>Animated Dialog</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      const content = screen.getByRole("dialog");
      expect(content).toHaveClass("custom-animation");

      expect(content).toHaveClass(
        "data-[state=open]:animate-in",
        "data-[state=closed]:animate-out"
      );
    });
  });

  describe("Error Handling", () => {
    it("should handle missing title gracefully", () => {
      const originalError = console.error;
      console.error = jest.fn();

      render(
        <Dialog defaultOpen>
          <DialogContent>
            <p>Content without title</p>
          </DialogContent>
        </Dialog>
      );

      const dialog = screen.getByRole("dialog");
      expect(dialog).toBeInTheDocument();

      console.error = originalError;
    });

    it("should handle invalid props gracefully", () => {
      render(
        <Dialog defaultOpen>
          <DialogContent
            // @ts-expect-error - Testing invalid prop
            invalidProp="test"
          >
            <DialogTitle>Test Dialog</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      const dialog = screen.getByRole("dialog");
      expect(dialog).toBeInTheDocument();
    });
  });
});
