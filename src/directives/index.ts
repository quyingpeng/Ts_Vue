/*
 * @Author: qyp
 * @Date: 2026-06-21 22:55:37
 * @LastEditors: qyp
 * @LastEditTime: 2026-06-21 22:56:45
 * @Description: 
 */
import type {App} from 'vue'
import {permission,role} from './permission'

export function setupDirectives(app:App){
  app.directive('permission', permission)
  app.directive('role',role)
}