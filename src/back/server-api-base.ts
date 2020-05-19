import { ApiResults, GenericObject } from './common';

export const DEV_API_PORT = Number(process.env.REACT_APP_DEV_API_PORT || 3301);
export const DEV_API_HOSTNAME = window.location.hostname;

// https://developer.mozilla.org/ru/docs/Web/API/Fetch_API/Using_Fetch

// `https://api.${window.location.hostname}/api`

export class ServerAPIBase {
  static URL =
    process.env.NODE_ENV === 'production'
      ? `https://api.cloudtickets.io/api`
      : `http://${DEV_API_HOSTNAME}:${DEV_API_PORT}/api`;

  async executeRequest(
    body: string | GenericObject,
    path: string = '/execute',
    method: 'POST' | 'GET' = 'POST',
  ): Promise<ApiResults> {
    const tm = new Date().getTime();

    if (typeof body === 'string') {
      body = { action: body };
    }

    const action = body.action || '';
    const target = body.target || 'core';

    console.log(`API: ${method} ${ServerAPIBase.URL + path}`, body);

    const fetchOpts: RequestInit = {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials:
        process.env.NODE_ENV !== 'production' ? 'include' : 'same-origin',
      body: 'POST' === method ? JSON.stringify(body) : null,
    };

    let response: Response;

    try {
      response = await fetch(ServerAPIBase.URL + path, fetchOpts);
    } catch(err) {
      console.error(`API: ${target}|${action} ERROR: ${err.message}`);
      throw new Error('Нет ответа от сервера');
    }

    const { ok, status, statusText } = response;

    let json: ApiResults;

    // у нас должно быть application/json даже когда не "200 OK"

    try {
      json = await response.json();
    } catch (err) {
      json = {
        success: false,
        errorMsg: ok
          ? `Некорректный ответ сервера (JSON parsing failed (${err}))`
          : `Не удалось получить ответ от сервера (${status} ${statusText})`,
      };
    }

    const et = `${new Date().getTime() - tm} ms`;

    if (!json.success) {
      console.error(`API: ${target}|${action} ERROR: ${json.errorMsg} (${et})`);
      throw new Error(json.errorMsg || 'Неизвестная ошибка');
    }


    console.log(`API: ${target}|${action} ${status} ${statusText} (${et})`, json);

    return json;
  }

  // private static async processResponse
}


