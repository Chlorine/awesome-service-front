import { Dispatch } from 'redux';
import {
  push as routerPush,
  CallHistoryMethodAction,
} from 'connected-react-router';

import { IUserInfo, WebUISettings } from '../back/common/users';
import { LocationDescriptorObject } from 'history';

export type LoginComplete = {
  type: '@auth/loginComplete';
  user: IUserInfo;
  uiSettings: WebUISettings;
};

export type LogoutComplete = {
  type: '@auth/logoutComplete';
};

export type ToggleAuthInProgress = {
  type: '@auth/toggleAuthInProgress';
  inProgress: boolean;
};

export type EnableDebugMode = {
  type: '@auth/enableDebugMode';
};

export type ActionType =
  | LoginComplete
  | LogoutComplete
  | ToggleAuthInProgress
  | EnableDebugMode;

export const Actions = {
  loginComplete: (
    user: IUserInfo,
    uiSettings: WebUISettings,
    pathToRedirect: LocationDescriptorObject,
  ) => {
    return (dispatch: Dispatch<ActionType | CallHistoryMethodAction>) => {
      dispatch({
        type: '@auth/loginComplete',
        user,
        uiSettings,
      });

      dispatch(routerPush(pathToRedirect));
    };
  },
  logoutComplete: () => {
    return (dispatch: Dispatch<ActionType | CallHistoryMethodAction>) => {
      dispatch({
        type: '@auth/logoutComplete',
      });

      dispatch(routerPush('/login'));
    };
  },
  toggleAuthInProgress: (inProgress: boolean) => {
    return (dispatch: Dispatch<ActionType>) => {
      dispatch({
        type: '@auth/toggleAuthInProgress',
        inProgress,
      });
    };
  },
  enableDebugMode: () => {
    return (dispatch: Dispatch<ActionType>) => {
      dispatch({
        type: '@auth/enableDebugMode',
      });
    };
  }
};
