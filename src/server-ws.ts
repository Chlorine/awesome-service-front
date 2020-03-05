import { EventEmitter, EventSubscription } from 'fbemitter';
import io from 'socket.io-client';

import { DEV_API_HOSTNAME as DEBUG_HOSTNAME, DEV_API_PORT as DEBUG_PORT } from './server-api';
import { WSMessages, WSMessagePayload } from './common-interfaces/common-front';

declare type Socket = SocketIOClient.Socket;

class ServerWS extends EventEmitter {
  socket: Socket | null;
  private readonly ns = '/default';

  constructor() {
    super();

    this.socket = null;
  }

  get connected(): boolean {
    return !!this.socket && this.socket.connected;
  }

  emitEvent<T extends keyof WSMessages>(
    eventType: T,
    payload: WSMessagePayload<T>,
  ) {
    if (this.connected) {
      this.socket!.emit(eventType, payload);
    }
  }

  disconnect() {
    console.log('ServerWS.disconnect');
    this._disconnect();
  }

  private _disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  private get wsUri() {
    if (process.env.NODE_ENV === 'production') {
      return window.location.origin + this.ns;
    }
    return `http://${DEBUG_HOSTNAME}:${DEBUG_PORT}${this.ns}`;
  }

  connect() {
    console.log('ServerWS.connect');
    this._disconnect();

    this.socket = io.connect(this.wsUri, {});

    this.socket.on('connect', () => this.emit('connect'));
    this.socket.on('disconnect', () => this.emit('disconnect'));

    this.addSocketListeners([
      'updateStats',
      'infoEvent',
    ]);
  }

  private addSocketListeners<WSM extends keyof WSMessages>(msgTypes: WSM[]) {
    msgTypes.forEach(msgType =>
      this.socket!.on(msgType, (payload: WSMessagePayload<WSM>) =>
        this.emit(msgType, payload),
      ),
    );
  }

  subscribeTo<T extends keyof WSMessages>(
    msgType: T,
    handler: (payload: WSMessagePayload<T>) => void,
  ): EventSubscription {
    return this.addListener(msgType, handler);
  }
}

const theServerWS = new ServerWS();

export class WSHelper {
  private subscriptions: EventSubscription[] = [];
  ws: ServerWS = theServerWS;
  onConnStateChanged: ((connected: boolean) => void) | undefined;

  constructor() {
    this.subscriptions.push(
      this.ws.addListener('connect', () => this._onConnStateChanged(true)),
    );
    this.subscriptions.push(
      this.ws.addListener('disconnect', () => this._onConnStateChanged(false)),
    );
  }

  private _onConnStateChanged(connected: boolean) {
    this.onConnStateChanged && this.onConnStateChanged(connected);
  }

  subscribeTo<T extends keyof WSMessages>(
    msgType: T,
    handler: (payload: WSMessagePayload<T>) => void,
  ) {
    this.subscriptions.push(this.ws.addListener(msgType, handler));

    return this;
  }

  onBeforeUnmount() {
    this.subscriptions.forEach(s => s.remove());
  }
}
