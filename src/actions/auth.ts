import { Dispatch } from 'redux';
import {
  push as routerPush,
  CallHistoryMethodAction,
} from 'connected-react-router';

import { IUser, WebUISettings } from '../common-interfaces/common-front';
import { LocationDescriptorObject } from 'history';

export type LoginComplete = {
  type: '@auth/loginComplete';
  user: IUser;
  uiSettings: WebUISettings;
};

export type LogoutComplete = {
  type: '@auth/logoutComplete';
};

export type ToggleAuthInProgress = {
  type: '@auth/toggleAuthInProgress';
  inProgress: boolean;
};

export type ActionType = LoginComplete | LogoutComplete | ToggleAuthInProgress;

export const Actions = {
  loginComplete: (
    user: IUser,
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
};
