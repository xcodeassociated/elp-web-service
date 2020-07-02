import {AppConfig} from "../config/AppConfig"
import {optional} from "../model/Types";
import {UserAccountDataCommand} from "../model/UserAccountDataCommand";

const getToken = (): optional<string> => {
  return localStorage.getItem('token')
}

const getUserSub = (token: string): string | null => {
  let jwtDecode: any = require('jwt-decode')
  const data: object = jwtDecode(token)
  return data["sub"]
}

const requestHeaders = (token: string) => [
  ['Content-Type', 'application/json'],
  ['Accept', 'application/json'],
  ['Access-Control-Allow-Origin', '*'],
  ['Sec-Fetch-Site', 'cross-site'],
  ['Authorization', `Bearer ${token}`]
]

export const fetchUserAccountData = (): optional<Promise<Response>> => {
  const token = getToken()
  if (token) {
    let mode: RequestMode = "cors"
    const requestOptions = {
      method: 'GET',
      mode: mode,
      headers: requestHeaders(token),
    }
    return fetch(`${AppConfig.user_service_url}/user/api/v1/users/by/authId/` + getUserSub(token), requestOptions)
  } else {
    return null
  }
}

export const updateUserAccountData = (command: UserAccountDataCommand): optional<Promise<Response>> => {
  const token: optional<string> = getToken()
  if (token) {
    let mode: RequestMode = "cors"
    const requestOptions = {
      method: 'PUT',
      mode: mode,
      headers: requestHeaders(token),
      body: JSON.stringify(command)
    }
    let url: string = `${AppConfig.user_service_url}/user/api/v1/users/update`
    return fetch(url, requestOptions)
  } else {
    return null
  }
}
