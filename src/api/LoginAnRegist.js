import Request from '@/service/request'

export const RegiserService = async (data) => {
  let res = await Request.post({
    url: '/register',
    data: data
  })
  return res
}

export const LoginService = async (data) => {
  let res = await Request.post({
    url: '/login?password=' + data.password + '&id=' + data.id
  })
  return res
}
