import { Dispatch } from 'redux';
import {
  push as routerPush,
  CallHistoryMethodAction,
} from 'connected-react-router';

import { MinimalVisitorInfo } from '../common-interfaces/common-front';
import { PhoneCountry } from '../common-interfaces/phone-numbers';

export type BaseInfoSubmitted = {
  type: '@visitorInfo/baseInfoSubmitted';
  visitor: MinimalVisitorInfo;
};

export type ShareContactsRadioChanged = {
  type: '@visitorInfo/shareContactsRadioChanged';
  wantsToShare: boolean;
};

export type ContactInfoSubmitted = {
  type: '@visitorInfo/contactInfoSubmitted';
  contactInfo: {
    email: string;
    phone: string;
    phoneCountry: PhoneCountry;
  };
};

export type Reset = {
  type: '@visitorInfo/reset';
};

export type LoadFromLocalStorage = {
  type: '@visitorInfo/loadFromLocalStorage';
};

export type ActionType =
  | BaseInfoSubmitted
  | ShareContactsRadioChanged
  | ContactInfoSubmitted
  | Reset
  | LoadFromLocalStorage;

export const Actions = {
  baseInfoSubmitted: (visitor: MinimalVisitorInfo) => {
    return (dispatch: Dispatch<ActionType | CallHistoryMethodAction>) => {
      dispatch({
        type: '@visitorInfo/baseInfoSubmitted',
        visitor,
      });

      dispatch(routerPush('/contact-info'));
    };
  },

  shareContactsRadioChanged: (wantsToShare: boolean) => {
    return (dispatch: Dispatch<ActionType>) => {
      dispatch({
        type: '@visitorInfo/shareContactsRadioChanged',
        wantsToShare,
      });
    };
  },

  contactInfoSubmitted: (
    email: string,
    phone: string,
    phoneCountry: PhoneCountry,
  ) => {
    return (dispatch: Dispatch<ActionType | CallHistoryMethodAction>) => {
      dispatch({
        type: '@visitorInfo/contactInfoSubmitted',
        contactInfo: {
          email,
          phone,
          phoneCountry,
        },
      });

      dispatch(routerPush('/get-qr'));
    };
  },

  reset: () => {
    return (dispatch: Dispatch<ActionType | CallHistoryMethodAction>) => {
      dispatch({
        type: '@visitorInfo/reset',
      });

      dispatch(routerPush('/welcome'));
    };
  },

  loadFromLocalStorage: () => {
    return (dispatch: Dispatch<ActionType>) => {
      dispatch({
        type: '@visitorInfo/loadFromLocalStorage',
      });
    };
  },
};
