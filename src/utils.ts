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