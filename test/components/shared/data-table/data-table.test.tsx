import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import type { CellContext } from "@tanstack/react-table";

import { DataTable } from "../../../../components/shared/data-table/data-table";

jest.mock("../../../../components/ui/button", () => ({
  Button: ({
    children,
    ...props
  }: React.PropsWithChildren<Record<string, unknown>>) => (
    <button {...props}>{children}</button>
  ),
}));

jest.mock("../../../../components/ui/input", () => ({
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} />
  ),
}));

jest.mock("../../../../components/ui/table", () => ({
  Table: ({ children }: React.PropsWithChildren<object>) => (
    <table>{children}</table>
  ),
  TableHeader: ({ children }: React.PropsWithChildren<object>) => (
    <thead>{children}</thead>
  ),
  TableBody: ({ children }: React.PropsWithChildren<object>) => (
    <tbody>{children}</tbody>
  ),
  TableCell: ({
    children,
    ...props
  }: React.PropsWithChildren<Record<string, unknown>>) => (
    <td {...props}>{children}</td>
  ),
  TableHead: ({ children }: React.PropsWithChildren<object>) => (
    <th>{children}</th>
  ),
  TableRow: ({
    children,
    ...props
  }: React.PropsWithChildren<Record<string, unknown>>) => (
    <tr {...props}>{children}</tr>
  ),
}));

const mockSetFilterValue = jest.fn();
const mockGetFilterValue = jest.fn();
const mockPreviousPage = jest.fn();
const mockNextPage = jest.fn();
const mockGetCanPreviousPage = jest.fn(() => true);
const mockGetCanNextPage = jest.fn(() => true);
const mockGetHeaderGroups = jest.fn();
const mockGetRowModel = jest.fn();
const mockGetColumn = jest.fn();
const mockGetIsSelected = jest.fn(() => false);

jest.mock("@tanstack/react-table", () => {
  const actual = jest.requireActual("@tanstack/react-table");
  return {
    ...actual,
    useReactTable: jest.fn(() => ({
      getHeaderGroups: mockGetHeaderGroups,
      getRowModel: mockGetRowModel,
      getColumn: mockGetColumn,
      previousPage: mockPreviousPage,
      nextPage: mockNextPage,
      getCanPreviousPage: mockGetCanPreviousPage,
      getCanNextPage: mockGetCanNextPage,
    })),
    flexRender: (component: unknown, ctx: unknown) =>
      typeof component === "function"
        ? (component as (ctx: unknown) => React.ReactNode)(ctx)
        : component,
  };
});

const columns = [
  {
    accessorKey: "name",
    header: () => "Nombre",
    cell: (info: CellContext<{ name: string; age: number }, unknown>) =>
      info.getValue(),
  },
  {
    accessorKey: "age",
    header: () => "Edad",
    cell: (info: CellContext<{ name: string; age: number }, unknown>) =>
      info.getValue(),
  },
];

const data = [
  { name: "Juan", age: 30 },
  { name: "Ana", age: 25 },
];

