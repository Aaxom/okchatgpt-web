import type { FetchMode } from "../types/types";

export type UserProfileState = {
  uuid: string;
  username: string;
  nickname: string;
  mobile: string;
  email: string;
  avatar_url: string;
  description: string;
  disabled: number;
  level: number;
};

export type GlobalState = {
  userProfile: UserProfileState;
  isLoggedIn: boolean;
  fetchMode: FetchMode;
  sendingData: boolean;
};

export function globalReducer(state: GlobalState, action: any): GlobalState {
  if (action.type === "LOGIN") {
    console.log("LOGIN, action: ", action);
    const { userProfile, fetchMode, sendingData }: GlobalState = state;
    return {
      userProfile: { ...userProfile, ...action.payload.userProfile },
      isLoggedIn: true,
      fetchMode: fetchMode,
      sendingData: sendingData,
    };
  }

  if (action.type === "SET_USER_PROFILE") {
    console.log("SET_USER_PROFILE, action: ", action);
    const { userProfile, isLoggedIn, fetchMode, sendingData }: GlobalState = state;
    return {
      userProfile: { ...userProfile, ...action.payload.userProfile },
      isLoggedIn: isLoggedIn,
      fetchMode: fetchMode,
      sendingData: sendingData,
    };
  }

  if (action.type === "SET_IS_LOGGED_IN") {
    console.log("SET_IS_LOGGED_IN, action: ", action);
    const { userProfile, fetchMode, sendingData }: GlobalState = state;
    return {
      userProfile: userProfile,
      isLoggedIn: action.payload.isLoggedIn,
      fetchMode: fetchMode,
      sendingData: sendingData,
    };
  }

  if (action.type === "SET_USER_PROFILE_AND_IS_LOGGED_IN") {
    console.log("SET_USER_PROFILE_AND_IS_LOGGED_IN, action: ", action);
    const { userProfile, fetchMode, sendingData }: GlobalState = state;
    return {
      userProfile: { ...userProfile, ...action.payload.userProfile },
      isLoggedIn: action.payload.isLoggedIn,
      fetchMode: fetchMode,
      sendingData: sendingData,
    };
  }

  if (action.type === "SET_FETCH_MODE") {
    console.log("SET_FETCH_MODE, action: ", action);
    const { userProfile, isLoggedIn, sendingData }: GlobalState = state;
    return {
      userProfile: userProfile,
      isLoggedIn: isLoggedIn,
      fetchMode: action.payload.fetchMode,
      sendingData: sendingData,
    };
  }

  if (action.type === "SET_SENDING_DATA") {
    console.log("SET_SENDING_DATA, action: ", action);
    const { userProfile, isLoggedIn, fetchMode }: GlobalState = state;
    return {
      userProfile: userProfile,
      isLoggedIn: isLoggedIn,
      fetchMode: fetchMode,
      sendingData: action.payload.sendingData,
    };
  }

  if (action.type === "LOGOUT") {
    console.log("LOGOUT, action: ", action);
    const { fetchMode, sendingData }: GlobalState = state;
    return {
      userProfile: {
        uuid: "",
        username: "",
        nickname: "",
        mobile: "",
        email: "",
        avatar_url:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        description: "",
        disabled: 0,
        level: 0,
      },
      isLoggedIn: false,
      fetchMode: fetchMode,
      sendingData: sendingData,
    };
  }

  return state;
}
