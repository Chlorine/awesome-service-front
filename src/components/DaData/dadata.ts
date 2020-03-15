import { EventEmitter, EventSubscription } from 'fbemitter';
import * as _ from 'lodash';
import { GenericObject } from '../../common-interfaces/common-front';
import { DaDataFioCache } from './dadata-cache';
import {
  DaDataFio,
  DaDataFioRequest,
  DaDataGender,
  DaDataNamePart,
  isFioRequest,
} from './dadata-fio';
import { ServerAPI } from '../../server-api';

export type DaDataApiName = 'fio' | 'address';

export type DaDataSuggestion<T> = {
  value: string;
  unrestricted_value: string;
  data: T;
};

export type DaDataFioSuggestion = DaDataSuggestion<DaDataFio>;

export type SuggestionsListener = (
  suggestions: DaDataSuggestion<any>[],
) => void;

const USE_OWN_BACKEND = true;

export class DaDataApi {
  private token = '00c3ab4b56af68caa1ea96ef0f2f63fb6d1e0cb1';

  private ee = new EventEmitter();
  private xhr?: XMLHttpRequest;
  private subscription?: EventSubscription;
  private debouncedBeginFetch = _.debounce(this._beginFetch.bind(this), 300, {
    leading: true,
  });

  namePartRegexp?: RegExp;

  private fioCache = new DaDataFioCache();

  subscribe(listener: SuggestionsListener) {
    if (this.subscription) {
      this.subscription.remove();
    }

    this.subscription = this.ee.addListener('fetched', listener);
  }

  onOwnerUnmount() {
    if (this.subscription) {
      this.subscription.remove();
    }

    if (this.xhr) {
      this.xhr.abort();
    }
  }

  private emitResults(suggestions: DaDataSuggestion<any>[]) {
    if (this.subscription) {
      this.ee.emit('fetched', suggestions);
    }
  }

  private isValidQuery(query: string) {
    if (!query) return false;

    if (this.namePartRegexp) {
      if (!this.namePartRegexp.test(query)) return false;
    }

    return true;
  }

  beginFetchFio(query: string, namePart: DaDataNamePart, gender: DaDataGender) {
    const q = query.toLowerCase().trim();

    if (!this.isValidQuery(q)) {
      console.log(`DaDataApi.beginFetchFio: bad query, skipping fetch`);
      this.emitResults([]);
    } else {
      const suggestions = this.fioCache.get(q, namePart, gender);
      if (suggestions) {
        this.emitResults(suggestions);
      } else {
        const req: DaDataFioRequest = {
          query: q,
          parts: [namePart],
          gender,
        };
        this.debouncedBeginFetch('fio', req);
      }
    }
  }

  private _beginFetch(
    api: DaDataApiName,
    params: { query: string } & GenericObject,
  ) {
    if (this.xhr) {
      this.xhr.abort();
    }

    const timestamp = new Date().getTime();
    console.log(`DaDataApi._beginFetch "${api}"`, JSON.stringify(params));

    this.xhr = new XMLHttpRequest();

    let url = USE_OWN_BACKEND ? ServerAPI.URL : 'https://suggestions.dadata.ru';
    url += `/suggestions/api/4_1/rs/suggest/${api}`;

    this.xhr.open('POST', url);

    this.xhr.setRequestHeader('Accept', 'application/json');
    this.xhr.setRequestHeader('Authorization', `Token ${this.token}`);
    this.xhr.setRequestHeader('Content-Type', 'application/json');

    this.xhr.onreadystatechange = () => {
      if (!this.xhr || this.xhr.readyState !== 4) {
        return;
      }

      console.log(`DaDataApi.xhr.onreadystatechange ${this.xhr.status}`);

      if (this.xhr.status >= 200 && this.xhr.status <= 300) {
        const json = JSON.parse(this.xhr.response);
        if (json && json.suggestions && Array.isArray(json.suggestions)) {
          console.log(
            `DaDataApi: received ${
              json.suggestions.length
            } suggestion(s) in ${new Date().getTime() - timestamp} ms`,
          );

          if (isFioRequest(params)) {
            this.fioCache.set(
              params.query,
              params.parts![0],
              json.suggestions,
              params.gender,
            );
          }

          if (this.subscription) {
            this.ee.emit('fetched', json.suggestions);
          }
        }
      } else {
        console.error(
          `DaDataApi: bad xhr.status (${this.xhr.status}, ${this.xhr.statusText})`,
        );
      }
    };

    this.xhr.send(JSON.stringify(params));
  }
}
