"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AddModal from "../modals/AddModal";
import ChangeModal from "../modals/ChangeModal";
import {
  asyncSetIsTodoDelete,
  asyncSetTodos,
  setIsTodoDeleteActionCreator,
} from "../states/action";
import { formatDate, showConfirmDialog } from "../../../helpers/toolsHelper";
import {
  IconPlus,
  IconChecklist,
  IconCircleCheck,
  IconClock,
  IconAlertCircle,
  IconPackage,
  IconUser,
  IconEye,
  IconPencil,
  IconTrash,
  IconFilter,
  IconSearch,
  IconLoader2,
} from "@tabler/icons-react";
import type { LostFound } from "@/types";

function HomePage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const profile = useAppSelector((state) => state.profile);
  const todos = useAppSelector((state) => state.todos);
  const isTodoDeleted = useAppSelector((state) => state.isTodoDeleted);

  const [loadingTodos, setLoadingTodos] = useState(false);
  const [filter, setFilter] = useState("");
  const [onlyMine, setOnlyMine] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoadingTodos(true);
    Promise.resolve(dispatch(asyncSetTodos(filter, onlyMine))).finally(() => {
      if (isMounted) setLoadingTodos(false);
    });
    return () => {
      isMounted = false;
    };
  }, [filter, onlyMine, dispatch]);

  useEffect(() => {
    let isMounted = true;
    if (isTodoDeleted) {
      dispatch(setIsTodoDeleteActionCreator(false));
      setLoadingTodos(true);
      Promise.resolve(dispatch(asyncSetTodos(filter, onlyMine))).finally(() => {
        if (isMounted) setLoadingTodos(false);
      });
    }
    return () => {
      isMounted = false;
    };
  }, [isTodoDeleted, filter, onlyMine, dispatch]);

  if (!profile) return null;

  async function handleDeleteTodo(todoId: number) {
    const result = await showConfirmDialog("Apakah Anda yakin ingin menghapus todo ini?");
    if (result.isConfirmed) {
      dispatch(asyncSetIsTodoDelete(todoId));
    }
  }

  const todoList = todos;
  const filteredTodos = todoList.filter((todo: LostFound) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const title = todo.title ? todo.title.toLowerCase() : "";
    const description = todo.description ? todo.description.toLowerCase() : "";
    return title.includes(q) || description.includes(q);
  });

  const totalCount = todoList.length;
  const finishedCount = todoList.filter((t: LostFound) => t.is_completed).length;
  const pendingCount = totalCount - finishedCount;
  const lostCount = todoList.filter((t: LostFound) => t.status === "lost").length;
  const foundCount = todoList.filter((t: LostFound) => t.status === "found").length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Laporan Lost & Founds
          </h1>
          <p className="text-sm text-slate-700 mt-1">
            Kelola dan pantau semua tugas harian Anda secara terorganisir.
          </p>
        </div>
        <button
          type="button"
          data-testid="add-todo-btn"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-md shadow-indigo-600/25 transition-all self-start sm:self-auto"
        >
          <IconPlus size={18} stroke={2.5} />
          <span>Tambah Laporan</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              Total Todo
            </p>
            <p className="text-3xl font-black text-slate-800 mt-1">{totalCount}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <IconChecklist size={26} stroke={2} />
          </div>
        </div>

        <div
          data-testid="lost-count-card"
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              Barang Hilang
            </p>
            <p className="text-3xl font-black text-rose-600 mt-1">{lostCount}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <IconAlertCircle size={26} stroke={2} />
          </div>
        </div>

        <div
          data-testid="found-count-card"
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              Barang Ditemukan
            </p>
            <p className="text-3xl font-black text-sky-600 mt-1">{foundCount}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <IconPackage size={26} stroke={2} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              Todo Selesai
            </p>
            <p className="text-3xl font-black text-emerald-600 mt-1">
              {finishedCount}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <IconCircleCheck size={26} stroke={2} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              Sedang Proses
            </p>
            <p className="text-3xl font-black text-amber-600 mt-1">{pendingCount}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <IconClock size={26} stroke={2} />
          </div>
        </div>
      </div>

      {/* Table & Controls Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Filter bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <IconSearch
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600"
            />
            <input
              type="text"
              data-testid="search-todo-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul atau deskripsi laporan..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              data-testid="filter-mine-btn"
              aria-pressed={onlyMine}
              onClick={() => setOnlyMine((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                onlyMine
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-slate-600 border-slate-200 hover:text-slate-900"
              }`}
            >
              <IconUser size={14} /> Laporan Saya
            </button>
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
              <IconFilter size={16} /> Filter:
            </span>
            <div className="inline-flex rounded-xl bg-slate-100 p-1 text-xs font-semibold text-slate-600">
              <button
                type="button"
                data-testid="filter-all-btn"
                onClick={() => setFilter("")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filter === ""
                    ? "bg-white text-slate-900 shadow-xs"
                    : "hover:text-slate-900"
                }`}
              >
                Semua
              </button>
              <button
                type="button"
                data-testid="filter-pending-btn"
                onClick={() => setFilter("0")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filter === "0"
                    ? "bg-white text-amber-700 shadow-xs"
                    : "hover:text-slate-900"
                }`}
              >
                Proses
              </button>
              <button
                type="button"
                data-testid="filter-finished-btn"
                onClick={() => setFilter("1")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filter === "1"
                    ? "bg-white text-emerald-700 shadow-xs"
                    : "hover:text-slate-900"
                }`}
              >
                Selesai
              </button>
            </div>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 text-xs uppercase tracking-wider font-semibold text-slate-700 border-b border-slate-100">
              <tr>
                <th className="px-5 py-3.5 text-center w-16">ID</th>
                <th className="px-5 py-3.5">Judul</th>
                <th className="px-5 py-3.5 hidden md:table-cell">Dibuat</th>
                <th className="px-5 py-3.5 hidden lg:table-cell">Diperbarui</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loadingTodos && filteredTodos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-600">
                    <IconLoader2 size={36} className="mx-auto text-indigo-600 animate-spin mb-2" />
                    <p className="font-medium text-slate-600">Memuat daftar todo...</p>
                  </td>
                </tr>
              ) : filteredTodos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-600">
                    <IconChecklist size={40} className="mx-auto text-slate-300 mb-2" />
                    <p className="font-medium">Belum ada data laporan yang cocok.</p>
                  </td>
                </tr>
              ) : (
                filteredTodos.map((todo: LostFound) => (
                  <tr
                    key={`todo-${todo.id}`}
                    data-testid={`todo-row-${todo.id}`}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    <td className="px-5 py-4 text-center font-mono text-xs font-bold text-slate-600">
                      #{todo.id}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {todo.cover && (
                          <img
                            src={todo.cover}
                            alt={todo.title as string}
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                          />
                        )}
                        <div>
                          <p className="font-semibold text-slate-800 leading-snug">
                            {todo.title}
                          </p>
                          {todo.description && (
                            <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">
                              {todo.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell text-xs text-slate-700">
                      {formatDate(todo.created_at)}
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell text-xs text-slate-700">
                      {formatDate(todo.updated_at)}
                    </td>
                    <td className="px-5 py-4">
                      {todo.is_completed ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Selesai
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          Proses
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          data-testid={`view-todo-${todo.id}`}
                          onClick={() => router.push(`/lost-founds/${todo.id}`)}
                          className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Lihat Detail"
                        >
                          <IconEye size={18} />
                        </button>
                        <button
                          type="button"
                          data-testid={`edit-todo-${todo.id}`}
                          onClick={() => {
                            setSelectedTodoId(todo.id);
                            setShowChangeModal(true);
                          }}
                          className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Ubah Todo"
                        >
                          <IconPencil size={18} />
                        </button>
                        <button
                          type="button"
                          data-testid={`delete-todo-${todo.id}`}
                          onClick={() => handleDeleteTodo(todo.id)}
                          className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus Todo"
                        >
                          <IconTrash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <AddModal show={showAddModal} onClose={() => setShowAddModal(false)} />
      <ChangeModal
        show={showChangeModal}
        onClose={() => setShowChangeModal(false)}
        todoId={selectedTodoId}
      />
    </div>
  );
}

export default HomePage;
