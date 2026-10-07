import apiHelper from "../../../helpers/apiHelper";

const lostFoundApi = (() => {
  const BASE_URL = "https://open-api.delcom.org/api/v1/lost-founds";

  function _url(path: string) {
    return BASE_URL + path;
  }

  async function postLostFound(title: string, description: string, status: string) {
    const response = await apiHelper.fetchData(_url("/"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, status }),
    });
    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal menambahkan laporan");
    }
    return result.data;
  }

  async function postLostFoundCover(id: number | string, cover: File) {
    const formData = new FormData();
    formData.append("cover", cover, cover.name || "cover.jpg");
    const response = await apiHelper.fetchData(_url(`/${id}/cover`), {
      method: "POST",
      body: formData,
    });
    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal mengubah cover");
    }
    return result.message;
  }

  async function putLostFound(
    id: number | string,
    title: string,
    description: string,
    status: string,
    is_completed: boolean | number
  ) {
    const response = await apiHelper.fetchData(_url(`/${id}`), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        status,
        is_completed: is_completed ? 1 : 0,
      }),
    });
    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal mengubah laporan");
    }
    return result.message;
  }

  async function getLostFounds(
    params: {
      is_completed?: string | number;
      status?: string;
      is_me?: string | number | boolean;
    } = {}
  ) {
    const query = new URLSearchParams();
    if (params.is_completed !== undefined && params.is_completed !== "") {
      query.set("is_completed", String(params.is_completed));
    }
    if (params.status) {
      query.set("status", params.status);
    }
    if (params.is_me) {
      query.set("is_me", "1");
    }
    const qs = query.toString();
    const targetUrl = qs ? `/?${qs}` : "/";

    const response = await apiHelper.fetchData(_url(targetUrl), { method: "GET" });
    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal mengambil data laporan");
    }
    return result.data?.lost_founds || [];
  }

  async function getLostFoundById(id: number | string) {
    const response = await apiHelper.fetchData(_url(`/${id}`), { method: "GET" });
    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal mengambil detail laporan");
    }
    return result.data?.lost_found || result.data;
  }

  async function deleteLostFound(id: number | string) {
    const response = await apiHelper.fetchData(_url(`/${id}`), { method: "DELETE" });
    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal menghapus laporan");
    }
    return result.message;
  }

  async function getStatsDaily() {
    const response = await apiHelper.fetchData(_url("/stats/daily"), { method: "GET" });
    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal mengambil statistik harian");
    }
    return result.data;
  }

  async function getStatsMonthly() {
    const response = await apiHelper.fetchData(_url("/stats/monthly"), { method: "GET" });
    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal mengambil statistik bulanan");
    }
    return result.data;
  }

  return {
    postLostFound,
    postLostFoundCover,
    putLostFound,
    getLostFounds,
    getLostFoundById,
    deleteLostFound,
    getStatsDaily,
    getStatsMonthly,
  };
})();

export default lostFoundApi;