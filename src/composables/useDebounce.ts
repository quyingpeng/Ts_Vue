/*
 * @Author: qyp
 * @Date: 2026-06-28 17:13:08
 * @LastEditors: qyp
 * @LastEditTime: 2026-06-28 17:13:29
 * @Description: 
 */
import {ref,watch} from 'vue'

export function useDebounce<T>(source: Ref<T>, delay: number = 300) {
  const debouncedValue = ref(source.value) as Ref<T>

  let timer: ReturnType<typeof setTimeout>
  watch(source, (val) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      debouncedValue.value = val
    }, delay)
  })

  return debouncedValue
}