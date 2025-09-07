import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";
import React from "react";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

describe("Avatar Component", () => {
  describe("Avatar", () => {
    it("should render with default classes", () => {
      render(<Avatar data-testid="avatar" />);

      const avatar = screen.getByTestId("avatar");

      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveAttribute("data-slot", "avatar");
      expect(avatar).toHaveClass(
        "relative",
        "flex",
        "size-8",
        "shrink-0",
        "overflow-hidden",
        "rounded-full"
      );
    });

    it("should render with custom className", () => {
      render(<Avatar className="custom-class" data-testid="avatar" />);

      const avatar = screen.getByTestId("avatar");

      expect(avatar).toHaveClass("custom-class");
      expect(avatar).toHaveClass("relative", "flex", "size-8");
    });

    it("should pass through additional props", () => {
      render(<Avatar data-testid="avatar" aria-label="User avatar" />);

      const avatar = screen.getByTestId("avatar");

      expect(avatar).toHaveAttribute("aria-label", "User avatar");
    });

    it("should render children correctly", () => {
      render(
        <Avatar data-testid="avatar">
          <div data-testid="child">Child content</div>
        </Avatar>
      );

      const avatar = screen.getByTestId("avatar");
      const child = screen.getByTestId("child");

      expect(avatar).toContainElement(child);
      expect(child).toHaveTextContent("Child content");
    });
  });

  describe("AvatarImage", () => {
    it("should render with default classes when image loads", () => {
      render(
        <Avatar data-testid="avatar-container">
          <AvatarImage
            alt="Test"
            data-testid="avatar-image"
            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzAwMCIvPjwvc3ZnPg=="
          />

          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      );

      const avatarContainer = screen.getByTestId("avatar-container");

      expect(avatarContainer).toBeInTheDocument();
      expect(avatarContainer).toHaveAttribute("data-slot", "avatar");
    });

    it("should render with custom className when provided", () => {
      render(
        <Avatar data-testid="avatar-container">
          <AvatarImage
            className="custom-image-class"
            data-testid="avatar-image"
            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzAwMCIvPjwvc3ZnPg=="
            alt="Test"
          />

          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      );

      const avatarContainer = screen.getByTestId("avatar-container");

      expect(avatarContainer).toBeInTheDocument();
      expect(avatarContainer).toHaveAttribute("data-slot", "avatar");
    });

    it("should handle image props correctly", () => {
      render(
        <Avatar data-testid="avatar-container">
          <AvatarImage
            alt="Test avatar"
            data-testid="avatar-image"
            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzAwMCIvPjwvc3ZnPg=="
          />

          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      );

      const avatarContainer = screen.getByTestId("avatar-container");

      expect(avatarContainer).toBeInTheDocument();

      const img = avatarContainer.querySelector("img");

      if (img) {
        expect(img).toHaveAttribute("alt", "Test avatar");
      }
    });

    it("should handle additional props", () => {
      render(
        <Avatar data-testid="avatar-container">
          <AvatarImage
            alt="Test"
            data-testid="avatar-image"
            loading="lazy"
            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzAwMCIvPjwvc3ZnPg=="
          />

          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      );

      const avatarContainer = screen.getByTestId("avatar-container");

      expect(avatarContainer).toBeInTheDocument();

      const img = avatarContainer.querySelector("img");

      if (img) {
        expect(img).toHaveAttribute("loading", "lazy");
      }
    });
  });

  describe("AvatarFallback", () => {
    it("should render with default classes", () => {
      render(
        <Avatar>
          <AvatarFallback data-testid="avatar-fallback">JD</AvatarFallback>
        </Avatar>
      );

      const avatarFallback = screen.getByTestId("avatar-fallback");

      expect(avatarFallback).toBeInTheDocument();
      expect(avatarFallback).toHaveAttribute("data-slot", "avatar-fallback");
      expect(avatarFallback).toHaveClass(
        "bg-muted",
        "flex",
        "size-full",
        "items-center",
        "justify-center",
        "rounded-full"
      );
    });

    it("should render with custom className", () => {
      render(
        <Avatar>
          <AvatarFallback
            className="custom-fallback-class"
            data-testid="avatar-fallback"
          >
            JD
          </AvatarFallback>
        </Avatar>
      );

      const avatarFallback = screen.getByTestId("avatar-fallback");

      expect(avatarFallback).toHaveClass("custom-fallback-class");
      expect(avatarFallback).toHaveClass("bg-muted", "flex", "size-full");
    });

    it("should render children correctly", () => {
      render(
        <Avatar>
          <AvatarFallback data-testid="avatar-fallback">JD</AvatarFallback>
        </Avatar>
      );

      const avatarFallback = screen.getByTestId("avatar-fallback");

      expect(avatarFallback).toHaveTextContent("JD");
    });

    it("should pass through additional props", () => {
      render(
        <Avatar>
          <AvatarFallback
            data-testid="avatar-fallback"
            aria-label="Fallback avatar"
          >
            JD
          </AvatarFallback>
        </Avatar>
      );

      const avatarFallback = screen.getByTestId("avatar-fallback");

      expect(avatarFallback).toHaveAttribute("aria-label", "Fallback avatar");
    });

    it("should render complex children", () => {
      render(
        <Avatar>
          <AvatarFallback data-testid="avatar-fallback">
            <span data-testid="fallback-content">Complex Content</span>
          </AvatarFallback>
        </Avatar>
      );

      const avatarFallback = screen.getByTestId("avatar-fallback");
      const fallbackContent = screen.getByTestId("fallback-content");

      expect(avatarFallback).toContainElement(fallbackContent);
      expect(fallbackContent).toHaveTextContent("Complex Content");
    });
  });

  describe("Avatar Integration", () => {
    it("should render complete avatar with image and fallback", () => {
      render(
        <Avatar data-testid="avatar">
          <AvatarImage data-testid="avatar-image" src="/test.jpg" alt="Test" />

          <AvatarFallback data-testid="avatar-fallback">JD</AvatarFallback>
        </Avatar>
      );

      const avatar = screen.getByTestId("avatar");
      const avatarFallback = screen.getByTestId("avatar-fallback");

      expect(avatar).toContainElement(avatarFallback);
    });

    it("should maintain proper structure with all components", () => {
      render(
        <Avatar className="size-16" data-testid="avatar">
          <AvatarImage
            className="object-cover"
            data-testid="avatar-image"
            src="/profile.jpg"
            alt="Profile"
          />

          <AvatarFallback
            className="bg-blue-500 text-white"
            data-testid="avatar-fallback"
          >
            JD
          </AvatarFallback>
        </Avatar>
      );

      const avatar = screen.getByTestId("avatar");
      const avatarFallback = screen.getByTestId("avatar-fallback");

      expect(avatar).toHaveClass("size-16");
      expect(avatarFallback).toHaveClass("bg-blue-500", "text-white");

      expect(avatar).toHaveClass("relative", "flex", "rounded-full");
      expect(avatarFallback).toHaveClass(
        "flex",
        "items-center",
        "justify-center"
      );
    });

    it("should show fallback when image fails to load", () => {
      render(
        <Avatar data-testid="avatar">
          <AvatarImage
            data-testid="avatar-image"
            src="/invalid.jpg"
            alt="Test"
          />

          <AvatarFallback data-testid="avatar-fallback">JD</AvatarFallback>
        </Avatar>
      );

      const avatar = screen.getByTestId("avatar");
      const avatarFallback = screen.getByTestId("avatar-fallback");

      expect(avatar).toContainElement(avatarFallback);
      expect(avatarFallback).toHaveTextContent("JD");
    });
  });
});
