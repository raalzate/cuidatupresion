import { render, screen } from "@testing-library/react";
import React from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";

jest.mock("../../../lib/utils", () => ({
  cn: (...classes: (string | undefined)[]) => classes.filter(Boolean).join(" "),
}));

describe("Table components", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Table", () => {
    it("renders a table inside a container", () => {
      render(
        <Table data-testid="table" className="custom-table">
          <TableHeader data-testid="table-header" />
        </Table>
      );

      const container = screen.getByTestId("table").parentElement;
      expect(container).toBeInTheDocument();

      const table = screen.getByTestId("table");
      expect(table).toBeInTheDocument();
  expect(table).toHaveClass("w-full caption-bottom text-base custom-table");
    });

    it("forwards props to table element", () => {
      render(
        <Table data-testid="main-table" id="main-table" aria-label="Test Table">
          <TableHeader data-testid="table-header" />
        </Table>
      );

      const table = screen.getByTestId("main-table");

      expect(table).toHaveAttribute("id", "main-table");
      expect(table).toHaveAttribute("aria-label", "Test Table");
    });
  });

  describe("TableHeader", () => {
    it("renders thead with correct class", () => {
      render(
        <table>
          <TableHeader data-testid="thead" className="custom-header">
            <TableRow />
          </TableHeader>
        </table>
      );

      const thead = screen.getByTestId("thead");

      expect(thead).toBeInTheDocument();
      expect(thead).toHaveClass("[&_tr]:border-b custom-header");
    });
  });

  describe("TableBody", () => {
    it("renders tbody with correct class", () => {
      render(
        <table>
          <TableBody data-testid="tbody" className="custom-body">
            <TableRow />
          </TableBody>
        </table>
      );

      const tbody = screen.getByTestId("tbody");

      expect(tbody).toBeInTheDocument();
      expect(tbody).toHaveClass("[&_tr:last-child]:border-0 custom-body");
    });
  });

  describe("TableFooter", () => {
    it("renders tfoot with correct class", () => {
      render(
        <table>
          <TableFooter data-testid="tfoot" className="custom-footer">
            <TableRow />
          </TableFooter>
        </table>
      );

      const tfoot = screen.getByTestId("tfoot");

      expect(tfoot).toBeInTheDocument();
      expect(tfoot).toHaveClass(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0 custom-footer"
      );
    });
  });

  describe("TableRow", () => {
    it("renders tr with correct class", () => {
      render(
        <table>
          <tbody>
            <TableRow data-testid="tr" className="custom-row">
              <TableCell />
            </TableRow>
          </tbody>
        </table>
      );

      const tr = screen.getByTestId("tr");

      expect(tr).toBeInTheDocument();
      expect(tr).toHaveClass(
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors custom-row"
      );
    });
  });

  describe("TableHead", () => {
    it("renders th with correct class", () => {
      render(
        <table>
          <thead>
            <TableRow>
              <TableHead data-testid="th" className="custom-head">
                Head
              </TableHead>
            </TableRow>
          </thead>
        </table>
      );

      const th = screen.getByTestId("th");

      expect(th).toBeInTheDocument();
      expect(th).toHaveClass(
        "text-foreground h-14 px-4 text-left align-middle text-lg font-bold whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] custom-head"
      );
      expect(th).toHaveTextContent("Head");
    });
  });

  describe("TableCell", () => {
    it("renders td with correct class", () => {
      render(
        <table>
          <tbody>
            <TableRow>
              <TableCell data-testid="td" className="custom-cell">
                Cell
              </TableCell>
            </TableRow>
          </tbody>
        </table>
      );

      const td = screen.getByTestId("td");

      expect(td).toBeInTheDocument();
      expect(td).toHaveClass(
        "px-4 py-3 align-middle text-base whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] custom-cell"
      );
      expect(td).toHaveTextContent("Cell");
    });
  });

  describe("TableCaption", () => {
    it("renders caption with correct class", () => {
      render(
        <table>
          <TableCaption data-testid="caption" className="custom-caption">
            Caption
          </TableCaption>
        </table>
      );

      const caption = screen.getByTestId("caption");

      expect(caption).toBeInTheDocument();
      expect(caption).toHaveClass(
        "text-muted-foreground mt-4 text-base custom-caption"
      );
      expect(caption).toHaveTextContent("Caption");
    });
  });

  describe("Integration", () => {
    it("renders a full table structure", () => {
      render(
        <Table data-testid="table">
          <TableCaption data-testid="caption">Test Caption</TableCaption>
          <TableHeader data-testid="header">
            <TableRow data-testid="row-header">
              <TableHead data-testid="head-1">Header 1</TableHead>

              <TableHead data-testid="head-2">Header 2</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody data-testid="body">
            <TableRow data-testid="row-body">
              <TableCell data-testid="cell-1">Cell 1</TableCell>

              <TableCell data-testid="cell-2">Cell 2</TableCell>
            </TableRow>
          </TableBody>

          <TableFooter data-testid="footer">
            <TableRow data-testid="row-footer">
              <TableCell data-testid="footer-1">Footer 1</TableCell>

              <TableCell data-testid="footer-2">Footer 2</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      );

      const container = screen.getByTestId("table").parentElement;

      expect(container).toBeInTheDocument();
      expect(screen.getByTestId("table")).toBeInTheDocument();
      expect(screen.getByTestId("caption")).toHaveTextContent("Test Caption");
      expect(screen.getByTestId("head-1")).toHaveTextContent("Header 1");
      expect(screen.getByTestId("head-2")).toHaveTextContent("Header 2");
      expect(screen.getByTestId("cell-1")).toHaveTextContent("Cell 1");
      expect(screen.getByTestId("cell-2")).toHaveTextContent("Cell 2");
      expect(screen.getByTestId("footer-1")).toHaveTextContent("Footer 1");
      expect(screen.getByTestId("footer-2")).toHaveTextContent("Footer 2");
      expect(screen.getByTestId("footer")).toBeInTheDocument();
    });
  });
});
