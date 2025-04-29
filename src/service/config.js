let BASE_URL = 'http://10.33.24.59:5050'
if (import.meta.env.PROD) {
  // 生产环境
  BASE_URL = 'http://10.33.24.59:5050'
} else {
  // 开发环境
  BASE_URL = 'http://10.33.24.59:5050'
}

// console.log(BASE_URL)

// 3.通过创建.env文件直接创建变量
// console.log(import.meta.env.VITE_URL)

export const TIME_OUT = 1000000
export { BASE_URL }
