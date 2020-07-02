import {AppConfig} from "../config/AppConfig"
import {optional} from "../model/Types";
import {getToken, getUserSub} from "./TokenService";

const requestHeaders = (token: string) => [
  ['Content-Type', 'application/json'],
  ['Accept', 'application/json'],
  ['Access-Control-Allow-Origin', '*'],
  ['Sec-Fetch-Site', 'cross-site'],
  ['Authorization', `Bearer ${token}`]
]

export const fetchAllSpots = (): optional<Promise<Response>> => {
  const token = getToken()
  if (token) {
    let mode: RequestMode = "cors"
    const requestOptions = {
      method: 'GET',
      mode: mode,
      headers: requestHeaders(token),
    }
    return fetch(`${AppConfig.event_service_url}/event/api/v1/spot/paged`, requestOptions)
  } else {
    return null
  }
}

