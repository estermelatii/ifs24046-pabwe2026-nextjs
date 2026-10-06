import { describe, it, expect, vi, beforeEach } from "vitest";
import lostFoundApi from "./lostFoundApi";
import apiHelper from "../../../helpers/apiHelper";

describe("lostFoundApi", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("postLostFound", () => {
    it("should create new todo and return data", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: { todo_id: 10 },
        }),
      });

      const res = await lostFoundApi.postLostFound("Title", "Description");
      expect(res).toEqual({ todo_id: 10 });
    });

    it("should throw error if creation fails", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Data tidak valid",
        }),
      });

      await expect(lostFoundApi.postLostFound("", "")).rejects.toThrow("Data tidak valid");
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      await expect(lostFoundApi.postLostFound("", "")).rejects.toThrow("Gagal menambahkan laporan");
    });
  });

  describe("postLostFoundCover", () => {
    it("should upload cover with FormData and return message on success", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil mengubah cover",
        }),
      });

      const dummyFile = new File(["dummy"], "cover.jpg", { type: "image/jpeg" });
      const msg = await lostFoundApi.postLostFoundCover(1, dummyFile);
      expect(msg).toBe("Berhasil mengubah cover");
    });

    it("should handle cover file without name property properly", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil",
        }),
      });

      const dummyBlob = new Blob(["dummy"], { type: "image/jpeg" });
      const msg = await lostFoundApi.postLostFoundCover(1, dummyBlob);
      expect(msg).toBe("Berhasil");
    });

    it("should throw error on upload cover fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Format tidak didukung",
        }),
      });

      const dummyFile = new File(["dummy"], "cover.jpg");
      await expect(lostFoundApi.postLostFoundCover(1, dummyFile)).rejects.toThrow(
        "Format tidak didukung"
      );
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      const dummyFile = new File(["dummy"], "cover.jpg");
      await expect(lostFoundApi.postLostFoundCover(1, dummyFile)).rejects.toThrow(
        "Gagal mengubah cover"
      );
    });
  });

  describe("putLostFound", () => {
    it("should update todo and return message on success", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil mengubah data",
        }),
      });

      const msg = await lostFoundApi.putLostFound(1, "Updated", "Desc", true);
      expect(msg).toBe("Berhasil mengubah data");
    });

    it("should correctly handle boolean false for is_completed", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil mengubah data",
        }),
      });

      const msg = await lostFoundApi.putLostFound(1, "Updated", "Desc", false);
      expect(msg).toBe("Berhasil mengubah data");
    });

    it("should throw error on update failure", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Gagal update todo",
        }),
      });

      await expect(lostFoundApi.putLostFound(1, "", "", false)).rejects.toThrow("Gagal update todo");
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      await expect(lostFoundApi.putLostFound(1, "", "", false)).rejects.toThrow("Gagal mengubah laporan");
    });
  });

  describe("getLostFounds", () => {
    it("should fetch all todos without filter", async () => {
      const mockTodos = [{ id: 1, title: "Todo 1" }];
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: { lost_founds: mockTodos },
        }),
      });

      const todos = await lostFoundApi.getLostFounds();
      expect(todos).toEqual(mockTodos);
    });

    it("should fetch filtered todos when is_completed parameter provided", async () => {
      const mockTodos = [{ id: 2, title: "Todo 2", is_completed: 1 }];
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: { lost_founds: mockTodos },
        }),
      });

      const todos = await lostFoundApi.getLostFounds("1");
      expect(todos).toEqual(mockTodos);
    });

    it("should return empty array if data.lost_founds is missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: {},
        }),
      });

      const todos = await lostFoundApi.getLostFounds();
      expect(todos).toEqual([]);
    });

    it("should throw error on fetch todos fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Akses tidak diizinkan",
        }),
      });

      await expect(lostFoundApi.getLostFounds()).rejects.toThrow("Akses tidak diizinkan");
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      await expect(lostFoundApi.getLostFounds()).rejects.toThrow("Gagal mengambil data laporan");
    });
  });

  describe("getLostFoundById", () => {
    it("should return single todo object on success", async () => {
      const mockTodo = { id: 5, title: "Single" };
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: { lost_found: mockTodo },
        }),
      });

      const res = await lostFoundApi.getLostFoundById(5);
      expect(res).toEqual(mockTodo);
    });

    it("should throw error on detail fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Todo tidak ditemukan",
        }),
      });

      await expect(lostFoundApi.getLostFoundById(999)).rejects.toThrow("Todo tidak ditemukan");
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      await expect(lostFoundApi.getLostFoundById(999)).rejects.toThrow("Gagal mengambil detail laporan");
    });
  });

  describe("deleteLostFound", () => {
    it("should delete todo and return message on success", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil menghapus data",
        }),
      });

      const msg = await lostFoundApi.deleteLostFound(1);
      expect(msg).toBe("Berhasil menghapus data");
    });

    it("should throw error on delete fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Gagal menghapus",
        }),
      });

      await expect(lostFoundApi.deleteLostFound(1)).rejects.toThrow("Gagal menghapus");
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      await expect(lostFoundApi.deleteLostFound(1)).rejects.toThrow("Gagal menghapus laporan");
    });
  });

  describe("getLostFounds query params", () => {
    it("should send is_me=1 and status when provided", async () => {
      const fetchSpy = vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({ status: "success", data: { lost_founds: [] } }),
      });

      await lostFoundApi.getLostFounds({ status: "lost", is_me: 1 });

      const calledUrl = fetchSpy.mock.calls[0][0] as string;
      expect(calledUrl).toContain("status=lost");
      expect(calledUrl).toContain("is_me=1");
    });

    it("should not send is_me when it is falsy", async () => {
      const fetchSpy = vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({ status: "success", data: { lost_founds: [] } }),
      });

      await lostFoundApi.getLostFounds({ is_me: false });

      expect(fetchSpy.mock.calls[0][0] as string).not.toContain("is_me");
    });
  });

  describe("getStatsDaily", () => {
    it("should return data on success", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({ status: "success", data: [{ date: "2026-10-01", total: 2 }] }),
      });

      await expect(lostFoundApi.getStatsDaily()).resolves.toEqual([
        { date: "2026-10-01", total: 2 },
      ]);
    });

    it("should throw api message on fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({ status: "fail", message: "Token tidak sah" }),
      });

      await expect(lostFoundApi.getStatsDaily()).rejects.toThrow("Token tidak sah");
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({ status: "fail" }),
      });

      await expect(lostFoundApi.getStatsDaily()).rejects.toThrow(
        "Gagal mengambil statistik harian"
      );
    });
  });

  describe("getStatsMonthly", () => {
    it("should return data on success", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({ status: "success", data: [{ label: "Oktober", total: 5 }] }),
      });

      await expect(lostFoundApi.getStatsMonthly()).resolves.toEqual([
        { label: "Oktober", total: 5 },
      ]);
    });

    it("should throw api message on fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({ status: "fail", message: "Token tidak sah" }),
      });

      await expect(lostFoundApi.getStatsMonthly()).rejects.toThrow("Token tidak sah");
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({ status: "fail" }),
      });

      await expect(lostFoundApi.getStatsMonthly()).rejects.toThrow(
        "Gagal mengambil statistik bulanan"
      );
    });
  });

  describe("branch coverage helpers", () => {
    it("should send is_completed as 1 when report is completed", async () => {
      const fetchSpy = vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({ status: "success", message: "Berhasil" }),
      });

      await lostFoundApi.putLostFound(1, "Judul", "Deskripsi", "found", true);

      const options = fetchSpy.mock.calls[0][1] as { body: string };
      expect(JSON.parse(options.body)).toEqual({
        title: "Judul",
        description: "Deskripsi",
        status: "found",
        is_completed: 1,
      });
    });

    it("should fall back to data when data.lost_found is missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({ status: "success", data: { id: 7, title: "Dompet" } }),
      });

      await expect(lostFoundApi.getLostFoundById(7)).resolves.toEqual({ id: 7, title: "Dompet" });
    });
  });
});
