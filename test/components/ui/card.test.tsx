import "@testing-library/jest-dom";

import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

describe("Card Component", () => {
  describe("Basic Rendering", () => {
    it("should render card with default props", () => {
      render(<Card data-testid="card">Card content</Card>);

      const card = screen.getByTestId("card");

      expect(card).toBeInTheDocument();
      expect(card).toHaveAttribute("data-slot", "card");
      expect(card).toHaveTextContent("Card content");
    });

    it("should render with default styling classes", () => {
      render(<Card data-testid="card">Card content</Card>);

      const card = screen.getByTestId("card");

      expect(card).toHaveClass(
        "bg-card",
        "text-card-foreground",
        "flex",
        "flex-col",
        "gap-8",
        "rounded-2xl",
        "border-2",
        "border-[rgba(64,169,68,0.6)]",
        "px-8",
        "py-8",
        "shadow-md"
      );
    });

    it("should render with custom className", () => {
      render(
        <Card className="custom-card-class" data-testid="card">
          Card content
        </Card>
      );

      const card = screen.getByTestId("card");

      expect(card).toHaveClass("custom-card-class");
      expect(card).toHaveClass("bg-card", "flex", "flex-col");
    });

    it("should pass through additional props", () => {
      render(
        <Card
          aria-label="Test card"
          data-testid="card"
          id="test-card"
          role="article"
        >
          Card content
        </Card>
      );

      const card = screen.getByTestId("card");

      expect(card).toHaveAttribute("id", "test-card");
      expect(card).toHaveAttribute("role", "article");
      expect(card).toHaveAttribute("aria-label", "Test card");
    });
  });

  describe("Interactive Behavior", () => {
    it("should handle click events", () => {
      const handleClick = jest.fn();

      render(
        <Card onClick={handleClick} data-testid="card">
          Clickable card
        </Card>
      );

      const card = screen.getByTestId("card");
      fireEvent.click(card);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should handle keyboard events", () => {
      const handleKeyDown = jest.fn();

      render(
        <Card onKeyDown={handleKeyDown} data-testid="card">
          Card with keyboard events
        </Card>
      );

      const card = screen.getByTestId("card");
      fireEvent.keyDown(card, { key: "Enter", code: "Enter" });

      expect(handleKeyDown).toHaveBeenCalledTimes(1);
    });
  });

  describe("Content Types", () => {
    it("should render with text content", () => {
      render(<Card data-testid="card">Simple text content</Card>);

      const card = screen.getByTestId("card");

      expect(card).toHaveTextContent("Simple text content");
    });

    it("should render with complex JSX content", () => {
      render(
        <Card data-testid="card">
          <div data-testid="complex-content">
            <h2>Title</h2>

            <p>Description</p>
          </div>
        </Card>
      );

      const card = screen.getByTestId("card");
      const complexContent = screen.getByTestId("complex-content");

      expect(card).toContainElement(complexContent);
      expect(complexContent).toHaveTextContent("Title");
      expect(complexContent).toHaveTextContent("Description");
    });
  });
});

describe("CardHeader Component", () => {
  describe("Basic Rendering", () => {
    it("should render header with default props", () => {
      render(<CardHeader data-testid="card-header">Header content</CardHeader>);

      const header = screen.getByTestId("card-header");

      expect(header).toBeInTheDocument();
      expect(header).toHaveAttribute("data-slot", "card-header");
      expect(header).toHaveTextContent("Header content");
    });

    it("should render with default styling classes", () => {
      render(<CardHeader data-testid="card-header">Header content</CardHeader>);

      const header = screen.getByTestId("card-header");

      expect(header).toHaveClass(
        "@container/card-header",
        "grid",
        "auto-rows-min",
        "grid-rows-[auto_auto]",
        "items-start",
        "gap-3",
        "px-0",
        "has-data-[slot=card-action]:grid-cols-[1fr_auto]",
        "[.border-b]:pb-6"
      );
    });

    it("should render with custom className", () => {
      render(
        <CardHeader className="custom-header-class" data-testid="card-header">
          Header content
        </CardHeader>
      );

      const header = screen.getByTestId("card-header");

      expect(header).toHaveClass("custom-header-class");
      expect(header).toHaveClass("grid", "items-start");
    });

    it("should pass through additional props", () => {
      render(
        <CardHeader data-testid="card-header" id="test-header" role="banner">
          Header content
        </CardHeader>
      );

      const header = screen.getByTestId("card-header");

      expect(header).toHaveAttribute("id", "test-header");
      expect(header).toHaveAttribute("role", "banner");
    });
  });
});

