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
