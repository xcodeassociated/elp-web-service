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

// todo: remove if not needed
export const fetchAllEvents = (): optional<Promise<Response>> => {
  const token = getToken()
  if (token) {
    let mode: RequestMode = "cors"
    const requestOptions = {
      method: 'GET',
      mode: mode,
      headers: requestHeaders(token),
    }
    return fetch(`${AppConfig.event_service_url}/event/api/v1/events/paged/data`, requestOptions)
  } else {
    return null
  }
}

export const fetchAllUserEvents = (): optional<Promise<Response>> => {
  const token = getToken()
  if (token) {
    let mode: RequestMode = "cors"
    const requestOptions = {
      method: 'GET',
      mode: mode,
      headers: requestHeaders(token),
    }
    return fetch(`${AppConfig.event_service_url}/event/api/v1/events/by/createdby/` + getUserSub(token) + `/paged/data`, requestOptions)
  } else {
    return null
  }
}

export const fetchAllActiveEvents = (): optional<Promise<Response>> => {
  const token = getToken()
  if (token) {
    let mode: RequestMode = "cors"
    const requestOptions = {
      method: 'GET',
      mode: mode,
      headers: requestHeaders(token),
    }
    return fetch(`${AppConfig.event_service_url}/event/api/v1/events/active/paged/data`, requestOptions)
  } else {
    return null
  }
}

export const fetchAllRecommendedEvents = (location: Location): optional<Promise<Response>> => {
  const token = getToken()
  if (token) {
    let mode: RequestMode = "cors"
    const requestOptions = {
      method: 'POST',
      mode: mode,
      headers: requestHeaders(token),
      body: JSON.stringify(location)
    }
    return fetch(`${AppConfig.event_service_url}/event/api/v1/events/preferred/paged/data`, requestOptions)
  } else {
    return null
  }
}

export const searchEvents = (search: EventSearch): optional<Promise<Response>> => {
  const token = getToken()
  if (token) {
    let mode: RequestMode = "cors"
    const requestOptions = {
      method: 'POST',
      mode: mode,
      headers: requestHeaders(token),
      body: JSON.stringify(search)
    }
    return fetch(`${AppConfig.event_service_url}/event/api/v1/events/search/data`, requestOptions)
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
