import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";

interface TestSheetProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  modal?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface TestSheetTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
  className?: string;
}

interface TestSheetCloseProps {
  asChild?: boolean;
  children: React.ReactNode;
  className?: string;
}

interface TestSheetPortalProps {
  children: React.ReactNode;
  container?: HTMLElement;
}

interface TestSheetOverlayProps {
  className?: string;
}

interface TestSheetContentProps {
  children?: React.ReactNode;
  className?: string;
  side?: "top" | "right" | "bottom" | "left";
}

interface TestSheetHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface TestSheetFooterProps {
  children: React.ReactNode;
  className?: string;
}

interface TestSheetTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface TestSheetDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

const mockOnOpenChange = jest.fn();

const XIcon = ({ className }: { className?: string }) => (
  <span data-testid="x-icon" className={className}>
    ✕
  </span>
);

const TestSheet = ({
  children,
  open,
  onOpenChange,
  defaultOpen = false,
  modal = true,
}: TestSheetProps) => {
  const [isOpen, setIsOpen] = React.useState(
    open !== undefined ? open : defaultOpen
  );

  React.useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open);
    }
  }, [open]);

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  const cloneElementWithProps = (
    element: React.ReactElement
  ): React.ReactElement => {
    const props = {
      isOpen,
      onOpenChange: handleOpenChange,
    } as Record<string, unknown>;

    const elementProps = element.props as { children?: React.ReactNode };
    if (elementProps.children) {
      props.children = React.Children.map(elementProps.children, (child) => {
        if (React.isValidElement(child)) {
          return cloneElementWithProps(child);
        }

        return child;
      });
    }

    return React.cloneElement(element, props);
  };

  return (
    <div
      data-modal={modal}
      data-slot="sheet"
      data-state={isOpen ? "open" : "closed"}
      data-testid="sheet-root"
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return cloneElementWithProps(child);
        }

        return child;
      })}
    </div>
  );
};

