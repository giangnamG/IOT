import { configureStore } from '@reduxjs/toolkit'

import HookPage from './HookPage'
import Streaming from './Streaming'
import ResponseCommand from './ResponseCommand'

export default configureStore({
  reducer: {
    hook: HookPage,
    streaming: Streaming,
    responseCommand: ResponseCommand,
  },
})
