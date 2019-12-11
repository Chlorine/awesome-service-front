import { AuthState } from '../store/state';
import { ActionType } from '../actions/auth';

const initialState: AuthState = {
  user: null,
  inProgress: false,
};

export function authReducer(
  state: AuthState = initialState,
  action: ActionType,
) {
  let res = state;

  switch (action.type) {
    case '@auth/loginComplete':
      res = { ...state, user: action.user, inProgress: false };
      break;
    case '@auth/logoutComplete':
      res = { ...state, user: null, inProgress: false };
      break;
    case '@auth/toggleAuthInProgress':
      res = { ...state, inProgress: action.inProgress };
      break;
  }

  return res;
}
