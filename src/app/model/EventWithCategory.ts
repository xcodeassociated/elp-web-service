import { Event } from "./Event"
import { Category } from './Category'

export interface IEventUserDetails {
  registered: boolean
}

export interface IEventWithCategory {
  categories: Array<Category>,
  userDetails: IEventUserDetails
}

export class EventWithCategory extends Event implements IEventWithCategory {
  categories: Array<Category>
  userDetails: IEventUserDetails

  constructor(createdBy: string, createdDate: number, id: string, lastModifiedDate: number, modifiedBy: string,
              uuid: string, version: number, title: string, description: string, start: number, stop: number,
              location: Array<Number>, categories: Array<Category>, userDetails: IEventUserDetails) {

    super(createdBy, createdDate, id, lastModifiedDate, modifiedBy, uuid, version, title,
      description, start, stop, location)

    this.categories = categories
    this.userDetails = userDetails
  }
}
