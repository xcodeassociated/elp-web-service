import {AppConfig} from "../config/AppConfig"
import {UserEventCommand} from "../model/UserEventCommand";
import {optional} from "../model/Types";

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

export const fetchUserHistory = (): optional<Promise<Response>> => {
  const token = getToken()
  if (token) {
    let mode: RequestMode = "cors"
    const requestOptions = {
      method: 'GET',
      mode: mode,
      headers: requestHeaders(token),
    }
    return fetch(`${AppConfig.event_service_url}/event/api/v1/record/by/user/` + getUserSub(token)  + `/paged/data`, requestOptions)
  } else {
    return null
  }
}

export const register = (eventId: string): optional<Promise<Response>> => {
  const token: optional<string> = getToken()
  if (token) {
    const sub: optional<string> = getUserSub(token)
    if (sub) {
      const command: UserEventCommand = new UserEventCommand(eventId, sub)

      let mode: RequestMode = "cors"
      const requestOptions = {
        method: 'POST',
        mode: mode,
        headers: requestHeaders(token),
        body: JSON.stringify(command)
      }

      let url: string = `${AppConfig.event_service_url}/event/api/v1/record`
      return fetch(url, requestOptions)
    } else {
      return null
    }
  } else {
    return null
  }
}

export const deregister = (eventId: string): optional<Promise<Response>> => {
  const token = getToken()
  if (token) {
    let mode: RequestMode = "cors"
    const requestOptions = {
      method: 'DELETE',
      mode: mode,
      headers: requestHeaders(token)
    }
    let url: string = `${AppConfig.event_service_url}/event/api/v1/record/by/event/` + eventId
    return fetch(url, requestOptions)
  } else {
    return null
  }
}
