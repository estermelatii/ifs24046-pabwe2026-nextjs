import apiHelper from "../../../helpers/apiHelper";
import {
  showErrorDialog,
  showSuccessDialog,
} from "../../../helpers/toolsHelper";
import authApi from "../api/authApi";
import type { Dispatch } from "@reduxjs/toolkit";

export const ActionType = {
  SET_IS_AUTH_LOGIN: "SET_IS_AUTH_LOGIN",
  SET_IS_AUTH_REGISTER: "SET_IS_AUTH_REGISTER",
  SET_IS_AUTH_LOGOUT: "SET_IS_AUTH_LOGOUT",
};

// Login
export function setIsAuthLoginActionCreator(isAuthLogin: boolean) {
  return {
    type: ActionType.SET_IS_AUTH_LOGIN,
    payload: isAuthLogin,
  };
}

export function asyncSetIsAuthLogin(email: string, password: string) {
  return async (dispatch: Dispatch) => {
    try {
      const data = await authApi.postLogin(email, password);
      apiHelper.putAccessToken(data.token);
      dispatch(setIsAuthLoginActionCreator(true));
    } catch (error) {
      dispatch(setIsAuthLoginActionCreator(false));
      showErrorDialog((error as Error).message);
    }
  };
}

// Register
export function setIsAuthRegisterActionCreator(isAuthRegister: boolean) {
  return {
    type: ActionType.SET_IS_AUTH_REGISTER,
    payload: isAuthRegister,
  };
}

export function asyncSetIsAuthRegister(name: string, email: string, password: string) {
  return async (dispatch: Dispatch) => {
    try {
      const message = await authApi.postRegister(name, email, password);
      dispatch(setIsAuthRegisterActionCreator(true));
      showSuccessDialog(message);
    } catch (error) {
      dispatch(setIsAuthRegisterActionCreator(false));
      showErrorDialog((error as Error).message);
    }
  };
}

// Logout
export function setIsAuthLogoutActionCreator(isAuthLogout: boolean) {
  return {
    type: ActionType.SET_IS_AUTH_LOGOUT,
    payload: isAuthLogout,
  };
}

export function asyncSetIsAuthLogout() {
  return async (dispatch: Dispatch) => {
    try {
      await authApi.postLogout();
    } catch {
      // Still proceed with clearing token locally even if server error
    } finally {
      apiHelper.putAccessToken("");
      dispatch(setIsAuthLogoutActionCreator(true));
    }
  };
}
