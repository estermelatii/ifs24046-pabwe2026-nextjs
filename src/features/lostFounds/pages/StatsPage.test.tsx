import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import StatsPage, { normalizeStats } from "./StatsPage";
import { renderWithProviders } from "../../../test-utils";
import lostFoundApi from "../api/lostFoundApi";
import * as toolsHelper from "../../../helpers/toolsHelper";

describe("normalizeStats", () => {
  it("should return empty array for null, undefined, or non-object data", () => {
    expect(normalizeStats(null)).toEqual([]);
    expect(normalizeStats(undefined)).toEqual([]);
    expect(normalizeStats("abc")).toEqual([]);
  });

  it("should normalize array items using date, label, or index as label", () => {
    const rows = normalizeStats([
      { date: "2026-10-01", total: 3, lost: 2, found: 1 },
      { label: "Oktober", count: "4", lost: "1", found: "3" },
      { total: 1 },
      null,
    ]);

    expect(rows).toEqual([
      { label: "2026-10-01", total: 3, lost: 2, found: 1 },
      { label: "Oktober", total: 4, lost: 1, found: 3 },
      { label: "3", total: 1, lost: 0, found: 0 },
      { label: "4", total: 0, lost: 0, found: 0 },
    ]);
  });

  it("should normalize object keyed by label with object or scalar values", () => {
    const rows = normalizeStats({
      "2026-10-01": { total: 2, lost: 1, found: 1 },
      "2026-10-02": 5,
      "2026-10-03": null,
    });

    expect(rows).toEqual([
      { label: "2026-10-01", total: 2, lost: 1, found: 1 },
      { label: "2026-10-02", total: 5, lost: 0, found: 0 },
      { label: "2026-10-03", total: 0, lost: 0, found: 0 },
    ]);
  });
});

describe("StatsPage", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should show loading and then render daily and monthly stats", async () => {
    vi.spyOn(lostFoundApi, "getStatsDaily").mockResolvedValue([
      { date: "2026-10-01", total: 4, lost: 3, found: 1 },
    ]);
    vi.spyOn(lostFoundApi, "getStatsMonthly").mockResolvedValue({
      Oktober: { total: 10, lost: 6, found: 4 },
    });

    renderWithProviders(<StatsPage />);

    expect(screen.getByTestId("stats-loading")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId("stats-daily")).toBeInTheDocument();
    });

    expect(screen.getByText("Statistik Harian")).toBeInTheDocument();
    expect(screen.getByText("2026-10-01")).toBeInTheDocument();
    expect(screen.getByTestId("stats-daily")).toHaveTextContent("Total 4 · Hilang 3 · Ditemukan 1");
    expect(screen.getByText("Oktober")).toBeInTheDocument();
    expect(screen.getByTestId("stats-monthly")).toHaveTextContent("Total 10");
  });

  it("should show empty message when there is no data", async () => {
    vi.spyOn(lostFoundApi, "getStatsDaily").mockResolvedValue([]);
    vi.spyOn(lostFoundApi, "getStatsMonthly").mockResolvedValue(null);

    renderWithProviders(<StatsPage />);

    await waitFor(() => {
      expect(screen.getAllByText("Belum ada data statistik.")).toHaveLength(2);
    });
  });

  it("should show error dialog when api fails", async () => {
    vi.spyOn(lostFoundApi, "getStatsDaily").mockRejectedValue(new Error("Gagal mengambil statistik harian"));
    vi.spyOn(lostFoundApi, "getStatsMonthly").mockResolvedValue([]);
    const errorSpy = vi
      .spyOn(toolsHelper, "showErrorDialog")
      .mockImplementation(() => Promise.resolve({} as never));

    renderWithProviders(<StatsPage />);

    await waitFor(() => {
      expect(errorSpy).toHaveBeenCalledWith("Gagal mengambil statistik harian");
    });
    expect(screen.queryByTestId("stats-loading")).not.toBeInTheDocument();
  });

  it("should not update state after unmount", async () => {
    let resolveDaily: (value: unknown) => void = () => {};
    vi.spyOn(lostFoundApi, "getStatsDaily").mockReturnValue(
      new Promise((resolve) => {
        resolveDaily = resolve;
      })
    );
    vi.spyOn(lostFoundApi, "getStatsMonthly").mockResolvedValue([]);

    const { unmount } = renderWithProviders(<StatsPage />);
    unmount();
    resolveDaily([{ date: "2026-10-01", total: 1 }]);

    await Promise.resolve();
    expect(screen.queryByTestId("stats-daily")).not.toBeInTheDocument();
  });
});
