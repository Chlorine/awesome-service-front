import { GenericObject } from '../../back/common';
import { DaDataFioRequest } from '../../back/common/dadata';

export const isFioRequest = (req: GenericObject): req is DaDataFioRequest => {
  return req.query && req.parts && Array.isArray(req.parts) && req.parts[0];
};
