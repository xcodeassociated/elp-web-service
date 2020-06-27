export interface IEvent {
  id: string | null
  title: String,
  description: String,
  start: number,
  stop: number,
  location: Array<Number>,
  eventCategories: Array<String>
}

export class EventCommand implements IEvent {
  id: string | null
  title: String
  description: String
  start: number
  stop: number
  location: Array<Number>
  eventCategories: Array<String>

  constructor(id: string | null, title: string, description: string,
              start: number, stop: number, location: Array<Number>,
              eventCategories: Array<String>) {
    this.id = id
    this.title = title
    this.start = start
    this.stop = stop
    this.description = description
    this.location = location
    this.eventCategories = eventCategories
  }
}
