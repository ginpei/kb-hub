import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { TriCheckbox } from "./TriCheckbox";

describe("<TriCheckbox>", () => {
  it("shows a symbol for true", () => {
    render(<TriCheckbox checked={true} label="Checkbox" />);
    const el = screen.getByText("Checkbox");
    expect(getCheckboxSymbolText(el)).toBe("✔");
  });

  it("shows a symbol for null", () => {
    render(<TriCheckbox checked={null} label="Checkbox" />);
    const el = screen.getByText("Checkbox");
    expect(getCheckboxSymbolText(el)).toBe("―");
  });

  it("shows a symbol for false", () => {
    render(<TriCheckbox checked={false} label="Checkbox" />);
    const el = screen.getByText("Checkbox");
    expect(getCheckboxSymbolText(el)).toBe("");
  });

  it("turns false if true", () => {
    const callback = jest.fn();
    render(<TriCheckbox checked={true} onChange={callback} />);
    fireEvent.click(screen.getByRole("checkbox"));
    expect(callback.mock.calls[0][1]).toBe(false);
  });

  it("turns false if null", () => {
    const callback = jest.fn();
    render(<TriCheckbox checked={null} onChange={callback} />);
    fireEvent.click(screen.getByRole("checkbox"));
    expect(callback.mock.calls[0][1]).toBe(false);
  });

  it("turns true if false", () => {
    const callback = jest.fn();
    render(<TriCheckbox checked={false} onChange={callback} />);
    fireEvent.click(screen.getByRole("checkbox"));
    expect(callback.mock.calls[0][1]).toBe(true);
  });
});

function getCheckboxSymbolText(el: HTMLElement): string | null {
  const elSymbol = el.firstElementChild?.children[1];
  if (!elSymbol) {
    throw new Error("Failed to get checkbox symbol element");
  }

  return elSymbol.textContent;
}
