export const debounce = (callback: Function, delay: number = 1000) => {
    let timeout: any
  
    return (...args: any) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => callback(...args), delay)
    }
  }