/**
 * 公共的数据
 */
import { defineStore } from 'pinia'
import createStoreCommon from './common'
import createStoreUserInfo from './userinfo'
import createStoreNotification from './notification'
import createStorePortal from './portal'
export default defineStore<
  'all',
  {},
  {},
  {
    clearAll(): void
  }
>({
  id: 'all',
  actions: {
    //清除所有缓存
    clearAll() {
      const useStoreCommon = createStoreCommon()
      const useUserBasic = createStoreUserInfo()
      const useNotification = createStoreNotification()
      const usePortal = createStorePortal()
      useStoreCommon.clear()
      useUserBasic.clear()
      useNotification.clear()
      usePortal.clear()
    },
  },
})
