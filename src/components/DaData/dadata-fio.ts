import { GenericObject } from '../../common-interfaces/common-front';
import { DaDataFioRequest } from '../../common-interfaces/common-dadata';

export const isFioRequest = (req: GenericObject): req is DaDataFioRequest => {
  return req.query && req.parts && Array.isArray(req.parts) && req.parts[0];
};
