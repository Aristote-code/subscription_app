import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SubscriptionCard from "../src/components/SubscriptionCard";

// Mock data for testing
const mockSubscription = {
  id: "test-id",
  name: "Netflix",
  trialStartDate: new Date("2023-03-01"),
  trialEndDate: new Date("2023-03-30"),
  cost: 15.99,
  billingCycle: "monthly",
  status: "active",
};

// Mock functions
const mockOnEdit = vi.fn();
const mockOnDelete = vi.fn();

describe("SubscriptionCard", () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockOnEdit.mockReset();
    mockOnDelete.mockReset();

    // Mock window.confirm to always return true
    vi.spyOn(window, "confirm").mockImplementation(() => true);
  });

  it("renders subscription name correctly", () => {
    render(
      <SubscriptionCard
        subscription={mockSubscription}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText("Netflix")).toBeInTheDocument();
  });

  it("shows trial end date", () => {
    render(
      <SubscriptionCard
        subscription={mockSubscription}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText(/Trial ends:/)).toBeInTheDocument();
  });

  it("expands when clicked", () => {
    render(
      <SubscriptionCard
        subscription={mockSubscription}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // Initially, cost details should not be visible
    expect(screen.queryByText("$15.99/monthly")).not.toBeInTheDocument();

    // Click to expand
    fireEvent.click(screen.getByText("Netflix"));

    // Now cost details should be visible
    expect(screen.getByText("$15.99/monthly")).toBeInTheDocument();
  });

  it("calls onEdit when edit button is clicked", () => {
    render(
      <SubscriptionCard
        subscription={mockSubscription}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // First expand the card
    fireEvent.click(screen.getByText("Netflix"));

    // Click edit button
    fireEvent.click(screen.getByText("Edit"));

    // Check if onEdit was called with the correct ID
    expect(mockOnEdit).toHaveBeenCalledWith("test-id");
  });

  it("calls onDelete when delete button is clicked and confirmed", () => {
    render(
      <SubscriptionCard
        subscription={mockSubscription}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // First expand the card
    fireEvent.click(screen.getByText("Netflix"));

    // Click delete button
    fireEvent.click(screen.getByText("Delete"));

    // Check if onDelete was called with the correct ID
    expect(mockOnDelete).toHaveBeenCalledWith("test-id");
  });
});
