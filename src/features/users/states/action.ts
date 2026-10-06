import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper";
import userApi from "../api/userApi";
import type { Dispatch } from "@reduxjs/toolkit";
import type { User } from "@/types";

export const ActionType = {
  SET_USERS: "SET_USERS",
  SET_USER: "SET_USER",
  SET_PROFILE: "SET_PROFILE",
  SET_IS_PROFILE: "SET_IS_PROFILE",
  SET_IS_CHANGE_PROFILE: "SET_IS_CHANGE_PROFILE",
  SET_IS_CHANGE_PROFILE_PHOTO: "SET_IS_CHANGE_PROFILE_PHOTO",
  SET_IS_CHANGE_PROFILE_PASSWORD: "SET_IS_CHANGE_PROFILE_PASSWORD",
};

// Get all users
export function setUsersActionCreator(users: User[]) {
  return {
    type: ActionType.SET_USERS,
    payload: users,
  };
}

export function asyncSetUsers() {
  return async (dispatch: Dispatch) => {
    try {
      const users = await userApi.getUsers();
      dispatch(setUsersActionCreator(users));
    } catch {
      dispatch(setUsersActionCreator([]));
    }
  };
}

// Get user by ID
export function setUserActionCreator(user: User | null) {
  return {
    type: ActionType.SET_USER,
    payload: user,
  };
}

export function asyncSetUserById(userId: number | string) {
  return async (dispatch: Dispatch) => {
    try {
      const user = await userApi.getUserById(userId);
      dispatch(setUserActionCreator(user));
    } catch {
      dispatch(setUserActionCreator(null));
    }
  };
}

// Get user profile
export function setProfileActionCreator(profile: User | null) {
  return {
    type: ActionType.SET_PROFILE,
    payload: profile,
  };
}

export function setIsProfile(isProfile: boolean) {
  return {
    type: ActionType.SET_IS_PROFILE,
    payload: isProfile,
  };
}

export function asyncSetProfile() {
  return async (dispatch: Dispatch) => {
    try {
      const profile = await userApi.getProfile();
      dispatch(setProfileActionCreator(profile));
    } catch {
      dispatch(setProfileActionCreator(null));
    } finally {
      dispatch(setIsProfile(true));
    }
  };
}

// Put profile
export function setIsChangeProfileActionCreator(isChange: boolean) {
  return {
    type: ActionType.SET_IS_CHANGE_PROFILE,
    payload: isChange,
  };
}

export function asyncPutProfile(name: string, email: string) {
  return async (dispatch: Dispatch) => {
    try {
      const profile = await userApi.putProfile(name, email);
      dispatch(setProfileActionCreator(profile));
      showSuccessDialog("Profil berhasil diperbarui!");
      dispatch(setIsChangeProfileActionCreator(true));
    } catch (error) {
      showErrorDialog((error as Error).message);
      dispatch(setIsChangeProfileActionCreator(false));
    }
  };
}

// Post profile photo
export function setIsChangeProfilePhotoActionCreator(isChange: boolean) {
  return {
    type: ActionType.SET_IS_CHANGE_PROFILE_PHOTO,
    payload: isChange,
  };
}

export function asyncPostProfilePhoto(photo: File) {
  return async (dispatch: Dispatch) => {
    try {
      const message = await userApi.postProfilePhoto(photo);
      showSuccessDialog(message || "Foto profil berhasil diperbarui!");
      const profile = await userApi.getProfile();
      dispatch(setProfileActionCreator(profile));
      dispatch(setIsChangeProfilePhotoActionCreator(true));
    } catch (error) {
      showErrorDialog((error as Error).message);
      dispatch(setIsChangeProfilePhotoActionCreator(false));
    }
  };
}

// Put profile password
export function setIsChangeProfilePasswordActionCreator(isChange: boolean) {
  return {
    type: ActionType.SET_IS_CHANGE_PROFILE_PASSWORD,
    payload: isChange,
  };
}

export function asyncPutProfilePassword(
  oldPassword: string,
  newPassword: string,
  newPasswordConfirmation: string
) {
  return async (dispatch: Dispatch) => {
    try {
      const message = await userApi.putProfilePassword(oldPassword, newPassword, newPasswordConfirmation);
      showSuccessDialog(message || "Kata sandi berhasil diperbarui!");
      dispatch(setIsChangeProfilePasswordActionCreator(true));
    } catch (error) {
      showErrorDialog((error as Error).message);
      dispatch(setIsChangeProfilePasswordActionCreator(false));
    }
  };
}
