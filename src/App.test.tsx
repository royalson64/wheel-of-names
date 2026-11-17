import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

test("allows adding more than 30 names", () => {
  render(<App />);

  const addButton = screen.getByRole("button", { name: /add more names/i });
  for (let i = 0; i < 11; i += 1) {
    userEvent.click(addButton);
  }

  expect(screen.getAllByPlaceholderText("Enter name")).toHaveLength(32);
});

test("allows up to 20 selections per name", () => {
  render(<App />);

  const countInput = screen.getAllByPlaceholderText("#")[0];
  const increaseButton = screen.getAllByRole("button", {
    name: /increase count/i,
  })[0];

  for (let i = 0; i < 19; i += 1) {
    userEvent.click(increaseButton);
  }

  expect(countInput).toHaveValue("20");
  expect(increaseButton).toBeDisabled();
});

test("fills names and counts from a CSV upload", async () => {
  render(<App />);

  const file = new File(["name,count\nAlice,5\nBob,12\n"], "names.csv", {
    type: "text/csv",
  });
  const input = screen.getByLabelText(/upload csv of names and counts/i);

  userEvent.upload(input, file);

  await waitFor(() => {
    const nameInputs = screen.getAllByPlaceholderText("Enter name");
    expect(nameInputs).toHaveLength(2);
    expect(nameInputs[0]).toHaveValue("Alice");
    expect(nameInputs[1]).toHaveValue("Bob");
    expect(screen.getAllByPlaceholderText("#")[0]).toHaveValue("5");
    expect(screen.getAllByPlaceholderText("#")[1]).toHaveValue("12");
  });
});
