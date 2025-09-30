import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";

import { AlertModal } from "@/components/shared/alert-modal/alert-modal";

jest.mock("../../../../components/shared/modal/modal", () => ({
  Modal: ({
    children,
    description,
    isOpen,
    title,
    onClose,
  }: {
    children: React.ReactNode;
    description: string;
    isOpen: boolean;
    title: string;
    onClose: () => void;
  }) =>
    isOpen ? (
      <div data-testid="modal">
        <h2>{title}</h2>

        <p>{description}</p>

        <button onClick={onClose} data-testid="modal-close">
          Close Modal
        </button>

        {children}
      </div>
    ) : null,
}));

describe("AlertModal", () => {
  const defaultProps = {
    isOpen: true,
    loading: false,
    onClose: jest.fn(),
    onConfirm: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render correctly when isOpen is true", () => {
    render(<AlertModal {...defaultProps} />);

    expect(screen.getByText("¿Estás seguro?")).toBeInTheDocument();
    expect(
      screen.getByText("Esta acción no se podrá revertir.")
    ).toBeInTheDocument();
    expect(screen.getByText("Cancelar")).toBeInTheDocument();
    expect(screen.getByText("Continuar")).toBeInTheDocument();
  });

  it("should not render when isOpen is false", () => {
    render(<AlertModal {...defaultProps} isOpen={false} />);

    expect(screen.queryByText("¿Estás seguro?")).not.toBeInTheDocument();
  });

  it("should call onClose when Cancel button is clicked", () => {
    const mockOnClose = jest.fn();

    render(<AlertModal {...defaultProps} onClose={mockOnClose} />);

    const cancelButton = screen.getByText("Cancelar");
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("should call onConfirm when Continue button is clicked", () => {
    const mockOnConfirm = jest.fn();
    render(<AlertModal {...defaultProps} onConfirm={mockOnConfirm} />);

    const continueButton = screen.getByText("Continuar");
    fireEvent.click(continueButton);

    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it("should disable buttons when loading is true", () => {
    render(<AlertModal {...defaultProps} loading={true} />);

    const cancelButton = screen.getByText("Cancelar");
    const continueButton = screen.getByText("Continuar");

    expect(cancelButton).toBeDisabled();
    expect(continueButton).toBeDisabled();
  });

  it("should enable buttons when loading is false", () => {
    render(<AlertModal {...defaultProps} loading={false} />);

    const cancelButton = screen.getByText("Cancelar");
    const continueButton = screen.getByText("Continuar");

    expect(cancelButton).not.toBeDisabled();
    expect(continueButton).not.toBeDisabled();
  });

  it("should have correct button variants", () => {
    render(<AlertModal {...defaultProps} />);

    const cancelButton = screen.getByText("Cancelar");
    const continueButton = screen.getByText("Continuar");

    expect(cancelButton).toBeInTheDocument();
    expect(continueButton).toBeInTheDocument();
    expect(cancelButton.tagName).toBe("BUTTON");
    expect(continueButton.tagName).toBe("BUTTON");
  });

  it("should render after component is mounted", async () => {
    render(<AlertModal {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByTestId("modal")).toBeInTheDocument();
    });
  });

  it("should handle multiple clicks on buttons correctly", () => {
    const mockOnClose = jest.fn();
    const mockOnConfirm = jest.fn();

    render(
      <AlertModal
        {...defaultProps}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    const cancelButton = screen.getByText("Cancelar");
    const continueButton = screen.getByText("Continuar");

    fireEvent.click(cancelButton);
    fireEvent.click(cancelButton);
    fireEvent.click(continueButton);

    expect(mockOnClose).toHaveBeenCalledTimes(2);
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it("should not call functions when buttons are disabled", () => {
    const mockOnClose = jest.fn();
    const mockOnConfirm = jest.fn();

    render(
      <AlertModal
        {...defaultProps}
        loading={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    const cancelButton = screen.getByText("Cancelar");
    const continueButton = screen.getByText("Continuar");

    fireEvent.click(cancelButton);
    fireEvent.click(continueButton);

    expect(mockOnClose).not.toHaveBeenCalled();
    expect(mockOnConfirm).not.toHaveBeenCalled();
  });

  it("should pass correct props to Modal component", () => {
    render(<AlertModal {...defaultProps} />);

    expect(screen.getByTestId("modal")).toBeInTheDocument();
    expect(screen.getByText("¿Estás seguro?")).toBeInTheDocument();
    expect(
      screen.getByText("Esta acción no se podrá revertir.")
    ).toBeInTheDocument();
  });

  it("should have proper accessibility attributes", () => {
    render(<AlertModal {...defaultProps} />);

    const cancelButton = screen.getByText("Cancelar");
    const continueButton = screen.getByText("Continuar");

    expect(cancelButton).toBeInTheDocument();
    expect(continueButton).toBeInTheDocument();

    expect(cancelButton.tagName).toBe("BUTTON");
    expect(continueButton.tagName).toBe("BUTTON");

    cancelButton.focus();
    expect(document.activeElement).toBe(cancelButton);

    continueButton.focus();
    expect(document.activeElement).toBe(continueButton);
  });
});
