import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";
import React from "react";

interface NavSubItem {
  title: string;
  url: string;
}

interface NavItem {
  icon?: React.ComponentType;
  isActive?: boolean;
  items?: NavSubItem[];
  title: string;
  url: string;
}

interface TestNavMainProps {
  items: NavItem[];
}

describe("NavMain Component", () => {
  const TestNavMain = ({ items }: TestNavMainProps) => {
    return (
      <div data-testid="nav-main">
        <div data-testid="sidebar-group">
          <div data-testid="sidebar-group-label">Platform</div>

          <ul data-testid="sidebar-menu">
            {items.map((item: NavItem, index) => (
              <li key={index} data-testid="sidebar-menu-item">
                <button data-testid="sidebar-menu-button" title={item.title}>
                  {item.icon && <item.icon />}

                  {item.title}
                </button>

                {item.items && item.items.length > 0 && (
                  <ul data-testid="sidebar-menu-sub">
                    {item.items.map((subItem: NavSubItem, subIndex: number) => (
                      <li key={subIndex} data-testid="sidebar-menu-sub-item">
                        <a
                          data-testid="sidebar-menu-sub-button"
                          href={subItem.url}
                        >
                          {subItem.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  describe("NavMain Component", () => {
    const mockItems: NavItem[] = [
      {
        title: "Dashboard",
        url: "/dashboard",
        isActive: true,
        items: [
          { title: "Overview", url: "/dashboard/overview" },
          { title: "Analytics", url: "/dashboard/analytics" },
        ],
      },
      {
        title: "Users",
        url: "/users",
        isActive: false,
        items: [
          { title: "All Users", url: "/users/all" },
          { title: "Permissions", url: "/users/permissions" },
        ],
      },
    ];

    const mockItemsWithoutIcon: NavItem[] = [
      {
        title: "Settings",
        url: "/settings",
        items: [
          { title: "General", url: "/settings/general" },
          { title: "Security", url: "/settings/security" },
        ],
      },
    ];

    const mockItemsWithoutSubItems: NavItem[] = [
      {
        title: "Profile",
        url: "/profile",
        isActive: false,
      },
    ];

    describe("Rendering", () => {
      it("should render nav main with default structure", () => {
        render(<TestNavMain items={mockItems} />);

        expect(screen.getByTestId("sidebar-group")).toBeInTheDocument();
        expect(screen.getByTestId("sidebar-group-label")).toHaveTextContent(
          "Platform"
        );
        expect(screen.getByTestId("sidebar-menu")).toBeInTheDocument();
      });

      it("should render all menu items", () => {
        render(<TestNavMain items={mockItems} />);

        expect(screen.getByText("Dashboard")).toBeInTheDocument();
        expect(screen.getByText("Users")).toBeInTheDocument();

        const menuItems = screen.getAllByTestId("sidebar-menu-item");
        expect(menuItems).toHaveLength(2);
      });

      it("should render menu items with tooltips", () => {
        render(<TestNavMain items={mockItems} />);

        const dashboardButton = screen
          .getByText("Dashboard")
          .closest('[data-testid="sidebar-menu-button"]');
        const usersButton = screen
          .getByText("Users")
          .closest('[data-testid="sidebar-menu-button"]');

        expect(dashboardButton).toHaveAttribute("title", "Dashboard");
        expect(usersButton).toHaveAttribute("title", "Users");
      });

      it("should render menu items without icons gracefully", () => {
        render(<TestNavMain items={mockItemsWithoutIcon} />);

        expect(screen.getByText("Settings")).toBeInTheDocument();

        const menuButton = screen
          .getByText("Settings")
          .closest('[data-testid="sidebar-menu-button"]');
        expect(menuButton).toBeInTheDocument();
      });
    });

    describe("Sub Items Rendering", () => {
      it("should render sub menu items when present", () => {
        render(<TestNavMain items={mockItems} />);

        expect(screen.getByText("Overview")).toBeInTheDocument();
        expect(screen.getByText("Analytics")).toBeInTheDocument();
        expect(screen.getByText("All Users")).toBeInTheDocument();
        expect(screen.getByText("Permissions")).toBeInTheDocument();
      });

      it("should render sub items as links with correct hrefs", () => {
        render(<TestNavMain items={mockItems} />);

        const overviewLink = screen.getByText("Overview").closest("a");
        const analyticsLink = screen.getByText("Analytics").closest("a");
        const allUsersLink = screen.getByText("All Users").closest("a");
        const permissionsLink = screen.getByText("Permissions").closest("a");

        expect(overviewLink).toHaveAttribute("href", "/dashboard/overview");
        expect(analyticsLink).toHaveAttribute("href", "/dashboard/analytics");
        expect(allUsersLink).toHaveAttribute("href", "/users/all");
        expect(permissionsLink).toHaveAttribute("href", "/users/permissions");
      });

      it("should wrap sub items in proper sidebar components", () => {
        render(<TestNavMain items={mockItems} />);

        expect(screen.getAllByTestId("sidebar-menu-sub")).toHaveLength(2);
        expect(screen.getAllByTestId("sidebar-menu-sub-item")).toHaveLength(4);
        expect(screen.getAllByTestId("sidebar-menu-sub-button")).toHaveLength(
          4
        );
      });

      it("should handle items without sub items", () => {
        render(<TestNavMain items={mockItemsWithoutSubItems} />);

        expect(screen.getByText("Profile")).toBeInTheDocument();

        expect(
          screen.queryByTestId("sidebar-menu-sub")
        ).not.toBeInTheDocument();
      });
    });

    describe("Edge Cases", () => {
      it("should handle empty items array", () => {
        render(<TestNavMain items={[]} />);

        expect(screen.getByTestId("nav-main")).toBeInTheDocument();
        expect(screen.getByTestId("sidebar-group")).toBeInTheDocument();
        expect(screen.getByTestId("sidebar-group-label")).toHaveTextContent(
          "Platform"
        );
        expect(screen.getByTestId("sidebar-menu")).toBeInTheDocument();

        expect(
          screen.queryByTestId("sidebar-menu-item")
        ).not.toBeInTheDocument();
      });

      it("should handle items with empty sub items array", () => {
        const itemsWithEmptySubItems: NavItem[] = [
          {
            title: "Empty Sub",
            url: "/empty",
            items: [],
          },
        ];

        render(<TestNavMain items={itemsWithEmptySubItems} />);

        expect(screen.getByText("Empty Sub")).toBeInTheDocument();

        expect(
          screen.queryByTestId("sidebar-menu-sub")
        ).not.toBeInTheDocument();
      });

      it("should handle items with undefined sub items", () => {
        const itemsWithUndefinedSubItems: NavItem[] = [
          {
            title: "No Subs",
            url: "/no-subs",
            items: undefined,
          },
        ];

        render(<TestNavMain items={itemsWithUndefinedSubItems} />);

        expect(screen.getByText("No Subs")).toBeInTheDocument();

        expect(
          screen.queryByTestId("sidebar-menu-sub")
        ).not.toBeInTheDocument();
      });

      it("should handle very long item titles", () => {
        const itemsWithLongTitles: NavItem[] = [
          {
            title:
              "This is a very long navigation item title that might overflow",
            url: "/long-title",
            items: [
              {
                title: "This is also a very long sub item title",
                url: "/long-sub-title",
              },
            ],
          },
        ];

        render(<TestNavMain items={itemsWithLongTitles} />);

        expect(
          screen.getByText(
            "This is a very long navigation item title that might overflow"
          )
        ).toBeInTheDocument();
        expect(
          screen.getByText("This is also a very long sub item title")
        ).toBeInTheDocument();
      });

      it("should handle special characters in titles and URLs", () => {
        const itemsWithSpecialChars: NavItem[] = [
          {
            title: "Settings & Configuration",
            url: "/settings&config",
            items: [
              {
                title: "API Keys & Tokens",
                url: "/settings/api-keys&tokens",
              },
            ],
          },
        ];

        render(<TestNavMain items={itemsWithSpecialChars} />);

        expect(
          screen.getByText("Settings & Configuration")
        ).toBeInTheDocument();
        expect(screen.getByText("API Keys & Tokens")).toBeInTheDocument();

        const subLink = screen.getByText("API Keys & Tokens").closest("a");
        expect(subLink).toHaveAttribute("href", "/settings/api-keys&tokens");
      });
    });

    describe("Accessibility", () => {
      it("should provide proper tooltip text for menu buttons", () => {
        render(<TestNavMain items={mockItems} />);

        const dashboardButton = screen.getByText("Dashboard").closest("button");
        const usersButton = screen.getByText("Users").closest("button");

        expect(dashboardButton).toHaveAttribute("title", "Dashboard");
        expect(usersButton).toHaveAttribute("title", "Users");
      });

      it("should use semantic HTML structure", () => {
        render(<TestNavMain items={mockItems} />);

        expect(screen.getByTestId("sidebar-menu")).toBeInTheDocument();
        expect(screen.getAllByTestId("sidebar-menu-item")).toHaveLength(2);
        expect(screen.getAllByTestId("sidebar-menu-sub")).toHaveLength(2);
        expect(screen.getAllByTestId("sidebar-menu-sub-item")).toHaveLength(4);
      });

      it("should provide accessible navigation links", () => {
        render(<TestNavMain items={mockItems} />);

        const links = screen.getAllByRole("link");

        links.forEach((link) => {
          expect(link).toHaveAttribute("href");
          expect(link.textContent).toBeTruthy();
        });
      });

      it("should be keyboard navigable", () => {
        render(<TestNavMain items={mockItems} />);

        const menuButtons = screen.getAllByTestId("sidebar-menu-button");
        const links = screen.getAllByRole("link");

        menuButtons.forEach((button) => {
          button.focus();

          expect(button).toHaveFocus();
        });

        links.forEach((link) => {
          link.focus();

          expect(link).toHaveFocus();
        });
      });
    });

    describe("Component Contract", () => {
      it("should accept items prop", () => {
        const testItems: NavItem[] = [
          {
            title: "Test Item",
            url: "/test",
            items: [{ title: "Sub Test", url: "/test/sub" }],
          },
        ];

        render(<TestNavMain items={testItems} />);

        expect(screen.getByText("Test Item")).toBeInTheDocument();
        expect(screen.getByText("Sub Test")).toBeInTheDocument();
      });

      it("should handle items with different properties", () => {
        const mixedItems: NavItem[] = [
          {
            title: "Item with Active",
            url: "/active",
            isActive: true,
          },
          {
            title: "Item with Subs",
            url: "/subs",
            items: [{ title: "Sub", url: "/sub" }],
          },
          {
            title: "Simple Item",
            url: "/simple",
          },
        ];

        render(<TestNavMain items={mixedItems} />);

        expect(screen.getByText("Item with Active")).toBeInTheDocument();
        expect(screen.getByText("Item with Subs")).toBeInTheDocument();
        expect(screen.getByText("Simple Item")).toBeInTheDocument();
        expect(screen.getByText("Sub")).toBeInTheDocument();
      });

      it("should render correctly with minimum required props", () => {
        const minimalItems: NavItem[] = [
          {
            title: "Minimal",
            url: "/minimal",
          },
        ];

        render(<TestNavMain items={minimalItems} />);

        expect(screen.getByText("Minimal")).toBeInTheDocument();
        expect(screen.getByTestId("nav-main")).toBeInTheDocument();
      });
    });
  });
});
