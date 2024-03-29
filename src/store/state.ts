import { RouterState } from 'connected-react-router';

import { UserInfo, WebUISettings } from '../back/common/users';
import { VisitorInfoState } from './visitor-info-state';
import { EventInfoState } from './event-info-state';

export type AuthState = {
  user: UserInfo | null;
  inProgress: boolean;
  uiSettings: WebUISettings;
  debugMode?: boolean;
};

export type AppState = {
  auth: AuthState;
  visitorInfo: VisitorInfoState;
  eventInfo: EventInfoState;
  router: RouterState;
};
