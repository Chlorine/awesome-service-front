import { AuthState } from '../store/state';
import { ActionType } from '../actions/auth';
import { produce, Draft } from 'immer';

const initialState: AuthState = {
  user: null,
  inProgress: false,
  uiSettings: {},
};

export const authReducer = produce(
  (draft: Draft<AuthState> = initialState, action: ActionType) => {
    switch (action.type) {
      case '@auth/loginComplete':
        draft.user = action.user;
        draft.uiSettings = action.uiSettings;
        draft.inProgress = false;
        break;
      case '@auth/logoutComplete':
        draft.user = null;
        draft.inProgress = false;
        break;
      case '@auth/toggleAuthInProgress':
        draft.inProgress = false;
        break;
    }

    return draft;
  },
);
