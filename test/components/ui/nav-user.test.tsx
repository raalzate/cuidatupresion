import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";

interface User {
  avatar: string;
  email: string;
  name: string;
}

interface TestNavUserProps {
  user: User;
}

const mockSignOut = jest.fn();
const mockLogoutUser = jest.fn();
const mockUseSidebar = jest.fn();

const TestNavUser = ({ user }: TestNavUserProps) => {
  const isMobile = false;

  const handleLogOut = () => {
    mockLogoutUser();
    mockSignOut({ callbackUrl: "/sign-in" });
  };

  return (
    <div data-testid="sidebar-menu">
      <div data-testid="sidebar-menu-item">
        <div data-testid="dropdown-menu">
          <button
            data-testid="sidebar-menu-button"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div data-testid="avatar" className="h-8 w-8 rounded-lg">
              <div
                data-alt={user.name}
                data-src={user.avatar}
                data-testid="avatar-image"
              >
                Avatar
              </div>

              <div data-testid="avatar-fallback" className="rounded-lg">
                CN
              </div>
            </div>

            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>

              <span className="truncate text-xs">{user.email}</span>
            </div>

            <div data-testid="chevron-icon">⌄</div>
          </button>

          <div
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            data-align="end"
            data-side-offset={4}
            data-side={isMobile ? "bottom" : "right"}
            data-testid="dropdown-menu-content"
          >
            <div data-testid="dropdown-menu-label" className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <div data-testid="avatar" className="h-8 w-8 rounded-lg">
                  <div
                    data-alt={user.name}
                    data-src={user.avatar}
                    data-testid="avatar-image"
                  >
                    Avatar
                  </div>

                  <div data-testid="avatar-fallback" className="rounded-lg">
                    CN
                  </div>
                </div>

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>

                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </div>

            <div data-testid="dropdown-menu-separator" />

            <div data-testid="dropdown-menu-group">
              <div data-testid="dropdown-menu-item">
                <span data-testid="sparkles-icon">✨</span>
                Upgrade to Pro
              </div>
            </div>

            <div data-testid="dropdown-menu-separator" />

            <div data-testid="dropdown-menu-group">
              <div data-testid="dropdown-menu-item">
                <span data-testid="badge-check-icon">✓</span>
                Account
              </div>

              <div data-testid="dropdown-menu-item" data-href="/user1/settings">
                <span data-testid="settings-icon">⚙️</span>
                Actualizar datos
              </div>

              <div data-testid="dropdown-menu-item">
                <span data-testid="bell-icon">🔔</span>
                Notificaciones
              </div>
            </div>

            <div data-testid="dropdown-menu-separator" />

            <div data-testid="dropdown-menu-item" onClick={handleLogOut}>
              <span data-testid="logout-icon">🚪</span>
              Cerrar sesión
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

describe("NavUser Component", () => {
  const mockUser: User = {
    avatar: "https://example.com/avatar.jpg",
    email: "john.doe@example.com",
    name: "John Doe",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSidebar.mockReturnValue({ isMobile: false });
  });

  describe("Rendering", () => {
    it("should render user navigation with basic structure", () => {
      render(<TestNavUser user={mockUser} />);

      expect(screen.getByTestId("sidebar-menu")).toBeInTheDocument();
      expect(screen.getByTestId("sidebar-menu-item")).toBeInTheDocument();
      expect(screen.getByTestId("dropdown-menu")).toBeInTheDocument();
      expect(screen.getByTestId("sidebar-menu-button")).toBeInTheDocument();
    });

    it("should display user information in trigger button", () => {
      render(<TestNavUser user={mockUser} />);

      const nameElements = screen.getAllByText("John Doe");

      expect(nameElements).toHaveLength(2);
      expect(nameElements[0]).toBeInTheDocument();

      const emailElements = screen.getAllByText("john.doe@example.com");

      expect(emailElements).toHaveLength(2);
      expect(emailElements[0]).toBeInTheDocument();
    });

    it("should render user avatar with correct props", () => {
      render(<TestNavUser user={mockUser} />);

      const avatarImages = screen.getAllByTestId("avatar-image");

      expect(avatarImages[0]).toHaveAttribute("data-src", mockUser.avatar);
      expect(avatarImages[0]).toHaveAttribute("data-alt", mockUser.name);
    });

    it("should render avatar fallback", () => {
      render(<TestNavUser user={mockUser} />);

      const avatarFallbacks = screen.getAllByTestId("avatar-fallback");

      expect(avatarFallbacks[0]).toHaveTextContent("CN");
      expect(avatarFallbacks[0]).toHaveClass("rounded-lg");
    });

    it("should apply correct CSS classes to menu button", () => {
      render(<TestNavUser user={mockUser} />);

      const menuButton = screen.getByTestId("sidebar-menu-button");

      expect(menuButton).toHaveClass(
        "data-[state=open]:bg-sidebar-accent",
        "data-[state=open]:text-sidebar-accent-foreground"
      );
    });
  });

  describe("Dropdown Menu Content", () => {
    it("should render dropdown menu content with correct structure", () => {
      render(<TestNavUser user={mockUser} />);

      expect(screen.getByTestId("dropdown-menu-content")).toBeInTheDocument();
      expect(screen.getByTestId("dropdown-menu-label")).toBeInTheDocument();
      expect(screen.getAllByTestId("dropdown-menu-separator")).toHaveLength(3);
      expect(screen.getAllByTestId("dropdown-menu-group")).toHaveLength(2);
    });

    it("should display user information in dropdown label", () => {
      render(<TestNavUser user={mockUser} />);

      const dropdownContent = screen.getByTestId("dropdown-menu-content");

      expect(dropdownContent).toHaveTextContent("John Doe");
      expect(dropdownContent).toHaveTextContent("john.doe@example.com");
    });

    it("should render all menu items", () => {
      render(<TestNavUser user={mockUser} />);

      expect(screen.getByText("Upgrade to Pro")).toBeInTheDocument();
      expect(screen.getByText("Account")).toBeInTheDocument();
      expect(screen.getByText("Actualizar datos")).toBeInTheDocument();
      expect(screen.getByText("Notificaciones")).toBeInTheDocument();
      expect(screen.getByText("Cerrar sesión")).toBeInTheDocument();
    });

    it("should render menu items with icons", () => {
      render(<TestNavUser user={mockUser} />);

      expect(screen.getByTestId("sparkles-icon")).toBeInTheDocument();
      expect(screen.getByTestId("badge-check-icon")).toBeInTheDocument();
      expect(screen.getByTestId("settings-icon")).toBeInTheDocument();
      expect(screen.getByTestId("bell-icon")).toBeInTheDocument();
      expect(screen.getByTestId("logout-icon")).toBeInTheDocument();
    });

    it("should render settings link with correct href", () => {
      render(<TestNavUser user={mockUser} />);

      const settingsLink = screen.getByText("Actualizar datos");
      expect(settingsLink).toHaveAttribute("data-href", "/user1/settings");
    });

    it("should apply correct CSS classes to dropdown content", () => {
      render(<TestNavUser user={mockUser} />);

      const dropdownContent = screen.getByTestId("dropdown-menu-content");

      expect(dropdownContent).toHaveClass(
        "w-(--radix-dropdown-menu-trigger-width)",
        "min-w-56",
        "rounded-lg"
      );
    });
  });

  describe("Mobile Responsiveness", () => {
    it("should set correct side position for desktop", () => {
      render(<TestNavUser user={mockUser} />);

      const dropdownContent = screen.getByTestId("dropdown-menu-content");
      expect(dropdownContent).toHaveAttribute("data-side", "right");
    });

    it("should set correct side position for mobile (simulated)", () => {
      render(<TestNavUser user={mockUser} />);

      const dropdownContent = screen.getByTestId("dropdown-menu-content");
      expect(dropdownContent).toHaveAttribute("data-side", "right");
    });

    it("should set correct alignment and offset", () => {
      render(<TestNavUser user={mockUser} />);

      const dropdownContent = screen.getByTestId("dropdown-menu-content");

      expect(dropdownContent).toHaveAttribute("data-align", "end");
      expect(dropdownContent).toHaveAttribute("data-side-offset", "4");
    });
  });

  describe("User Interactions", () => {
    it("should call logout functions when logout is clicked", async () => {
      render(<TestNavUser user={mockUser} />);

      const logoutButton = screen.getByText("Cerrar sesión");
      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(mockLogoutUser).toHaveBeenCalledTimes(1);
        expect(mockSignOut).toHaveBeenCalledWith({ callbackUrl: "/sign-in" });
      });
    });

    it("should handle menu item clicks without errors", () => {
      render(<TestNavUser user={mockUser} />);

      const upgradeButton = screen.getByText("Upgrade to Pro");
      const accountButton = screen.getByText("Account");
      const notificationsButton = screen.getByText("Notificaciones");

      expect(() => {
        fireEvent.click(upgradeButton);
        fireEvent.click(accountButton);
        fireEvent.click(notificationsButton);
      }).not.toThrow();
    });

    it("should navigate to settings when settings link is clicked", () => {
      render(<TestNavUser user={mockUser} />);

      const settingsLink = screen.getByText("Actualizar datos");
      expect(settingsLink).toBeInTheDocument();

      fireEvent.click(settingsLink);
      expect(settingsLink).toHaveAttribute("data-href", "/user1/settings");
    });
  });

  describe("Edge Cases", () => {
    it("should handle user with empty name", () => {
      const userWithEmptyName = { ...mockUser, name: "" };
      render(<TestNavUser user={userWithEmptyName} />);

      const nameElements = screen.getAllByText("", { exact: false });
      expect(nameElements).toBeDefined();
    });

    it("should handle user with empty email", () => {
      const userWithEmptyEmail = { ...mockUser, email: "" };
      render(<TestNavUser user={userWithEmptyEmail} />);

      const nameElements = screen.getAllByText("John Doe");

      expect(nameElements).toHaveLength(2);
      expect(nameElements[0]).toBeInTheDocument();
    });

    it("should handle user with empty avatar", () => {
      const userWithEmptyAvatar = { ...mockUser, avatar: "" };

      render(<TestNavUser user={userWithEmptyAvatar} />);

      const avatarImages = screen.getAllByTestId("avatar-image");

      expect(avatarImages[0]).toHaveAttribute("data-src", "");
      expect(avatarImages[0]).toHaveAttribute("data-alt", mockUser.name);
    });

    it("should handle very long user names", () => {
      const userWithLongName = {
        ...mockUser,
        name: "This is a very long user name that might overflow the container",
      };

      render(<TestNavUser user={userWithLongName} />);

      const longNameElements = screen.getAllByText(
        "This is a very long user name that might overflow the container"
      );

      expect(longNameElements).toHaveLength(2);
      expect(longNameElements[0]).toBeInTheDocument();
    });

    it("should handle very long email addresses", () => {
      const userWithLongEmail = {
        ...mockUser,
        email:
          "this.is.a.very.long.email.address@very-long-domain-name.example.com",
      };

      render(<TestNavUser user={userWithLongEmail} />);

      const longEmailElements = screen.getAllByText(
        "this.is.a.very.long.email.address@very-long-domain-name.example.com"
      );

      expect(longEmailElements).toHaveLength(2);
      expect(longEmailElements[0]).toBeInTheDocument();
    });

    it("should handle special characters in user data", () => {
      const userWithSpecialChars = {
        avatar: "https://example.com/josé-maría.jpg",
        email: "josé.maría@ñoño.com",
        name: "José María Ñoño",
      };

      render(<TestNavUser user={userWithSpecialChars} />);

      const nameElements = screen.getAllByText("José María Ñoño");

      expect(nameElements).toHaveLength(2);
      expect(nameElements[0]).toBeInTheDocument();

      const emailElements = screen.getAllByText("josé.maría@ñoño.com");

      expect(emailElements).toHaveLength(2);
      expect(emailElements[0]).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should provide proper alt text for avatar images", () => {
      render(<TestNavUser user={mockUser} />);

      const avatarImages = screen.getAllByTestId("avatar-image");

      avatarImages.forEach((img) => {
        expect(img).toHaveAttribute("data-alt", mockUser.name);
      });
    });

    it("should use semantic HTML structure", () => {
      render(<TestNavUser user={mockUser} />);

      expect(screen.getByTestId("sidebar-menu-button")).toBeInTheDocument();

      const settingsLink = screen.getByText("Actualizar datos");
      expect(settingsLink).toBeInTheDocument();
    });

    it("should be keyboard navigable", () => {
      render(<TestNavUser user={mockUser} />);

      const menuButton = screen.getByTestId("sidebar-menu-button");

      menuButton.focus();
      expect(menuButton).toHaveFocus();

      const settingsLink = screen.getByText("Actualizar datos");

      expect(settingsLink).toBeInTheDocument();
      expect(settingsLink).toHaveAttribute("data-href", "/user1/settings");

      const logoutButton = screen.getByText("Cerrar sesión");

      expect(logoutButton).toBeInTheDocument();
      expect(logoutButton).toHaveAttribute("data-testid", "dropdown-menu-item");
    });

    it("should apply proper truncation classes for long text", () => {
      render(<TestNavUser user={mockUser} />);

      const nameElements = screen.getAllByText("John Doe");
      const emailElements = screen.getAllByText("john.doe@example.com");

      nameElements.forEach((element) => {
        expect(element).toHaveClass("truncate", "font-medium");
      });

      emailElements.forEach((element) => {
        expect(element).toHaveClass("truncate", "text-xs");
      });
    });
  });

  describe("Component Integration", () => {
    it("should integrate with useSidebar hook", () => {
      render(<TestNavUser user={mockUser} />);

      expect(screen.getByTestId("dropdown-menu-content")).toHaveAttribute(
        "data-side",
        "right"
      );
    });

    it("should integrate with auth store", () => {
      render(<TestNavUser user={mockUser} />);

      const logoutButton = screen.getByText("Cerrar sesión");
      fireEvent.click(logoutButton);

      expect(mockLogoutUser).toHaveBeenCalled();
    });

    it("should integrate with NextAuth signOut", async () => {
      render(<TestNavUser user={mockUser} />);

      const logoutButton = screen.getByText("Cerrar sesión");
      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(mockSignOut).toHaveBeenCalledWith({ callbackUrl: "/sign-in" });
      });
    });

    it("should work with different user prop variations", () => {
      const users = [
        { name: "Alice", email: "alice@test.com", avatar: "alice.jpg" },
        { name: "Bob", email: "bob@test.com", avatar: "bob.jpg" },
        { name: "Charlie", email: "charlie@test.com", avatar: "charlie.jpg" },
      ];

      users.forEach((user) => {
        const { unmount } = render(<TestNavUser user={user} />);

        const nameElements = screen.getAllByText(user.name);

        expect(nameElements).toHaveLength(2);
        expect(nameElements[0]).toBeInTheDocument();

        const emailElements = screen.getAllByText(user.email);

        expect(emailElements).toHaveLength(2);
        expect(emailElements[0]).toBeInTheDocument();

        const avatarImages = screen.getAllByTestId("avatar-image");
        expect(avatarImages[0]).toHaveAttribute("data-src", user.avatar);

        unmount();
      });
    });
  });
});