describe("CardTitle Component", () => {
  describe("Basic Rendering", () => {
    it("should render title with default props", () => {
      render(<CardTitle data-testid="card-title">Card Title</CardTitle>);

      const title = screen.getByTestId("card-title");

      expect(title).toBeInTheDocument();
      expect(title).toHaveAttribute("data-slot", "card-title");
      expect(title).toHaveTextContent("Card Title");
    });

    it("should render with default styling classes", () => {
      render(<CardTitle data-testid="card-title">Card Title</CardTitle>);

      const title = screen.getByTestId("card-title");

      expect(title).toHaveClass(
        "text-2xl",
        "font-bold",
        "leading-tight",
        "text-foreground"
      );
    });

    it("should render with custom className", () => {
      render(
        <CardTitle className="custom-title-class" data-testid="card-title">
          Card Title
        </CardTitle>
      );

      const title = screen.getByTestId("card-title");

      expect(title).toHaveClass("custom-title-class");
      expect(title).toHaveClass(
        "text-2xl",
        "font-bold",
        "leading-tight",
        "text-foreground"
      );
    });
  });
});

describe("CardDescription Component", () => {
  describe("Basic Rendering", () => {
    it("should render description with default props", () => {
      render(
        <CardDescription data-testid="card-description">
          Card description text
        </CardDescription>
      );

      const description = screen.getByTestId("card-description");

      expect(description).toBeInTheDocument();
      expect(description).toHaveAttribute("data-slot", "card-description");
      expect(description).toHaveTextContent("Card description text");
    });

    it("should render with default styling classes", () => {
      render(
        <CardDescription data-testid="card-description">
          Card description text
        </CardDescription>
      );

      const description = screen.getByTestId("card-description");

      expect(description).toHaveClass(
        "text-muted-foreground",
        "text-base"
      );
    });

    it("should render with custom className", () => {
      render(
        <CardDescription
          className="custom-description-class"
          data-testid="card-description"
        >
          Card description text
        </CardDescription>
      );

      const description = screen.getByTestId("card-description");

      expect(description).toHaveClass("custom-description-class");
      expect(description).toHaveClass(
        "text-muted-foreground",
        "text-base"
      );
    });
  });
});

describe("CardAction Component", () => {
  describe("Basic Rendering", () => {
    it("should render action with default props", () => {
      render(
        <CardAction data-testid="card-action">
          <button>Action</button>
        </CardAction>
      );

      const action = screen.getByTestId("card-action");

      expect(action).toBeInTheDocument();
      expect(action).toHaveAttribute("data-slot", "card-action");
    });

    it("should render with default styling classes", () => {
      render(
        <CardAction data-testid="card-action">
          <button>Action</button>
        </CardAction>
      );

      const action = screen.getByTestId("card-action");

      expect(action).toHaveClass(
        "col-start-2",
        "row-span-2",
        "row-start-1",
        "self-start",
        "justify-self-end"
      );
    });

    it("should render with custom className", () => {
      render(
        <CardAction className="custom-action-class" data-testid="card-action">
          <button>Action</button>
        </CardAction>
      );

      const action = screen.getByTestId("card-action");

      expect(action).toHaveClass("custom-action-class");
      expect(action).toHaveClass("col-start-2", "row-span-2");
    });
  });
});

describe("CardContent Component", () => {
  describe("Basic Rendering", () => {
    it("should render content with default props", () => {
      render(
        <CardContent data-testid="card-content">Main content area</CardContent>
      );

      const content = screen.getByTestId("card-content");

      expect(content).toBeInTheDocument();
      expect(content).toHaveAttribute("data-slot", "card-content");
      expect(content).toHaveTextContent("Main content area");
    });

    it("should render with default styling classes", () => {
      render(
        <CardContent data-testid="card-content">Main content area</CardContent>
      );

    const content = screen.getByTestId("card-content");

    expect(content).toHaveClass("px-0");
    });

    it("should render with custom className", () => {
      render(
        <CardContent
          className="custom-content-class"
          data-testid="card-content"
        >
          Main content area
        </CardContent>
      );

    const content = screen.getByTestId("card-content");

    expect(content).toHaveClass("custom-content-class");
    expect(content).toHaveClass("px-0");
    });
  });
});

