import "@testing-library/jest-dom";

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";

jest.mock("../../../hooks/use-mobile", () => ({
  useIsMobile: jest.fn(() => false),
}));

jest.mock("../../../lib/utils", () => ({
  cn: (...classes: (string | undefined)[]) => classes.filter(Boolean).join(" "),
}));

jest.mock("@radix-ui/react-slot", () => ({
  Slot: ({ children, ...props }: { children: React.ReactNode }) => (
    <div data-testid="slot" {...props}>
      {children}
    </div>
  ),
}));

jest.mock("lucide-react", () => ({
  PanelLeftIcon: () => <span data-testid="panel-left-icon">☰</span>,
}));

jest.mock("../../../components/ui/button", () => {
  const MockButton = React.forwardRef<
    HTMLButtonElement,
    React.ComponentProps<"button"> & { variant?: string; size?: string }
  >(({ children, ...props }, ref) => (
    <button ref={ref} data-testid="mock-button" {...props}>
      {children}
    </button>
  ));
  MockButton.displayName = "MockButton";

  return { Button: MockButton };
});

jest.mock("../../../components/ui/input", () => {
  const MockInput = React.forwardRef<
    HTMLInputElement,
    React.ComponentProps<"input">
  >((props, ref) => <input ref={ref} data-testid="mock-input" {...props} />);
  MockInput.displayName = "MockInput";

  return { Input: MockInput };
});

jest.mock("../../../components/ui/sheet", () => ({
  Sheet: ({
    children,
    open,
    ...props
  }: {
    children: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }) => {
    const filteredProps = Object.fromEntries(
      Object.entries(props).filter(
        ([key]) => !key.startsWith("data-testid") && key !== "onOpenChange"
      )
    );

    return (
      <div data-testid="mock-sheet" data-open={open} {...filteredProps}>
        {children}
      </div>
    );
  },
  SheetContent: ({ children, ...props }: { children: React.ReactNode }) => {
    const filteredProps = Object.fromEntries(
      Object.entries(props).filter(([key]) => !key.startsWith("data-testid"))
    );

    return (
      <div data-testid="mock-sheet-content" {...filteredProps}>
        {children}
      </div>
    );
  },
  SheetDescription: ({ children, ...props }: { children: React.ReactNode }) => (
    <div data-testid="mock-sheet-description" {...props}>
      {children}
    </div>
  ),
  SheetHeader: ({ children, ...props }: { children: React.ReactNode }) => (
    <div data-testid="mock-sheet-header" {...props}>
      {children}
    </div>
  ),
  SheetTitle: ({ children, ...props }: { children: React.ReactNode }) => (
    <div data-testid="mock-sheet-title" {...props}>
      {children}
    </div>
  ),
}));

jest.mock("../../../components/ui/skeleton", () => ({
  Skeleton: (props: React.ComponentProps<"div">) => (
    <div data-testid="mock-skeleton" {...props} />
  ),
}));

jest.mock("../../../components/ui/tooltip", () => ({
  Tooltip: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-tooltip">{children}</div>
  ),
  TooltipContent: ({ children, ...props }: { children: React.ReactNode }) => (
    <div data-testid="mock-tooltip-content" {...props}>
      {children}
    </div>
  ),
  TooltipProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-tooltip-provider">{children}</div>
  ),
  TooltipTrigger: ({ children, ...props }: { children: React.ReactNode }) => (
    <div data-testid="mock-tooltip-trigger" {...props}>
      {children}
    </div>
  ),
}));

jest.mock("../../../components/shared/separator/separator", () => ({
  Separator: (props: React.ComponentProps<"div">) => (
    <div data-testid="mock-separator" {...props} />
  ),
}));

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "../../../components/ui/sidebar";

const mockOnOpenChange = jest.fn();
const mockUseIsMobile = jest.requireMock(
  "../../../hooks/use-mobile"
).useIsMobile;

const TestSidebarConsumer = () => {
  const context = useSidebar();
  return (
    <div data-testid="sidebar-consumer">
      <div data-testid="sidebar-state">{context.state}</div>

      <div data-testid="sidebar-open">{context.open.toString()}</div>

      <div data-testid="sidebar-is-mobile">{context.isMobile.toString()}</div>

      <div data-testid="sidebar-open-mobile">
        {context.openMobile.toString()}
      </div>

      <button
        data-testid="toggle-sidebar"
        onClick={() => context.toggleSidebar()}
      >
        Toggle
      </button>

      <button data-testid="set-open" onClick={() => context.setOpen(true)}>
        Set Open
      </button>

      <button
        data-testid="set-mobile-open"
        onClick={() => context.setOpenMobile(true)}
      >
        Set Mobile Open
      </button>
    </div>
  );
};

