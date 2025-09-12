import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";
import React from "react";

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

describe("Breadcrumb Components", () => {
  describe("Breadcrumb", () => {
    it("should render with default props", () => {
      render(<Breadcrumb data-testid="breadcrumb" />);

      const breadcrumb = screen.getByTestId("breadcrumb");

      expect(breadcrumb).toBeInTheDocument();
      expect(breadcrumb).toHaveAttribute("aria-label", "breadcrumb");
      expect(breadcrumb).toHaveAttribute("data-slot", "breadcrumb");
      expect(breadcrumb.tagName).toBe("NAV");
    });

    it("should pass through additional props", () => {
      render(
        <Breadcrumb
          className="custom-class"
          data-testid="breadcrumb"
          id="custom-id"
        />
      );

      const breadcrumb = screen.getByTestId("breadcrumb");

      expect(breadcrumb).toHaveClass("custom-class");
      expect(breadcrumb).toHaveAttribute("id", "custom-id");
    });

    it("should render children correctly", () => {
      render(
        <Breadcrumb data-testid="breadcrumb">
          <div data-testid="child">Child content</div>
        </Breadcrumb>
      );

      const breadcrumb = screen.getByTestId("breadcrumb");
      const child = screen.getByTestId("child");

      expect(breadcrumb).toContainElement(child);
      expect(child).toHaveTextContent("Child content");
    });
  });

  describe("BreadcrumbList", () => {
    it("should render with default classes", () => {
      render(<BreadcrumbList data-testid="breadcrumb-list" />);

      const breadcrumbList = screen.getByTestId("breadcrumb-list");

      expect(breadcrumbList).toBeInTheDocument();
      expect(breadcrumbList).toHaveAttribute("data-slot", "breadcrumb-list");
      expect(breadcrumbList).toHaveClass(
        "text-muted-foreground",
        "flex",
        "flex-wrap",
        "items-center",
        "gap-1.5",
        "text-sm",
        "break-words",
        "sm:gap-2.5"
      );
      expect(breadcrumbList.tagName).toBe("OL");
    });

    it("should render with custom className", () => {
      render(
        <BreadcrumbList
          className="custom-list-class"
          data-testid="breadcrumb-list"
        />
      );

      const breadcrumbList = screen.getByTestId("breadcrumb-list");

      expect(breadcrumbList).toHaveClass("custom-list-class");
      expect(breadcrumbList).toHaveClass("text-muted-foreground", "flex");
    });

    it("should pass through additional props", () => {
      render(
        <BreadcrumbList
          data-testid="breadcrumb-list"
          id="list-id"
          role="list"
        />
      );

      const breadcrumbList = screen.getByTestId("breadcrumb-list");

      expect(breadcrumbList).toHaveAttribute("id", "list-id");
      expect(breadcrumbList).toHaveAttribute("role", "list");
    });

    it("should render children correctly", () => {
      render(
        <BreadcrumbList data-testid="breadcrumb-list">
          <li data-testid="list-item">List item</li>
        </BreadcrumbList>
      );

      const breadcrumbList = screen.getByTestId("breadcrumb-list");
      const listItem = screen.getByTestId("list-item");

      expect(breadcrumbList).toContainElement(listItem);
      expect(listItem).toHaveTextContent("List item");
    });
  });

  describe("BreadcrumbItem", () => {
    it("should render with default classes", () => {
      render(<BreadcrumbItem data-testid="breadcrumb-item" />);

      const breadcrumbItem = screen.getByTestId("breadcrumb-item");

      expect(breadcrumbItem).toBeInTheDocument();
      expect(breadcrumbItem).toHaveAttribute("data-slot", "breadcrumb-item");
      expect(breadcrumbItem).toHaveClass(
        "inline-flex",
        "items-center",
        "gap-1.5"
      );
      expect(breadcrumbItem.tagName).toBe("LI");
    });

    it("should render with custom className", () => {
      render(
        <BreadcrumbItem
          className="custom-item-class"
          data-testid="breadcrumb-item"
        />
      );

      const breadcrumbItem = screen.getByTestId("breadcrumb-item");

      expect(breadcrumbItem).toHaveClass("custom-item-class");
      expect(breadcrumbItem).toHaveClass("inline-flex", "items-center");
    });

    it("should pass through additional props", () => {
      render(<BreadcrumbItem data-testid="breadcrumb-item" role="listitem" />);

      const breadcrumbItem = screen.getByTestId("breadcrumb-item");

      expect(breadcrumbItem).toHaveAttribute("role", "listitem");
    });

    it("should render children correctly", () => {
      render(
        <BreadcrumbItem data-testid="breadcrumb-item">
          <span data-testid="item-content">Item content</span>
        </BreadcrumbItem>
      );

      const breadcrumbItem = screen.getByTestId("breadcrumb-item");
      const itemContent = screen.getByTestId("item-content");

      expect(breadcrumbItem).toContainElement(itemContent);
      expect(itemContent).toHaveTextContent("Item content");
    });
  });

  describe("BreadcrumbLink", () => {
    it("should render as anchor by default", () => {
      render(
        <BreadcrumbLink data-testid="breadcrumb-link" href="/test">
          Link text
        </BreadcrumbLink>
      );

      const breadcrumbLink = screen.getByTestId("breadcrumb-link");

      expect(breadcrumbLink).toBeInTheDocument();
      expect(breadcrumbLink).toHaveAttribute("data-slot", "breadcrumb-link");
      expect(breadcrumbLink).toHaveClass(
        "hover:text-foreground",
        "transition-colors"
      );
      expect(breadcrumbLink.tagName).toBe("A");
      expect(breadcrumbLink).toHaveAttribute("href", "/test");
      expect(breadcrumbLink).toHaveTextContent("Link text");
    });

    it("should render with custom className", () => {
      render(
        <BreadcrumbLink
          className="custom-link-class"
          data-testid="breadcrumb-link"
          href="/test"
        >
          Link text
        </BreadcrumbLink>
      );

      const breadcrumbLink = screen.getByTestId("breadcrumb-link");

      expect(breadcrumbLink).toHaveClass("custom-link-class");
      expect(breadcrumbLink).toHaveClass(
        "hover:text-foreground",
        "transition-colors"
      );
    });

    it("should render as Slot when asChild is true", () => {
      render(
        <BreadcrumbLink asChild data-testid="breadcrumb-link">
          <button type="button">Button Link</button>
        </BreadcrumbLink>
      );

      const breadcrumbLink = screen.getByTestId("breadcrumb-link");

      expect(breadcrumbLink).toBeInTheDocument();
      expect(breadcrumbLink).toHaveAttribute("data-slot", "breadcrumb-link");
      expect(breadcrumbLink.tagName).toBe("BUTTON");
      expect(breadcrumbLink).toHaveTextContent("Button Link");
    });

    it("should pass through additional props", () => {
      render(
        <BreadcrumbLink
          data-testid="breadcrumb-link"
          href="/test"
          rel="noopener noreferrer"
          target="_blank"
        >
          External Link
        </BreadcrumbLink>
      );

      const breadcrumbLink = screen.getByTestId("breadcrumb-link");

      expect(breadcrumbLink).toHaveAttribute("target", "_blank");
      expect(breadcrumbLink).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  describe("BreadcrumbPage", () => {
    it("should render with default props and classes", () => {
      render(
        <BreadcrumbPage data-testid="breadcrumb-page">
          Current Page
        </BreadcrumbPage>
      );

      const breadcrumbPage = screen.getByTestId("breadcrumb-page");

      expect(breadcrumbPage).toBeInTheDocument();
      expect(breadcrumbPage).toHaveAttribute("data-slot", "breadcrumb-page");
      expect(breadcrumbPage).toHaveAttribute("role", "link");
      expect(breadcrumbPage).toHaveAttribute("aria-disabled", "true");
      expect(breadcrumbPage).toHaveAttribute("aria-current", "page");
      expect(breadcrumbPage).toHaveClass("text-foreground", "font-normal");
      expect(breadcrumbPage.tagName).toBe("SPAN");
      expect(breadcrumbPage).toHaveTextContent("Current Page");
    });

    it("should render with custom className", () => {
      render(
        <BreadcrumbPage
          className="custom-page-class"
          data-testid="breadcrumb-page"
        >
          Current Page
        </BreadcrumbPage>
      );

      const breadcrumbPage = screen.getByTestId("breadcrumb-page");

      expect(breadcrumbPage).toHaveClass("custom-page-class");
      expect(breadcrumbPage).toHaveClass("text-foreground", "font-normal");
    });

    it("should pass through additional props", () => {
      render(
        <BreadcrumbPage data-testid="breadcrumb-page" id="current-page">
          Current Page
        </BreadcrumbPage>
      );

      const breadcrumbPage = screen.getByTestId("breadcrumb-page");

      expect(breadcrumbPage).toHaveAttribute("id", "current-page");
    });
  });

  describe("BreadcrumbSeparator", () => {
    it("should render with default ChevronRight icon", () => {
      render(<BreadcrumbSeparator data-testid="breadcrumb-separator" />);

      const breadcrumbSeparator = screen.getByTestId("breadcrumb-separator");

      expect(breadcrumbSeparator).toBeInTheDocument();
      expect(breadcrumbSeparator).toHaveAttribute(
        "data-slot",
        "breadcrumb-separator"
      );
      expect(breadcrumbSeparator).toHaveAttribute("role", "presentation");
      expect(breadcrumbSeparator).toHaveAttribute("aria-hidden", "true");
      expect(breadcrumbSeparator).toHaveClass("[&>svg]:size-3.5");
      expect(breadcrumbSeparator.tagName).toBe("LI");

      const icon = breadcrumbSeparator.querySelector("svg");
      expect(icon).toBeInTheDocument();
    });

    it("should render with custom className", () => {
      render(
        <BreadcrumbSeparator
          className="custom-separator-class"
          data-testid="breadcrumb-separator"
        />
      );

      const breadcrumbSeparator = screen.getByTestId("breadcrumb-separator");

      expect(breadcrumbSeparator).toHaveClass("custom-separator-class");
      expect(breadcrumbSeparator).toHaveClass("[&>svg]:size-3.5");
    });

    it("should render custom children instead of default icon", () => {
      render(
        <BreadcrumbSeparator data-testid="breadcrumb-separator">
          <span data-testid="custom-separator">/</span>
        </BreadcrumbSeparator>
      );

      const breadcrumbSeparator = screen.getByTestId("breadcrumb-separator");
      const customSeparator = screen.getByTestId("custom-separator");

      expect(breadcrumbSeparator).toContainElement(customSeparator);
      expect(customSeparator).toHaveTextContent("/");
    });

    it("should pass through additional props", () => {
      render(
        <BreadcrumbSeparator
          data-testid="breadcrumb-separator"
          id="separator-id"
        />
      );

      const breadcrumbSeparator = screen.getByTestId("breadcrumb-separator");

      expect(breadcrumbSeparator).toHaveAttribute("id", "separator-id");
    });
  });

  describe("BreadcrumbEllipsis", () => {
    it("should render with default props and MoreHorizontal icon", () => {
      render(<BreadcrumbEllipsis data-testid="breadcrumb-ellipsis" />);

      const breadcrumbEllipsis = screen.getByTestId("breadcrumb-ellipsis");

      expect(breadcrumbEllipsis).toBeInTheDocument();
      expect(breadcrumbEllipsis).toHaveAttribute(
        "data-slot",
        "breadcrumb-ellipsis"
      );
      expect(breadcrumbEllipsis).toHaveAttribute("role", "presentation");
      expect(breadcrumbEllipsis).toHaveAttribute("aria-hidden", "true");
      expect(breadcrumbEllipsis).toHaveClass(
        "flex",
        "size-9",
        "items-center",
        "justify-center"
      );
      expect(breadcrumbEllipsis.tagName).toBe("SPAN");

      const icon = breadcrumbEllipsis.querySelector("svg");
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass("size-4");

      const srText = screen.getByText("More");
      expect(srText).toBeInTheDocument();
      expect(srText).toHaveClass("sr-only");
    });

    it("should render with custom className", () => {
      render(
        <BreadcrumbEllipsis
          className="custom-ellipsis-class"
          data-testid="breadcrumb-ellipsis"
        />
      );

      const breadcrumbEllipsis = screen.getByTestId("breadcrumb-ellipsis");

      expect(breadcrumbEllipsis).toHaveClass("custom-ellipsis-class");
      expect(breadcrumbEllipsis).toHaveClass("flex", "size-9", "items-center");
    });

    it("should pass through additional props", () => {
      render(
        <BreadcrumbEllipsis
          data-testid="breadcrumb-ellipsis"
          id="ellipsis-id"
          title="Show more items"
        />
      );

      const breadcrumbEllipsis = screen.getByTestId("breadcrumb-ellipsis");

      expect(breadcrumbEllipsis).toHaveAttribute("id", "ellipsis-id");
      expect(breadcrumbEllipsis).toHaveAttribute("title", "Show more items");
    });
  });

  describe("Breadcrumb Integration", () => {
    it("should render a complete breadcrumb navigation", () => {
      render(
        <Breadcrumb data-testid="breadcrumb">
          <BreadcrumbList data-testid="breadcrumb-list">
            <BreadcrumbItem data-testid="breadcrumb-item-1">
              <BreadcrumbLink href="/" data-testid="breadcrumb-link-1">
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator data-testid="breadcrumb-separator-1" />

            <BreadcrumbItem data-testid="breadcrumb-item-2">
              <BreadcrumbLink href="/products" data-testid="breadcrumb-link-2">
                Products
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator data-testid="breadcrumb-separator-2" />

            <BreadcrumbItem data-testid="breadcrumb-item-3">
              <BreadcrumbPage data-testid="breadcrumb-page">
                Current Product
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );

      const breadcrumb = screen.getByTestId("breadcrumb");
      const breadcrumbList = screen.getByTestId("breadcrumb-list");
      const homeLink = screen.getByTestId("breadcrumb-link-1");
      const productsLink = screen.getByTestId("breadcrumb-link-2");
      const currentPage = screen.getByTestId("breadcrumb-page");

      expect(breadcrumb).toContainElement(breadcrumbList);
      expect(breadcrumbList).toContainElement(homeLink);
      expect(breadcrumbList).toContainElement(productsLink);
      expect(breadcrumbList).toContainElement(currentPage);

      expect(homeLink).toHaveTextContent("Home");
      expect(productsLink).toHaveTextContent("Products");
      expect(currentPage).toHaveTextContent("Current Product");
    });

    it("should render breadcrumb with ellipsis for long paths", () => {
      render(
        <Breadcrumb data-testid="breadcrumb">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbEllipsis data-testid="breadcrumb-ellipsis" />
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage>Current Page</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );

      const breadcrumb = screen.getByTestId("breadcrumb");
      const ellipsis = screen.getByTestId("breadcrumb-ellipsis");

      expect(breadcrumb).toContainElement(ellipsis);
      expect(screen.getByText("More")).toBeInTheDocument();
    });

    it("should render breadcrumb with custom separators", () => {
      render(
        <Breadcrumb data-testid="breadcrumb">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator data-testid="custom-separator">
              <span>/</span>
            </BreadcrumbSeparator>

            <BreadcrumbItem>
              <BreadcrumbPage>Current Page</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );

      const customSeparator = screen.getByTestId("custom-separator");

      expect(customSeparator).toHaveTextContent("/");
    });
  });
});
