import { EventEmitter, EventSubscription } from 'fbemitter';
import * as _ from 'lodash';
import { GenericObject } from '../../common-interfaces/common-front';
import { DaDataFioCache } from './dadata-cache';
import { isFioRequest } from './dadata-fio';
import { ServerAPI } from '../../server-api';

import {
  DaDataFio,
  DaDataFioRequest,
  DaDataGender,
  DaDataNamePart,
  DaDataSuggestion,
  DaDataSuggestionsSource,
} from '../../common-interfaces/common-dadata';

export type DaDataApiName = 'fio' | 'address';

export type SuggestionsSource =
  | DaDataSuggestionsSource
  | 'local-cache'
  | 'backend';

export type Stats = {
  et: number;
  lt: number;
  src: SuggestionsSource | null;
};

export type SuggestionsListener = (
  suggestions: DaDataSuggestion<DaDataFio>[],
  stats: Stats,
) => void;

const USE_OWN_BACKEND = true;

export class DaDataApi {
  private token = 'WRONG_TOKEN!';

  private ee = new EventEmitter();
  private xhr?: XMLHttpRequest;
  private subscription?: EventSubscription;

  private throttledBeginFetch = _.throttle(this._beginFetch.bind(this), 300);
  private debouncedBeginFetch = _.debounce(this._beginFetch.bind(this), 400, {
    leading: false,
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

  private emitResults(suggestions: DaDataSuggestion<any>[], stats: Stats) {
    if (this.subscription) {
      this.ee.emit('fetched', suggestions, stats);
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
      this.emitResults([], { et: 0, lt: 0, src: null });
    } else {
      const suggestions = this.fioCache.get(q, namePart, gender);
      if (suggestions) {
        this.emitResults(suggestions, { et: 0, lt: 0, src: 'local-cache' });
      } else {
        const req: DaDataFioRequest = {
          query: q,
          parts: [namePart],
          gender,
          count: undefined, // не отправляем; по умолч. 10
        };

        if(q.length < 5) {
          this.throttledBeginFetch('fio', req);
        } else {
          this.debouncedBeginFetch('fio', req);
        }
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
    this.xhr.setRequestHeader('Content-Type', 'application/json');

    if (!USE_OWN_BACKEND) {
      this.xhr.setRequestHeader('Authorization', `Token ${this.token}`);
    }

    this.xhr.onreadystatechange = () => {
      if (!this.xhr || this.xhr.readyState !== 4) {
        return;
      }

      console.log(`DaDataApi.xhr.onreadystatechange ${this.xhr.status}`);

      if (this.xhr.status >= 200 && this.xhr.status <= 300) {
        const loadingTime = new Date().getTime() - timestamp;
        const json = JSON.parse(this.xhr.response);

        if (json && json.suggestions && Array.isArray(json.suggestions)) {
          console.log(
            `DaDataApi: received ${json.suggestions.length} suggestion(s) in ${loadingTime} ms`,
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
            const stats: Stats = {
              et: _.get(json, 'stats.et') || 0,
              lt: loadingTime,
              src: _.get(json, 'stats.src') || 'backend',
            };

            this.emitResults(json.suggestions, stats);
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
