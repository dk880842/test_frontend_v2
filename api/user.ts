import { request } from './core/request'
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// ==========================================
// 定義資料介面 (Definitions)
// ==========================================

/** 用戶資訊 (對應 main.getUserInfoResp) */
export interface UserInfo {
  id: number
  name: string
  age: number
}

/** 創建用戶請求參數 (對應 main.createUserInfoReq) */
export interface CreateUserReq {
  name: string
  age: number
}

/** 創建用戶回傳資料 (對應 main.createUserInfoResp) */
export interface CreateUserResp {
  id: number
}

/** 更新用戶請求參數 (對應 main.updateUserInfoReq) */
export interface UpdateUserReq {
  id: number
  name: string
  age: number
}

/** 刪除用戶請求參數 (對應 main.deleteUserInfoReq) */
export interface DeleteUserReq {
  id: number
}

// ==========================================
// API 方法 (Paths)
// ==========================================

const API_PATH = '/user'

/**
 * [GET] 取得用戶清單
 */
export async function getUserList(): Promise<UserInfo[]> {
  return request.get<UserInfo[]>(API_PATH).then(res => res.data)
}
/**
 * [POST] 創建用戶
 */
export async function createUser(data: CreateUserReq): Promise<CreateUserResp> {
  return request.post<CreateUserResp>(API_PATH, data).then(res => res.data)
}

/**
 * [PUT] 修改用戶資訊
 */
export async function updateUser(data: UpdateUserReq): Promise<any> {
  return request.put<any>(API_PATH, data).then(res => res.data)
}

/**
 * [DELETE] 刪除用戶
 */
export async function deleteUser(data: DeleteUserReq): Promise<any> {
  return request.delete<any>(API_PATH, { data }).then(res => res.data)
}