describe("DataTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockGetHeaderGroups.mockReturnValue([
      {
        id: "headerGroup1",
        headers: [
          {
            id: "name",
            isPlaceholder: false,
            column: { columnDef: columns[0] },
            getContext: () => ({ getValue: () => "Juan" }),
          },
          {
            id: "age",
            isPlaceholder: false,
            column: { columnDef: columns[1] },
            getContext: () => ({ getValue: () => 30 }),
          },
        ],
      },
    ]);

    mockGetRowModel.mockReturnValue({
      rows: [
        {
          id: "row1",
          getIsSelected: mockGetIsSelected,
          getVisibleCells: () => [
            {
              id: "cell1",
              column: { columnDef: columns[0] },
              getContext: () => ({ getValue: () => "Juan" }),
            },
            {
              id: "cell2",
              column: { columnDef: columns[1] },
              getContext: () => ({ getValue: () => 30 }),
            },
          ],
        },
      ],
    });

    mockGetColumn.mockReturnValue({
      setFilterValue: mockSetFilterValue,
      getFilterValue: mockGetFilterValue,
    });

    mockGetFilterValue.mockReturnValue("");
  });

  it("renders table with data", () => {
    render(<DataTable columns={columns} data={data} searchKey="name" />);
    expect(screen.getByPlaceholderText("Buscar")).toBeInTheDocument();

    expect(screen.getByText("Nombre")).toBeInTheDocument();
    expect(screen.getByText("Edad")).toBeInTheDocument();
    expect(screen.getByText("Juan")).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();
  });

  it("shows 'No se encontraron resultados.' when no rows", () => {
    mockGetRowModel.mockReturnValue({ rows: [] });
    render(<DataTable columns={columns} data={[]} searchKey="name" />);

    expect(
      screen.getByText("No se encontraron resultados.")
    ).toBeInTheDocument();
  });

  it("filters data when typing in input", () => {
    render(<DataTable columns={columns} data={data} searchKey="name" />);

    const input = screen.getByPlaceholderText("Buscar");

    fireEvent.change(input, { target: { value: "Ana" } });

    expect(mockSetFilterValue).toHaveBeenCalledWith("Ana");
  });

  it("shows input value from filter", () => {
    mockGetFilterValue.mockReturnValue("Ana");
    render(<DataTable columns={columns} data={data} searchKey="name" />);

    const input = screen.getByPlaceholderText("Buscar");
    expect(input).toHaveValue("Ana");
  });

  it("disables previous button when getCanPreviousPage is false", () => {
    mockGetCanPreviousPage.mockReturnValue(false);
    render(<DataTable columns={columns} data={data} searchKey="name" />);

    const prevBtn = screen.getByText("Atrás");
    expect(prevBtn).toBeDisabled();
  });

  it("disables next button when getCanNextPage is false", () => {
    mockGetCanNextPage.mockReturnValue(false);
    render(<DataTable columns={columns} data={data} searchKey="name" />);

    const nextBtn = screen.getByText("Siguiente");
    expect(nextBtn).toBeDisabled();
  });

  it("calls previousPage when Atrás is clicked", () => {
    mockGetCanPreviousPage.mockReturnValue(true);
    render(<DataTable columns={columns} data={data} searchKey="name" />);

    const prevBtn = screen.getByText("Atrás");
    expect(prevBtn).not.toBeDisabled();

    fireEvent.click(prevBtn);
    expect(mockPreviousPage).toHaveBeenCalled();
  });

  it("calls nextPage when Siguiente is clicked", () => {
    mockGetCanNextPage.mockReturnValue(true);
    render(<DataTable columns={columns} data={data} searchKey="name" />);

    const nextBtn = screen.getByText("Siguiente");
    expect(nextBtn).not.toBeDisabled();

    fireEvent.click(nextBtn);
    expect(mockNextPage).toHaveBeenCalled();
  });

  it("renders correctly with empty columns", () => {
    mockGetRowModel.mockReturnValue({ rows: [] });
    render(<DataTable columns={[]} data={data} searchKey="name" />);

    expect(screen.getByPlaceholderText("Buscar")).toBeInTheDocument();
    expect(
      screen.getByText("No se encontraron resultados.")
    ).toBeInTheDocument();
  });

  it("renders correctly with empty data and columns", () => {
    mockGetRowModel.mockReturnValue({ rows: [] });
    render(<DataTable columns={[]} data={[]} searchKey="name" />);

    expect(screen.getByPlaceholderText("Buscar")).toBeInTheDocument();
    expect(
      screen.getByText("No se encontraron resultados.")
    ).toBeInTheDocument();
  });

  it("handles filter input with undefined column", () => {
    mockGetColumn.mockReturnValue(undefined);
    render(<DataTable columns={columns} data={data} searchKey="notfound" />);

    const input = screen.getByPlaceholderText("Buscar");

    fireEvent.change(input, { target: { value: "test" } });

    expect(input).toBeInTheDocument();
  });
});
