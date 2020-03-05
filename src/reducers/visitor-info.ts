import { VisitorInfoState } from '../store/state';
import { ActionType } from '../actions/visitor-info';

import { produce, Draft } from 'immer';
import { MinimalVisitorInfo } from '../common-interfaces/common-front';

export const emptyMinimalVisitorInfo: MinimalVisitorInfo = {
  firstName: '',
  middleName: '',
  lastName: '',
  companyName: '',
  position: '',
};

const initialState: VisitorInfoState = {
  baseInfo: emptyMinimalVisitorInfo,
  wantsToShareContacts: false,
  email: '',
  phone: '',
};

export const visitorInfoReducer = produce(
  (draft: Draft<VisitorInfoState> = initialState, action: ActionType) => {
    switch (action.type) {
      case '@visitorInfo/reset':
        draft.baseInfo = emptyMinimalVisitorInfo;
        draft.wantsToShareContacts = false;
        draft.email = '';
        draft.phone = '';
        break;
      case '@visitorInfo/baseInfoSubmitted':
        draft.baseInfo = action.visitor;
        break;
      case '@visitorInfo/shareContactsRadioChanged':
        draft.wantsToShareContacts = action.wantsToShare;
        break;
      case '@visitorInfo/contactInfoSubmitted':
        {
          const { email, phone } = action.contactInfo;
          draft.email = email;
          draft.phone = phone;
        }
        break;
    }

    return draft;
  },
);
