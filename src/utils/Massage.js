import { ElMessage } from 'element-plus'

export default class Massage {
  static success(message) {
    ElMessage({
      message: message,
      type: 'success'
    })
  }

  static error(message) {
    ElMessage({
      message: message,
      type: 'error'
    })
  }

  static warning(message) {
    ElMessage({
      message: message,
      type: 'warning'
    })
  }
}
