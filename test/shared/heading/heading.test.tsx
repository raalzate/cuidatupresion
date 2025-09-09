import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";
import React from "react";

import { Heading } from "../../../components/shared/heading/heading";

describe("Heading Component", () => {
  const defaultProps = {
    title: "Test Title",
    description: "Test description for the heading component",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Basic Rendering", () => {
    it("should render with required props", () => {
      render(<Heading {...defaultProps} />);

      const title = screen.getByRole("heading", { level: 2 });
      const description = screen.getByText(defaultProps.description);

      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent(defaultProps.title);
      expect(description).toBeInTheDocument();
    });

    it("should render title as h2 element", () => {
      render(<Heading {...defaultProps} />);

      const title = screen.getByRole("heading", { level: 2 });

      expect(title.tagName).toBe("H2");
      expect(title).toHaveTextContent(defaultProps.title);
    });

    it("should render description as paragraph element", () => {
      render(<Heading {...defaultProps} />);

      const description = screen.getByText(defaultProps.description);
      expect(description.tagName).toBe("P");
    });

    it("should apply correct CSS classes to title", () => {
      render(<Heading {...defaultProps} />);

      const title = screen.getByRole("heading", { level: 2 });
      expect(title).toHaveClass("text-3xl", "font-bold", "tracking-tight");
    });

    it("should apply correct CSS classes to description", () => {
      render(<Heading {...defaultProps} />);

      const description = screen.getByText(defaultProps.description);
      expect(description).toHaveClass("text-sm", "text-muted-foreground");
    });
  });

  describe("Content Variations", () => {
    it("should render with different title content", () => {
      const customTitle = "Custom Page Title";
      render(
        <Heading title={customTitle} description={defaultProps.description} />
      );

      const title = screen.getByRole("heading", { level: 2 });
      expect(title).toHaveTextContent(customTitle);
    });

    it("should render with different description content", () => {
      const customDescription =
        "This is a custom description for testing purposes";
      render(
        <Heading title={defaultProps.title} description={customDescription} />
      );

      const description = screen.getByText(customDescription);
      expect(description).toBeInTheDocument();
    });

    it("should render with long title text", () => {
      const longTitle =
        "This is a very long title that might wrap to multiple lines in the user interface";
      render(
        <Heading title={longTitle} description={defaultProps.description} />
      );

      const title = screen.getByRole("heading", { level: 2 });
      expect(title).toHaveTextContent(longTitle);
    });

    it("should render with long description text", () => {
      const longDescription =
        "This is a very long description that provides detailed information about the page or section. It might contain multiple sentences and could potentially wrap to several lines depending on the screen size and layout constraints.";
      render(
        <Heading title={defaultProps.title} description={longDescription} />
      );

      const description = screen.getByText(longDescription);
      expect(description).toBeInTheDocument();
    });

    it("should render with empty strings", () => {
      const { container } = render(<Heading title="" description="" />);

      const title = screen.getByRole("heading", { level: 2 });
      const description = container.querySelector("p");

      expect(title).toBeInTheDocument();
      expect(title).toBeEmptyDOMElement();
      expect(description).toBeInTheDocument();
      expect(description).toBeEmptyDOMElement();
    });
  });

  describe("Component Structure", () => {
    it("should wrap content in a div container", () => {
      const { container } = render(<Heading {...defaultProps} />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.tagName).toBe("DIV");
    });

    it("should maintain correct DOM hierarchy", () => {
      const { container } = render(<Heading {...defaultProps} />);

      const wrapper = container.firstChild as HTMLElement;
      const title = wrapper.querySelector("h2");
      const description = wrapper.querySelector("p");

      expect(wrapper).toContainElement(title);
      expect(wrapper).toContainElement(description);
      expect(title).toBeInTheDocument();
      expect(description).toBeInTheDocument();
    });

    it("should render title before description in DOM order", () => {
      const { container } = render(<Heading {...defaultProps} />);

      const wrapper = container.firstChild as HTMLElement;
      const children = Array.from(wrapper.children);

      expect(children[0].tagName).toBe("H2");
      expect(children[1].tagName).toBe("P");
    });
  });

  describe("Accessibility", () => {
    it("should have proper heading hierarchy", () => {
      render(<Heading {...defaultProps} />);

      const title = screen.getByRole("heading", { level: 2 });
      expect(title).toBeInTheDocument();
    });

    it("should be accessible by screen readers", () => {
      render(<Heading {...defaultProps} />);

      const title = screen.getByRole("heading", { level: 2 });
      const description = screen.getByText(defaultProps.description);

      expect(title).toBeVisible();
      expect(description).toBeVisible();
    });

    it("should provide semantic meaning through proper HTML elements", () => {
      render(<Heading {...defaultProps} />);

      const title = screen.getByRole("heading", { level: 2 });
      expect(title).toBeInTheDocument();

      const description = screen.getByText(defaultProps.description);
      expect(description.tagName).toBe("P");
    });
  });

  describe("Props Interface", () => {
    it("should accept title prop", () => {
      const title = "Props Test Title";
      render(<Heading title={title} description={defaultProps.description} />);

      expect(screen.getByText(title)).toBeInTheDocument();
    });

    it("should accept description prop", () => {
      const description = "Props test description";
      render(<Heading title={defaultProps.title} description={description} />);

      expect(screen.getByText(description)).toBeInTheDocument();
    });

    it("should require both title and description props", () => {
      render(
        <Heading
          description={defaultProps.description}
          title={defaultProps.title}
        />
      );

      expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
      expect(screen.getByText(defaultProps.description)).toBeInTheDocument();
    });
  });

  describe("Visual Styling", () => {
    it("should apply large text styling to title", () => {
      render(<Heading {...defaultProps} />);

      const title = screen.getByRole("heading", { level: 2 });
      expect(title).toHaveClass("text-3xl");
    });

    it("should apply bold font weight to title", () => {
      render(<Heading {...defaultProps} />);

      const title = screen.getByRole("heading", { level: 2 });
      expect(title).toHaveClass("font-bold");
    });

    it("should apply tight letter spacing to title", () => {
      render(<Heading {...defaultProps} />);

      const title = screen.getByRole("heading", { level: 2 });
      expect(title).toHaveClass("tracking-tight");
    });

    it("should apply small text styling to description", () => {
      render(<Heading {...defaultProps} />);

      const description = screen.getByText(defaultProps.description);
      expect(description).toHaveClass("text-sm");
    });

    it("should apply muted foreground color to description", () => {
      render(<Heading {...defaultProps} />);

      const description = screen.getByText(defaultProps.description);
      expect(description).toHaveClass("text-muted-foreground");
    });
  });

  describe("Content Edge Cases", () => {
    it("should handle special characters in title", () => {
      const specialTitle = "Title with Special Characters: @#$%^&*()";
      render(
        <Heading title={specialTitle} description={defaultProps.description} />
      );

      expect(screen.getByText(specialTitle)).toBeInTheDocument();
    });

    it("should handle special characters in description", () => {
      const specialDescription =
        "Description with symbols: €£¥₹ & emojis: 🚀🎉✨";
      render(
        <Heading title={defaultProps.title} description={specialDescription} />
      );

      expect(screen.getByText(specialDescription)).toBeInTheDocument();
    });

    it("should handle HTML entities in content", () => {
      const titleWithEntities = "Title with &amp; HTML &lt;entities&gt;";
      const descriptionWithEntities =
        "Description with &quot;quotes&quot; and &apos;apostrophes&apos;";

      render(
        <Heading
          description={descriptionWithEntities}
          title={titleWithEntities}
        />
      );

      expect(screen.getByText(titleWithEntities)).toBeInTheDocument();
      expect(screen.getByText(descriptionWithEntities)).toBeInTheDocument();
    });

    it("should handle numeric content", () => {
      const numericTitle = "2024 Annual Report";
      const numericDescription =
        "Showing data from January 1, 2024 to December 31, 2024";

      render(<Heading title={numericTitle} description={numericDescription} />);

      expect(screen.getByText(numericTitle)).toBeInTheDocument();
      expect(screen.getByText(numericDescription)).toBeInTheDocument();
    });
  });

  describe("Component Integration", () => {
    it("should work when rendered multiple times", () => {
      render(
        <div>
          <Heading title="First Heading" description="First description" />

          <Heading title="Second Heading" description="Second description" />
        </div>
      );

      expect(screen.getByText("First Heading")).toBeInTheDocument();
      expect(screen.getByText("First description")).toBeInTheDocument();
      expect(screen.getByText("Second Heading")).toBeInTheDocument();
      expect(screen.getByText("Second description")).toBeInTheDocument();
    });

    it("should maintain independence when rendered multiple times", () => {
      render(
        <div>
          <Heading
            description="Independent description 1"
            title="Independent Title 1"
          />

          <Heading
            description="Independent description 2"
            title="Independent Title 2"
          />
        </div>
      );

      const headings = screen.getAllByRole("heading", { level: 2 });

      expect(headings).toHaveLength(2);
      expect(headings[0]).toHaveTextContent("Independent Title 1");
      expect(headings[1]).toHaveTextContent("Independent Title 2");
    });
  });
});
