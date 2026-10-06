import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import {
  isAuthLoginReducer,
  isAuthRegisterReducer,
  isAuthLogoutReducer,
} from "./features/auth/states/reducer";
import {
  usersReducer,
  userReducer,
  profileReducer,
  isProfileReducer,
  isChangeProfileReducer,
  isChangeProfilePhotoReducer,
  isChangeProfilePasswordReducer,
} from "./features/users/states/reducer";
import {
  lostFoundsReducer,
  lostFoundReducer,
  isTodoReducer,
  isTodoAddReducer,
  isTodoAddedReducer,
  isTodoChangeReducer,
  isTodoChangedReducer,
  isTodoChangeCoverReducer,
  isTodoChangedCoverReducer,
  isTodoDeleteReducer,
  isTodoDeletedReducer,
} from "./features/lostFounds/states/reducer";

export function createMockStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      isAuthLogin: isAuthLoginReducer,
      isAuthRegister: isAuthRegisterReducer,
      isAuthLogout: isAuthLogoutReducer,
      users: usersReducer,
      user: userReducer,
      profile: profileReducer,
      isProfile: isProfileReducer,
      isChangeProfile: isChangeProfileReducer,
      isChangeProfilePhoto: isChangeProfilePhotoReducer,
      isChangeProfilePassword: isChangeProfilePasswordReducer,
      todos: lostFoundsReducer,
      todo: lostFoundReducer,
      isTodo: isTodoReducer,
      isTodoAdd: isTodoAddReducer,
      isTodoAdded: isTodoAddedReducer,
      isTodoChange: isTodoChangeReducer,
      isTodoChanged: isTodoChangedReducer,
      isTodoChangeCover: isTodoChangeCoverReducer,
      isTodoChangedCover: isTodoChangedCoverReducer,
      isTodoDelete: isTodoDeleteReducer,
      isTodoDeleted: isTodoDeletedReducer,
    },
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        // Dev-only checks are slow under Vitest/jsdom and spam stderr.
        serializableCheck: false,
        immutableCheck: false,
      }),
  });
}

export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    store = createMockStore(preloadedState),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
