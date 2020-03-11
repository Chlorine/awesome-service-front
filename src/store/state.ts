import { RouterState } from 'connected-react-router';

import { IUser, WebUISettings } from '../common-interfaces/common-front';
import { VisitorInfoState } from './visitor-info-state';

export type AuthState = {
  user: IUser | null;
  inProgress: boolean;
  uiSettings: WebUISettings;
};

export type AppState = {
  auth: AuthState;
  visitorInfo: VisitorInfoState;
  router: RouterState;
};
