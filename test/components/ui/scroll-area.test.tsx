import { render, screen } from "@testing-library/react";
import React from "react";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

jest.mock(
  "@radix-ui/react-scroll-area",
  () => ({
  Root: ({
    children,
    className,
    ...props
  }: {
    children: React.ReactNode;
    className?: string;
    [key: string]: unknown;
  }) => (
    <div data-testid="scroll-area-root" className={className} {...props}>
      {children}
    </div>
  ),
  Viewport: ({
    children,
    className,
    ...props
  }: {
    children: React.ReactNode;
    className?: string;
    [key: string]: unknown;
  }) => (
    <div data-testid="scroll-area-viewport" className={className} {...props}>
      {children}
    </div>
  ),
  ScrollAreaScrollbar: ({
    children,
    className,
    orientation,
    ...props
  }: {
    children: React.ReactNode;
    className?: string;
    orientation?: "vertical" | "horizontal";
    [key: string]: unknown;
  }) => (
    <div
      className={className}
      data-orientation={orientation}
      data-testid="scroll-area-scrollbar"
      {...props}
    >
      {children}
    </div>
  ),
  ScrollAreaThumb: ({
    className,
    ...props
  }: {
    className?: string;
    [key: string]: unknown;
  }) => (
    <div data-testid="scroll-area-thumb" className={className} {...props} />
  ),
  Corner: (props: { [key: string]: unknown }) => (
    <div data-testid="scroll-area-corner" {...props} />
  ),
  }),
  { virtual: true }
);

