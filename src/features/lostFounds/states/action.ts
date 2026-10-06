import {
  showErrorDialog,
  showSuccessDialog,
} from "../../../helpers/toolsHelper";
import lostFoundApi from "../api/lostFoundApi";
import type { Dispatch } from "@reduxjs/toolkit";
import type { LostFound } from "@/types";

export const ActionType = {
  SET_TODOS: "SET_TODOS",
  SET_TODO: "SET_TODO",
  SET_IS_TODO: "SET_IS_TODO",
  SET_IS_TODO_ADD: "SET_IS_TODO_ADD",
  SET_IS_TODO_ADDED: "SET_IS_TODO_ADDED",
  SET_IS_TODO_CHANGE: "SET_IS_TODO_CHANGE",
  SET_IS_TODO_CHANGED: "SET_IS_TODO_CHANGED",
  SET_IS_TODO_CHANGE_COVER: "SET_IS_TODO_CHANGE_COVER",
  SET_IS_TODO_CHANGED_COVER: "SET_IS_TODO_CHANGED_COVER",
  SET_IS_TODO_DELETE: "SET_IS_TODO_DELETE",
  SET_IS_TODO_DELETED: "SET_IS_TODO_DELETED",
};

export function setTodosActionCreator(todos: LostFound[]) {
  return {
    type: ActionType.SET_TODOS,
    payload: todos,
  };
}

export function asyncSetTodos(
  is_completed: string | number = "",
  is_me: boolean = false
) {
  return async (dispatch: Dispatch) => {
    try {
      const todos = await lostFoundApi.getLostFounds(
        is_me ? { is_completed, is_me: 1 } : { is_completed }
      );
      dispatch(setTodosActionCreator(todos));
    } catch {
      dispatch(setTodosActionCreator([]));
    }
  };
}

export function setTodoActionCreator(todo: LostFound | null) {
  return {
    type: ActionType.SET_TODO,
    payload: todo,
  };
}

export function setIsTodoActionCreator(status: boolean) {
  return {
    type: ActionType.SET_IS_TODO,
    payload: status,
  };
}

export function asyncSetTodo(todoId: number | string) {
  return async (dispatch: Dispatch) => {
    try {
      const todo = await lostFoundApi.getLostFoundById(todoId);
      dispatch(setTodoActionCreator(todo));
    } catch {
      dispatch(setTodoActionCreator(null));
    } finally {
      dispatch(setIsTodoActionCreator(true));
    }
  };
}

export function setIsTodoAddActionCreator(isTodoAdd: boolean) {
  return {
    type: ActionType.SET_IS_TODO_ADD,
    payload: isTodoAdd,
  };
}

export function setIsTodoAddedActionCreator(isTodoAdded: boolean) {
  return {
    type: ActionType.SET_IS_TODO_ADDED,
    payload: isTodoAdded,
  };
}

export function asyncSetIsTodoAdd(
  title: string,
  description: string,
  status: string = "lost"
) {
  return async (dispatch: Dispatch) => {
    try {
      await lostFoundApi.postLostFound(title, description, status || "lost");
      showSuccessDialog("Todo berhasil ditambahkan!");
      dispatch(setIsTodoAddedActionCreator(true));
    } catch (error) {
      showErrorDialog((error as Error).message);
      dispatch(setIsTodoAddedActionCreator(false));
    } finally {
      dispatch(setIsTodoAddActionCreator(true));
    }
  };
}

export function setIsTodoChangeActionCreator(isTodoChange: boolean) {
  return {
    type: ActionType.SET_IS_TODO_CHANGE,
    payload: isTodoChange,
  };
}

export function setIsTodoChangedActionCreator(isTodoChanged: boolean) {
  return {
    type: ActionType.SET_IS_TODO_CHANGED,
    payload: isTodoChanged,
  };
}

export function asyncSetIsTodoChange(
  todoId: number | string,
  title: string,
  description: string,
  is_completed: boolean | number,
  status: string = "lost"
) {
  return async (dispatch: Dispatch) => {
    try {
      const message = await lostFoundApi.putLostFound(
        todoId,
        title,
        description,
        status,
        is_completed
      );
      showSuccessDialog(message || "Laporan berhasil diperbarui!");
      dispatch(setIsTodoChangedActionCreator(true));
    } catch (error) {
      showErrorDialog((error as Error).message);
      dispatch(setIsTodoChangedActionCreator(false));
    } finally {
      dispatch(setIsTodoChangeActionCreator(true));
    }
  };
}

export function setIsTodoChangeCoverActionCreator(isTodoChangeCover: boolean) {
  return {
    type: ActionType.SET_IS_TODO_CHANGE_COVER,
    payload: isTodoChangeCover,
  };
}

export function setIsTodoChangedCoverActionCreator(status: boolean) {
  return {
    type: ActionType.SET_IS_TODO_CHANGED_COVER,
    payload: status,
  };
}

export function asyncSetIsTodoChangeCover(todoId: number | string, cover: File) {
  return async (dispatch: Dispatch) => {
    try {
      const message = await lostFoundApi.postLostFoundCover(todoId, cover);
      showSuccessDialog(message || "Cover berhasil diperbarui!");
      dispatch(setIsTodoChangedCoverActionCreator(true));
    } catch (error) {
      showErrorDialog((error as Error).message);
      dispatch(setIsTodoChangedCoverActionCreator(false));
    } finally {
      dispatch(setIsTodoChangeCoverActionCreator(true));
    }
  };
}

export function setIsTodoDeleteActionCreator(isTodoDelete: boolean) {
  return {
    type: ActionType.SET_IS_TODO_DELETE,
    payload: isTodoDelete,
  };
}

export function setIsTodoDeletedActionCreator(isTodoDeleted: boolean) {
  return {
    type: ActionType.SET_IS_TODO_DELETED,
    payload: isTodoDeleted,
  };
}

export function asyncSetIsTodoDelete(todoId: number | string) {
  return async (dispatch: Dispatch) => {
    try {
      const message = await lostFoundApi.deleteLostFound(todoId);
      showSuccessDialog(message || "Todo berhasil dihapus!");
      dispatch(setIsTodoDeletedActionCreator(true));
    } catch (error) {
      showErrorDialog((error as Error).message);
      dispatch(setIsTodoDeletedActionCreator(false));
    } finally {
      dispatch(setIsTodoDeleteActionCreator(true));
    }
  };
}
