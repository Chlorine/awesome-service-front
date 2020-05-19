import { produce, Draft } from 'immer';

import { ActionType } from '../actions/event-info';
import { EventInfoState } from '../store/event-info-state';

export const initialEventInfoState: EventInfoState = {
  event: null,
};

export const eventInfoReducer = produce(
  (
    draft: Draft<EventInfoState> = initialEventInfoState,
    action: ActionType,
  ) => {
    switch (action.type) {
      case '@eventInfo/eventInfoLoaded':
        draft.event = action.event;
        break;
    }

    return draft;
  },
);
