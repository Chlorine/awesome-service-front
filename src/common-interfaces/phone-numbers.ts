export type PhoneCountry = 'ru' | 'by' | 'kz' | 'ua' | '*';

export const DefaultPhoneCountry: PhoneCountry = 'ru';

export const AllPhoneCountries: PhoneCountry[] = ['ru', 'by', 'kz', 'ua', '*'];

export const ensurePhoneCountry = (country: string): PhoneCountry => {
  return AllPhoneCountries.includes(country as PhoneCountry)
    ? (country as PhoneCountry)
    : DefaultPhoneCountry;
};

export type PhoneCountryInfo = {
  name: string;
  prefix: string;
  mask: string;
  valuePrefix?: string;
  minLength?: number; // 10!
};

export const PhoneCountries: {
  [key in PhoneCountry]: PhoneCountryInfo;
} = {
  ru: {
    name: 'Россия',
    prefix: '+7',
    mask: '+7 (###) ###-##-##',
  },
  by: {
    name: 'Беларусь',
    prefix: '+375',
    mask: '+375 (##) ###-##-##',
    valuePrefix: '',
    minLength: 9,
  },
  kz: {
    name: 'Қазақстан',
    prefix: '+7',
    mask: '+7 (###) ###-##-##',
  },
  ua: {
    name: 'Україна',
    prefix: '+380',
    mask: '+380 (##) ###-##-##',
    valuePrefix: '',
    minLength: 9,
  },
  '*': {
    name: 'Другое',
    prefix: '+',
    mask: '+ ##############',
    minLength: 11,
  },
};

export class PCUtils {
  static phoneFromFormValue(country: PhoneCountry, formValue: string): string {
    return `${PhoneCountries[country].valuePrefix || ''}${formValue}`
  }

  static formValueFromPhone(country: PhoneCountry, phone: string): string {
    if (!phone) {
      return '';
    }

    const prefix = PhoneCountries[country].valuePrefix;
    if (!prefix) {
      return phone;
    }

    if(!phone.startsWith(prefix)) {
      return phone; // какая-то фигня, но хсн
    }

    return phone.substr(prefix.length);
  }
}

