import {optional} from "../model/Types";

export const getToken = (): optional<string> => {
  return localStorage.getItem('token')
}

export const hasToken = (): optional<boolean> => {
  return localStorage.getItem('token') != null
}

export const getUserSub = (token: string): optional<string> => {
  let jwtDecode: any = require('jwt-decode')
  const data: object = jwtDecode(token)
  return data["sub"]
}
