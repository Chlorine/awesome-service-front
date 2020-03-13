import * as _ from 'lodash';

import { GenericObject } from './common-interfaces/common-front';
import { ApiActions, Params, Results } from './common-interfaces/common-api';
import { Utils } from './utils';

const DEBUG_DELAY = 0;

export const DEV_API_PORT = Number(process.env.REACT_APP_DEV_API_PORT || 3301);
export const DEV_API_HOSTNAME = window.location.hostname;

export class ServerAPI {
  private readonly apiUrl: string;

  constructor() {
    this.apiUrl = ServerAPI.URL;
  }

  static URL = process.env.NODE_ENV === 'production'
    ? `https://api.${window.location.hostname}/api`
    : `http://${DEV_API_HOSTNAME}:${DEV_API_PORT}/api`;

  async executeRequest(
    body: string | GenericObject,
    path: string = '/execute',
    method: 'POST' | 'GET' = 'POST',
  ): Promise<GenericObject> {
    if (_.isString(body)) {
      body = { action: body };
    }

    console.log('ServerAPI.executeRequest', this.apiUrl, body);

    const fetchOpts: RequestInit = {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin',
      body: 'POST' === method ? JSON.stringify(body) : null,
    };

    if (process.env.NODE_ENV !== 'production') {
      fetchOpts.credentials = 'include';
    }

    const response = await fetch(this.apiUrl + path, fetchOpts);

    DEBUG_DELAY &&
    (await new Promise(resolve => setTimeout(resolve, DEBUG_DELAY)));

    if (response.status < 200 || response.status >= 300)
      throw new Error(`${response.status} ${response.statusText}`);

    if (method !== 'POST') return {};

    const json = await response.json();

    console.log('ServerAPI.executeRequest', json);

    if (!json.success) {
      throw new Error(json.errorMsg || `Unknown error (!success && !errorMsg)`);
    }

    return json;
  }

  async execute<AT extends keyof ApiActions>(
    action: AT,
    params: Params<AT> & { __delay?: number, __genErr?: boolean | string },
  ): Promise<Results<AT>> {
    if (params.__delay) {
      await Utils.delay(params.__delay);
    }

    if (params.__genErr) {
      if (typeof params.__genErr === 'string') {
        throw new Error(params.__genErr);
      } else {
        throw new Error(`Тестовая ошибка во время выполнения метода '${action}'`);
      }
    }

    return this.executeRequest({ action, ...(params as any) }, '/execute', 'POST');
  }
}

const theServerAPI = new ServerAPI();
export default theServerAPI;