const TestSheetTrigger = ({
  children,
  asChild = false,
  className = "",
  isOpen,
  onOpenChange,
}: TestSheetTriggerProps & {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}) => {
  const handleClick = () => {
    onOpenChange?.(!isOpen);
  };

  const baseClasses = "inline-flex items-center justify-center";
  const combinedClasses = className
    ? `${baseClasses} ${className}`
    : baseClasses;

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: handleClick,
      "data-testid": "sheet-trigger",
      "data-slot": "sheet-trigger",
      className: combinedClasses,
    } as Record<string, unknown>);
  }

  return (
    <button
      className={combinedClasses}
      data-slot="sheet-trigger"
      data-testid="sheet-trigger"
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

const TestSheetClose = ({
  children,
  asChild = false,
  className = "",
  onOpenChange,
}: TestSheetCloseProps & {
  onOpenChange?: (open: boolean) => void;
}) => {
  const handleClick = () => {
    onOpenChange?.(false);
  };

  const baseClasses = "inline-flex items-center justify-center";
  const combinedClasses = className
    ? `${baseClasses} ${className}`
    : baseClasses;

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: handleClick,
      "data-testid": "sheet-close",
      "data-slot": "sheet-close",
      className: combinedClasses,
    } as Record<string, unknown>);
  }

  return (
    <button
      className={combinedClasses}
      data-slot="sheet-close"
      data-testid="sheet-close"
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

const TestSheetPortal = ({ children, container }: TestSheetPortalProps) => {
  return (
    <div
      data-container={container ? "custom" : "body"}
      data-slot="sheet-portal"
      data-testid="sheet-portal"
    >
      {children}
    </div>
  );
};

const TestSheetOverlay = ({ className = "" }: TestSheetOverlayProps) => {
  const baseClasses =
    "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50";
  const combinedClasses = className
    ? `${baseClasses} ${className}`
    : baseClasses;

  return (
    <div
      className={combinedClasses}
      data-slot="sheet-overlay"
      data-state="open"
      data-testid="sheet-overlay"
    />
  );
};

const TestSheetContent = ({
  children,
  side = "right",
  className = "",
  isOpen,
  onOpenChange,
}: TestSheetContentProps & {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}) => {
  if (!isOpen) return null;

  const baseClasses =
    "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500";

  const sideClasses = {
    right:
      "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
    left: "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
    top: "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
    bottom:
      "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
  };

  const combinedClasses =
    `${baseClasses} ${sideClasses[side]} ${className}`.trim();

  return (
    <TestSheetPortal>
      <TestSheetOverlay />
      <div
        className={combinedClasses}
        data-side={side}
        data-slot="sheet-content"
        data-state="open"
        data-testid="sheet-content"
      >
        {children}
        <TestSheetClose
          className="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none"
          onOpenChange={onOpenChange}
        >
          <XIcon className="size-4" />

          <span className="sr-only">Close</span>
        </TestSheetClose>
      </div>
    </TestSheetPortal>
  );
};

const TestSheetHeader = ({
  children,
  className = "",
}: TestSheetHeaderProps) => {
  const baseClasses = "flex flex-col gap-1.5 p-4";
  const combinedClasses = className
    ? `${baseClasses} ${className}`
    : baseClasses;

  return (
    <div
      className={combinedClasses}
      data-slot="sheet-header"
      data-testid="sheet-header"
    >
      {children}
    </div>
  );
};

const TestSheetFooter = ({
  children,
  className = "",
}: TestSheetFooterProps) => {
  const baseClasses = "mt-auto flex flex-col gap-2 p-4";
  const combinedClasses = className
    ? `${baseClasses} ${className}`
    : baseClasses;

  return (
    <div
      className={combinedClasses}
      data-slot="sheet-footer"
      data-testid="sheet-footer"
    >
      {children}
    </div>
  );
};

const TestSheetTitle = ({ children, className = "" }: TestSheetTitleProps) => {
  const baseClasses = "text-foreground font-semibold";
  const combinedClasses = className
    ? `${baseClasses} ${className}`
    : baseClasses;

  return (
    <h2
      className={combinedClasses}
      data-slot="sheet-title"
      data-testid="sheet-title"
    >
      {children}
    </h2>
  );
};

const TestSheetDescription = ({
  children,
  className = "",
}: TestSheetDescriptionProps) => {
  const baseClasses = "text-muted-foreground text-sm";
  const combinedClasses = className
    ? `${baseClasses} ${className}`
    : baseClasses;

  return (
    <p
      className={combinedClasses}
      data-slot="sheet-description"
      data-testid="sheet-description"
    >
      {children}
    </p>
  );
};

describe("Sheet Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Sheet Root", () => {
    it("should render sheet root with correct structure", () => {
      render(
        <TestSheet>
          <TestSheetTrigger>Open Sheet</TestSheetTrigger>

          <TestSheetContent>
            <TestSheetHeader>
              <TestSheetTitle>Sheet Title</TestSheetTitle>
            </TestSheetHeader>
          </TestSheetContent>
        </TestSheet>
      );

      expect(screen.getByTestId("sheet-root")).toBeInTheDocument();
      expect(screen.getByTestId("sheet-root")).toHaveAttribute(
        "data-slot",
        "sheet"
      );
    });

    it("should have closed state by default", () => {
      render(
        <TestSheet>
          <TestSheetTrigger>Open Sheet</TestSheetTrigger>

          <TestSheetContent>Content</TestSheetContent>
        </TestSheet>
      );

      expect(screen.getByTestId("sheet-root")).toHaveAttribute(
        "data-state",
        "closed"
      );
    });

    it("should accept controlled open prop", () => {
      render(
        <TestSheet open={true}>
          <TestSheetTrigger>Open Sheet</TestSheetTrigger>

          <TestSheetContent>Content</TestSheetContent>
        </TestSheet>
      );

      expect(screen.getByTestId("sheet-root")).toHaveAttribute(
        "data-state",
        "open"
      );
    });

    it("should handle defaultOpen prop", () => {
      render(
        <TestSheet defaultOpen={true}>
          <TestSheetTrigger>Open Sheet</TestSheetTrigger>

          <TestSheetContent>Content</TestSheetContent>
        </TestSheet>
      );

      expect(screen.getByTestId("sheet-root")).toHaveAttribute(
        "data-state",
        "open"
      );
    });

    it("should call onOpenChange when state changes", async () => {
      render(
        <TestSheet onOpenChange={mockOnOpenChange}>
          <TestSheetTrigger>Open Sheet</TestSheetTrigger>

          <TestSheetContent>Content</TestSheetContent>
        </TestSheet>
      );

      fireEvent.click(screen.getByTestId("sheet-trigger"));

      await waitFor(() => {
        expect(mockOnOpenChange).toHaveBeenCalledWith(true);
      });
    });

    it("should handle modal prop", () => {
      render(
        <TestSheet modal={false}>
          <TestSheetTrigger>Open Sheet</TestSheetTrigger>

          <TestSheetContent>Content</TestSheetContent>
        </TestSheet>
      );

      expect(screen.getByTestId("sheet-root")).toHaveAttribute(
        "data-modal",
        "false"
      );
    });
  });

  describe("SheetTrigger", () => {
    it("should render trigger with correct attributes", () => {
      render(
        <TestSheet>
          <TestSheetTrigger>Open Sheet</TestSheetTrigger>

          <TestSheetContent>Content</TestSheetContent>
        </TestSheet>
      );

      const trigger = screen.getByTestId("sheet-trigger");
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveAttribute("data-slot", "sheet-trigger");
      expect(trigger).toHaveTextContent("Open Sheet");
    });

    it("should open sheet when clicked", async () => {
      render(
        <TestSheet>
          <TestSheetTrigger>Open Sheet</TestSheetTrigger>

          <TestSheetContent>Content</TestSheetContent>
        </TestSheet>
      );

      fireEvent.click(screen.getByTestId("sheet-trigger"));

      await waitFor(() => {
        expect(screen.getByTestId("sheet-content")).toBeInTheDocument();
      });
    });

    it("should apply custom className", () => {
      render(
        <TestSheet>
          <TestSheetTrigger className="custom-trigger-class">
            Open Sheet
          </TestSheetTrigger>

          <TestSheetContent>Content</TestSheetContent>
        </TestSheet>
      );

      expect(screen.getByTestId("sheet-trigger")).toHaveClass(
        "custom-trigger-class"
      );
    });

    it("should work with asChild prop", () => {
      render(
        <TestSheet>
          <TestSheetTrigger asChild>
            <button>Custom Button</button>
          </TestSheetTrigger>

          <TestSheetContent>Content</TestSheetContent>
        </TestSheet>
      );

      const trigger = screen.getByTestId("sheet-trigger");

      expect(trigger).toHaveTextContent("Custom Button");
      expect(trigger).toHaveAttribute("data-slot", "sheet-trigger");
    });
  });

  describe("SheetClose", () => {
    it("should render close button with correct attributes", () => {
      render(
        <TestSheet open={true}>
          <TestSheetTrigger>Open Sheet</TestSheetTrigger>

          <TestSheetContent>
            <TestSheetClose>Close</TestSheetClose>
          </TestSheetContent>
        </TestSheet>
      );

      const closeButton = screen.getAllByTestId("sheet-close")[0];

      expect(closeButton).toBeInTheDocument();
      expect(closeButton).toHaveAttribute("data-slot", "sheet-close");
    });

    it("should close sheet when clicked", async () => {
      render(
        <TestSheet defaultOpen={true}>
          <TestSheetTrigger>Open Sheet</TestSheetTrigger>

          <TestSheetContent>
            <TestSheetClose>Close</TestSheetClose>
          </TestSheetContent>
        </TestSheet>
      );

      const closeButton = screen.getAllByTestId("sheet-close")[0];
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByTestId("sheet-content")).not.toBeInTheDocument();
      });
    });

    it("should apply custom className", () => {
      render(
        <TestSheet open={true}>
          <TestSheetTrigger>Open Sheet</TestSheetTrigger>

          <TestSheetContent>
            <TestSheetClose className="custom-close-class">
              Close
            </TestSheetClose>
          </TestSheetContent>
        </TestSheet>
      );

      const closeButton = screen.getAllByTestId("sheet-close")[0];
      expect(closeButton).toHaveClass("custom-close-class");
    });

    it("should work with asChild prop", () => {
      render(
        <TestSheet open={true}>
          <TestSheetTrigger>Open Sheet</TestSheetTrigger>

          <TestSheetContent>
            <TestSheetClose asChild>
              <button>Custom Close</button>
            </TestSheetClose>
          </TestSheetContent>
        </TestSheet>
      );

      const closeButton = screen.getAllByTestId("sheet-close")[0];
      expect(closeButton).toHaveTextContent("Custom Close");
    });
  });

  describe("SheetPortal", () => {
    it("should render portal with correct attributes", () => {
      render(
        <TestSheet open={true}>
          <TestSheetTrigger>Open Sheet</TestSheetTrigger>

          <TestSheetContent>Content</TestSheetContent>
        </TestSheet>
      );

      expect(screen.getByTestId("sheet-portal")).toBeInTheDocument();
      expect(screen.getByTestId("sheet-portal")).toHaveAttribute(
        "data-slot",
        "sheet-portal"
      );
    });

    it("should handle custom container", () => {
      const customContainer = document.createElement("div");
      render(
        <TestSheetPortal container={customContainer}>
          <div>Portal Content</div>
        </TestSheetPortal>
      );

      expect(screen.getByTestId("sheet-portal")).toHaveAttribute(
        "data-container",
        "custom"
      );
    });
  });

  describe("SheetOverlay", () => {
    it("should render overlay with correct attributes", () => {
      render(
        <TestSheet open={true}>
          <TestSheetTrigger>Open Sheet</TestSheetTrigger>

          <TestSheetContent>Content</TestSheetContent>
        </TestSheet>
      );

      expect(screen.getByTestId("sheet-overlay")).toBeInTheDocument();
      expect(screen.getByTestId("sheet-overlay")).toHaveAttribute(
        "data-slot",
        "sheet-overlay"
      );
    });

    it("should apply default CSS classes", () => {
      render(
        <TestSheet open={true}>
          <TestSheetTrigger>Open Sheet</TestSheetTrigger>

          <TestSheetContent>Content</TestSheetContent>
        </TestSheet>
      );

      expect(screen.getByTestId("sheet-overlay")).toHaveClass(
        "fixed",
        "inset-0",
        "z-50",
        "bg-black/50"
      );
    });

    it("should apply custom className", () => {
      render(<TestSheetOverlay className="custom-overlay-class" />);

      expect(screen.getByTestId("sheet-overlay")).toHaveClass(
        "custom-overlay-class"
      );
    });
  });

  describe("SheetContent", () => {
    it("should not render when closed", () => {
      render(
        <TestSheet>
          <TestSheetTrigger>Open Sheet</TestSheetTrigger>

          <TestSheetContent>Content</TestSheetContent>
        </TestSheet>
      );

      expect(screen.queryByTestId("sheet-content")).not.toBeInTheDocument();
    });

    it("should render when open", () => {
      render(
        <TestSheet open={true}>
          <TestSheetTrigger>Open Sheet</TestSheetTrigger>

          <TestSheetContent>Content</TestSheetContent>
        </TestSheet>
      );

      expect(screen.getByTestId("sheet-content")).toBeInTheDocument();
    });

    it("should have correct default side", () => {
      render(
        <TestSheet open={true}>
          <TestSheetTrigger>Open Sheet</TestSheetTrigger>

          <TestSheetContent>Content</TestSheetContent>
        </TestSheet>
      );

      expect(screen.getByTestId("sheet-content")).toHaveAttribute(
        "data-side",
        "right"
      );
    });

    it("should accept different sides", () => {
      const sides: Array<"top" | "right" | "bottom" | "left"> = [
        "top",
        "right",
        "bottom",
        "left",
      ];

      sides.forEach((side) => {
        const { unmount } = render(
          <TestSheet open={true}>
            <TestSheetTrigger>Open Sheet</TestSheetTrigger>

            <TestSheetContent side={side}>Content</TestSheetContent>
          </TestSheet>
        );

        expect(screen.getByTestId("sheet-content")).toHaveAttribute(
          "data-side",
          side
        );
        unmount();
      });
    });

    it("should render overlay and portal", () => {
      render(
        <TestSheet open={true}>
          <TestSheetTrigger>Open Sheet</TestSheetTrigger>

          <TestSheetContent>Content</TestSheetContent>
        </TestSheet>
      );

      expect(screen.getByTestId("sheet-portal")).toBeInTheDocument();
      expect(screen.getByTestId("sheet-overlay")).toBeInTheDocument();
    });

    it("should render built-in close button", () => {
      render(
        <TestSheet open={true}>
          <TestSheetTrigger>Open Sheet</TestSheetTrigger>

          <TestSheetContent>Content</TestSheetContent>
        </TestSheet>
      );

      const closeButtons = screen.getAllByTestId("sheet-close");
      expect(closeButtons).toHaveLength(1);
      expect(screen.getByTestId("x-icon")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      render(
        <TestSheet open={true}>
          <TestSheetTrigger>Open Sheet</TestSheetTrigger>

          <TestSheetContent className="custom-content-class">
            Content
          </TestSheetContent>
        </TestSheet>
      );

      expect(screen.getByTestId("sheet-content")).toHaveClass(
        "custom-content-class"
      );
    });
  });

  describe("SheetHeader", () => {
    it("should render header with correct structure", () => {
      render(
        <TestSheet open={true}>
          <TestSheetTrigger>Open Sheet</TestSheetTrigger>

          <TestSheetContent>
            <TestSheetHeader>
              <TestSheetTitle>Title</TestSheetTitle>

              <TestSheetDescription>Description</TestSheetDescription>
            </TestSheetHeader>
          </TestSheetContent>
        </TestSheet>
      );

      const header = screen.getByTestId("sheet-header");
      expect(header).toBeInTheDocument();
      expect(header).toHaveAttribute("data-slot", "sheet-header");
    });

    it("should apply default CSS classes", () => {
      render(
        <TestSheetHeader>
          <TestSheetTitle>Title</TestSheetTitle>
        </TestSheetHeader>
      );

      expect(screen.getByTestId("sheet-header")).toHaveClass(
        "flex",
        "flex-col",
        "gap-1.5",
        "p-4"
      );
    });

    it("should apply custom className", () => {
      render(
        <TestSheetHeader className="custom-header-class">
          <TestSheetTitle>Title</TestSheetTitle>
        </TestSheetHeader>
      );

      expect(screen.getByTestId("sheet-header")).toHaveClass(
        "custom-header-class"
      );
    });
  });

  describe("SheetFooter", () => {
    it("should render footer with correct structure", () => {
      render(
        <TestSheet open={true}>
          <TestSheetTrigger>Open Sheet</TestSheetTrigger>

          <TestSheetContent>
            <TestSheetFooter>
              <button>Cancel</button>

              <button>Save</button>
            </TestSheetFooter>
          </TestSheetContent>
        </TestSheet>
      );

      const footer = screen.getByTestId("sheet-footer");

      expect(footer).toBeInTheDocument();
      expect(footer).toHaveAttribute("data-slot", "sheet-footer");
    });

    it("should apply default CSS classes", () => {
      render(
        <TestSheetFooter>
          <button>Action</button>
        </TestSheetFooter>
      );

      expect(screen.getByTestId("sheet-footer")).toHaveClass(
        "mt-auto",
        "flex",
        "flex-col",
        "gap-2",
        "p-4"
      );
    });

    it("should apply custom className", () => {
      render(
        <TestSheetFooter className="custom-footer-class">
          <button>Action</button>
        </TestSheetFooter>
      );

      expect(screen.getByTestId("sheet-footer")).toHaveClass(
        "custom-footer-class"
      );
    });
  });

  describe("SheetTitle", () => {
    it("should render title with correct structure", () => {
      render(<TestSheetTitle>Sheet Title</TestSheetTitle>);

      const title = screen.getByTestId("sheet-title");

      expect(title).toBeInTheDocument();
      expect(title).toHaveAttribute("data-slot", "sheet-title");
      expect(title).toHaveTextContent("Sheet Title");
      expect(title.tagName).toBe("H2");
    });

    it("should apply default CSS classes", () => {
      render(<TestSheetTitle>Sheet Title</TestSheetTitle>);

      expect(screen.getByTestId("sheet-title")).toHaveClass(
        "text-foreground",
        "font-semibold"
      );
    });

    it("should apply custom className", () => {
      render(
        <TestSheetTitle className="custom-title-class">
          Sheet Title
        </TestSheetTitle>
      );

      expect(screen.getByTestId("sheet-title")).toHaveClass(
        "custom-title-class"
      );
    });
  });

  describe("SheetDescription", () => {
    it("should render description with correct structure", () => {
      render(
        <TestSheetDescription>Sheet description text</TestSheetDescription>
      );

      const description = screen.getByTestId("sheet-description");

      expect(description).toBeInTheDocument();
      expect(description).toHaveAttribute("data-slot", "sheet-description");
      expect(description).toHaveTextContent("Sheet description text");
      expect(description.tagName).toBe("P");
    });

    it("should apply default CSS classes", () => {
      render(<TestSheetDescription>Description</TestSheetDescription>);

      expect(screen.getByTestId("sheet-description")).toHaveClass(
        "text-muted-foreground",
        "text-sm"
      );
    });

    it("should apply custom className", () => {
      render(
        <TestSheetDescription className="custom-description-class">
          Description
        </TestSheetDescription>
      );

      expect(screen.getByTestId("sheet-description")).toHaveClass(
        "custom-description-class"
      );
    });
  });

  describe("Complex Integration", () => {
    it("should work with all components together", async () => {
      render(
        <TestSheet onOpenChange={mockOnOpenChange}>
          <TestSheetTrigger>Open Settings</TestSheetTrigger>

          <TestSheetContent side="left">
            <TestSheetHeader>
              <TestSheetTitle>Settings</TestSheetTitle>

              <TestSheetDescription>
                Manage your account settings and preferences.
              </TestSheetDescription>
            </TestSheetHeader>

            <div className="py-4">
              <p>Settings content goes here</p>
            </div>

            <TestSheetFooter>
              <TestSheetClose>Cancel</TestSheetClose>

              <button>Save changes</button>
            </TestSheetFooter>
          </TestSheetContent>
        </TestSheet>
      );

      expect(screen.queryByTestId("sheet-content")).not.toBeInTheDocument();

      fireEvent.click(screen.getByTestId("sheet-trigger"));

      await waitFor(() => {
        expect(screen.getByTestId("sheet-content")).toBeInTheDocument();
        expect(mockOnOpenChange).toHaveBeenCalledWith(true);
      });

      expect(screen.getByText("Settings")).toBeInTheDocument();
      expect(
        screen.getByText("Manage your account settings and preferences.")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Settings content goes here")
      ).toBeInTheDocument();
      expect(screen.getByText("Cancel")).toBeInTheDocument();
      expect(screen.getByText("Save changes")).toBeInTheDocument();

      fireEvent.click(screen.getByText("Cancel"));

      await waitFor(() => {
        expect(screen.queryByTestId("sheet-content")).not.toBeInTheDocument();
        expect(mockOnOpenChange).toHaveBeenCalledWith(false);
      });
    });

    it("should handle controlled state", () => {
      const ControlledSheet = () => {
        const [open, setOpen] = React.useState(false);

        return (
          <div>
            <button
              data-testid="external-control"
              onClick={() => setOpen(!open)}
            >
              Toggle
            </button>

            <TestSheet open={open} onOpenChange={setOpen}>
              <TestSheetTrigger>Open Sheet</TestSheetTrigger>

              <TestSheetContent>
                <TestSheetHeader>
                  <TestSheetTitle>Controlled Sheet</TestSheetTitle>
                </TestSheetHeader>
              </TestSheetContent>
            </TestSheet>
          </div>
        );
      };

      render(<ControlledSheet />);

      expect(screen.queryByTestId("sheet-content")).not.toBeInTheDocument();

      fireEvent.click(screen.getByTestId("external-control"));
      expect(screen.getByTestId("sheet-content")).toBeInTheDocument();

      fireEvent.click(screen.getByTestId("external-control"));
      expect(screen.queryByTestId("sheet-content")).not.toBeInTheDocument();
    });

    it("should handle different sides", () => {
      const sides: Array<"top" | "right" | "bottom" | "left"> = [
        "top",
        "right",
        "bottom",
        "left",
      ];

      sides.forEach((side) => {
        const { unmount } = render(
          <TestSheet open={true}>
            <TestSheetTrigger>Open Sheet</TestSheetTrigger>

            <TestSheetContent side={side}>
              <TestSheetHeader>
                <TestSheetTitle>{side} Sheet</TestSheetTitle>
              </TestSheetHeader>
            </TestSheetContent>
          </TestSheet>
        );

        expect(screen.getByTestId("sheet-content")).toHaveAttribute(
          "data-side",
          side
        );
        expect(screen.getByText(`${side} Sheet`)).toBeInTheDocument();
        unmount();
      });
    });

    it("should close with built-in X button", async () => {
      render(
        <TestSheet defaultOpen={true} onOpenChange={mockOnOpenChange}>
          <TestSheetTrigger>Open Sheet</TestSheetTrigger>

          <TestSheetContent>
            <TestSheetHeader>
              <TestSheetTitle>Sheet Title</TestSheetTitle>
            </TestSheetHeader>
          </TestSheetContent>
        </TestSheet>
      );

      expect(screen.getByTestId("sheet-content")).toBeInTheDocument();

      const closeButtons = screen.getAllByTestId("sheet-close");
      fireEvent.click(closeButtons[0]);

      await waitFor(() => {
        expect(screen.queryByTestId("sheet-content")).not.toBeInTheDocument();
        expect(mockOnOpenChange).toHaveBeenCalledWith(false);
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle multiple triggers", () => {
      render(
        <TestSheet>
          <TestSheetTrigger>Trigger 1</TestSheetTrigger>

          <TestSheetTrigger>Trigger 2</TestSheetTrigger>

          <TestSheetContent>Content</TestSheetContent>
        </TestSheet>
      );

      const triggers = screen.getAllByTestId("sheet-trigger");

      expect(triggers).toHaveLength(2);
      expect(triggers[0]).toHaveTextContent("Trigger 1");
      expect(triggers[1]).toHaveTextContent("Trigger 2");
    });

    it("should handle empty content", () => {
      render(
        <TestSheet open={true}>
          <TestSheetTrigger>Open Sheet</TestSheetTrigger>
          <TestSheetContent></TestSheetContent>
        </TestSheet>
      );

      expect(screen.getByTestId("sheet-content")).toBeInTheDocument();
    });

    it("should handle nested components", () => {
      render(
        <TestSheet open={true}>
          <TestSheetTrigger>Open Sheet</TestSheetTrigger>

          <TestSheetContent>
            <TestSheetHeader>
              <div>
                <TestSheetTitle>Nested Title</TestSheetTitle>

                <TestSheetDescription>Nested Description</TestSheetDescription>
              </div>
            </TestSheetHeader>
          </TestSheetContent>
        </TestSheet>
      );

      expect(screen.getByText("Nested Title")).toBeInTheDocument();
      expect(screen.getByText("Nested Description")).toBeInTheDocument();
    });

    it("should handle rapid open/close operations", async () => {
      render(
        <TestSheet onOpenChange={mockOnOpenChange}>
          <TestSheetTrigger>Open Sheet</TestSheetTrigger>

          <TestSheetContent>
            <TestSheetClose>Close</TestSheetClose>
          </TestSheetContent>
        </TestSheet>
      );

      const trigger = screen.getByTestId("sheet-trigger");

      fireEvent.click(trigger);
      fireEvent.click(trigger);
      fireEvent.click(trigger);

      await waitFor(() => {
        expect(mockOnOpenChange).toHaveBeenCalled();
      });
    });
  });
});
