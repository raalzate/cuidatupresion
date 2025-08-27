import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Home from "../pages/index";
import { useSession, signOut } from "next-auth/react";

// index.test.js

// Mock next-auth/react
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
  signOut: jest.fn(),
}));


describe("Home page", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("shows loading state", () => {
    useSession.mockReturnValue({ data: null, status: "loading" });
    render(<Home />);
    expect(screen.getByText(/Cargando/i)).toBeInTheDocument();
  });

  it("shows unauthenticated message", () => {
    useSession.mockReturnValue({ data: null, status: "unauthenticated" });
    render(<Home />);
    expect(screen.getByText(/No has iniciado sesión/i)).toBeInTheDocument();
  });

  it("shows authenticated user and logout button", () => {
    useSession.mockReturnValue({
      data: { user: { name: "Raul" } },
      status: "authenticated",
    });
    render(<Home />);
    expect(screen.getByText(/Hola, Raul/i)).toBeInTheDocument();
    expect(screen.getByText(/Cerrar sesión/i)).toBeInTheDocument();
  });

  it("calls signOut on logout button click", () => {
    useSession.mockReturnValue({
      data: { user: { name: "Raul" } },
      status: "authenticated",
    });
    render(<Home />);
    fireEvent.click(screen.getByText(/Cerrar sesión/i));
    expect(signOut).toHaveBeenCalledWith({ callbackUrl: "/login" });
  });
});