describe("CardFooter Component", () => {
  describe("Basic Rendering", () => {
    it("should render footer with default props", () => {
      render(<CardFooter data-testid="card-footer">Footer content</CardFooter>);

      const footer = screen.getByTestId("card-footer");

      expect(footer).toBeInTheDocument();
      expect(footer).toHaveAttribute("data-slot", "card-footer");
      expect(footer).toHaveTextContent("Footer content");
    });

    it("should render with default styling classes", () => {
      render(<CardFooter data-testid="card-footer">Footer content</CardFooter>);

      const footer = screen.getByTestId("card-footer");

      expect(footer).toHaveClass(
        "flex",
        "items-center",
        "gap-4",
        "px-0",
        "[.border-t]:pt-6"
      );
    });

    it("should render with custom className", () => {
      render(
        <CardFooter className="custom-footer-class" data-testid="card-footer">
          Footer content
        </CardFooter>
      );

      const footer = screen.getByTestId("card-footer");

      expect(footer).toHaveClass("custom-footer-class");
      expect(footer).toHaveClass(
        "flex",
        "items-center",
        "gap-4",
        "px-0",
        "[.border-t]:pt-6"
      );
    });
  });
});

describe("Card Component Integration", () => {
  describe("Complete Card Structure", () => {
    it("should render a complete card with all components", () => {
      render(
        <Card data-testid="complete-card">
          <CardHeader data-testid="header">
            <CardTitle data-testid="title">Test Card Title</CardTitle>

            <CardDescription data-testid="description">
              Test card description
            </CardDescription>

            <CardAction data-testid="action">
              <button>Edit</button>
            </CardAction>
          </CardHeader>

          <CardContent data-testid="content">
            <p>Main card content goes here.</p>
          </CardContent>

          <CardFooter data-testid="footer">
            <button>Save</button>

            <button>Cancel</button>
          </CardFooter>
        </Card>
      );

      const card = screen.getByTestId("complete-card");
      const header = screen.getByTestId("header");
      const title = screen.getByTestId("title");
      const description = screen.getByTestId("description");
      const action = screen.getByTestId("action");
      const content = screen.getByTestId("content");
      const footer = screen.getByTestId("footer");

      expect(card).toContainElement(header);
      expect(card).toContainElement(content);
      expect(card).toContainElement(footer);
      expect(header).toContainElement(title);
      expect(header).toContainElement(description);
      expect(header).toContainElement(action);

      expect(title).toHaveTextContent("Test Card Title");
      expect(description).toHaveTextContent("Test card description");
      expect(content).toHaveTextContent("Main card content goes here.");
    });

    it("should handle card with minimal components", () => {
      render(
        <Card data-testid="minimal-card">
          <CardContent data-testid="content">Just content</CardContent>
        </Card>
      );

      const card = screen.getByTestId("minimal-card");
      const content = screen.getByTestId("content");

      expect(card).toContainElement(content);
      expect(content).toHaveTextContent("Just content");
    });

    it("should handle card with header only", () => {
      render(
        <Card data-testid="header-only-card">
          <CardHeader data-testid="header">
            <CardTitle data-testid="title">Header Only Card</CardTitle>
          </CardHeader>
        </Card>
      );

      const card = screen.getByTestId("header-only-card");
      const header = screen.getByTestId("header");
      const title = screen.getByTestId("title");

      expect(card).toContainElement(header);
      expect(header).toContainElement(title);
      expect(title).toHaveTextContent("Header Only Card");
    });
  });

  describe("Interactive Card Components", () => {
    it("should handle interactions on card action buttons", () => {
      const handleEdit = jest.fn();
      const handleDelete = jest.fn();

      render(
        <Card data-testid="interactive-card">
          <CardHeader>
            <CardTitle>Interactive Card</CardTitle>

            <CardAction data-testid="actions">
              <button onClick={handleEdit} data-testid="edit-btn">
                Edit
              </button>

              <button onClick={handleDelete} data-testid="delete-btn">
                Delete
              </button>
            </CardAction>
          </CardHeader>
        </Card>
      );

      const editBtn = screen.getByTestId("edit-btn");
      const deleteBtn = screen.getByTestId("delete-btn");

      fireEvent.click(editBtn);
      fireEvent.click(deleteBtn);

      expect(handleEdit).toHaveBeenCalledTimes(1);
      expect(handleDelete).toHaveBeenCalledTimes(1);
    });

    it("should handle interactions on footer buttons", () => {
      const handleSave = jest.fn();
      const handleCancel = jest.fn();

      render(
        <Card data-testid="form-card">
          <CardContent>Form content</CardContent>
          <CardFooter data-testid="footer">
            <button onClick={handleSave} data-testid="save-btn">
              Save
            </button>

            <button onClick={handleCancel} data-testid="cancel-btn">
              Cancel
            </button>
          </CardFooter>
        </Card>
      );

      const saveBtn = screen.getByTestId("save-btn");
      const cancelBtn = screen.getByTestId("cancel-btn");

      fireEvent.click(saveBtn);
      fireEvent.click(cancelBtn);

      expect(handleSave).toHaveBeenCalledTimes(1);
      expect(handleCancel).toHaveBeenCalledTimes(1);
    });
  });

  describe("Accessibility", () => {
    it("should support accessibility attributes", () => {
      render(
        <Card
          aria-describedby="card-description"
          aria-labelledby="card-title"
          data-testid="accessible-card"
          role="article"
        >
          <CardHeader>
            <CardTitle id="card-title">Accessible Card</CardTitle>

            <CardDescription id="card-description">
              This card follows accessibility best practices
            </CardDescription>
          </CardHeader>

          <CardContent>Accessible content</CardContent>
        </Card>
      );

      const card = screen.getByTestId("accessible-card");
      const title = screen.getByText("Accessible Card");
      const description = screen.getByText(
        "This card follows accessibility best practices"
      );

      expect(card).toHaveAttribute("role", "article");
      expect(card).toHaveAttribute("aria-labelledby", "card-title");
      expect(card).toHaveAttribute("aria-describedby", "card-description");
      expect(title).toHaveAttribute("id", "card-title");
      expect(description).toHaveAttribute("id", "card-description");
    });

    it("should support keyboard navigation on interactive elements", () => {
      const handleKeyDown = jest.fn();

      render(
        <Card data-testid="keyboard-card">
          <CardFooter>
            <button onKeyDown={handleKeyDown} data-testid="keyboard-btn">
              Keyboard Button
            </button>
          </CardFooter>
        </Card>
      );

      const button = screen.getByTestId("keyboard-btn");
      fireEvent.keyDown(button, { key: "Enter", code: "Enter" });
      fireEvent.keyDown(button, { key: " ", code: "Space" });

      expect(handleKeyDown).toHaveBeenCalledTimes(2);
    });
  });

  describe("Complex Content Scenarios", () => {
    it("should handle nested components and complex layouts", () => {
      render(
        <Card data-testid="complex-card">
          <CardHeader>
            <CardTitle>Complex Layout Card</CardTitle>

            <CardDescription>Testing complex nested structures</CardDescription>

            <CardAction>
              <div data-testid="action-group">
                <button>Action 1</button>

                <button>Action 2</button>
              </div>
            </CardAction>
          </CardHeader>

          <CardContent>
            <div data-testid="content-sections">
              <section data-testid="section-1">
                <h3>Section 1</h3>

                <p>Content for section 1</p>
              </section>

              <section data-testid="section-2">
                <h3>Section 2</h3>

                <p>Content for section 2</p>
              </section>
            </div>
          </CardContent>

          <CardFooter>
            <div data-testid="footer-actions">
              <button>Primary Action</button>

              <button>Secondary Action</button>
            </div>
          </CardFooter>
        </Card>
      );

      const card = screen.getByTestId("complex-card");
      const actionGroup = screen.getByTestId("action-group");
      const contentSections = screen.getByTestId("content-sections");
      const section1 = screen.getByTestId("section-1");
      const section2 = screen.getByTestId("section-2");
      const footerActions = screen.getByTestId("footer-actions");

      expect(card).toContainElement(actionGroup);
      expect(card).toContainElement(contentSections);
      expect(card).toContainElement(footerActions);
      expect(contentSections).toContainElement(section1);
      expect(contentSections).toContainElement(section2);
    });

    it("should handle dynamic content updates", () => {
      const { rerender } = render(
        <Card data-testid="dynamic-card">
          <CardHeader>
            <CardTitle>Initial Title</CardTitle>
          </CardHeader>

          <CardContent>Initial content</CardContent>
        </Card>
      );

      expect(screen.getByText("Initial Title")).toBeInTheDocument();
      expect(screen.getByText("Initial content")).toBeInTheDocument();

      rerender(
        <Card data-testid="dynamic-card">
          <CardHeader>
            <CardTitle>Updated Title</CardTitle>
          </CardHeader>

          <CardContent>Updated content</CardContent>
        </Card>
      );

      expect(screen.getByText("Updated Title")).toBeInTheDocument();
      expect(screen.getByText("Updated content")).toBeInTheDocument();
      expect(screen.queryByText("Initial Title")).not.toBeInTheDocument();
      expect(screen.queryByText("Initial content")).not.toBeInTheDocument();
    });
  });
});
