import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import LoginPage from "../app/(auth)/(routes)/sign-in/[[...sign-in]]/page";
import { signIn } from "next-auth/react";

// Mock next-auth/react
jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
}));

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt || ""} />;
  },
}));

describe("LoginPage", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders login form with welcome message", () => {
    render(<LoginPage />);
    expect(screen.getByText(/¡Bienvenido!/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Es un placer tenerte de regreso/i)
    ).toBeInTheDocument();
  });

  it("renders Google login button", () => {
    render(<LoginPage />);
    expect(screen.getByText(/Ingresar con Google/i)).toBeInTheDocument();
  });

  it("calls signIn when Google login button is clicked", () => {
    render(<LoginPage />);
    const googleButton = screen.getByText(/Ingresar con Google/i);
    fireEvent.click(googleButton);
    expect(signIn).toHaveBeenCalledWith("google", {
      callbackUrl: "/user1/history",
    });
  });

  it("renders terms and privacy policy links", () => {
    render(<LoginPage />);
    expect(screen.getByText(/Términos de Servicio/i)).toBeInTheDocument();
    expect(screen.getByText(/Política de Privacidad/i)).toBeInTheDocument();
  });

  it("prevents default form submission", () => {
    const preventDefault = jest.fn();
    render(<LoginPage />);
    const googleButton = screen.getByText(/Ingresar con Google/i);

    fireEvent.click(googleButton, { preventDefault });

    expect(signIn).toHaveBeenCalled();
  });
});
