import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

jest.mock("../../../../components/ui/dialog", () => ({
  Dialog: ({
    children,
    open,
    onOpenChange,
  }: {
    children: React.ReactNode;
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }) => {
    return (
      <div
        data-open={open}
        data-testid="mock-dialog"
        onClick={() => onOpenChange(false)}
      >
        {open && children}
      </div>
    );
  },
  DialogContent: ({ children, ...props }: { children: React.ReactNode }) => (
    <div data-testid="mock-dialog-content" {...props}>
      {children}
    </div>
  ),
  DialogHeader: ({ children, ...props }: { children: React.ReactNode }) => (
    <div data-testid="mock-dialog-header" {...props}>
      {children}
    </div>
  ),
  DialogTitle: ({ children, ...props }: { children: React.ReactNode }) => (
    <h2 data-testid="mock-dialog-title" {...props}>
      {children}
    </h2>
  ),
  DialogDescription: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
  }) => (
    <p data-testid="mock-dialog-description" {...props}>
      {children}
    </p>
  ),
}));

import { Modal } from "../../../../components/shared/modal/modal";

describe("Modal Component", () => {
  const defaultProps = {
    title: "Test Modal Title",
    description: "Test modal description",
    isOpen: true,
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Basic Rendering", () => {
    it("should render when isOpen is true", () => {
      render(<Modal {...defaultProps} />);

      expect(screen.getByTestId("mock-dialog")).toBeInTheDocument();
      expect(screen.getByTestId("mock-dialog-content")).toBeInTheDocument();
      expect(screen.getByTestId("mock-dialog-header")).toBeInTheDocument();
      expect(screen.getByTestId("mock-dialog-title")).toBeInTheDocument();
      expect(screen.getByTestId("mock-dialog-description")).toBeInTheDocument();
    });

    it("should not render content when isOpen is false", () => {
      render(<Modal {...defaultProps} isOpen={false} />);

      const dialog = screen.getByTestId("mock-dialog");

      expect(dialog).toHaveAttribute("data-open", "false");
      expect(
        screen.queryByTestId("mock-dialog-content")
      ).not.toBeInTheDocument();
    });

    it("should render title correctly", () => {
      render(<Modal {...defaultProps} />);

      const title = screen.getByTestId("mock-dialog-title");

      expect(title).toHaveTextContent(defaultProps.title);
      expect(title.tagName).toBe("H2");
    });

    it("should render description correctly", () => {
      render(<Modal {...defaultProps} />);

      const description = screen.getByTestId("mock-dialog-description");

      expect(description).toHaveTextContent(defaultProps.description);
      expect(description.tagName).toBe("P");
    });

    it("should render with correct dialog state", () => {
      render(<Modal {...defaultProps} />);

      const dialog = screen.getByTestId("mock-dialog");
      expect(dialog).toHaveAttribute("data-open", "true");
    });
  });

  describe("Props Handling", () => {
    it("should accept and render different title", () => {
      const customTitle = "Custom Modal Title";
      render(<Modal {...defaultProps} title={customTitle} />);

      expect(screen.getByText(customTitle)).toBeInTheDocument();
    });

    it("should accept and render different description", () => {
      const customDescription = "Custom modal description for testing";
      render(<Modal {...defaultProps} description={customDescription} />);

      expect(screen.getByText(customDescription)).toBeInTheDocument();
    });

    it("should handle isOpen prop changes", () => {
      const { rerender } = render(<Modal {...defaultProps} isOpen={false} />);

      let dialog = screen.getByTestId("mock-dialog");
      expect(dialog).toHaveAttribute("data-open", "false");

      rerender(<Modal {...defaultProps} isOpen={true} />);

      dialog = screen.getByTestId("mock-dialog");
      expect(dialog).toHaveAttribute("data-open", "true");
    });

    it("should render children when provided", () => {
      render(
        <Modal {...defaultProps}>
          <div data-testid="modal-child">Modal child content</div>
        </Modal>
      );

      expect(screen.getByTestId("modal-child")).toBeInTheDocument();
      expect(screen.getByText("Modal child content")).toBeInTheDocument();
    });

    it("should render without children", () => {
      render(<Modal {...defaultProps} />);

      expect(screen.getByTestId("mock-dialog-content")).toBeInTheDocument();
    });
  });

  describe("Event Handling", () => {
    it("should call onClose when dialog changes to closed", () => {
      const mockOnClose = jest.fn();
      render(<Modal {...defaultProps} onClose={mockOnClose} />);

      const dialog = screen.getByTestId("mock-dialog");
      fireEvent.click(dialog);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("should not call onClose when dialog opens", () => {
      const mockOnClose = jest.fn();

      const MockDialogWithOpen = ({
        onOpenChange,
      }: {
        onOpenChange: (open: boolean) => void;
      }) => {
        React.useEffect(() => {
          onOpenChange(true);
        }, [onOpenChange]);
        return null;
      };

      render(
        <div>
          <Modal {...defaultProps} onClose={mockOnClose} />

          <MockDialogWithOpen
            onOpenChange={(open) => {
              if (!open) {
                mockOnClose();
              }
            }}
          />
        </div>
      );

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it("should handle multiple onClose calls", () => {
      const mockOnClose = jest.fn();
      render(<Modal {...defaultProps} onClose={mockOnClose} />);

      const dialog = screen.getByTestId("mock-dialog");

      fireEvent.click(dialog);
      fireEvent.click(dialog);
      fireEvent.click(dialog);

      expect(mockOnClose).toHaveBeenCalledTimes(3);
    });
  });

  describe("Component Structure", () => {
    it("should maintain correct dialog structure", () => {
      render(<Modal {...defaultProps} />);

      const dialog = screen.getByTestId("mock-dialog");
      const content = screen.getByTestId("mock-dialog-content");
      const header = screen.getByTestId("mock-dialog-header");

      expect(dialog).toContainElement(content);
      expect(content).toContainElement(header);
    });

    it("should render header with title and description", () => {
      render(<Modal {...defaultProps} />);

      const header = screen.getByTestId("mock-dialog-header");
      const title = screen.getByTestId("mock-dialog-title");
      const description = screen.getByTestId("mock-dialog-description");

      expect(header).toContainElement(title);
      expect(header).toContainElement(description);
    });

    it("should render children in a div wrapper", () => {
      render(
        <Modal {...defaultProps}>
          <span data-testid="child-element">Test child</span>
        </Modal>
      );

      const content = screen.getByTestId("mock-dialog-content");
      const childWrapper = content.querySelector("div:last-child");
      const childElement = screen.getByTestId("child-element");

      expect(childWrapper).toContainElement(childElement);
    });
  });

  describe("Content Variations", () => {
    it("should handle long title text", () => {
      const longTitle =
        "This is a very long modal title that might wrap to multiple lines depending on the screen size and modal width";

      render(<Modal {...defaultProps} title={longTitle} />);

      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it("should handle long description text", () => {
      const longDescription =
        "This is a very long modal description that provides detailed information about the modal purpose. It might contain multiple sentences and could wrap to several lines.";

      render(<Modal {...defaultProps} description={longDescription} />);

      expect(screen.getByText(longDescription)).toBeInTheDocument();
    });

    it("should handle empty title", () => {
      render(<Modal {...defaultProps} title="" />);

      const title = screen.getByTestId("mock-dialog-title");
      expect(title).toBeEmptyDOMElement();
    });

    it("should handle empty description", () => {
      render(<Modal {...defaultProps} description="" />);

      const description = screen.getByTestId("mock-dialog-description");
      expect(description).toBeEmptyDOMElement();
    });

    it("should handle special characters in title and description", () => {
      const specialTitle = "Modal with Special Characters: @#$%^&*()";
      const specialDescription =
        "Description with symbols: €£¥₹ & emojis: 🚀🎉✨";

      render(
        <Modal
          {...defaultProps}
          description={specialDescription}
          title={specialTitle}
        />
      );

      expect(screen.getByText(specialTitle)).toBeInTheDocument();
      expect(screen.getByText(specialDescription)).toBeInTheDocument();
    });
  });

  describe("Children Rendering", () => {
    it("should render simple text children", () => {
      render(<Modal {...defaultProps}>Simple text content</Modal>);

      expect(screen.getByText("Simple text content")).toBeInTheDocument();
    });

    it("should render complex JSX children", () => {
      render(
        <Modal {...defaultProps}>
          <div>
            <h3>Child Title</h3>

            <p>Child paragraph</p>

            <button>Child Button</button>
          </div>
        </Modal>
      );

      expect(screen.getByText("Child Title")).toBeInTheDocument();
      expect(screen.getByText("Child paragraph")).toBeInTheDocument();
      expect(screen.getByText("Child Button")).toBeInTheDocument();
    });

    it("should render multiple children", () => {
      render(
        <Modal {...defaultProps}>
          <div data-testid="child-1">First child</div>

          <div data-testid="child-2">Second child</div>

          <div data-testid="child-3">Third child</div>
        </Modal>
      );

      expect(screen.getByTestId("child-1")).toBeInTheDocument();
      expect(screen.getByTestId("child-2")).toBeInTheDocument();
      expect(screen.getByTestId("child-3")).toBeInTheDocument();
    });

    it("should handle conditional children", () => {
      const showContent = true;

      render(
        <Modal {...defaultProps}>
          {showContent && (
            <div data-testid="conditional-content">Conditional content</div>
          )}

          <div data-testid="always-shown">Always shown</div>
        </Modal>
      );

      expect(screen.getByTestId("conditional-content")).toBeInTheDocument();
      expect(screen.getByTestId("always-shown")).toBeInTheDocument();
    });

    it("should handle null children", () => {
      render(
        <Modal {...defaultProps}>
          {null}

          <div data-testid="visible-child">Visible content</div>
        </Modal>
      );

      expect(screen.getByTestId("visible-child")).toBeInTheDocument();
    });
  });

  describe("State Management", () => {
    it("should work with controlled state", () => {
      let isOpen = true;
      const handleClose = () => {
        isOpen = false;
      };

      const { rerender } = render(
        <Modal {...defaultProps} isOpen={isOpen} onClose={handleClose} />
      );

      expect(screen.getByTestId("mock-dialog")).toHaveAttribute(
        "data-open",
        "true"
      );

      rerender(
        <Modal {...defaultProps} isOpen={false} onClose={handleClose} />
      );

      expect(screen.getByTestId("mock-dialog")).toHaveAttribute(
        "data-open",
        "false"
      );
    });

    it("should handle rapid open/close cycles", () => {
      const mockOnClose = jest.fn();
      const { rerender } = render(
        <Modal {...defaultProps} isOpen={true} onClose={mockOnClose} />
      );

      rerender(
        <Modal {...defaultProps} isOpen={false} onClose={mockOnClose} />
      );
      rerender(<Modal {...defaultProps} isOpen={true} onClose={mockOnClose} />);
      rerender(
        <Modal {...defaultProps} isOpen={false} onClose={mockOnClose} />
      );

      expect(screen.getByTestId("mock-dialog")).toHaveAttribute(
        "data-open",
        "false"
      );
    });
  });

  describe("Integration Tests", () => {
    it("should work with all props provided", () => {
      const props = {
        title: "Complete Modal",
        description: "Modal with all props",
        isOpen: true,
        onClose: jest.fn(),
      };

      render(
        <Modal {...props}>
          <div data-testid="modal-content">
            <p>Modal body content</p>

            <button onClick={props.onClose}>Close Modal</button>
          </div>
        </Modal>
      );

      expect(screen.getByText("Complete Modal")).toBeInTheDocument();
      expect(screen.getByText("Modal with all props")).toBeInTheDocument();
      expect(screen.getByTestId("modal-content")).toBeInTheDocument();
      expect(screen.getByText("Modal body content")).toBeInTheDocument();
      expect(screen.getByText("Close Modal")).toBeInTheDocument();
    });

    it("should maintain component isolation when rendered multiple times", () => {
      const onClose1 = jest.fn();
      const onClose2 = jest.fn();

      render(
        <div>
          <Modal
            description="First description"
            isOpen={true}
            onClose={onClose1}
            title="First Modal"
          >
            <div data-testid="first-modal-content">First content</div>
          </Modal>

          <Modal
            description="Second description"
            isOpen={true}
            onClose={onClose2}
            title="Second Modal"
          >
            <div data-testid="second-modal-content">Second content</div>
          </Modal>
        </div>
      );

      expect(screen.getByText("First Modal")).toBeInTheDocument();
      expect(screen.getByText("First description")).toBeInTheDocument();
      expect(screen.getByTestId("first-modal-content")).toBeInTheDocument();

      expect(screen.getByText("Second Modal")).toBeInTheDocument();
      expect(screen.getByText("Second description")).toBeInTheDocument();
      expect(screen.getByTestId("second-modal-content")).toBeInTheDocument();

      expect(onClose1).not.toBe(onClose2);
    });

    it("should handle one modal open and one closed", () => {
      const onClose1 = jest.fn();
      const onClose2 = jest.fn();

      render(
        <div>
          <Modal
            description="This modal is open"
            isOpen={true}
            onClose={onClose1}
            title="Open Modal"
          >
            <div data-testid="open-modal-content">Open content</div>
          </Modal>

          <Modal
            description="This modal is closed"
            isOpen={false}
            onClose={onClose2}
            title="Closed Modal"
          >
            <div data-testid="closed-modal-content">Closed content</div>
          </Modal>
        </div>
      );

      expect(screen.getByText("Open Modal")).toBeInTheDocument();
      expect(screen.getByText("This modal is open")).toBeInTheDocument();
      expect(screen.getByTestId("open-modal-content")).toBeInTheDocument();

      const dialogs = screen.getAllByTestId("mock-dialog");
      expect(dialogs).toHaveLength(2);
      expect(dialogs[0]).toHaveAttribute("data-open", "true");
      expect(dialogs[1]).toHaveAttribute("data-open", "false");

      expect(
        screen.queryByTestId("closed-modal-content")
      ).not.toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle undefined children gracefully", () => {
      render(<Modal {...defaultProps}>{undefined}</Modal>);

      expect(screen.getByTestId("mock-dialog-content")).toBeInTheDocument();
    });

    it("should handle onClose being called multiple times", () => {
      const mockOnClose = jest.fn();

      render(<Modal {...defaultProps} onClose={mockOnClose} />);

      const dialog = screen.getByTestId("mock-dialog");

      fireEvent.click(dialog);
      fireEvent.click(dialog);

      expect(mockOnClose).toHaveBeenCalledTimes(2);
    });

    it("should not crash with missing required props", () => {
      const consoleError = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      render(
        // @ts-expect-error - Intentionally testing without required props
        <Modal />
      );

      consoleError.mockRestore();
    });
  });
});
