import { RouterState } from 'connected-react-router';
import { IUser } from '../common-interfaces/common-front';

export type AuthState = {
  user: IUser | null;
  inProgress: boolean;
};

export type AppState = {
  auth: AuthState;
  router: RouterState;
};
