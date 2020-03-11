import { produce, Draft } from 'immer';

import { ActionType } from '../actions/visitor-info';

import { MinimalVisitorInfo } from '../common-interfaces/common-front';

import { DefaultPhoneCountry } from '../common-interfaces/phone-numbers';

import {
  loadVisitorInfoStateInto,
  VisitorInfoState,
} from '../store/visitor-info-state';

export const emptyMinimalVisitorInfo: MinimalVisitorInfo = {
  firstName: '',
  middleName: '',
  lastName: '',
  companyName: '',
  position: '',
};

export const initialVisitorInfoState: VisitorInfoState = {
  baseInfo: emptyMinimalVisitorInfo,
  wantsToShareContacts: false,
  phoneCountry: DefaultPhoneCountry,
  phone: '',
  email: '',
};

export const visitorInfoReducer = produce(
  (draft: Draft<VisitorInfoState> = initialVisitorInfoState, action: ActionType) => {
    switch (action.type) {
      case '@visitorInfo/reset':
        draft.baseInfo = emptyMinimalVisitorInfo;
        draft.wantsToShareContacts = false;
        draft.phoneCountry = DefaultPhoneCountry;
        draft.phone = '';
        draft.email = '';
        break;
      case '@visitorInfo/baseInfoSubmitted':
        draft.baseInfo = action.visitor;
        break;
      case '@visitorInfo/shareContactsRadioChanged':
        draft.wantsToShareContacts = action.wantsToShare;
        break;
      case '@visitorInfo/contactInfoSubmitted':
        {
          const { email, phone, phoneCountry } = action.contactInfo;

          draft.email = email;
          draft.phone = phone;
          draft.phoneCountry = phoneCountry;
        }
        break;
      case '@visitorInfo/loadFromLocalStorage':
        loadVisitorInfoStateInto(draft);
        break;
    }

    return draft;
  },
);
