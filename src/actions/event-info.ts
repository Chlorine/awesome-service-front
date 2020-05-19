import { Dispatch } from 'redux';
import {
  // push as routerPush,
  CallHistoryMethodAction,
} from 'connected-react-router';

// import { LocationDescriptorObject } from 'history';
import { PublicEventFullInfo } from '../back/common/public-events';

export type EventInfoLoaded = {
  type: '@eventInfo/eventInfoLoaded';
  event: PublicEventFullInfo;
};

export type ActionType = EventInfoLoaded;

export const Actions = {
  eventInfoLoaded: (event: PublicEventFullInfo) => {
    return (dispatch: Dispatch<ActionType | CallHistoryMethodAction>) => {
      dispatch({
        type: '@eventInfo/eventInfoLoaded',
        event,
      });

      // dispatch(routerPush(`/welcome/${event.id}`));
    };
  },
};
