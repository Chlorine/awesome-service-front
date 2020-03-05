import * as yup from 'yup';

export class Utils {
  static isInteger(nVal: any): boolean {
    return (
      typeof nVal === 'number' &&
      isFinite(nVal) &&
      nVal > -9007199254740992 &&
      nVal < 9007199254740992 &&
      Math.floor(nVal) === nVal
    );
  }

  static localStorageGet(key: string): any {
    if (window.localStorage) {
      try {
        let value = window.localStorage.getItem(key);
        if (value) {
          return JSON.parse(value);
        }
      } catch (err) {
        console.error(`localStorageGet('${key}'): ${err}`);
      }
    }

    return undefined;
  }

  static localStorageSet(key: string, value: any): boolean {
    if (window.localStorage) {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (err) {
        console.error(`localStorageSet('${key}'): ${err}`);
      }
    }

    return false;
  }

  static isStrBlank(str: string | null): boolean {
    if (str == null) str = '';

    return /^\s*$/.test(str);
  }

  static async delay(ms: number): Promise<void> {
    return new Promise(resolve => {
      window.setTimeout(resolve, ms);
    });
  }
}

export type GetElementType<T extends Array<any>> = T extends (infer U)[]
  ? U
  : never;

export class LocalStorageHelper<PN extends string = string> {
  constructor(public namePrefix: string) {}

  private makeParamName(name: PN) {
    return `${this.namePrefix}_${name}`;
  }

  get(paramName: PN) {
    return Utils.localStorageGet(this.makeParamName(paramName));
  }

  set(paramName: PN, value: any) {
    Utils.localStorageSet(this.makeParamName(paramName), value);
    return this;
  }
}

export const YupSchemes = {
  stringField: (
    maxLength: number,
    required: 'required' | 'optional' = 'required',
  ) => {
    // TODO: уразуметь как они цепочаться
    return required === 'required'
      ? yup
          .string()
          .required()
          .max(maxLength)
          .trim()
      : yup
          .string()
          .max(maxLength)
          .trim();
  },
  email: (maxLength: number) => {
    return yup.string().required().max(maxLength).email().trim();
  }
};
