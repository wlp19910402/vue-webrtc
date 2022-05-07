//深拷贝方法回调
const deepCope: any = (obj: any) => {
  if (Array.isArray(obj)) {
    return obj.map((item) => deepCope(item))
  } else if (Object.prototype.toString.call(obj) === '[object Object]') {
    let dd = {}
    for (let i in obj) {
      if (typeof obj[i] !== 'object' || obj[i] === null) {
        dd[i] = obj[i]
      } else {
        dd[i] = deepCope(obj[i])
      }
    }
    return dd
  } else {
    return obj
  }
}

export default deepCope
