import {AppConfig} from "../config/AppConfig"
import {EventCommand} from "../model/EventCommand"
import {EventSearch} from "../model/EventSearch"
import {Location} from "../model/Location"
import {getToken, getUserSub} from "./TokenService";
import {optional} from "../model/Types";

const requestHeaders = (token: string) => [
  ['Content-Type', 'application/json'],
  ['Accept', 'application/json'],
  ['Access-Control-Allow-Origin', '*'],
  ['Sec-Fetch-Site', 'cross-site'],
  ['Authorization', `Bearer ${token}`]
]

const makeUrl = (path: string, page: number = 1, size: number = 10, sortBy: string, sortDirection: string): URL => {
  let url: URL = new URL(path), params = {page: page, size: size, sort_by: sortBy, sort_how: sortDirection}
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
  return url
}

export const fetchAllUserEvents = (page: number = 1, size: number = 1000, sortBy: string = 'id', sortDirection: string = 'asc'): optional<Promise<Response>> => {
  const token = getToken()
  if (token) {
    let mode: RequestMode = "cors"
    const requestOptions = {
      method: 'GET',
      mode: mode,
      headers: requestHeaders(token),
    }
    const path: string = `${AppConfig.event_service_url}/event/api/v1/events/by/createdby/` + getUserSub(token) + `/paged/data`
    const url: URL = makeUrl(path, page, size, sortBy, sortDirection)
    return fetch(url.toString(), requestOptions)
  } else {
    return null
  }
}

export const fetchAllActiveEvents = (page: number = 1, size: number = 10, sortBy: string = 'id', sortDirection: string = 'asc'): optional<Promise<Response>> => {
  const token = getToken()
  if (token) {
    let mode: RequestMode = "cors"
    const requestOptions = {
      method: 'GET',
      mode: mode,
      headers: requestHeaders(token),
    }
    const url: URL = makeUrl(`${AppConfig.event_service_url}/event/api/v1/events/active/paged/data`, page, size, sortBy, sortDirection)
    return fetch(url.toString(), requestOptions)
  } else {
    return null
  }
}

export const fetchAllRecommendedEvents = (location: Location, page: number = 1, size: number = 10, sortBy: string = 'id', sortDirection: string = 'asc'): optional<Promise<Response>> => {
  const token = getToken()
  if (token) {
    let mode: RequestMode = "cors"
    const requestOptions = {
      method: 'POST',
      mode: mode,
      headers: requestHeaders(token),
      body: JSON.stringify(location)
    }
    const url: URL = makeUrl(`${AppConfig.event_service_url}/event/api/v1/events/preferred/paged/data`, page, size, sortBy, sortDirection)
    return fetch(url.toString(), requestOptions)
  } else {
    return null
  }
}

export const searchEvents = (search: EventSearch, page: number = 1, size: number = 10, sortBy: string = 'id', sortDirection: string = 'asc'): optional<Promise<Response>> => {
  const token = getToken()
  if (token) {
    let mode: RequestMode = "cors"
    const requestOptions = {
      method: 'POST',
      mode: mode,
      headers: requestHeaders(token),
      body: JSON.stringify(search)
    }
    const url: URL = makeUrl(`${AppConfig.event_service_url}/event/api/v1/events/search/data`, page, size, sortBy, sortDirection)
    return fetch(url.toString(), requestOptions)
  } else {
    return null
  }
}

export const createEvent = (event: EventCommand): optional<Promise<Response>> => {
  const token = getToken()
  if (token) {
    let mode: RequestMode = "cors"
    const requestOptions = {
      method: 'POST',
      mode: mode,
      headers: requestHeaders(token),
      body: JSON.stringify(event)
    }
    let url: string = `${AppConfig.event_service_url}/event/api/v1/events/create`
    return fetch(url, requestOptions)
  } else {
    return null
  }
}

export const updateEvent = (event: EventCommand): optional<Promise<Response>> => {
  const token = getToken()
  if (token) {
    let mode: RequestMode = "cors"
    const requestOptions = {
      method: 'PUT',
      mode: mode,
      headers: requestHeaders(token),
      body: JSON.stringify(event)
    }
    let url: string = `${AppConfig.event_service_url}/event/api/v1/events/update`
    return fetch(url, requestOptions)
  } else {
    return null
  }
}

export const deleteEvent = (id: String): optional<Promise<Response>> => {
  const token = getToken()
  if (token) {
    let mode: RequestMode = "cors"
    const requestOptions = {
      method: 'DELETE',
      mode: mode,
      headers: requestHeaders(token),
    }
    let url: string = `${AppConfig.event_service_url}/event/api/v1/events/` + id
    return fetch(url, requestOptions)
  } else {
    return null
  }
}
