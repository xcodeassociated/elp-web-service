import {AppConfig} from "../config/AppConfig"
import {UserDataCommand} from "../model/UserDataCommand";
import {getToken} from "./TokenService";

const requestHeaders = (token: string) => [
  ['Content-Type', 'application/json'],
  ['Accept', 'application/json'],
  ['Access-Control-Allow-Origin', '*'],
  ['Sec-Fetch-Site', 'cross-site'],
  ['Authorization', `Bearer ${token}`]
]

export const fetchUserData = (): Promise<Response> | null => {
  const token = getToken()
  if (token) {
    let mode: RequestMode = "cors"
    const requestOptions = {
      method: 'GET',
      mode: mode,
      headers: requestHeaders(token),
    }
    return fetch(`${AppConfig.event_service_url}/event/api/v1/userdata/data`, requestOptions)
  } else {
    return null
  }
}

export const saveUserData = (data: UserDataCommand): Promise<Response> | null => {
  const token = getToken()
  if (token) {
    let mode: RequestMode = "cors"
    const requestOptions = {
      method: 'POST',
      mode: mode,
      headers: requestHeaders(token),
      body: JSON.stringify(data)
    }
    let url: string = `${AppConfig.event_service_url}/event/api/v1/userdata/save`
    return fetch(url, requestOptions)
  } else {
    return null
  }
}

