import { render } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ErrorScreen } from "./ErrorScreen";

describe("<ErrorScreen>", () => {
  beforeEach(() => {
    // hide console log
    global.console.error = jest.fn();
  });

  beforeEach(() => {
    (global.console.error as jest.Mock).mockRestore();
  });

  describe("error", () => {
    it("outputs given error in console", () => {
      const error = new Error("Hello Error!");
      render(
        <BrowserRouter>
          <ErrorScreen error={error} />
        </BrowserRouter>
      );

      expect(global.console.error).toBeCalledWith(error);
    });

    it("shows message if Error instance", () => {
      const { getByText } = render(
        <BrowserRouter>
          <ErrorScreen error={new Error("Hello Error!")} />
        </BrowserRouter>
      );

      expect(getByText("Hello Error!")).toBeInTheDocument();
    });

    it("shows message if string", () => {
      const { getByText } = render(
        <BrowserRouter>
          <ErrorScreen error={"Hello Error!"} />
        </BrowserRouter>
      );

      expect(getByText("Hello Error!")).toBeInTheDocument();
    });

    it("shows message if the object has message prop", () => {
      const { getByText } = render(
        <BrowserRouter>
          <ErrorScreen error={{ message: "Hello Error!" }} />
        </BrowserRouter>
      );

      expect(getByText("Hello Error!")).toBeInTheDocument();
    });

    it("shows unknown if so", () => {
      const { getByText } = render(
        <BrowserRouter>
          <ErrorScreen error={1} />
        </BrowserRouter>
      );

      expect(getByText("Unknown error")).toBeInTheDocument();
    });
  });
});
