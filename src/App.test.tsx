import { fireEvent, render, screen } from "@testing-library/react";
import App from "./App";
import { setupIntersectionObserverMock } from "./MockedInterceptor";

describe("IntersectionObserver", () => {
  setupIntersectionObserverMock();
  window.HTMLElement.prototype.scrollIntoView = jest.fn();

  it("should first sidebar element be selected by default", () => {
    render(<App />);
    const circles = screen.getAllByTestId("circle");
    const dataSelectedAttr = circles[0].getAttribute("data-selected");
    expect(dataSelectedAttr).toBeTruthy();
  });
  it("should second element be selected on click", () => {
    const idx = 1;
    render(<App />);
    const circles = screen.getAllByTestId("circle");
    fireEvent.click(circles[idx]);
    const dataSelectedAttr = circles[idx].getAttribute("data-selected");
    expect(dataSelectedAttr).toBeTruthy();
  });
});