describe("ScrollArea", () => {
  it("should render correctly", () => {
    render(
      <ScrollArea>
        <div>Content</div>
      </ScrollArea>
    );

    expect(screen.getByTestId("scroll-area-root")).toBeInTheDocument();
    expect(screen.getByTestId("scroll-area-viewport")).toBeInTheDocument();
    expect(screen.getByTestId("scroll-area-scrollbar")).toBeInTheDocument();
    expect(screen.getByTestId("scroll-area-corner")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("should apply default classes to root", () => {
    render(<ScrollArea data-testid="scroll-area">Content</ScrollArea>);

    const scrollArea = screen.getByTestId("scroll-area");
    expect(scrollArea).toHaveClass("relative");
  });

  it("should merge custom className with default classes", () => {
    render(
      <ScrollArea className="custom-class" data-testid="scroll-area">
        Content
      </ScrollArea>
    );

    const scrollArea = screen.getByTestId("scroll-area");

    expect(scrollArea).toHaveClass("custom-class");
    expect(scrollArea).toHaveClass("relative");
  });

  it("should have data-slot attribute on root", () => {
    render(<ScrollArea>Content</ScrollArea>);

    const scrollArea = screen.getByTestId("scroll-area-root");
    expect(scrollArea).toHaveAttribute("data-slot", "scroll-area");
  });

  it("should have data-slot attribute on viewport", () => {
    render(<ScrollArea>Content</ScrollArea>);

    const viewport = screen.getByTestId("scroll-area-viewport");
    expect(viewport).toHaveAttribute("data-slot", "scroll-area-viewport");
  });

  it("should apply viewport classes", () => {
    render(<ScrollArea>Content</ScrollArea>);

    const viewport = screen.getByTestId("scroll-area-viewport");

  expect(viewport).toHaveClass("focus-visible:ring-[rgba(30,86,49,0.5)]");
    expect(viewport).toHaveClass("size-full");
    expect(viewport).toHaveClass("rounded-[inherit]");
  expect(viewport).toHaveClass("focus-visible:ring-[3px]");
  expect(viewport).toHaveClass("focus-visible:outline-1");
  });

  it("should render children inside viewport", () => {
    render(
      <ScrollArea>
        <div data-testid="child-content">Test Content</div>
      </ScrollArea>
    );

    const viewport = screen.getByTestId("scroll-area-viewport");
    const childContent = screen.getByTestId("child-content");

    expect(viewport).toContainElement(childContent);
    expect(childContent).toHaveTextContent("Test Content");
  });

  it("should forward props to root component", () => {
    render(
      <ScrollArea role="region" aria-label="Scrollable content">
        Content
      </ScrollArea>
    );

    const scrollArea = screen.getByTestId("scroll-area-root");

    expect(scrollArea).toHaveAttribute("role", "region");
    expect(scrollArea).toHaveAttribute("aria-label", "Scrollable content");
  });
});

describe("ScrollBar", () => {
  it("should render correctly with default orientation", () => {
    render(<ScrollBar />);

    const scrollbar = screen.getByTestId("scroll-area-scrollbar");
    const thumb = screen.getByTestId("scroll-area-thumb");

    expect(scrollbar).toBeInTheDocument();
    expect(thumb).toBeInTheDocument();
    expect(scrollbar).toHaveAttribute("data-orientation", "vertical");
  });

  it("should render with vertical orientation", () => {
    render(<ScrollBar orientation="vertical" />);

    const scrollbar = screen.getByTestId("scroll-area-scrollbar");
    expect(scrollbar).toHaveAttribute("data-orientation", "vertical");
  });

  it("should render with horizontal orientation", () => {
    render(<ScrollBar orientation="horizontal" />);

    const scrollbar = screen.getByTestId("scroll-area-scrollbar");
    expect(scrollbar).toHaveAttribute("data-orientation", "horizontal");
  });

  it("should apply default classes", () => {
    render(<ScrollBar />);

    const scrollbar = screen.getByTestId("scroll-area-scrollbar");

    expect(scrollbar).toHaveClass("flex");
    expect(scrollbar).toHaveClass("touch-none");
    expect(scrollbar).toHaveClass("p-px");
    expect(scrollbar).toHaveClass("transition-colors");
    expect(scrollbar).toHaveClass("select-none");
  });

  it("should apply vertical orientation classes", () => {
    render(<ScrollBar orientation="vertical" />);

    const scrollbar = screen.getByTestId("scroll-area-scrollbar");

    expect(scrollbar).toHaveClass("h-full");
    expect(scrollbar).toHaveClass("w-2.5");
    expect(scrollbar).toHaveClass("border-l");
    expect(scrollbar).toHaveClass("border-l-transparent");
  });

  it("should apply horizontal orientation classes", () => {
    render(<ScrollBar orientation="horizontal" />);

    const scrollbar = screen.getByTestId("scroll-area-scrollbar");

    expect(scrollbar).toHaveClass("h-2.5");
    expect(scrollbar).toHaveClass("flex-col");
    expect(scrollbar).toHaveClass("border-t");
    expect(scrollbar).toHaveClass("border-t-transparent");
  });

  it("should merge custom className with default classes", () => {
    render(<ScrollBar className="custom-scrollbar" />);

    const scrollbar = screen.getByTestId("scroll-area-scrollbar");

    expect(scrollbar).toHaveClass("custom-scrollbar");
    expect(scrollbar).toHaveClass("flex");
  });

  it("should have data-slot attribute on scrollbar", () => {
    render(<ScrollBar />);

    const scrollbar = screen.getByTestId("scroll-area-scrollbar");
    expect(scrollbar).toHaveAttribute("data-slot", "scroll-area-scrollbar");
  });

  it("should have data-slot attribute on thumb", () => {
    render(<ScrollBar />);

    const thumb = screen.getByTestId("scroll-area-thumb");
    expect(thumb).toHaveAttribute("data-slot", "scroll-area-thumb");
  });

  it("should apply thumb classes", () => {
    render(<ScrollBar />);

    const thumb = screen.getByTestId("scroll-area-thumb");

    expect(thumb).toHaveClass("bg-border");
    expect(thumb).toHaveClass("relative");
    expect(thumb).toHaveClass("flex-1");
    expect(thumb).toHaveClass("rounded-full");
  });

  it("should forward props to scrollbar component", () => {
    render(<ScrollBar role="scrollbar" aria-label="Vertical scrollbar" />);

    const scrollbar = screen.getByTestId("scroll-area-scrollbar");

    expect(scrollbar).toHaveAttribute("role", "scrollbar");
    expect(scrollbar).toHaveAttribute("aria-label", "Vertical scrollbar");
  });
});

describe("ScrollArea Integration", () => {
  it("should render ScrollArea with custom ScrollBar", () => {
    render(
      <ScrollArea>
        <div>Long content that might need scrolling</div>

        <ScrollBar orientation="horizontal" className="custom-horizontal" />
      </ScrollArea>
    );

    expect(screen.getByTestId("scroll-area-root")).toBeInTheDocument();
    expect(
      screen.getByText("Long content that might need scrolling")
    ).toBeInTheDocument();

    const scrollbars = screen.getAllByTestId("scroll-area-scrollbar");
    expect(scrollbars).toHaveLength(2);

    const horizontalScrollbar = scrollbars.find(
      (scrollbar) => scrollbar.getAttribute("data-orientation") === "horizontal"
    );
    expect(horizontalScrollbar).toHaveClass("custom-horizontal");
  });

  it("should handle complex content structure", () => {
    render(
      <ScrollArea className="h-96 w-full">
        <div className="p-4">
          <h2>Section 1</h2>

          <p>Content paragraph 1</p>

          <h2>Section 2</h2>

          <p>Content paragraph 2</p>
        </div>
      </ScrollArea>
    );

    expect(screen.getByText("Section 1")).toBeInTheDocument();
    expect(screen.getByText("Content paragraph 1")).toBeInTheDocument();
    expect(screen.getByText("Section 2")).toBeInTheDocument();
    expect(screen.getByText("Content paragraph 2")).toBeInTheDocument();

    const scrollArea = screen.getByTestId("scroll-area-root");

    expect(scrollArea).toHaveClass("h-96");
    expect(scrollArea).toHaveClass("w-full");
  });

  it("should maintain proper nesting structure", () => {
    render(
      <ScrollArea>
        <div data-testid="content-wrapper">
          <span data-testid="nested-content">Nested content</span>
        </div>
      </ScrollArea>
    );

    const root = screen.getByTestId("scroll-area-root");
    const viewport = screen.getByTestId("scroll-area-viewport");
    const contentWrapper = screen.getByTestId("content-wrapper");
    const nestedContent = screen.getByTestId("nested-content");

    expect(root).toContainElement(viewport);
    expect(viewport).toContainElement(contentWrapper);
    expect(contentWrapper).toContainElement(nestedContent);
  });

  it("should support accessibility features", () => {
    render(
      <ScrollArea role="region" aria-label="Main content area">
        <div>Accessible content</div>
      </ScrollArea>
    );

    const scrollArea = screen.getByTestId("scroll-area-root");

    expect(scrollArea).toHaveAttribute("role", "region");
    expect(scrollArea).toHaveAttribute("aria-label", "Main content area");
  });
});
