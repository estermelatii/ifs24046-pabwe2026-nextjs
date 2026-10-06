import { describe, it, expect } from "vitest";
import store from "./store";
import { setIsAuthLoginActionCreator } from "./features/auth/states/action";

describe("Redux store configuration", () => {
  it("should contain all expected reducer keys and update state properly", () => {
    const state = store.getState();

    // Verify all keys exist
    expect(state).toHaveProperty("isAuthLogin");
    expect(state).toHaveProperty("isAuthRegister");
    expect(state).toHaveProperty("isAuthLogout");
    expect(state).toHaveProperty("users");
    expect(state).toHaveProperty("user");
    expect(state).toHaveProperty("profile");
    expect(state).toHaveProperty("isProfile");
    expect(state).toHaveProperty("isChangeProfile");
    expect(state).toHaveProperty("isChangeProfilePhoto");
    expect(state).toHaveProperty("isChangeProfilePassword");
    expect(state).toHaveProperty("todos");
    expect(state).toHaveProperty("todo");
    expect(state).toHaveProperty("isTodo");
    expect(state).toHaveProperty("isTodoAdd");
    expect(state).toHaveProperty("isTodoAdded");
    expect(state).toHaveProperty("isTodoChange");
    expect(state).toHaveProperty("isTodoChanged");
    expect(state).toHaveProperty("isTodoChangeCover");
    expect(state).toHaveProperty("isTodoChangedCover");
    expect(state).toHaveProperty("isTodoDelete");
    expect(state).toHaveProperty("isTodoDeleted");

    // Test dispatching an action
    store.dispatch(setIsAuthLoginActionCreator(true));
    expect(store.getState().isAuthLogin).toBe(true);
  });
});
