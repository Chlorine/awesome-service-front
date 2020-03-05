import { RouterState } from 'connected-react-router';
import {
  IUser,
  MinimalVisitorInfo,
  WebUISettings,
} from '../common-interfaces/common-front';

export type AuthState = {
  user: IUser | null;
  inProgress: boolean;
  uiSettings: WebUISettings;
};

export type VisitorInfoState = {
  baseInfo: MinimalVisitorInfo;
  wantsToShareContacts: boolean;
  email: string;
  phone: string;
};

export type AppState = {
  auth: AuthState;
  visitorInfo: VisitorInfoState;
  router: RouterState;
};
