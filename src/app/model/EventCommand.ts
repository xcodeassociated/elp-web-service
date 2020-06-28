import {optional} from "./Types"

export interface IEventCommand {
  id: optional<string>
  title: string,
  description: string,
  start: number,
  stop: number,
  location: Array<Number>,
  eventCategories: Array<String>
}

export class EventCommand implements IEventCommand {
  id: optional<string>
  title: string
  description: string
  start: number
  stop: number
  location: Array<Number>
  eventCategories: Array<String>

  constructor(id: optional<string>, title: string, description: string,
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
