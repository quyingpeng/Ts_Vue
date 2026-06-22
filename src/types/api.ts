/*
 * @Author: qyp
 * @Date: 2026-06-16 13:26:03
 * @LastEditors: qyp
 * @LastEditTime: 2026-06-16 13:29:16
 * @Description: 
 */
// 统一的后端返回格式
export interface ApiResponse<T= any> {
  code:number
  data:T
  message:string
}

// 分页请求参数
export interface PaginationParams {
  page: number
  pageSize: number
}

// 分页返回数据
export interface PaginatedData<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}