import React from "react";
import "../../../i18n-tests";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import "jest-extended";
import "expect-more-jest";
import Duration from "../Duration";

it("shows negative durations as 00:00", () => {
    const { getByText } = render(<Duration duration={-1234.0} />);
    getByText("00:00");
});

it("works with 0 seconds", () => {
    const { getByText } = render(<Duration duration={0.0} />);
    getByText("00:00");
});

it("works with 1 second", () => {
    const { getByText } = render(<Duration duration={1.0} />);
    getByText("00:00");
});

it("works with 29 seconds", () => {
    const { getByText } = render(<Duration duration={29.0} />);
    getByText("00:00");
});

it("works with 30 seconds", () => {
    const { getByText } = render(<Duration duration={30.0} />);
    getByText("00:01");
});

it("works with 59 seconds", () => {
    const { getByText } = render(<Duration duration={59.0} />);
    getByText("00:01");
});

it("works with 1 minute", () => {
    const { getByText } = render(<Duration duration={60.0} />);
    getByText("00:01");
});

it("works with 1 minute and 1 second", () => {
    const { getByText } = render(<Duration duration={61.0} />);
    getByText("00:01");
});

it("works with 59 minutes", () => {
    const { getByText } = render(<Duration duration={59.0 * 60.0} />);
    getByText("00:59");
});

it("works with 1 hour", () => {
    const { getByText } = render(<Duration duration={3600.0} />);
    getByText("01:00");
});

it("works with 1 hour and 1 minute", () => {
    const { getByText } = render(<Duration duration={3660.0} />);
    getByText("01:01");
});

it("works with 12 hours", () => {
    const { getByText } = render(<Duration duration={12.0 * 3600.0} />);
    getByText("12:00");
});

it("works with 24 hours", () => {
    const { getByText } = render(<Duration duration={24.0 * 3600.0} />);
    getByText("24:00");
});

it("works with 24 hours", () => {
    const { getByText } = render(<Duration duration={24.0 * 3600.0} />);
    getByText("24:00");
});

it("works with 48 hours", () => {
    const { getByText } = render(<Duration duration={48.0 * 3600.0} />);
    getByText("48:00");
});

it("works with 250 hours", () => {
    const { getByText } = render(<Duration duration={250.0 * 3600.0} />);
    getByText("250:00");
});
