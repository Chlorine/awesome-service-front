import { GenericObject } from '../../common-interfaces/common-front';

export type DaDataNamePart = 'NAME' | 'PATRONYMIC' | 'SURNAME';
export type DaDataGender = 'MALE' | 'FEMALE' | 'UNKNOWN';

export type DaDataFio = {
  /**
   * Имя
   */
  name: string | null;
  /**
   * Отчество
   */
  patronymic: string | null;
  /**
   * Фамилия
   */
  surname: string | null;
  /**
   * Пол
   *
   *   FEMALE;
   *   MALE;
   *   UNKNOWN  — не удалось однозначно определить.
   */
  gender: DaDataGender;
  /**
   * Код качества
   *
   *   0 - если все части ФИО найдены в справочниках.
   *   1 - если в ФИО есть часть не из справочника
   */
  qc: 1 | 0;
};

export type DaDataFioRequest = {
  query: string;
  count?: number;
  parts?: DaDataNamePart[];
  gender?: DaDataGender;
};

export const isFioRequest = (req: GenericObject): req is DaDataFioRequest => {
  return req.query && req.parts && Array.isArray(req.parts) && req.parts[0];
};
