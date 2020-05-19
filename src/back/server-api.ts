import { GenericObject } from './common';
import { ServerAPIBase } from './server-api-base';

import * as CoreApi from './common/api';
import * as PublicEventsApi from './common/public-events/api';
import * as UsersApi from './common/users/api';

export type API = {
  core: CoreApi.ApiActions;
  events: PublicEventsApi.ApiActions;
  users: UsersApi.ApiActions;
};

export type DbgParams = {
  __delay?: number;
  __genErr?: boolean | string;
};

export class ServerAPI extends ServerAPIBase {
  private async _exec(target: string, action: string, params: GenericObject) {
    const { __delay, __genErr } = params;

    // отладочная тормозяшка
    if (__delay) {
      await new Promise(resolve => setTimeout(resolve, __delay));
    }

    // отладочная сбойняшка
    if (__genErr) {
      console.log(`API: raising debug error...`);
      throw new Error(
        typeof __genErr === 'string' ? __genErr : 'Ошибка в отладочных целях',
      );
    }

    return this.executeRequest({ target, action, ...params });
  }

  core = {
    exec: async <A extends keyof API['core']>(
      action: A,
      params: API['core'][A]['params'] & DbgParams,
    ): Promise<API['core'][A]['results']> => {
      return this._exec('core', action, params);
    },
  };

  users = {
    exec: async <A extends keyof API['users']>(
      action: A,
      params: API['users'][A]['params'] & DbgParams,
    ): Promise<API['users'][A]['results']> => {
      return this._exec('users', action, params);
    },
  };

  events = {
    exec: async <A extends keyof API['events']>(
      action: A,
      params: API['events'][A]['params'] & DbgParams,
    ): Promise<API['events'][A]['results']> => {
      return this._exec('events', action, params);
    },
  };

  // TODO: вытащить третью штуку
  // async exec<
  //   T extends keyof API,
  //   A extends keyof API[T],
  //   AP extends keyof API[T][A]
  // >(target: T, action: A, params: AP) {}
}

const theServerAPI = new ServerAPI();
export default theServerAPI;
