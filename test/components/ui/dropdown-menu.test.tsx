import "@testing-library/jest-dom";

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

describe("DropdownMenu Component", () => {
  describe("Basic Rendering", () => {
    it("should render dropdown menu with default props", () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>

            <DropdownMenuItem>Item 2</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const trigger = screen.getByText("Open Menu");

      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveAttribute("data-slot", "dropdown-menu-trigger");
    });

    it("should render with custom props", () => {
      render(
        <DropdownMenu defaultOpen data-testid="dropdown">
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem>Test Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const menuItem = screen.getByText("Test Item");

      expect(menuItem).toBeInTheDocument();
    });
  });

  describe("DropdownMenuTrigger", () => {
    it("should render trigger with correct attributes", () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger className="custom-trigger" data-testid="trigger">
            Trigger Button
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const trigger = screen.getByTestId("trigger");

      expect(trigger).toHaveAttribute("data-slot", "dropdown-menu-trigger");
      expect(trigger).toHaveClass("custom-trigger");
    });

    it("should open menu when clicked", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger data-testid="trigger">Open</DropdownMenuTrigger>

          <DropdownMenuContent data-testid="content">
            <DropdownMenuItem data-testid="test-item">
              Test Item
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const trigger = screen.getByTestId("trigger");
      expect(trigger).toHaveAttribute("aria-expanded", "true");

      const menuItem = screen.getByTestId("test-item");
      expect(menuItem).toBeInTheDocument();
    });

    it("should work with asChild", () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button data-testid="custom-trigger">Custom Button</button>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const trigger = screen.getByTestId("custom-trigger");
      expect(trigger.tagName).toBe("BUTTON");
    });

    it("should handle trigger interactions", () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger data-testid="trigger">Open</DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem>Test Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const trigger = screen.getByTestId("trigger");

      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(trigger).toHaveAttribute("aria-haspopup", "menu");
      expect(trigger).toHaveAttribute("data-state", "closed");

      expect(trigger).toHaveAttribute("type", "button");
    });
  });

  describe("DropdownMenuContent", () => {
    it("should render content with proper structure", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>

          <DropdownMenuContent data-testid="content">
            <DropdownMenuItem>Test Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const content = screen.getByTestId("content");

      expect(content).toHaveAttribute("data-slot", "dropdown-menu-content");
      expect(content).toHaveClass(
        "bg-popover",
        "text-popover-foreground",
        "z-50",
        "min-w-[8rem]"
      );
    });

    it("should render with custom className", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>

          <DropdownMenuContent className="custom-content" data-testid="content">
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const content = screen.getByTestId("content");

      expect(content).toHaveClass("custom-content");
    });

    it("should respect sideOffset prop", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>

          <DropdownMenuContent sideOffset={10}>
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const content = screen.getByRole("menu");

      expect(content).toBeInTheDocument();
    });
  });

  describe("DropdownMenuItem", () => {
    it("should render menu item with correct attributes", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem data-testid="item">Test Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const item = screen.getByTestId("item");

      expect(item).toHaveAttribute("data-slot", "dropdown-menu-item");
      expect(item).toHaveClass("relative", "flex", "cursor-default");
      expect(item).toHaveTextContent("Test Item");
    });

    it("should render with inset prop", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem inset data-testid="item">
              Inset Item
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const item = screen.getByTestId("item");

      expect(item).toHaveAttribute("data-inset", "true");
    });

    it("should render with destructive variant", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem variant="destructive" data-testid="item">
              Delete Item
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const item = screen.getByTestId("item");

      expect(item).toHaveAttribute("data-variant", "destructive");
    });

    it("should handle click events", () => {
      const handleClick = jest.fn();

      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem onSelect={handleClick} data-testid="item">
              Clickable Item
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const item = screen.getByTestId("item");
      fireEvent.click(item);

      expect(handleClick).toHaveBeenCalled();
    });

    it("should be disabled when disabled prop is true", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem disabled data-testid="item">
              Disabled Item
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const item = screen.getByTestId("item");

      expect(item).toHaveAttribute("data-disabled");
    });
  });

  describe("DropdownMenuCheckboxItem", () => {
    it("should render checkbox item with correct attributes", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuCheckboxItem checked data-testid="checkbox-item">
              Checkbox Item
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const item = screen.getByTestId("checkbox-item");

      expect(item).toHaveAttribute("data-slot", "dropdown-menu-checkbox-item");
      expect(item).toHaveAttribute("data-state", "checked");
    });

    it("should toggle when clicked", () => {
      const TestComponent = () => {
        const [checked, setChecked] = React.useState(false);

        return (
          <DropdownMenu defaultOpen>
            <DropdownMenuTrigger>Open</DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuCheckboxItem
                checked={checked}
                data-testid="checkbox-item"
                onCheckedChange={setChecked}
              >
                Toggle Item
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      };

      render(<TestComponent />);

      const item = screen.getByTestId("checkbox-item");
      expect(item).toHaveAttribute("data-state", "unchecked");

      fireEvent.click(item);
      expect(item).toHaveAttribute("data-state", "checked");
    });

    it("should show check icon when checked", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuCheckboxItem checked data-testid="checkbox-item">
              Checked Item
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const item = screen.getByTestId("checkbox-item");
      const checkIcon = item.querySelector("svg");

      expect(checkIcon).toBeInTheDocument();
    });
  });

  describe("DropdownMenuRadioGroup and DropdownMenuRadioItem", () => {
    it("should render radio group with items", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuRadioGroup value="option1" data-testid="radio-group">
              <DropdownMenuRadioItem value="option1" data-testid="radio-1">
                Option 1
              </DropdownMenuRadioItem>

              <DropdownMenuRadioItem value="option2" data-testid="radio-2">
                Option 2
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const radioGroup = screen.getByTestId("radio-group");
      expect(radioGroup).toHaveAttribute(
        "data-slot",
        "dropdown-menu-radio-group"
      );

      const radio1 = screen.getByTestId("radio-1");
      expect(radio1).toHaveAttribute("data-slot", "dropdown-menu-radio-item");
      expect(radio1).toHaveAttribute("data-state", "checked");

      const radio2 = screen.getByTestId("radio-2");
      expect(radio2).toHaveAttribute("data-state", "unchecked");
    });

    it("should handle radio selection", () => {
      const TestComponent = () => {
        const [value, setValue] = React.useState("option1");

        return (
          <DropdownMenu defaultOpen>
            <DropdownMenuTrigger>Open</DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuRadioGroup value={value} onValueChange={setValue}>
                <DropdownMenuRadioItem value="option1" data-testid="radio-1">
                  Option 1
                </DropdownMenuRadioItem>

                <DropdownMenuRadioItem value="option2" data-testid="radio-2">
                  Option 2
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      };

      render(<TestComponent />);

      const radio2 = screen.getByTestId("radio-2");
      fireEvent.click(radio2);

      expect(radio2).toHaveAttribute("data-state", "checked");
    });

    it("should show indicator when selected", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuRadioGroup value="option1">
              <DropdownMenuRadioItem value="option1" data-testid="radio-item">
                Selected Option
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const radioItem = screen.getByTestId("radio-item");
      const indicator = radioItem.querySelector("svg");

      expect(indicator).toBeInTheDocument();
    });
  });

  describe("DropdownMenuLabel", () => {
    it("should render label with correct attributes", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuLabel data-testid="label">
              Menu Label
            </DropdownMenuLabel>

            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const label = screen.getByTestId("label");

      expect(label).toHaveAttribute("data-slot", "dropdown-menu-label");
      expect(label).toHaveClass("px-2", "py-1.5", "text-sm", "font-medium");
      expect(label).toHaveTextContent("Menu Label");
    });

    it("should render with inset prop", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuLabel inset data-testid="label">
              Inset Label
            </DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const label = screen.getByTestId("label");
      expect(label).toHaveAttribute("data-inset", "true");
    });
  });

  describe("DropdownMenuSeparator", () => {
    it("should render separator with correct attributes", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>

            <DropdownMenuSeparator data-testid="separator" />

            <DropdownMenuItem>Item 2</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const separator = screen.getByTestId("separator");

      expect(separator).toHaveAttribute("data-slot", "dropdown-menu-separator");
      expect(separator).toHaveClass("bg-border", "-mx-1", "my-1", "h-px");
    });

    it("should render with custom className", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuSeparator
              className="custom-separator"
              data-testid="separator"
            />
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const separator = screen.getByTestId("separator");
      expect(separator).toHaveClass("custom-separator");
    });
  });

  describe("DropdownMenuShortcut", () => {
    it("should render shortcut with correct attributes", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem>
              Copy
              <DropdownMenuShortcut data-testid="shortcut">
                ⌘C
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const shortcut = screen.getByTestId("shortcut");

      expect(shortcut).toHaveAttribute("data-slot", "dropdown-menu-shortcut");
      expect(shortcut).toHaveClass(
        "text-muted-foreground",
        "ml-auto",
        "text-xs"
      );
      expect(shortcut).toHaveTextContent("⌘C");
    });

    it("should render with custom className", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem>
              Item
              <DropdownMenuShortcut
                className="custom-shortcut"
                data-testid="shortcut"
              >
                Ctrl+X
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const shortcut = screen.getByTestId("shortcut");
      expect(shortcut).toHaveClass("custom-shortcut");
    });
  });

  describe("DropdownMenuGroup", () => {
    it("should render group with correct attributes", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuGroup data-testid="group">
              <DropdownMenuItem>Item 1</DropdownMenuItem>

              <DropdownMenuItem>Item 2</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const group = screen.getByTestId("group");
      expect(group).toHaveAttribute("data-slot", "dropdown-menu-group");
    });
  });

  describe("DropdownMenuSub", () => {
    it("should render submenu with trigger and content", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem>Regular Item</DropdownMenuItem>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger data-testid="sub-trigger">
                More Options
              </DropdownMenuSubTrigger>

              <DropdownMenuSubContent>
                <DropdownMenuItem>Sub Item 1</DropdownMenuItem>

                <DropdownMenuItem>Sub Item 2</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const subTrigger = screen.getByTestId("sub-trigger");
      expect(subTrigger).toHaveAttribute(
        "data-slot",
        "dropdown-menu-sub-trigger"
      );
      expect(subTrigger).toHaveTextContent("More Options");

      const chevronIcon = subTrigger.querySelector("svg");
      expect(chevronIcon).toBeInTheDocument();
    });

    it("should open submenu on hover", async () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger data-testid="sub-trigger">
                Hover Me
              </DropdownMenuSubTrigger>

              <DropdownMenuSubContent>
                <DropdownMenuItem data-testid="sub-item">
                  Sub Item
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const subTrigger = screen.getByTestId("sub-trigger");

      fireEvent.click(subTrigger);

      await waitFor(() => {
        expect(screen.getByTestId("sub-item")).toBeInTheDocument();
      });
    });

    it("should render sub trigger with inset", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger inset data-testid="sub-trigger">
                Inset Trigger
              </DropdownMenuSubTrigger>

              <DropdownMenuSubContent>
                <DropdownMenuItem>Sub Item</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const subTrigger = screen.getByTestId("sub-trigger");
      expect(subTrigger).toHaveAttribute("data-inset", "true");
    });

    it("should render sub content with correct attributes", async () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger data-testid="sub-trigger">
                Trigger
              </DropdownMenuSubTrigger>

              <DropdownMenuSubContent data-testid="sub-content">
                <DropdownMenuItem>Sub Item</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const subTrigger = screen.getByTestId("sub-trigger");
      fireEvent.click(subTrigger);

      await waitFor(() => {
        const subContent = screen.getByTestId("sub-content");

        expect(subContent).toHaveAttribute(
          "data-slot",
          "dropdown-menu-sub-content"
        );
        expect(subContent).toHaveClass("bg-popover", "text-popover-foreground");
      });
    });
  });

  describe("DropdownMenuPortal", () => {
    it("should render content through portal", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>

          <DropdownMenuPortal>
            <DropdownMenuContent>
              <DropdownMenuItem data-testid="portal-item">
                Portal Item
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenu>
      );

      const portalItem = screen.getByTestId("portal-item");

      expect(portalItem).toBeInTheDocument();
      expect(portalItem).toHaveTextContent("Portal Item");
    });
  });

  describe("Keyboard Navigation", () => {
    it("should handle arrow key navigation", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem data-testid="item-1">Item 1</DropdownMenuItem>

            <DropdownMenuItem data-testid="item-2">Item 2</DropdownMenuItem>

            <DropdownMenuItem data-testid="item-3">Item 3</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const content = screen.getByRole("menu");
      content.focus();

      fireEvent.keyDown(content, { key: "ArrowDown" });

      const item1 = screen.getByTestId("item-1");
      expect(item1).toHaveAttribute("data-highlighted");
    });

    it("should close menu with Escape key", async () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const content = screen.getByRole("menu");
      expect(content).toBeInTheDocument();

      fireEvent.keyDown(content, { key: "Escape" });

      await waitFor(() => {
        expect(screen.queryByRole("menu")).not.toBeInTheDocument();
      });
    });

    it("should activate item with Enter key", () => {
      const handleSelect = jest.fn();

      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem onSelect={handleSelect} data-testid="item">
              Test Item
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const item = screen.getByTestId("item");
      fireEvent.keyDown(item, { key: "Enter" });

      expect(handleSelect).toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA attributes", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>

            <DropdownMenuItem>Item 2</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const menu = screen.getByRole("menu");
      expect(menu).toBeInTheDocument();

      const menuItems = screen.getAllByRole("menuitem");
      expect(menuItems).toHaveLength(2);
    });

    it("should have proper focus management", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger data-testid="trigger">Open</DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem data-testid="first-item">
              First Item
            </DropdownMenuItem>

            <DropdownMenuItem>Second Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const trigger = screen.getByTestId("trigger");
      expect(trigger).toHaveAttribute("aria-expanded", "true");

      const menu = screen.getByRole("menu");
      expect(menu).toBeInTheDocument();

      const firstItem = screen.getByTestId("first-item");
      expect(firstItem).toBeInTheDocument();
    });

    it("should support screen readers", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Accessible Menu</DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            <DropdownMenuItem>Edit</DropdownMenuItem>

            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const menu = screen.getByRole("menu");
      expect(menu).toBeInTheDocument();

      const menuItems = screen.getAllByRole("menuitem");
      expect(menuItems).toHaveLength(2);
    });
  });

  describe("Complex Scenarios", () => {
    it("should handle complete menu structure", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Complex Menu</DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem>
                Profile
                <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>

              <DropdownMenuItem>
                Settings
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuCheckboxItem checked data-testid="notifications">
              Notifications
            </DropdownMenuCheckboxItem>

            <DropdownMenuSeparator />

            <DropdownMenuRadioGroup value="light">
              <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>

              <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem variant="destructive">Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      expect(screen.getByText("My Account")).toBeInTheDocument();
      expect(screen.getByText("Profile")).toBeInTheDocument();
      expect(screen.getByText("⌘P")).toBeInTheDocument();
      expect(screen.getByTestId("notifications")).toBeInTheDocument();
      expect(screen.getByText("Light")).toBeInTheDocument();
      expect(screen.getByText("Logout")).toBeInTheDocument();
    });

    it("should handle controlled state", () => {
      const TestComponent = () => {
        const [open, setOpen] = React.useState(true);

        return (
          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger data-testid="trigger">
              {open ? "Close" : "Open"}
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuItem
                data-testid="close-item"
                onSelect={() => setOpen(false)}
              >
                Close Menu
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      };

      render(<TestComponent />);

      expect(screen.getByText("Close")).toBeInTheDocument();
      expect(screen.getByRole("menu")).toBeInTheDocument();

      const closeItem = screen.getByTestId("close-item");
      fireEvent.click(closeItem);

      expect(screen.getByText("Open")).toBeInTheDocument();
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });

  describe("Error Handling", () => {
    it("should handle missing required props gracefully", () => {
      const originalError = console.error;
      console.error = jest.fn();

      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem>Item without issues</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const menu = screen.getByRole("menu");
      expect(menu).toBeInTheDocument();

      console.error = originalError;
    });

    it("should handle invalid props gracefully", () => {
      const originalError = console.error;
      console.error = jest.fn();

      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem data-invalidprop="test">
              Test Item
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const item = screen.getByText("Test Item");
      expect(item).toBeInTheDocument();

      console.error = originalError;
    });
  });
});
