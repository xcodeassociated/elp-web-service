import {AppConfig} from "../config/AppConfig"
import {CategoryCommand} from "../model/CategoryCommand"
import {getToken} from "./TokenService";
import {optional} from "../model/Types";

const requestHeaders = (token: string) => [
  ['Content-Type', 'application/json'],
  ['Accept', 'application/json'],
  ['Access-Control-Allow-Origin', '*'],
  ['Sec-Fetch-Site', 'cross-site'],
  ['Authorization', `Bearer ${token}`]
]

export const fetchAllCategories = (): optional<Promise<Response>> => {
  const token = getToken()
  if (token) {
    let mode: RequestMode = "cors"
    const requestOptions = {
      method: 'GET',
      mode: mode,
      headers: requestHeaders(token),
    }
    return fetch(`${AppConfig.event_service_url}/event/api/v1/category`, requestOptions)
  } else {
    return null
  }
}

export const saveCategory = (event: CategoryCommand): optional<Promise<Response>> => {
  const token = getToken()
  if (token) {
    let mode: RequestMode = "cors"
    const requestOptions = {
      method: 'POST',
      mode: mode,
      headers: requestHeaders(token),
      body: JSON.stringify(event)
    }
    let url: string = `${AppConfig.event_service_url}/event/api/v1/category/save`
    return fetch(url, requestOptions)
  } else {
    return null
  }
}

export const deleteCategory = (id: String): optional<Promise<Response>>  => {
  const token = getToken()
  if (token) {
    let mode: RequestMode = "cors"
    const requestOptions = {
      method: 'DELETE',
      mode: mode,
      headers: requestHeaders(token),
    }
    let url: string = `${AppConfig.event_service_url}/event/api/v1/category/` + id
    return fetch(url, requestOptions)
  } else {
    return null
  }
}
