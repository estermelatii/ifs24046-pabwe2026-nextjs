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

const store = configureStore({
  reducer: {
    // Auth reducers
    isAuthLogin: isAuthLoginReducer,
    isAuthRegister: isAuthRegisterReducer,
    isAuthLogout: isAuthLogoutReducer,

    // Users reducers
    users: usersReducer,
    user: userReducer,
    profile: profileReducer,
    isProfile: isProfileReducer,
    isChangeProfile: isChangeProfileReducer,
    isChangeProfilePhoto: isChangeProfilePhotoReducer,
    isChangeProfilePassword: isChangeProfilePasswordReducer,

    // Todos reducers
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
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
