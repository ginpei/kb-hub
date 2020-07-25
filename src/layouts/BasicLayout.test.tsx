import { render } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { BasicLayout } from "./BasicLayout";

describe("<BasicLayout>", () => {
  describe("document title", () => {
    it("sets app name as default title", () => {
      render(
        <BrowserRouter>
          <BasicLayout />
        </BrowserRouter>
      );
      expect(document.title).toBe("Knowledge Base Hub");
    });

    it("sets given title besides app name", () => {
      render(
        <BrowserRouter>
          <BasicLayout title="Hello" />
        </BrowserRouter>
      );
      expect(document.title).toBe("Hello - Knowledge Base Hub");
    });
  });

  describe("children", () => {
    it("sets given children under main area", () => {
      const { getByText } = render(
        <BrowserRouter>
          <BasicLayout>
            <h1>Hello World!</h1>
          </BasicLayout>
        </BrowserRouter>
      );

      const h1 = getByText("Hello World!");
      expect(h1).toBeInTheDOM();
    });
  });
});
