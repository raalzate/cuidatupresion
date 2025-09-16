import { render, screen } from "@testing-library/react";
import React from "react";

import { AppSidebar } from "../../../../components/shared/sidebar/sidebar";

jest.mock("lucide-react", () => ({
  AudioWaveform: ({
    "data-testid": testId,
    ...props
  }: React.SVGProps<SVGSVGElement> & { "data-testid"?: string }) => (
    <svg data-testid={testId || "audio-waveform-icon"} {...props}>
      <title>AudioWaveform</title>
    </svg>
  ),
  Command: ({
    "data-testid": testId,
    ...props
  }: React.SVGProps<SVGSVGElement> & { "data-testid"?: string }) => (
    <svg data-testid={testId || "command-icon"} {...props}>
      <title>Command</title>
    </svg>
  ),
  GalleryVerticalEnd: ({
    "data-testid": testId,
    ...props
  }: React.SVGProps<SVGSVGElement> & { "data-testid"?: string }) => (
    <svg data-testid={testId || "gallery-vertical-end-icon"} {...props}>
      <title>GalleryVerticalEnd</title>
    </svg>
  ),
}));

jest.mock("../../../../components/ui/nav-main", () => ({
  NavMain: ({
    items,
    ...props
  }: {
    items?: Array<{
      title: string;
      url: string;
      icon?: React.ComponentType;
      isActive?: boolean;
      items: Array<{ title: string; url: string }>;
    }>;
  } & React.HTMLAttributes<HTMLDivElement>) => (
    <div data-testid="mock-nav-main" {...props}>
      {items?.map((item, index) => (
        <div key={index} data-testid={`nav-item-${index}`}>
          <span data-testid={`nav-title-${index}`}>{item.title}</span>

          <span data-testid={`nav-url-${index}`}>{item.url}</span>

          {item.icon && <item.icon data-testid={`nav-icon-${index}`} />}

          {item.isActive && (
            <span data-testid={`nav-active-${index}`}>active</span>
          )}

          {item.items?.map((subItem, subIndex) => (
            <div
              data-testid={`nav-subitem-${index}-${subIndex}`}
              key={subIndex}
            >
              <span>{subItem.title}</span>

              <span>{subItem.url}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
}));

jest.mock("../../../../components/ui/nav-user", () => ({
  NavUser: ({
    user,
    ...props
  }: {
    user?: { name: string; email: string; avatar: string };
  } & React.HTMLAttributes<HTMLDivElement>) => (
    <div data-testid="mock-nav-user" {...props}>
      <span data-testid="user-name">{user?.name}</span>

      <span data-testid="user-email">{user?.email}</span>

      <span data-testid="user-avatar">{user?.avatar}</span>
    </div>
  ),
}));

jest.mock("../../../../components/ui/team-switcher", () => ({
  TeamSwitcher: ({
    teams,
    ...props
  }: {
    teams?: Array<{ name: string; plan: string; logo?: React.ComponentType }>;
  } & React.HTMLAttributes<HTMLDivElement>) => (
    <div data-testid="mock-team-switcher" {...props}>
      {teams?.map((team, index) => (
        <div key={index} data-testid={`team-${index}`}>
          <span data-testid={`team-name-${index}`}>{team.name}</span>

          <span data-testid={`team-plan-${index}`}>{team.plan}</span>

          {team.logo && <team.logo data-testid={`team-logo-${index}`} />}
        </div>
      ))}
    </div>
  ),
}));

jest.mock("../../../../components/ui/sidebar", () => ({
  Sidebar: ({
    children,
    collapsible,
    ...props
  }: {
    children?: React.ReactNode;
    collapsible?: string;
  } & React.HTMLAttributes<HTMLDivElement>) => (
    <div data-testid="mock-sidebar" data-collapsible={collapsible} {...props}>
      {children}
    </div>
  ),
  SidebarContent: ({
    children,
    ...props
  }: { children?: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) => (
    <div data-testid="mock-sidebar-content" {...props}>
      {children}
    </div>
  ),
  SidebarFooter: ({
    children,
    ...props
  }: { children?: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) => (
    <div data-testid="mock-sidebar-footer" {...props}>
      {children}
    </div>
  ),
  SidebarHeader: ({
    children,
    ...props
  }: { children?: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) => (
    <div data-testid="mock-sidebar-header" {...props}>
      {children}
    </div>
  ),
  SidebarRail: ({ ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div data-testid="mock-sidebar-rail" {...props} />
  ),
}));

describe("AppSidebar", () => {
  const mockUser = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://example.com/avatar.jpg",
  };

  const mockNavMain = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: (() => {
        const DashboardIcon = React.forwardRef<SVGSVGElement>((props, ref) => (
          <svg ref={ref} {...props} data-testid="dashboard-icon">
            <title>Dashboard</title>
          </svg>
        ));
        DashboardIcon.displayName = "DashboardIcon";

        return DashboardIcon;
      })(),
      isActive: true,
      items: [
        { title: "Overview", url: "/dashboard/overview" },
        { title: "Analytics", url: "/dashboard/analytics" },
      ],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: (() => {
        const SettingsIcon = React.forwardRef<SVGSVGElement>((props, ref) => (
          <svg ref={ref} {...props} data-testid="settings-icon">
            <title>Settings</title>
          </svg>
        ));
        SettingsIcon.displayName = "SettingsIcon";
        return SettingsIcon;
      })(),
      items: [
        { title: "Profile", url: "/settings/profile" },
        { title: "Preferences", url: "/settings/preferences" },
      ],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Basic Rendering", () => {
    it("should render AppSidebar with all required components", () => {
      render(<AppSidebar user={mockUser} navMain={mockNavMain} />);

      expect(screen.getByTestId("mock-sidebar")).toBeInTheDocument();
      expect(screen.getByTestId("mock-sidebar-header")).toBeInTheDocument();
      expect(screen.getByTestId("mock-sidebar-content")).toBeInTheDocument();
      expect(screen.getByTestId("mock-sidebar-footer")).toBeInTheDocument();
      expect(screen.getByTestId("mock-sidebar-rail")).toBeInTheDocument();
    });

    it("should set sidebar as collapsible icon by default", () => {
      render(<AppSidebar user={mockUser} navMain={mockNavMain} />);

      const sidebar = screen.getByTestId("mock-sidebar");
      expect(sidebar).toHaveAttribute("data-collapsible", "icon");
    });

    it("should render TeamSwitcher in header", () => {
      render(<AppSidebar user={mockUser} navMain={mockNavMain} />);

      expect(screen.getByTestId("mock-team-switcher")).toBeInTheDocument();
    });

    it("should render NavMain in content", () => {
      render(<AppSidebar user={mockUser} navMain={mockNavMain} />);

      expect(screen.getByTestId("mock-nav-main")).toBeInTheDocument();
    });

    it("should render NavUser in footer", () => {
      render(<AppSidebar user={mockUser} navMain={mockNavMain} />);

      expect(screen.getByTestId("mock-nav-user")).toBeInTheDocument();
    });
  });

  describe("User Prop", () => {
    it("should pass user data to NavUser", () => {
      render(<AppSidebar user={mockUser} navMain={mockNavMain} />);

      expect(screen.getByTestId("user-name")).toHaveTextContent("John Doe");
      expect(screen.getByTestId("user-email")).toHaveTextContent(
        "john.doe@example.com"
      );
      expect(screen.getByTestId("user-avatar")).toHaveTextContent(
        "https://example.com/avatar.jpg"
      );
    });

    it("should handle different user data", () => {
      const differentUser = {
        name: "Jane Smith",
        email: "jane.smith@test.com",
        avatar: "https://test.com/jane.jpg",
      };

      render(<AppSidebar user={differentUser} navMain={mockNavMain} />);

      expect(screen.getByTestId("user-name")).toHaveTextContent("Jane Smith");
      expect(screen.getByTestId("user-email")).toHaveTextContent(
        "jane.smith@test.com"
      );
      expect(screen.getByTestId("user-avatar")).toHaveTextContent(
        "https://test.com/jane.jpg"
      );
    });

    it("should handle user with special characters", () => {
      const specialUser = {
        name: "José María",
        email: "josé.maría@español.com",
        avatar: "https://example.com/josé.jpg",
      };

      render(<AppSidebar user={specialUser} navMain={mockNavMain} />);

      expect(screen.getByTestId("user-name")).toHaveTextContent("José María");
      expect(screen.getByTestId("user-email")).toHaveTextContent(
        "josé.maría@español.com"
      );
    });
  });

  describe("NavMain Prop", () => {
    it("should pass navMain items to NavMain component", () => {
      render(<AppSidebar user={mockUser} navMain={mockNavMain} />);

      expect(screen.getByTestId("nav-title-0")).toHaveTextContent("Dashboard");
      expect(screen.getByTestId("nav-url-0")).toHaveTextContent("/dashboard");
      expect(screen.getByTestId("nav-active-0")).toHaveTextContent("active");

      expect(screen.getByTestId("nav-title-1")).toHaveTextContent("Settings");
      expect(screen.getByTestId("nav-url-1")).toHaveTextContent("/settings");
    });

    it("should render navigation sub-items", () => {
      render(<AppSidebar user={mockUser} navMain={mockNavMain} />);

      expect(screen.getByTestId("nav-subitem-0-0")).toBeInTheDocument();
      expect(screen.getByTestId("nav-subitem-0-1")).toBeInTheDocument();

      expect(screen.getByTestId("nav-subitem-1-0")).toBeInTheDocument();
      expect(screen.getByTestId("nav-subitem-1-1")).toBeInTheDocument();
    });

    it("should handle empty navMain array", () => {
      render(<AppSidebar user={mockUser} navMain={[]} />);

      const navMain = screen.getByTestId("mock-nav-main");

      expect(navMain).toBeInTheDocument();
      expect(navMain).toBeEmptyDOMElement();
    });

    it("should handle navMain items without sub-items", () => {
      const simpleNavMain = [
        {
          title: "Simple Item",
          url: "/simple",
          icon: (() => {
            const SimpleIcon = React.forwardRef<SVGSVGElement>((props, ref) => (
              <svg ref={ref} {...props} data-testid="simple-icon">
                <title>Simple</title>
              </svg>
            ));
            SimpleIcon.displayName = "SimpleIcon";
            return SimpleIcon;
          })(),
          items: [],
        },
      ];

      render(<AppSidebar user={mockUser} navMain={simpleNavMain} />);

      expect(screen.getByTestId("nav-title-0")).toHaveTextContent(
        "Simple Item"
      );
      expect(screen.getByTestId("nav-url-0")).toHaveTextContent("/simple");
    });
  });

  describe("TeamSwitcher Data", () => {
    it("should render predefined teams data", () => {
      render(<AppSidebar user={mockUser} navMain={mockNavMain} />);

      expect(screen.getByTestId("team-name-0")).toHaveTextContent("Acme Inc");
      expect(screen.getByTestId("team-plan-0")).toHaveTextContent("Enterprise");
      expect(screen.getByTestId("team-logo-0")).toBeInTheDocument();

      expect(screen.getByTestId("team-name-1")).toHaveTextContent("Acme Corp.");
      expect(screen.getByTestId("team-plan-1")).toHaveTextContent("Startup");

      expect(screen.getByTestId("team-name-2")).toHaveTextContent("Evil Corp.");
      expect(screen.getByTestId("team-plan-2")).toHaveTextContent("Free");
    });

    it("should render team logos using Lucide icons", () => {
      render(<AppSidebar user={mockUser} navMain={mockNavMain} />);

      expect(screen.getByTestId("team-logo-0")).toBeInTheDocument();
      expect(screen.getByTestId("team-logo-1")).toBeInTheDocument();
      expect(screen.getByTestId("team-logo-2")).toBeInTheDocument();
    });
  });

  describe("Props Forwarding", () => {
    it("should forward additional props to Sidebar", () => {
      render(
        <AppSidebar
          className="custom-sidebar"
          data-custom="test"
          navMain={mockNavMain}
          user={mockUser}
        />
      );

      const sidebar = screen.getByTestId("mock-sidebar");

      expect(sidebar).toHaveClass("custom-sidebar");
      expect(sidebar).toHaveAttribute("data-custom", "test");
    });

    it("should handle style prop", () => {
      const customStyle = {
        backgroundColor: "rgb(0, 0, 255)",
        padding: "20px",
      };
      render(
        <AppSidebar user={mockUser} navMain={mockNavMain} style={customStyle} />
      );

      const sidebar = screen.getByTestId("mock-sidebar");

      expect(sidebar).toHaveStyle("background-color: rgb(0, 0, 255)");
      expect(sidebar).toHaveStyle("padding: 20px");
    });

    it("should override collapsible prop", () => {
      render(
        <AppSidebar user={mockUser} navMain={mockNavMain} collapsible="none" />
      );

      const sidebar = screen.getByTestId("mock-sidebar");
      expect(sidebar).toHaveAttribute("data-collapsible", "none");
    });
  });

  describe("Component Structure", () => {
    it("should have correct hierarchy", () => {
      render(<AppSidebar user={mockUser} navMain={mockNavMain} />);

      const sidebar = screen.getByTestId("mock-sidebar");
      const header = screen.getByTestId("mock-sidebar-header");
      const content = screen.getByTestId("mock-sidebar-content");
      const footer = screen.getByTestId("mock-sidebar-footer");
      const rail = screen.getByTestId("mock-sidebar-rail");

      expect(sidebar).toContainElement(header);
      expect(sidebar).toContainElement(content);
      expect(sidebar).toContainElement(footer);
      expect(sidebar).toContainElement(rail);

      expect(header).toContainElement(screen.getByTestId("mock-team-switcher"));
      expect(content).toContainElement(screen.getByTestId("mock-nav-main"));
      expect(footer).toContainElement(screen.getByTestId("mock-nav-user"));
    });

    it("should render components in correct order", () => {
      render(<AppSidebar user={mockUser} navMain={mockNavMain} />);

      const sidebar = screen.getByTestId("mock-sidebar");
      const children = Array.from(sidebar.children);

      expect(children[0]).toHaveAttribute("data-testid", "mock-sidebar-header");
      expect(children[1]).toHaveAttribute(
        "data-testid",
        "mock-sidebar-content"
      );
      expect(children[2]).toHaveAttribute("data-testid", "mock-sidebar-footer");
      expect(children[3]).toHaveAttribute("data-testid", "mock-sidebar-rail");
    });
  });

  describe("Edge Cases", () => {
    it("should handle missing icon in navMain items", () => {
      const navMainWithoutIcon = [
        {
          title: "No Icon Item",
          url: "/no-icon",
          items: [],
        },
      ];

      render(
        <AppSidebar user={mockUser} navMain={navMainWithoutIcon as never} />
      );

      expect(screen.getByTestId("nav-title-0")).toHaveTextContent(
        "No Icon Item"
      );
      expect(screen.queryByTestId("nav-icon-0")).not.toBeInTheDocument();
    });

    it("should handle navMain items without isActive", () => {
      const navMainWithoutActive = [
        {
          title: "Inactive Item",
          url: "/inactive",
          icon: (() => {
            const InactiveIcon = React.forwardRef<SVGSVGElement>(
              (props, ref) => (
                <svg ref={ref} {...props} data-testid="inactive-icon">
                  <title>Inactive</title>
                </svg>
              )
            );
            InactiveIcon.displayName = "InactiveIcon";

            return InactiveIcon;
          })(),
          items: [],
        },
      ];

      render(<AppSidebar user={mockUser} navMain={navMainWithoutActive} />);

      expect(screen.getByTestId("nav-title-0")).toHaveTextContent(
        "Inactive Item"
      );
      expect(screen.queryByTestId("nav-active-0")).not.toBeInTheDocument();
    });

    it("should handle empty user data gracefully", () => {
      const emptyUser = {
        name: "",
        email: "",
        avatar: "",
      };

      render(<AppSidebar user={emptyUser} navMain={mockNavMain} />);

      expect(screen.getByTestId("user-name")).toHaveTextContent("");
      expect(screen.getByTestId("user-email")).toHaveTextContent("");
      expect(screen.getByTestId("user-avatar")).toHaveTextContent("");
    });
  });

  describe("Integration Scenarios", () => {
    it("should work with complex navigation structure", () => {
      const complexNavMain = [
        {
          title: "Complex Section",
          url: "/complex",
          icon: (() => {
            const ComplexIcon = React.forwardRef<SVGSVGElement>(
              (props, ref) => (
                <svg ref={ref} {...props} data-testid="complex-icon">
                  <title>Complex</title>
                </svg>
              )
            );
            ComplexIcon.displayName = "ComplexIcon";
            return ComplexIcon;
          })(),
          isActive: true,
          items: [
            { title: "Sub Item 1", url: "/complex/sub1" },
            { title: "Sub Item 2", url: "/complex/sub2" },
            { title: "Sub Item 3", url: "/complex/sub3" },
          ],
        },
      ];

      render(<AppSidebar user={mockUser} navMain={complexNavMain} />);

      expect(screen.getByTestId("nav-title-0")).toHaveTextContent(
        "Complex Section"
      );
      expect(screen.getByTestId("nav-active-0")).toBeInTheDocument();
      expect(screen.getByTestId("nav-subitem-0-0")).toBeInTheDocument();
      expect(screen.getByTestId("nav-subitem-0-1")).toBeInTheDocument();
      expect(screen.getByTestId("nav-subitem-0-2")).toBeInTheDocument();
    });

    it("should handle multiple navigation sections", () => {
      const multipleNavMain = Array.from({ length: 5 }, (_, i) => {
        const SectionIcon = React.forwardRef<SVGSVGElement>((props, ref) => (
          <svg ref={ref} {...props} data-testid={`section-${i + 1}-icon`}>
            <title>{`Section ${i + 1}`}</title>
          </svg>
        ));
        SectionIcon.displayName = `Section${i + 1}Icon`;

        return {
          title: `Section ${i + 1}`,
          url: `/section-${i + 1}`,
          icon: SectionIcon,
          items: [
            { title: `Sub ${i + 1}.1`, url: `/section-${i + 1}/sub1` },
            { title: `Sub ${i + 1}.2`, url: `/section-${i + 1}/sub2` },
          ],
        };
      });

      render(<AppSidebar user={mockUser} navMain={multipleNavMain} />);

      for (let i = 0; i < 5; i++) {
        expect(screen.getByTestId(`nav-title-${i}`)).toHaveTextContent(
          `Section ${i + 1}`
        );
        expect(screen.getByTestId(`nav-subitem-${i}-0`)).toBeInTheDocument();
        expect(screen.getByTestId(`nav-subitem-${i}-1`)).toBeInTheDocument();
      }
    });
  });
});
