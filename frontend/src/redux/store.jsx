import { configureStore } from '@reduxjs/toolkit'

import HookPage from './HookPage'
import Streaming from './Streaming'

export default configureStore({
  reducer: {
    hook: HookPage,
    streaming: Streaming
  },
})
