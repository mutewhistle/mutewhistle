/**
 * Copyright 2019 Ironbelly Devs
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export const MAINNET_API_SECRET = ''
export const MAINNET_DEFAULT_NODE = 'https://next-node.ironbelly.app'
// import { MAINNET_DEFAULT_NODE, MAINNET_API_SECRET } from 'src/modules/settings'
import { store } from '../store/store'

export const migrations = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  0: (state: any) => {
    return {
      ...state,
      settings: {
        ...state.settings,
        checkNodeApiHttpAddr:
          state.settings.checkNodeApiHttpAddr ===
          'http://grinnode.cycle42.com:23413'
            ? MAINNET_DEFAULT_NODE
            : state.settings.checkNodeApiHttpAddr,
      },
    }
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  1: (state: any) => {
    const unsafeNode =
      state.settings.checkNodeApiHttpAddr === 'http://grinnode.cycle42.com:3413'
    if (unsafeNode) {
      // yeah, a side effect
      store.dispatch({ type: 'SET_API_SECRET', apiSecret: MAINNET_API_SECRET })
    }
    return {
      ...state,
      settings: {
        ...state.settings,
        checkNodeApiHttpAddr: unsafeNode
          ? MAINNET_DEFAULT_NODE
          : state.settings.checkNodeApiHttpAddr,
      },
    }
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  2: (state: any) => {
    const oldNode =
      state.settings.checkNodeApiHttpAddr === 'https://node.ironbelly.app'
    return {
      ...state,
      settings: {
        ...state.settings,
        checkNodeApiHttpAddr: oldNode
          ? MAINNET_DEFAULT_NODE
          : state.settings.checkNodeApiHttpAddr,
      },
    }
  },
}
