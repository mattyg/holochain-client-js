/**
 * Defines AppWebsocket, an easy-to-use websocket implementation of the
 * Conductor API for apps
 *
 *    const client = AppWebsocket.connect(
 *      'ws://localhost:9000',
 *      signal => console.log('got a signal:', signal)
 *    )
 *
 *    client.callZome({...})  // TODO: show what's in here
 *      .then(() => {
 *        console.log('DNA successfully installed')
 *      })
 *      .catch(err => {
 *        console.error('problem installing DNA:', err)
 *      })
 */
import * as msgpack from '@msgpack/msgpack';

import { AppApi, CallZomeRequest, CallZomeResponse, AppInfoRequest, AppInfoResponse, CallZomeRequestGeneric, CallZomeResponseGeneric, AppSignalCb } from '../api/app'
import { WsClient } from './client'
import { catchError, promiseTimeout } from './common'
import { Transformer, requesterTransformer, Requester } from '../api/common'

export class AppWebsocket implements AppApi {
  client: WsClient
  timeout?: number

  constructor(client: WsClient, timeout?: number) {
    this.client = client
    this.timeout = timeout
  }

  static async connect(url: string, timeout?: number, signalCb?: AppSignalCb): Promise<AppWebsocket> {
    const wsClient = await WsClient.connect(url, signalCb)
    return new AppWebsocket(wsClient, timeout)
  }

  _requester = <ReqO, ReqI, ResI, ResO>(tag: string, transformer?: Transformer<ReqO, ReqI, ResI, ResO>) =>
    requesterTransformer(
      (req, timeout) => promiseTimeout(this.client.request(req), tag, timeout || this.timeout).then(catchError),
      tag,
      transformer
    )

  appInfo: Requester<AppInfoRequest, AppInfoResponse>
    = this._requester('app_info')
  callZome: Requester<CallZomeRequestGeneric<any>, CallZomeResponseGeneric<any>>
    = this._requester('zome_call_invocation', callZomeTransform)
}

const callZomeTransform: Transformer<CallZomeRequestGeneric<any>, CallZomeRequestGeneric<Buffer>, CallZomeResponseGeneric<Buffer>, CallZomeResponseGeneric<any>> = {
  input: (req: CallZomeRequestGeneric<any>): CallZomeRequestGeneric<Buffer> => {
    req.payload = msgpack.encode(req.payload)
    return req
  },
  output: (res: CallZomeResponseGeneric<Buffer>): CallZomeResponseGeneric<any> => {
    return msgpack.decode(res)
  }
}
