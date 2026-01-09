import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getUserList, createUser, updateUser, deleteUser,
  type UserInfo, type CreateUserReq, type UpdateUserReq
} from '~/api/user'

export const useUserStore = defineStore('user', () => {
  // State
  const list = ref<UserInfo[]>([])
  const editingId = ref<number | undefined>(undefined)

  // Actions
  const fetchList = async () => {
    try {
      const resData = await getUserList()
      list.value = resData
      return true
    } catch (error) {
      console.error('Fetch error:', error)
    }
  }

  // 2. 新增
  const addUserAction = async (payload: CreateUserReq) => {
    await createUser(payload)
    await fetchList()
  }

  // 3. 修改
  const updateUserAction = async (payload: UpdateUserReq) => {
    await updateUser(payload)
    await fetchList()
  }

  // 4. 刪除
  const deleteUserAction = async (id: number) => {
    await deleteUser({ id })
    await fetchList()
  }

  return {
    list,
    editingId,
    fetchList,
    addUserAction,
    updateUserAction,
    deleteUserAction
  }
})