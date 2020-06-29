import { Event } from "./Event"
import { Category } from './Category'

export interface IEventWithCategory {
  categories: Array<Category>,
  registered: boolean
}

export class EventWithCategory extends Event implements IEventWithCategory {
  categories: Array<Category>
  registered: boolean

  constructor(createdBy: string, createdDate: number, id: string, lastModifiedDate: number, modifiedBy: string,
              uuid: string, version: number, title: string, description: string, start: number, stop: number,
              location: Array<Number>, eventCategories: Array<String>, categories: Array<Category>, registered: boolean) {

    super(createdBy, createdDate, id, lastModifiedDate, modifiedBy, uuid, version, title,
      description, start, stop, location, eventCategories)

    this.categories = categories
    this.registered = registered
  }
}
