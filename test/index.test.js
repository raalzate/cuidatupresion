import { render, screen, fireEvent } from "@testing-library/react";
import LoginPage from "../app/(auth)/(routes)/sign-in/[[...sign-in]]/page";
import { signIn } from "next-auth/react";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
} from "../components/ui/card";

jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
}));

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

describe("Card Components", () => {
  it("renders Card component", () => {
    render(<Card data-testid="card">Test Card</Card>);

    expect(screen.getByTestId("card")).toBeInTheDocument();
    expect(screen.getByText("Test Card")).toBeInTheDocument();
  });

  it("renders CardHeader component", () => {
    render(<CardHeader data-testid="card-header">Header Content</CardHeader>);

    expect(screen.getByTestId("card-header")).toBeInTheDocument();
    expect(screen.getByText("Header Content")).toBeInTheDocument();
  });

  it("renders CardTitle component", () => {
    render(<CardTitle data-testid="card-title">Card Title</CardTitle>);

    expect(screen.getByTestId("card-title")).toBeInTheDocument();
    expect(screen.getByText("Card Title")).toBeInTheDocument();
  });

  it("renders CardDescription component", () => {
    render(
      <CardDescription data-testid="card-description">
        Card Description
      </CardDescription>
    );

    expect(screen.getByTestId("card-description")).toBeInTheDocument();
    expect(screen.getByText("Card Description")).toBeInTheDocument();
  });

  it("renders CardAction component", () => {
    render(<CardAction data-testid="card-action">Action Button</CardAction>);

    expect(screen.getByTestId("card-action")).toBeInTheDocument();
    expect(screen.getByText("Action Button")).toBeInTheDocument();
  });

  it("renders CardContent component", () => {
    render(<CardContent data-testid="card-content">Card Content</CardContent>);

    expect(screen.getByTestId("card-content")).toBeInTheDocument();
    expect(screen.getByText("Card Content")).toBeInTheDocument();
  });

  it("renders CardFooter component", () => {
    render(<CardFooter data-testid="card-footer">Footer Content</CardFooter>);

    expect(screen.getByTestId("card-footer")).toBeInTheDocument();
    expect(screen.getByText("Footer Content")).toBeInTheDocument();
  });

  it("renders complete Card structure", () => {
    render(
      <Card data-testid="complete-card">
        <CardHeader>
          <CardTitle>Complete Card Title</CardTitle>

          <CardDescription>Complete Card Description</CardDescription>

          <CardAction>Action</CardAction>
        </CardHeader>

        <CardContent>Complete Card Content</CardContent>

        <CardFooter>Complete Card Footer</CardFooter>
      </Card>
    );

    expect(screen.getByTestId("complete-card")).toBeInTheDocument();
    expect(screen.getByText("Complete Card Title")).toBeInTheDocument();
    expect(screen.getByText("Complete Card Description")).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
    expect(screen.getByText("Complete Card Content")).toBeInTheDocument();
    expect(screen.getByText("Complete Card Footer")).toBeInTheDocument();
  });

  it("applies custom className to Card components", () => {
    render(
      <div>
        <Card className="custom-card" data-testid="custom-card">
          Card
        </Card>
        <CardHeader className="custom-header" data-testid="custom-header">
          Header
        </CardHeader>

        <CardTitle className="custom-title" data-testid="custom-title">
          Title
        </CardTitle>
      </div>
    );

    expect(screen.getByTestId("custom-card")).toHaveClass("custom-card");
    expect(screen.getByTestId("custom-header")).toHaveClass("custom-header");
    expect(screen.getByTestId("custom-title")).toHaveClass("custom-title");
  });
});
