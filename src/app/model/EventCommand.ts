import {optional} from "./Types"
import {Category} from "./Category";

export interface IEventCommand {
  id: optional<string>
  title: string,
  description: string,
  start: number,
  stop: number,
  location: Array<Number>,
  categories: Array<Category>
}

export class EventCommand implements IEventCommand {
  id: optional<string>
  title: string
  description: string
  start: number
  stop: number
  location: Array<Number>
  categories: Array<Category>

  constructor(id: optional<string>, title: string, description: string,
              start: number, stop: number, location: Array<Number>,
              eventCategories: Array<Category>) {
    this.id = id
    this.title = title
    this.start = start
    this.stop = stop
    this.description = description
    this.location = location
    this.categories = eventCategories
  }
}
