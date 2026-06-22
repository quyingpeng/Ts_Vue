/*
 * @Author: qyp
 * @Date: 2026-06-21 22:03:48
 * @LastEditors: qyp
 * @LastEditTime: 2026-06-21 22:55:23
 * @Description: 
 */
import type { Directive, DirectiveBinding } from 'vue'
import { useUserStore } from '@/stores/user'

// 角色权重：admin > editor > viewer
const roleLevel: Record<string, number> = {
  admin: 3,
  editor: 2,
  viewer: 1
}

function checkPermission(required: string): boolean {
  const userStore = useUserStore()
  const role = userStore.user?.role
  if (!role) return false
  return roleLevel[role] >= roleLevel[required]
}

// v-permission：只有指定角色及以上才能看到
export const permission: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const required = binding.value as string
    if (!checkPermission(required)) {
      el.parentNode?.removeChild(el)  // 没权限直接移除 DOM
    }
  }
}

// v-role：只有角色在数组里才能看到
export const role: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const roles = binding.value as string[]
    const userStore = useUserStore()
    const userRole = userStore.user?.role
    if (!userRole || !roles.includes(userRole)) {
      el.parentNode?.removeChild(el)
    }
  }
}