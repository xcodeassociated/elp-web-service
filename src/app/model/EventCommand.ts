export interface ILocation {
  latitude: String,
  longitude: String
}

export class Location implements ILocation{
  latitude: String
  longitude: String

  constructor(latitude: string, longitude: string) {
    this.latitude = latitude
    this.longitude = longitude
  }
}

export interface IEvent {
  id: string | null
  title: String,
  description: String,
  location: ILocation
}

export class EventCommand implements IEvent {
  id: string | null
  title: String
  description: String
  location: Location

  constructor(id: string | null, title: string, description: string, location: Location) {
    this.id = id
    this.title = title
    this.description = description
    this.location = location
  }
}
