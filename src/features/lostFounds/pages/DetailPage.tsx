"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  asyncSetTodo,
  asyncSetIsTodoDelete,
  setIsTodoActionCreator,
  setIsTodoDeleteActionCreator,
} from "../states/action";
import { formatDate, showConfirmDialog } from "../../../helpers/toolsHelper";
import ChangeCoverModal from "../modals/ChangeCoverModal";
import ChangeModal from "../modals/ChangeModal";
import {
  IconArrowLeft,
  IconPhotoUp,
  IconEdit,
  IconTrash,
  IconCalendar,
  IconCircleCheck,
  IconClock,
} from "@tabler/icons-react";

function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const profile = useAppSelector((state) => state.profile);
  const todo = useAppSelector((state) => state.todo);
  const isTodo = useAppSelector((state) => state.isTodo);
  const isTodoDeleted = useAppSelector((state) => state.isTodoDeleted);

  const [showCoverModal, setShowCoverModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    dispatch(asyncSetTodo(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (isTodo) {
      dispatch(setIsTodoActionCreator(false));
      if (!todo) {
        router.push("/");
      }
    }
  }, [isTodo, todo, router, dispatch]);

  useEffect(() => {
    if (isTodoDeleted) {
      dispatch(setIsTodoDeleteActionCreator(false));
      router.push("/");
    }
  }, [isTodoDeleted, router, dispatch]);

  if (!profile || !todo) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  async function handleDelete() {
    const result = await showConfirmDialog("Apakah Anda yakin ingin menghapus todo ini?");
    if (result.isConfirmed) {
      dispatch(asyncSetIsTodoDelete(todo.id));
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* Back button & Action buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/"
          data-testid="back-to-todos-link"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <IconArrowLeft size={18} />
          Kembali ke Todo
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            data-testid="edit-cover-btn"
            onClick={() => setShowCoverModal(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200/60 transition-colors"
          >
            <IconPhotoUp size={16} />
            Ubah Cover
          </button>
          <button
            type="button"
            data-testid="edit-detail-todo-btn"
            onClick={() => setShowEditModal(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/60 transition-colors"
          >
            <IconEdit size={16} />
            Ubah Data
          </button>
          <button
            type="button"
            data-testid="delete-detail-todo-btn"
            onClick={handleDelete}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl text-red-700 bg-red-50 hover:bg-red-100 border border-red-200/60 transition-colors"
          >
            <IconTrash size={16} />
            Hapus
          </button>
        </div>
      </div>

      {/* Main Detail Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {todo.cover && (
          <div className="relative w-full h-64 sm:h-80 bg-slate-900 overflow-hidden">
            <img
              src={todo.cover}
              alt={todo.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
          </div>
        )}

        <div className="p-6 sm:p-8 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-slate-400">
                #{todo.id}
              </span>
              {todo.is_completed ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <IconCircleCheck size={14} />
                  Selesai
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  <IconClock size={14} />
                  Sedang Proses
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {todo.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <IconCalendar size={14} className="shrink-0" />
                <span>Dibuat: <strong className="text-slate-500">{formatDate(todo.created_at)}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <IconCalendar size={14} className="shrink-0" />
                <span>Diperbarui: <strong className="text-slate-500">{formatDate(todo.updated_at)}</strong></span>
              </div>
            </div>
          </div>

          <div className="prose max-w-none text-slate-600 bg-slate-50/60 p-6 rounded-2xl border border-slate-100 whitespace-pre-wrap leading-relaxed">
            {todo.description || "Tidak ada deskripsi rinci untuk todo ini."}
          </div>
        </div>
      </div>

      {/* Cover Modal */}
      <ChangeCoverModal
        show={showCoverModal}
        onClose={() => setShowCoverModal(false)}
        todo={todo}
      />

      {/* Edit Modal */}
      <ChangeModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        todoId={todo.id}
      />
    </div>
  );
}

export default DetailPage;
