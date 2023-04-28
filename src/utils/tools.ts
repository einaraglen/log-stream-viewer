import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

export const debounce = (callback: Function, delay: number = 1000) => {
  let timeout: any

  return (...args: any) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => callback(...args), delay)
  }
}

export const classNames = (...classes: any[]): string => {
  return classes.filter(Boolean).join(' ')
}

export const duration = (from: any, to: any): string => {
  return dayjs(to).from(dayjs(from), true) 
}
