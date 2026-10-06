import type { AppAction } from "@/types/action";
import { ActionType } from "./action";

export function lostFoundsReducer(states = [], action: AppAction = {}) {
  switch (action.type) {
    case ActionType.SET_TODOS:
      return action.payload;
    default:
      return states;
  }
}

export function lostFoundReducer(state = null, action: AppAction = {}) {
  switch (action.type) {
    case ActionType.SET_TODO:
      return action.payload;
    default:
      return state;
  }
}

export function isTodoReducer(state = false, action: AppAction = {}) {
  switch (action.type) {
    case ActionType.SET_IS_TODO:
      return action.payload;
    default:
      return state;
  }
}

export function isTodoAddReducer(state = false, action: AppAction = {}) {
  switch (action.type) {
    case ActionType.SET_IS_TODO_ADD:
      return action.payload;
    default:
      return state;
  }
}

export function isTodoAddedReducer(state = false, action: AppAction = {}) {
  switch (action.type) {
    case ActionType.SET_IS_TODO_ADDED:
      return action.payload;
    default:
      return state;
  }
}

export function isTodoChangeReducer(state = false, action: AppAction = {}) {
  switch (action.type) {
    case ActionType.SET_IS_TODO_CHANGE:
      return action.payload;
    default:
      return state;
  }
}

export function isTodoChangedReducer(state = false, action: AppAction = {}) {
  switch (action.type) {
    case ActionType.SET_IS_TODO_CHANGED:
      return action.payload;
    default:
      return state;
  }
}

export function isTodoChangeCoverReducer(state = false, action: AppAction = {}) {
  switch (action.type) {
    case ActionType.SET_IS_TODO_CHANGE_COVER:
      return action.payload;
    default:
      return state;
  }
}

export function isTodoChangedCoverReducer(state = false, action: AppAction = {}) {
  switch (action.type) {
    case ActionType.SET_IS_TODO_CHANGED_COVER:
      return action.payload;
    default:
      return state;
  }
}

export function isTodoDeleteReducer(state = false, action: AppAction = {}) {
  switch (action.type) {
    case ActionType.SET_IS_TODO_DELETE:
      return action.payload;
    default:
      return state;
  }
}

export function isTodoDeletedReducer(state = false, action: AppAction = {}) {
  switch (action.type) {
    case ActionType.SET_IS_TODO_DELETED:
      return action.payload;
    default:
      return state;
  }
}