describe("Sidebar Components", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseIsMobile.mockReturnValue(false);

    Object.defineProperty(document, "cookie", {
      writable: true,
      value: "",
    });
  });

  describe("useSidebar Hook", () => {
    it("should throw error when used outside SidebarProvider", () => {
      const consoleError = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      expect(() => {
        render(<TestSidebarConsumer />);
      }).toThrow("useSidebar must be used within a SidebarProvider.");

      consoleError.mockRestore();
    });

    it("should provide sidebar context when used inside SidebarProvider", () => {
      render(
        <SidebarProvider>
          <TestSidebarConsumer />
        </SidebarProvider>
      );

      expect(screen.getByTestId("sidebar-consumer")).toBeInTheDocument();
      expect(screen.getByTestId("sidebar-state")).toHaveTextContent("expanded");
      expect(screen.getByTestId("sidebar-open")).toHaveTextContent("true");
      expect(screen.getByTestId("sidebar-is-mobile")).toHaveTextContent(
        "false"
      );
      expect(screen.getByTestId("sidebar-open-mobile")).toHaveTextContent(
        "false"
      );
    });
  });

  describe("SidebarProvider", () => {
    it("should render with default props", () => {
      render(
        <SidebarProvider data-testid="sidebar-provider">
          <div>Test Content</div>
        </SidebarProvider>
      );

      const provider = screen.getByTestId("sidebar-provider");

      expect(provider).toBeInTheDocument();
      expect(provider).toHaveAttribute("data-slot", "sidebar-wrapper");
      expect(screen.getByText("Test Content")).toBeInTheDocument();
    });

    it("should handle defaultOpen prop", () => {
      render(
        <SidebarProvider defaultOpen={false}>
          <TestSidebarConsumer />
        </SidebarProvider>
      );

      expect(screen.getByTestId("sidebar-state")).toHaveTextContent(
        "collapsed"
      );
      expect(screen.getByTestId("sidebar-open")).toHaveTextContent("false");
    });

    it("should handle controlled open prop", () => {
      render(
        <SidebarProvider open={false} onOpenChange={mockOnOpenChange}>
          <TestSidebarConsumer />
        </SidebarProvider>
      );

      expect(screen.getByTestId("sidebar-state")).toHaveTextContent(
        "collapsed"
      );
      expect(screen.getByTestId("sidebar-open")).toHaveTextContent("false");
    });

    it("should call onOpenChange when state changes", () => {
      render(
        <SidebarProvider onOpenChange={mockOnOpenChange}>
          <TestSidebarConsumer />
        </SidebarProvider>
      );

      fireEvent.click(screen.getByTestId("set-open"));

      expect(mockOnOpenChange).toHaveBeenCalledWith(true);
    });

    it("should toggle sidebar state", () => {
      render(
        <SidebarProvider>
          <TestSidebarConsumer />
        </SidebarProvider>
      );

      expect(screen.getByTestId("sidebar-state")).toHaveTextContent("expanded");

      fireEvent.click(screen.getByTestId("toggle-sidebar"));
      expect(screen.getByTestId("sidebar-state")).toHaveTextContent(
        "collapsed"
      );

      fireEvent.click(screen.getByTestId("toggle-sidebar"));
      expect(screen.getByTestId("sidebar-state")).toHaveTextContent("expanded");
    });

    it("should handle mobile state", () => {
      mockUseIsMobile.mockReturnValue(true);

      render(
        <SidebarProvider>
          <TestSidebarConsumer />
        </SidebarProvider>
      );

      expect(screen.getByTestId("sidebar-is-mobile")).toHaveTextContent("true");

      fireEvent.click(screen.getByTestId("toggle-sidebar"));
      expect(screen.getByTestId("sidebar-open-mobile")).toHaveTextContent(
        "true"
      );
    });

    it("should handle keyboard shortcut", async () => {
      render(
        <SidebarProvider>
          <TestSidebarConsumer />
        </SidebarProvider>
      );

      expect(screen.getByTestId("sidebar-state")).toHaveTextContent("expanded");

      fireEvent.keyDown(window, { key: "b", ctrlKey: true });

      await waitFor(() => {
        expect(screen.getByTestId("sidebar-state")).toHaveTextContent(
          "collapsed"
        );
      });
    });

    it("should handle keyboard shortcut with Meta key", async () => {
      render(
        <SidebarProvider>
          <TestSidebarConsumer />
        </SidebarProvider>
      );

      fireEvent.keyDown(window, { key: "b", metaKey: true });

      await waitFor(() => {
        expect(screen.getByTestId("sidebar-state")).toHaveTextContent(
          "collapsed"
        );
      });
    });

    it("should not toggle on other keyboard shortcuts", () => {
      render(
        <SidebarProvider>
          <TestSidebarConsumer />
        </SidebarProvider>
      );

      expect(screen.getByTestId("sidebar-state")).toHaveTextContent("expanded");

      fireEvent.keyDown(window, { key: "a", ctrlKey: true });
      fireEvent.keyDown(window, { key: "b" });

      expect(screen.getByTestId("sidebar-state")).toHaveTextContent("expanded");
    });

    it("should apply custom className and style", () => {
      const customStyle = { backgroundColor: "rgb(255, 0, 0)" };

      render(
        <SidebarProvider
          className="custom-sidebar-class"
          style={customStyle}
          data-testid="sidebar-provider"
        >
          <div>Content</div>
        </SidebarProvider>
      );

      const provider = screen.getByTestId("sidebar-provider");

      expect(provider).toHaveClass("custom-sidebar-class");
      expect(provider).toHaveStyle("background-color: rgb(255, 0, 0)");
    });

    it("should set and update cookie on state change", () => {
      render(
        <SidebarProvider>
          <TestSidebarConsumer />
        </SidebarProvider>
      );

      fireEvent.click(screen.getByTestId("toggle-sidebar"));

      expect(document.cookie).toContain("sidebar_state=false");

      fireEvent.click(screen.getByTestId("toggle-sidebar"));
      expect(document.cookie).toContain("sidebar_state=true");
    });
  });

  describe("Sidebar", () => {
    const renderSidebarWithProvider = (
      sidebarProps = {},
      providerProps = {}
    ) => {
      return render(
        <SidebarProvider {...providerProps}>
          <Sidebar data-testid="sidebar" {...sidebarProps}>
            <div>Sidebar Content</div>
          </Sidebar>
        </SidebarProvider>
      );
    };

    it("should render desktop sidebar by default", () => {
      renderSidebarWithProvider();

      const sidebarWrapper = document.querySelector('[data-slot="sidebar"]');

      expect(sidebarWrapper).toBeInTheDocument();
      expect(sidebarWrapper).toHaveAttribute("data-state", "expanded");
      expect(sidebarWrapper).toHaveAttribute("data-side", "left");
      expect(sidebarWrapper).toHaveAttribute("data-variant", "sidebar");

      expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    });

    it("should render mobile sidebar when isMobile is true", () => {
      mockUseIsMobile.mockReturnValue(true);

      renderSidebarWithProvider();

      expect(screen.getByTestId("mock-sheet")).toBeInTheDocument();
      expect(screen.getByTestId("mock-sheet-content")).toBeInTheDocument();
    });

    it("should handle different sides", () => {
      renderSidebarWithProvider({ side: "right" });

      const sidebarWrapper = document.querySelector('[data-slot="sidebar"]');
      expect(sidebarWrapper).toHaveAttribute("data-side", "right");
    });

    it("should handle different variants", () => {
      const variants = ["sidebar", "floating", "inset"] as const;

      variants.forEach((variant) => {
        const { unmount } = renderSidebarWithProvider({ variant });

        const sidebarWrapper = document.querySelector('[data-slot="sidebar"]');
        expect(sidebarWrapper).toHaveAttribute("data-variant", variant);

        unmount();
      });
    });

    it("should handle different collapsible modes", () => {
      const collapsibleModes = ["offcanvas", "icon", "none"] as const;

      collapsibleModes.forEach((collapsible) => {
        const { unmount } = renderSidebarWithProvider({ collapsible });

        if (collapsible === "none") {
          const sidebar = screen.getByTestId("sidebar");

          expect(sidebar).toHaveClass("bg-sidebar", "text-sidebar-foreground");
        } else {
          const sidebar = screen.getByTestId("sidebar");

          expect(sidebar).toBeInTheDocument();
        }

        unmount();
      });
    });

    it("should show collapsible attribute when collapsed", () => {
      renderSidebarWithProvider({}, { defaultOpen: false });

      const sidebarWrapper = document.querySelector('[data-slot="sidebar"]');

      expect(sidebarWrapper).toHaveAttribute("data-state", "collapsed");
      expect(sidebarWrapper).toHaveAttribute("data-collapsible", "offcanvas");
    });

    it("should not show collapsible attribute when expanded", () => {
      renderSidebarWithProvider({}, { defaultOpen: true });

      const sidebarWrapper = document.querySelector('[data-slot="sidebar"]');

      expect(sidebarWrapper).toHaveAttribute("data-state", "expanded");
      expect(sidebarWrapper).toHaveAttribute("data-collapsible", "");
    });

    it("should apply custom className", () => {
      renderSidebarWithProvider({ className: "custom-sidebar-class" });

      expect(
        document.querySelector(".custom-sidebar-class")
      ).toBeInTheDocument();
    });

    it("should render sidebar gap and container", () => {
      renderSidebarWithProvider();

      expect(screen.getByTestId("sidebar")).toBeInTheDocument();

      const gapElement = document.querySelector('[data-slot="sidebar-gap"]');
      const containerElement = document.querySelector(
        '[data-slot="sidebar-container"]'
      );
      const innerElement = document.querySelector(
        '[data-slot="sidebar-inner"]'
      );

      expect(gapElement).toBeInTheDocument();
      expect(containerElement).toBeInTheDocument();
      expect(innerElement).toBeInTheDocument();
    });

    it("should handle none collapsible mode correctly", () => {
      renderSidebarWithProvider({ collapsible: "none" });

      const sidebar = screen.getByTestId("sidebar");
      expect(sidebar).toHaveClass(
        "bg-sidebar",
        "text-sidebar-foreground",
        "flex",
        "h-full",
        "flex-col"
      );

      expect(
        document.querySelector('[data-slot="sidebar-gap"]')
      ).not.toBeInTheDocument();
      expect(
        document.querySelector('[data-slot="sidebar-container"]')
      ).not.toBeInTheDocument();
    });
  });

  describe("Integration Tests", () => {
    it("should work with provider state changes", () => {
      render(
        <SidebarProvider>
          <TestSidebarConsumer />

          <Sidebar data-testid="sidebar">
            <div>Content</div>
          </Sidebar>
        </SidebarProvider>
      );

      const sidebarWrapper = document.querySelector('[data-slot="sidebar"]');

      expect(sidebarWrapper).toHaveAttribute("data-state", "expanded");
      expect(screen.getByTestId("sidebar-state")).toHaveTextContent("expanded");

      fireEvent.click(screen.getByTestId("toggle-sidebar"));

      expect(sidebarWrapper).toHaveAttribute("data-state", "collapsed");
      expect(screen.getByTestId("sidebar-state")).toHaveTextContent(
        "collapsed"
      );
    });

    it("should handle mobile and desktop transitions", () => {
      render(
        <SidebarProvider>
          <Sidebar data-testid="sidebar">
            <div>Content</div>
          </Sidebar>
        </SidebarProvider>
      );

      expect(screen.getByTestId("sidebar")).toBeInTheDocument();
      expect(screen.queryByTestId("mock-sheet")).not.toBeInTheDocument();
    });
  });

  describe("SidebarTrigger", () => {
    it("should render trigger button with correct attributes", () => {
      render(
        <SidebarProvider>
          <SidebarTrigger data-testid="sidebar-trigger">Toggle</SidebarTrigger>
        </SidebarProvider>
      );

      const trigger = screen.getByTestId("sidebar-trigger");

      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveAttribute("data-sidebar", "trigger");
      expect(trigger).toHaveAttribute("data-slot", "sidebar-trigger");
      expect(screen.getByTestId("panel-left-icon")).toBeInTheDocument();
    });

    it("should toggle sidebar when clicked", () => {
      render(
        <SidebarProvider>
          <TestSidebarConsumer />

          <SidebarTrigger data-testid="sidebar-trigger">Toggle</SidebarTrigger>
        </SidebarProvider>
      );

      expect(screen.getByTestId("sidebar-state")).toHaveTextContent("expanded");

      fireEvent.click(screen.getByTestId("sidebar-trigger"));

      expect(screen.getByTestId("sidebar-state")).toHaveTextContent(
        "collapsed"
      );
    });

    it("should call custom onClick handler", () => {
      const mockOnClick = jest.fn();

      render(
        <SidebarProvider>
          <SidebarTrigger onClick={mockOnClick} data-testid="sidebar-trigger">
            Toggle
          </SidebarTrigger>
        </SidebarProvider>
      );

      fireEvent.click(screen.getByTestId("sidebar-trigger"));

      expect(mockOnClick).toHaveBeenCalled();
    });

    it("should apply custom className", () => {
      render(
        <SidebarProvider>
          <SidebarTrigger
            className="custom-trigger"
            data-testid="sidebar-trigger"
          >
            Toggle
          </SidebarTrigger>
        </SidebarProvider>
      );

      expect(screen.getByTestId("sidebar-trigger")).toHaveClass(
        "custom-trigger"
      );
    });
  });

  describe("SidebarRail", () => {
    it("should render rail button with correct attributes", () => {
      render(
        <SidebarProvider>
          <SidebarRail data-testid="sidebar-rail" />
        </SidebarProvider>
      );

      const rail = screen.getByTestId("sidebar-rail");

      expect(rail).toBeInTheDocument();
      expect(rail).toHaveAttribute("data-sidebar", "rail");
      expect(rail).toHaveAttribute("data-slot", "sidebar-rail");
      expect(rail).toHaveAttribute("aria-label", "Toggle Sidebar");
      expect(rail).toHaveAttribute("title", "Toggle Sidebar");
      expect(rail).toHaveAttribute("tabIndex", "-1");
    });

    it("should toggle sidebar when clicked", () => {
      render(
        <SidebarProvider>
          <TestSidebarConsumer />

          <SidebarRail data-testid="sidebar-rail" />
        </SidebarProvider>
      );

      expect(screen.getByTestId("sidebar-state")).toHaveTextContent("expanded");

      fireEvent.click(screen.getByTestId("sidebar-rail"));

      expect(screen.getByTestId("sidebar-state")).toHaveTextContent(
        "collapsed"
      );
    });

    it("should apply custom className", () => {
      render(
        <SidebarProvider>
          <SidebarRail className="custom-rail" data-testid="sidebar-rail" />
        </SidebarProvider>
      );

      expect(screen.getByTestId("sidebar-rail")).toHaveClass("custom-rail");
    });
  });

  describe("SidebarInset", () => {
    it("should render with correct attributes", () => {
      render(<SidebarInset data-testid="sidebar-inset">Content</SidebarInset>);

      const inset = screen.getByTestId("sidebar-inset");

      expect(inset).toBeInTheDocument();
      expect(inset).toHaveAttribute("data-slot", "sidebar-inset");
      expect(inset.tagName).toBe("MAIN");
      expect(screen.getByText("Content")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      render(
        <SidebarInset className="custom-inset" data-testid="sidebar-inset">
          Content
        </SidebarInset>
      );

      expect(screen.getByTestId("sidebar-inset")).toHaveClass("custom-inset");
    });
  });

  describe("SidebarInput", () => {
    it("should render with correct attributes", () => {
      render(
        <SidebarProvider>
          <SidebarInput data-testid="sidebar-input" placeholder="Search..." />
        </SidebarProvider>
      );

      const input = screen.getByTestId("sidebar-input");

      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("data-slot", "sidebar-input");
      expect(input).toHaveAttribute("data-sidebar", "input");
      expect(input).toHaveAttribute("placeholder", "Search...");
    });

    it("should apply custom className", () => {
      render(
        <SidebarProvider>
          <SidebarInput className="custom-input" data-testid="sidebar-input" />
        </SidebarProvider>
      );

      const input = screen.getByTestId("sidebar-input");
      expect(input).toHaveClass("custom-input");
    });
  });

  describe("SidebarHeader", () => {
    it("should render with correct attributes", () => {
      render(
        <SidebarHeader data-testid="sidebar-header">Header</SidebarHeader>
      );

      const header = screen.getByTestId("sidebar-header");

      expect(header).toBeInTheDocument();
      expect(header).toHaveAttribute("data-slot", "sidebar-header");
      expect(header).toHaveAttribute("data-sidebar", "header");
      expect(screen.getByText("Header")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      render(
        <SidebarHeader className="custom-header" data-testid="sidebar-header">
          Header
        </SidebarHeader>
      );

      expect(screen.getByTestId("sidebar-header")).toHaveClass("custom-header");
    });
  });

  describe("SidebarFooter", () => {
    it("should render with correct attributes", () => {
      render(
        <SidebarFooter data-testid="sidebar-footer">Footer</SidebarFooter>
      );

      const footer = screen.getByTestId("sidebar-footer");

      expect(footer).toBeInTheDocument();
      expect(footer).toHaveAttribute("data-slot", "sidebar-footer");
      expect(footer).toHaveAttribute("data-sidebar", "footer");
      expect(screen.getByText("Footer")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      render(
        <SidebarFooter className="custom-footer" data-testid="sidebar-footer">
          Footer
        </SidebarFooter>
      );

      expect(screen.getByTestId("sidebar-footer")).toHaveClass("custom-footer");
    });
  });

  describe("SidebarSeparator", () => {
    it("should render with correct attributes", () => {
      render(<SidebarSeparator data-testid="sidebar-separator" />);

      const separator = screen.getByTestId("sidebar-separator");

      expect(separator).toBeInTheDocument();
      expect(separator).toHaveAttribute("data-slot", "sidebar-separator");
      expect(separator).toHaveAttribute("data-sidebar", "separator");
    });

    it("should apply custom className", () => {
      render(
        <SidebarSeparator
          className="custom-separator"
          data-testid="sidebar-separator"
        />
      );

      expect(screen.getByTestId("sidebar-separator")).toHaveClass(
        "custom-separator"
      );
    });
  });

  describe("SidebarContent", () => {
    it("should render with correct attributes", () => {
      render(
        <SidebarContent data-testid="sidebar-content">Content</SidebarContent>
      );

      const content = screen.getByTestId("sidebar-content");

      expect(content).toBeInTheDocument();
      expect(content).toHaveAttribute("data-slot", "sidebar-content");
      expect(content).toHaveAttribute("data-sidebar", "content");
      expect(screen.getByText("Content")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      render(
        <SidebarContent
          className="custom-content"
          data-testid="sidebar-content"
        >
          Content
        </SidebarContent>
      );

      expect(screen.getByTestId("sidebar-content")).toHaveClass(
        "custom-content"
      );
    });
  });

  describe("SidebarGroup", () => {
    it("should render with correct attributes", () => {
      render(<SidebarGroup data-testid="sidebar-group">Group</SidebarGroup>);

      const group = screen.getByTestId("sidebar-group");

      expect(group).toBeInTheDocument();
      expect(group).toHaveAttribute("data-slot", "sidebar-group");
      expect(group).toHaveAttribute("data-sidebar", "group");
      expect(screen.getByText("Group")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      render(
        <SidebarGroup className="custom-group" data-testid="sidebar-group">
          Group
        </SidebarGroup>
      );

      expect(screen.getByTestId("sidebar-group")).toHaveClass("custom-group");
    });
  });

  describe("SidebarGroupLabel", () => {
    it("should render with correct attributes", () => {
      render(
        <SidebarGroupLabel data-testid="sidebar-group-label">
          Label
        </SidebarGroupLabel>
      );

      const label = screen.getByTestId("sidebar-group-label");

      expect(label).toBeInTheDocument();
      expect(label).toHaveAttribute("data-slot", "sidebar-group-label");
      expect(label).toHaveAttribute("data-sidebar", "group-label");
      expect(screen.getByText("Label")).toBeInTheDocument();
    });

    it("should work with asChild prop", () => {
      render(
        <SidebarGroupLabel asChild data-testid="sidebar-group-label">
          <h2>Label</h2>
        </SidebarGroupLabel>
      );

      const label = screen.getByTestId("sidebar-group-label");

      expect(label).toBeInTheDocument();
      expect(label).toHaveAttribute("data-slot", "sidebar-group-label");
      expect(screen.getByText("Label")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      render(
        <SidebarGroupLabel
          className="custom-label"
          data-testid="sidebar-group-label"
        >
          Label
        </SidebarGroupLabel>
      );

      expect(screen.getByTestId("sidebar-group-label")).toHaveClass(
        "custom-label"
      );
    });
  });

  describe("SidebarGroupAction", () => {
    it("should render with correct attributes", () => {
      render(
        <SidebarGroupAction data-testid="sidebar-group-action">
          Action
        </SidebarGroupAction>
      );

      const action = screen.getByTestId("sidebar-group-action");

      expect(action).toBeInTheDocument();
      expect(action).toHaveAttribute("data-slot", "sidebar-group-action");
      expect(action).toHaveAttribute("data-sidebar", "group-action");
      expect(screen.getByText("Action")).toBeInTheDocument();
    });

    it("should work with asChild prop", () => {
      render(
        <SidebarGroupAction asChild data-testid="sidebar-group-action">
          <button>Action</button>
        </SidebarGroupAction>
      );

      const action = screen.getByTestId("sidebar-group-action");

      expect(action).toBeInTheDocument();
      expect(action).toHaveAttribute("data-slot", "sidebar-group-action");
      expect(screen.getByText("Action")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      render(
        <SidebarGroupAction
          className="custom-action"
          data-testid="sidebar-group-action"
        >
          Action
        </SidebarGroupAction>
      );

      expect(screen.getByTestId("sidebar-group-action")).toHaveClass(
        "custom-action"
      );
    });
  });

  describe("SidebarGroupContent", () => {
    it("should render with correct attributes", () => {
      render(
        <SidebarGroupContent data-testid="sidebar-group-content">
          Content
        </SidebarGroupContent>
      );

      const content = screen.getByTestId("sidebar-group-content");

      expect(content).toBeInTheDocument();
      expect(content).toHaveAttribute("data-slot", "sidebar-group-content");
      expect(content).toHaveAttribute("data-sidebar", "group-content");
      expect(screen.getByText("Content")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      render(
        <SidebarGroupContent
          className="custom-group-content"
          data-testid="sidebar-group-content"
        >
          Content
        </SidebarGroupContent>
      );

      expect(screen.getByTestId("sidebar-group-content")).toHaveClass(
        "custom-group-content"
      );
    });
  });

  describe("SidebarMenu", () => {
    it("should render with correct attributes", () => {
      render(<SidebarMenu data-testid="sidebar-menu">Menu</SidebarMenu>);

      const menu = screen.getByTestId("sidebar-menu");

      expect(menu).toBeInTheDocument();
      expect(menu).toHaveAttribute("data-slot", "sidebar-menu");
      expect(menu).toHaveAttribute("data-sidebar", "menu");
      expect(menu.tagName).toBe("UL");
      expect(screen.getByText("Menu")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      render(
        <SidebarMenu className="custom-menu" data-testid="sidebar-menu">
          Menu
        </SidebarMenu>
      );

      expect(screen.getByTestId("sidebar-menu")).toHaveClass("custom-menu");
    });
  });

  describe("SidebarMenuItem", () => {
    it("should render with correct attributes", () => {
      render(
        <SidebarMenuItem data-testid="sidebar-menu-item">Item</SidebarMenuItem>
      );

      const item = screen.getByTestId("sidebar-menu-item");

      expect(item).toBeInTheDocument();
      expect(item).toHaveAttribute("data-slot", "sidebar-menu-item");
      expect(item).toHaveAttribute("data-sidebar", "menu-item");
      expect(item.tagName).toBe("LI");
      expect(screen.getByText("Item")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      render(
        <SidebarMenuItem
          className="custom-item"
          data-testid="sidebar-menu-item"
        >
          Item
        </SidebarMenuItem>
      );

      expect(screen.getByTestId("sidebar-menu-item")).toHaveClass(
        "custom-item"
      );
    });
  });

  describe("SidebarMenuButton", () => {
    it("should render with correct attributes", () => {
      render(
        <SidebarProvider>
          <SidebarMenuButton data-testid="sidebar-menu-button">
            Button
          </SidebarMenuButton>
        </SidebarProvider>
      );

      const button = screen.getByTestId("sidebar-menu-button");

      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute("data-slot", "sidebar-menu-button");
      expect(button).toHaveAttribute("data-sidebar", "menu-button");
      expect(screen.getByText("Button")).toBeInTheDocument();
    });

    it("should handle isActive prop", () => {
      render(
        <SidebarProvider>
          <SidebarMenuButton isActive data-testid="sidebar-menu-button">
            Button
          </SidebarMenuButton>
        </SidebarProvider>
      );

      const button = screen.getByTestId("sidebar-menu-button");
      expect(button).toHaveAttribute("data-active", "true");
    });

    it("should handle different sizes", () => {
      const sizes = ["default", "sm", "lg"] as const;

      sizes.forEach((size) => {
        const { unmount } = render(
          <SidebarProvider>
            <SidebarMenuButton size={size} data-testid="sidebar-menu-button">
              Button
            </SidebarMenuButton>
          </SidebarProvider>
        );

        const button = screen.getByTestId("sidebar-menu-button");
        expect(button).toHaveAttribute("data-size", size);

        unmount();
      });
    });

    it("should handle different variants", () => {
      const variants = ["default", "outline"] as const;

      variants.forEach((variant) => {
        const { unmount } = render(
          <SidebarProvider>
            <SidebarMenuButton
              data-testid="sidebar-menu-button"
              variant={variant}
            >
              Button
            </SidebarMenuButton>
          </SidebarProvider>
        );

        const button = screen.getByTestId("sidebar-menu-button");
        expect(button).toBeInTheDocument();

        unmount();
      });
    });

    it("should work with asChild prop", () => {
      render(
        <SidebarProvider>
          <SidebarMenuButton asChild data-testid="sidebar-menu-button">
            <a href="#test">Link</a>
          </SidebarMenuButton>
        </SidebarProvider>
      );

      const button = screen.getByTestId("sidebar-menu-button");

      expect(button).toBeInTheDocument();
      expect(screen.getByText("Link")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      render(
        <SidebarProvider>
          <SidebarMenuButton
            className="custom-button"
            data-testid="sidebar-menu-button"
          >
            Button
          </SidebarMenuButton>
        </SidebarProvider>
      );

      expect(screen.getByTestId("sidebar-menu-button")).toHaveClass(
        "custom-button"
      );
    });
  });

  describe("SidebarMenuAction", () => {
    it("should render with correct attributes", () => {
      render(
        <SidebarMenuAction data-testid="sidebar-menu-action">
          Action
        </SidebarMenuAction>
      );

      const action = screen.getByTestId("sidebar-menu-action");

      expect(action).toBeInTheDocument();
      expect(action).toHaveAttribute("data-slot", "sidebar-menu-action");
      expect(action).toHaveAttribute("data-sidebar", "menu-action");
      expect(screen.getByText("Action")).toBeInTheDocument();
    });

    it("should work with asChild prop", () => {
      render(
        <SidebarMenuAction asChild data-testid="sidebar-menu-action">
          <button>Action</button>
        </SidebarMenuAction>
      );

      const action = screen.getByTestId("sidebar-menu-action");

      expect(action).toBeInTheDocument();
      expect(action).toHaveAttribute("data-slot", "sidebar-menu-action");
      expect(screen.getByText("Action")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      render(
        <SidebarMenuAction
          className="custom-action"
          data-testid="sidebar-menu-action"
        >
          Action
        </SidebarMenuAction>
      );

      expect(screen.getByTestId("sidebar-menu-action")).toHaveClass(
        "custom-action"
      );
    });
  });

  describe("SidebarMenuBadge", () => {
    it("should render with correct attributes", () => {
      render(
        <SidebarMenuBadge data-testid="sidebar-menu-badge">5</SidebarMenuBadge>
      );

      const badge = screen.getByTestId("sidebar-menu-badge");

      expect(badge).toBeInTheDocument();
      expect(badge).toHaveAttribute("data-slot", "sidebar-menu-badge");
      expect(badge).toHaveAttribute("data-sidebar", "menu-badge");
      expect(screen.getByText("5")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      render(
        <SidebarMenuBadge
          className="custom-badge"
          data-testid="sidebar-menu-badge"
        >
          5
        </SidebarMenuBadge>
      );

      expect(screen.getByTestId("sidebar-menu-badge")).toHaveClass(
        "custom-badge"
      );
    });
  });

  describe("SidebarMenuSkeleton", () => {
    it("should render with correct attributes", () => {
      render(<SidebarMenuSkeleton data-testid="sidebar-menu-skeleton" />);

      const skeleton = screen.getByTestId("sidebar-menu-skeleton");

      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveAttribute("data-slot", "sidebar-menu-skeleton");
      expect(skeleton).toHaveAttribute("data-sidebar", "menu-skeleton");
    });

    it("should render with icon when showIcon is true", () => {
      render(
        <SidebarMenuSkeleton showIcon data-testid="sidebar-menu-skeleton" />
      );

      expect(screen.getByTestId("sidebar-menu-skeleton")).toBeInTheDocument();
      expect(screen.getAllByTestId("mock-skeleton")).toHaveLength(2);
    });

    it("should apply custom className", () => {
      render(
        <SidebarMenuSkeleton
          className="custom-skeleton"
          data-testid="sidebar-menu-skeleton"
        />
      );

      expect(screen.getByTestId("sidebar-menu-skeleton")).toHaveClass(
        "custom-skeleton"
      );
    });
  });

  describe("SidebarMenuSub", () => {
    it("should render with correct attributes", () => {
      render(
        <SidebarMenuSub data-testid="sidebar-menu-sub">Sub Menu</SidebarMenuSub>
      );

      const subMenu = screen.getByTestId("sidebar-menu-sub");

      expect(subMenu).toBeInTheDocument();
      expect(subMenu).toHaveAttribute("data-slot", "sidebar-menu-sub");
      expect(subMenu).toHaveAttribute("data-sidebar", "menu-sub");
      expect(subMenu.tagName).toBe("UL");
      expect(screen.getByText("Sub Menu")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      render(
        <SidebarMenuSub
          className="custom-sub-menu"
          data-testid="sidebar-menu-sub"
        >
          Sub Menu
        </SidebarMenuSub>
      );

      expect(screen.getByTestId("sidebar-menu-sub")).toHaveClass(
        "custom-sub-menu"
      );
    });
  });

  describe("SidebarMenuSubItem", () => {
    it("should render with correct attributes", () => {
      render(
        <SidebarMenuSubItem data-testid="sidebar-menu-sub-item">
          Sub Item
        </SidebarMenuSubItem>
      );

      const subItem = screen.getByTestId("sidebar-menu-sub-item");

      expect(subItem).toBeInTheDocument();
      expect(subItem).toHaveAttribute("data-slot", "sidebar-menu-sub-item");
      expect(subItem).toHaveAttribute("data-sidebar", "menu-sub-item");
      expect(subItem.tagName).toBe("LI");
      expect(screen.getByText("Sub Item")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      render(
        <SidebarMenuSubItem
          className="custom-sub-item"
          data-testid="sidebar-menu-sub-item"
        >
          Sub Item
        </SidebarMenuSubItem>
      );

      expect(screen.getByTestId("sidebar-menu-sub-item")).toHaveClass(
        "custom-sub-item"
      );
    });
  });

  describe("SidebarMenuSubButton", () => {
    it("should render with correct attributes", () => {
      render(
        <SidebarProvider>
          <SidebarMenuSubButton data-testid="sidebar-menu-sub-button">
            Sub Button
          </SidebarMenuSubButton>
        </SidebarProvider>
      );

      const subButton = screen.getByTestId("sidebar-menu-sub-button");

      expect(subButton).toBeInTheDocument();
      expect(subButton).toHaveAttribute("data-slot", "sidebar-menu-sub-button");
      expect(subButton).toHaveAttribute("data-sidebar", "menu-sub-button");
      expect(screen.getByText("Sub Button")).toBeInTheDocument();
    });

    it("should handle isActive prop", () => {
      render(
        <SidebarProvider>
          <SidebarMenuSubButton isActive data-testid="sidebar-menu-sub-button">
            Sub Button
          </SidebarMenuSubButton>
        </SidebarProvider>
      );

      const subButton = screen.getByTestId("sidebar-menu-sub-button");
      expect(subButton).toHaveAttribute("data-active", "true");
    });

    it("should handle different sizes", () => {
      const sizes = ["sm", "md"] as const;

      sizes.forEach((size) => {
        const { unmount } = render(
          <SidebarProvider>
            <SidebarMenuSubButton
              data-testid="sidebar-menu-sub-button"
              size={size}
            >
              Sub Button
            </SidebarMenuSubButton>
          </SidebarProvider>
        );

        const subButton = screen.getByTestId("sidebar-menu-sub-button");
        expect(subButton).toHaveAttribute("data-size", size);

        unmount();
      });
    });

    it("should work with asChild prop", () => {
      render(
        <SidebarProvider>
          <SidebarMenuSubButton asChild data-testid="sidebar-menu-sub-button">
            <a href="#test">Sub Link</a>
          </SidebarMenuSubButton>
        </SidebarProvider>
      );

      const subButton = screen.getByTestId("sidebar-menu-sub-button");

      expect(subButton).toBeInTheDocument();
      expect(screen.getByText("Sub Link")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      render(
        <SidebarProvider>
          <SidebarMenuSubButton
            className="custom-sub-button"
            data-testid="sidebar-menu-sub-button"
          >
            Sub Button
          </SidebarMenuSubButton>
        </SidebarProvider>
      );

      expect(screen.getByTestId("sidebar-menu-sub-button")).toHaveClass(
        "custom-sub-button"
      );
    });
  });
});
