import { MinimalVisitorInfo } from '../common-interfaces/common-front';
import {
  DefaultPhoneCountry,
  ensurePhoneCountry,
  PhoneCountry,
} from '../common-interfaces/phone-numbers';
import { LocalStorageHelper } from '../utils';

export type VisitorInfoState = {
  baseInfo: MinimalVisitorInfo;
  wantsToShareContacts: boolean;
  phoneCountry: PhoneCountry;
  phone: string;
  email: string;
};

declare type LSParamName =
  | keyof MinimalVisitorInfo
  | 'shareContacts'
  | 'email'
  | 'phone'
  | 'phoneCountry';

const visitorInfoLS = new LocalStorageHelper<LSParamName>('tsVisitorReg');

export const saveThisVisitorInfoState = (
  visitorInfo: VisitorInfoState,
): void => {
  const {
    baseInfo,
    wantsToShareContacts,
    email,
    phone,
    phoneCountry,
  } = visitorInfo;

  visitorInfoLS
    .set('firstName', baseInfo.firstName)
    .set('middleName', baseInfo.middleName)
    .set('lastName', baseInfo.lastName)
    .set('companyName', baseInfo.companyName)
    .set('position', baseInfo.position)
    .set('shareContacts', wantsToShareContacts)
    .set('email', email)
    .set('phone', phone)
    .set('phoneCountry', phoneCountry);
};

export const loadVisitorInfoStateInto = (vi: VisitorInfoState): void => {
  const ls = visitorInfoLS;
  const { baseInfo } = vi;

  Object.keys(baseInfo).forEach(key => {
    let fieldName = key as keyof MinimalVisitorInfo;
    baseInfo[fieldName] = ls.get(fieldName) || '';
  });

  vi.wantsToShareContacts = !!ls.get('shareContacts');

  vi.email = vi.wantsToShareContacts ? ls.get('email') || '' : '';
  vi.phone = vi.wantsToShareContacts ? ls.get('phone') || '' : '';
  vi.phoneCountry = ensurePhoneCountry(
    ls.get('phoneCountry') || DefaultPhoneCountry,
  );
};

export const isVisitorInfoStateNotEmpty = (
  vi: VisitorInfoState,
): boolean => {
  return !!vi.baseInfo.firstName;
};
