import "@testing-library/jest-dom";

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const testSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  age: z.number().min(18, "Must be at least 18 years old").optional(),
});

const simpleTestSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
});

type TestFormData = z.infer<typeof testSchema>;
type SimpleTestFormData = z.infer<typeof simpleTestSchema>;

describe("Form Component", () => {
  describe("Form Provider", () => {
    it("should render form with default props", () => {
      const TestForm = () => {
        const form = useForm<TestFormData>();

        return (
          <Form {...form}>
            <form data-testid="test-form">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>

                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        );
      };

      render(<TestForm />);

      const form = screen.getByTestId("test-form");

      expect(form).toBeInTheDocument();
      expect(screen.getByText("Username")).toBeInTheDocument();
    });

    it("should provide form context to children", () => {
      const TestForm = () => {
        const form = useForm<TestFormData>({
          defaultValues: { username: "testuser" },
        });

        return (
          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input data-testid="username-input" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        );
      };

      render(<TestForm />);

      const input = screen.getByTestId("username-input");
      expect(input).toHaveValue("testuser");
    });
  });

  describe("FormField", () => {
    it("should render form field with controller", () => {
      const TestForm = () => {
        const form = useForm<TestFormData>({
          defaultValues: { username: "" },
        });

        return (
          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>

                    <FormControl>
                      <Input data-testid="username-input" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        );
      };

      render(<TestForm />);

      const input = screen.getByTestId("username-input");

      expect(input).toBeInTheDocument();
      expect(screen.getByText("Username")).toBeInTheDocument();
    });

    it("should handle field value changes", () => {
      const TestForm = () => {
        const form = useForm<TestFormData>({
          defaultValues: { username: "" },
        });

        return (
          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input data-testid="username-input" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        );
      };

      render(<TestForm />);

      const input = screen.getByTestId("username-input");
      fireEvent.change(input, { target: { value: "newuser" } });

      expect(input).toHaveValue("newuser");
    });

    it("should provide field context to children", () => {
      const FieldTester = () => {
        const field = useFormField();

        return <div data-testid="field-name">{field.name}</div>;
      };

      const TestForm = () => {
        const form = useForm<TestFormData>({
          defaultValues: { username: "" },
        });

        return (
          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name="username"
                render={() => (
                  <FormItem>
                    <FieldTester />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        );
      };

      render(<TestForm />);

      const fieldName = screen.getByTestId("field-name");
      expect(fieldName).toHaveTextContent("username");
    });
  });

  describe("FormItem", () => {
    it("should render form item with correct structure", () => {
      const TestForm = () => {
        const form = useForm<TestFormData>();

        return (
          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name="username"
                render={() => (
                  <FormItem data-testid="form-item">
                    <FormLabel>Username</FormLabel>

                    <FormControl>
                      <Input />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        );
      };

      render(<TestForm />);

      const formItem = screen.getByTestId("form-item");
      expect(formItem).toHaveClass("space-y-2");
    });

    it("should render with custom className", () => {
      const TestForm = () => {
        const form = useForm<TestFormData>();

        return (
          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name="username"
                render={() => (
                  <FormItem className="custom-item" data-testid="form-item">
                    <FormLabel>Username</FormLabel>

                    <FormControl>
                      <Input />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        );
      };

      render(<TestForm />);

      const formItem = screen.getByTestId("form-item");
      expect(formItem).toHaveClass("custom-item", "space-y-2");
    });

    it("should provide unique id context", () => {
      const IdTester = () => {
        const field = useFormField();

        return <div data-testid="form-item-id">{field.formItemId}</div>;
      };

      const TestForm = () => {
        const form = useForm<TestFormData>();

        return (
          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name="username"
                render={() => (
                  <FormItem>
                    <IdTester />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        );
      };

      render(<TestForm />);

      const formItemId = screen.getByTestId("form-item-id");
      expect(formItemId.textContent).toMatch(/-form-item$/);
    });
  });

  describe("FormLabel", () => {
    it("should render label with correct attributes", () => {
      const TestForm = () => {
        const form = useForm<TestFormData>();

        return (
          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name="username"
                render={() => (
                  <FormItem>
                    <FormLabel data-testid="form-label">Username</FormLabel>

                    <FormControl>
                      <Input data-testid="username-input" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        );
      };

      render(<TestForm />);

      const label = screen.getByTestId("form-label");
      const input = screen.getByTestId("username-input");

      expect(label).toBeInTheDocument();
      expect(label).toHaveTextContent("Username");
      expect(label).toHaveAttribute("for", input.id);
    });

    it("should show error state styling", async () => {
      const TestForm = () => {
        const form = useForm<TestFormData>({
          resolver: zodResolver(testSchema),
          mode: "onChange",
          defaultValues: { username: "" },
        });

        return (
          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel data-testid="form-label">Username</FormLabel>

                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        );
      };

      render(<TestForm />);

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "ab" } });
      fireEvent.blur(input);

      await waitFor(() => {
        const label = screen.getByTestId("form-label");
        expect(label).toHaveClass("text-destructive");
      });
    });

    it("should render with custom className", () => {
      const TestForm = () => {
        const form = useForm<TestFormData>();

        return (
          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name="username"
                render={() => (
                  <FormItem>
                    <FormLabel
                      className="custom-label"
                      data-testid="form-label"
                    >
                      Username
                    </FormLabel>

                    <FormControl>
                      <Input />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        );
      };

      render(<TestForm />);

      const label = screen.getByTestId("form-label");
      expect(label).toHaveClass("custom-label");
    });
  });

  describe("FormControl", () => {
    it("should render control with correct attributes", () => {
      const TestForm = () => {
        const form = useForm<TestFormData>();

        return (
          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name="username"
                render={() => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>

                    <FormControl>
                      <Input data-testid="control-input" />
                    </FormControl>

                    <FormDescription>Enter your username</FormDescription>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        );
      };

      render(<TestForm />);

      const input = screen.getByTestId("control-input");

      expect(input).toHaveAttribute("aria-describedby");
      expect(input).toHaveAttribute("aria-invalid", "false");
      expect(input).toHaveAttribute("id");
    });

    it("should handle error state", async () => {
      const TestForm = () => {
        const form = useForm<TestFormData>({
          resolver: zodResolver(testSchema),
          mode: "onChange",
          defaultValues: { username: "" },
        });

        return (
          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>

                    <FormControl>
                      <Input data-testid="control-input" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        );
      };

      render(<TestForm />);

      const input = screen.getByTestId("control-input");
      fireEvent.change(input, { target: { value: "ab" } });
      fireEvent.blur(input);

      await waitFor(() => {
        expect(input).toHaveAttribute("aria-invalid", "true");
      });
    });

    it("should work with different input types", () => {
      const TestForm = () => {
        const form = useForm<TestFormData>();

        return (
          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name="username"
                render={() => (
                  <FormItem>
                    <FormControl>
                      <textarea data-testid="textarea-control" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        );
      };

      render(<TestForm />);

      const textarea = screen.getByTestId("textarea-control");

      expect(textarea).toHaveAttribute("aria-describedby");
      expect(textarea).toHaveAttribute("id");
    });
  });

  describe("FormDescription", () => {
    it("should render description with correct attributes", () => {
      const TestForm = () => {
        const form = useForm<TestFormData>();

        return (
          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name="username"
                render={() => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>

                    <FormControl>
                      <Input />
                    </FormControl>

                    <FormDescription data-testid="form-description">
                      Enter your unique username
                    </FormDescription>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        );
      };

      render(<TestForm />);

      const description = screen.getByTestId("form-description");

      expect(description).toHaveTextContent("Enter your unique username");
      expect(description).toHaveClass("text-sm", "text-muted-foreground");
      expect(description).toHaveAttribute("id");
    });

    it("should render with custom className", () => {
      const TestForm = () => {
        const form = useForm<TestFormData>();

        return (
          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name="username"
                render={() => (
                  <FormItem>
                    <FormDescription
                      className="custom-description"
                      data-testid="form-description"
                    >
                      Custom description
                    </FormDescription>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        );
      };

      render(<TestForm />);

      const description = screen.getByTestId("form-description");
      expect(description).toHaveClass("custom-description");
    });

    it("should be linked to form control via aria-describedby", () => {
      const TestForm = () => {
        const form = useForm<TestFormData>();

        return (
          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name="username"
                render={() => (
                  <FormItem>
                    <FormControl>
                      <Input data-testid="control-input" />
                    </FormControl>

                    <FormDescription data-testid="form-description">
                      Help text
                    </FormDescription>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        );
      };

      render(<TestForm />);

      const input = screen.getByTestId("control-input");
      const description = screen.getByTestId("form-description");

      expect(input.getAttribute("aria-describedby")).toContain(
        description.getAttribute("id")
      );
    });
  });

  describe("FormMessage", () => {
    it("should render error message", async () => {
      const TestForm = () => {
        const form = useForm<TestFormData>({
          resolver: zodResolver(testSchema),
          mode: "onChange",
          defaultValues: { username: "" },
        });

        return (
          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>

                    <FormMessage data-testid="form-message" />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        );
      };

      render(<TestForm />);

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "ab" } });
      fireEvent.blur(input);

      await waitFor(() => {
        const message = screen.getByTestId("form-message");

        expect(message).toHaveTextContent(
          "Username must be at least 3 characters"
        );
        expect(message).toHaveClass(
          "text-sm",
          "font-medium",
          "text-destructive"
        );
      });
    });

    it("should render custom message", () => {
      const TestForm = () => {
        const form = useForm<TestFormData>();

        return (
          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name="username"
                render={() => (
                  <FormItem>
                    <FormMessage data-testid="form-message">
                      Custom message
                    </FormMessage>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        );
      };

      render(<TestForm />);

      const message = screen.getByTestId("form-message");
      expect(message).toHaveTextContent("Custom message");
    });

    it("should not render when no error or message", () => {
      const TestForm = () => {
        const form = useForm<TestFormData>();

        return (
          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name="username"
                render={() => (
                  <FormItem>
                    <FormMessage data-testid="form-message" />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        );
      };

      render(<TestForm />);

      const message = screen.queryByTestId("form-message");
      expect(message).not.toBeInTheDocument();
    });

    it("should render with custom className", () => {
      const TestForm = () => {
        const form = useForm<TestFormData>();

        return (
          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name="username"
                render={() => (
                  <FormItem>
                    <FormMessage
                      className="custom-message"
                      data-testid="form-message"
                    >
                      Custom styled message
                    </FormMessage>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        );
      };

      render(<TestForm />);

      const message = screen.getByTestId("form-message");
      expect(message).toHaveClass("custom-message");
    });

    it("should be linked to form control via aria-describedby", async () => {
      const TestForm = () => {
        const form = useForm<TestFormData>({
          resolver: zodResolver(testSchema),
          mode: "onChange",
          defaultValues: { username: "" },
        });

        return (
          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input data-testid="control-input" {...field} />
                    </FormControl>

                    <FormMessage data-testid="form-message" />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        );
      };

      render(<TestForm />);

      const input = screen.getByTestId("control-input");
      fireEvent.change(input, { target: { value: "ab" } });
      fireEvent.blur(input);

      await waitFor(() => {
        const message = screen.getByTestId("form-message");

        expect(input.getAttribute("aria-describedby")).toContain(
          message.getAttribute("id")
        );
      });
    });
  });

  describe("useFormField Hook", () => {
    it("should throw error when used outside FormField", () => {
      const TestComponent = () => {
        try {
          useFormField();

          return <div>Should not render</div>;
        } catch (error) {
          return (
            <div data-testid="error-message">{(error as Error).message}</div>
          );
        }
      };

      render(<TestComponent />);

      const errorMessage = screen.getByTestId("error-message");

      expect(errorMessage.textContent).toContain(
        "Cannot destructure property 'getFieldState'"
      );
    });

    it("should provide correct field information", () => {
      const FieldInfo = () => {
        const field = useFormField();

        return (
          <div>
            <div data-testid="field-name">{field.name}</div>

            <div data-testid="field-id">{field.id}</div>

            <div data-testid="form-item-id">{field.formItemId}</div>

            <div data-testid="form-description-id">
              {field.formDescriptionId}
            </div>

            <div data-testid="form-message-id">{field.formMessageId}</div>
          </div>
        );
      };

      const TestForm = () => {
        const form = useForm<TestFormData>();

        return (
          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name="username"
                render={() => (
                  <FormItem>
                    <FieldInfo />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        );
      };

      render(<TestForm />);

      expect(screen.getByTestId("field-name")).toHaveTextContent("username");
      expect(screen.getByTestId("field-id").textContent).toBeTruthy();
      expect(screen.getByTestId("form-item-id").textContent).toMatch(
        /-form-item$/
      );
      expect(screen.getByTestId("form-description-id").textContent).toMatch(
        /-form-item-description$/
      );
      expect(screen.getByTestId("form-message-id").textContent).toMatch(
        /-form-item-message$/
      );
    });
  });

  describe("Complete Form Integration", () => {
    it("should handle form submission", async () => {
      const onSubmit = jest.fn();
      const onError = jest.fn();

      const TestForm = () => {
        const form = useForm<SimpleTestFormData>({
          resolver: zodResolver(simpleTestSchema),
          mode: "onChange",
          defaultValues: {
            username: "",
            email: "",
          },
        });

        const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();

          const isValid = await form.trigger();

          if (isValid) {
            const data = form.getValues();

            onSubmit(data);
          } else {
            onError(form.formState.errors);
          }
        };

        return (
          <Form {...form}>
            <form onSubmit={handleSubmit} data-testid="complete-form">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>

                    <FormControl>
                      <Input {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>

                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Submit</Button>
            </form>
          </Form>
        );
      };

      render(<TestForm />);

      const usernameInput = screen.getByLabelText("Username");
      const emailInput = screen.getByLabelText("Email");

      fireEvent.change(usernameInput, {
        target: { value: "testuser" },
      });
      fireEvent.change(emailInput, {
        target: { value: "test@example.com" },
      });

      await waitFor(() => {
        expect(usernameInput).toHaveValue("testuser");
        expect(emailInput).toHaveValue("test@example.com");
      });

      fireEvent.click(screen.getByText("Submit"));

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith({
          username: "testuser",
          email: "test@example.com",
        });
      });

      expect(onError).not.toHaveBeenCalled();
    });

    it("should show validation errors", async () => {
      const onSubmit = jest.fn();

      const TestForm = () => {
        const form = useForm<SimpleTestFormData>({
          resolver: zodResolver(simpleTestSchema),
          mode: "onSubmit",
          defaultValues: {
            username: "",
            email: "",
          },
        });

        return (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>

                    <FormControl>
                      <Input {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>

                    <FormControl>
                      <Input {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Submit</Button>
            </form>
          </Form>
        );
      };

      render(<TestForm />);

      fireEvent.click(screen.getByText("Submit"));

      await waitFor(() => {
        expect(
          screen.getByText("Username must be at least 3 characters")
        ).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText("Invalid email address")).toBeInTheDocument();
      });

      expect(onSubmit).not.toHaveBeenCalled();
    });

    it("should handle complex form with all components", () => {
      const TestForm = () => {
        const form = useForm<SimpleTestFormData>({
          resolver: zodResolver(simpleTestSchema),
          defaultValues: {
            username: "",
            email: "",
          },
        });

        return (
          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>

                    <FormControl>
                      <Input placeholder="Enter username" {...field} />
                    </FormControl>

                    <FormDescription>
                      Choose a unique username (minimum 3 characters)
                    </FormDescription>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>

                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter email"
                        {...field}
                      />
                    </FormControl>

                    <FormDescription>
                      We&apos;ll use this to contact you
                    </FormDescription>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Create Account</Button>
            </form>
          </Form>
        );
      };

      render(<TestForm />);

      expect(screen.getByText("Username")).toBeInTheDocument();
      expect(screen.getByText("Email")).toBeInTheDocument();
      expect(
        screen.getByText("Choose a unique username (minimum 3 characters)")
      ).toBeInTheDocument();
      expect(
        screen.getByText("We'll use this to contact you")
      ).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Enter username")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Enter email")).toBeInTheDocument();
      expect(screen.getByText("Create Account")).toBeInTheDocument();
    });
  });

  describe("Error Handling", () => {
    it("should handle missing form context gracefully", () => {
      const originalError = console.error;

      console.error = jest.fn();

      const TestComponent = () => {
        return (
          <FormItem>
            <FormLabel>Test Label</FormLabel>
          </FormItem>
        );
      };

      expect(() => render(<TestComponent />)).toThrow();

      console.error = originalError;
    });

    it("should handle invalid field names gracefully", () => {
      const TestForm = () => {
        const form = useForm();

        return (
          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name="nonexistent"
                render={() => (
                  <FormItem>
                    <FormLabel>Nonexistent Field</FormLabel>

                    <FormControl>
                      <Input />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        );
      };

      render(<TestForm />);

      expect(screen.getByText("Nonexistent Field")).toBeInTheDocument();
    });
  });
});
