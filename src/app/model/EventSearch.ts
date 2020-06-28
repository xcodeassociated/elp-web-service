import {arrayOptional, optional} from "./Types"
import {BaseSearch, IBaseSearch} from "./BaseSearch"

export interface IEventSearch extends IBaseSearch {
  title: optional<string>,
  description: optional<string>,
  start: optional<number>,
  stop: optional<number>,
  location: arrayOptional<Number>,
  range: optional<number>
  eventCategories: arrayOptional<String>
}

export class EventSearch extends BaseSearch implements IEventSearch {
  title: optional<string>
  description: optional<string>
  start: optional<number>
  stop: optional<number>
  location: arrayOptional<Number>
  range: optional<number>
  eventCategories: arrayOptional<String>

  constructor(createdBy: optional<string>, createdDate: optional<number>, id: optional<string>,
              modifiedBy: optional<string>, uuid: optional<string>, title: optional<string>,
              description: optional<string>, start: optional<number>, stop: optional<number>,
              location: arrayOptional<Number>, range: optional<number>, eventCategories: arrayOptional<String>) {

    super(createdBy, createdDate, id, modifiedBy, uuid)

    this.title = title
    this.description = description
    this.start = start
    this.stop = stop
    this.location = location
    this.range = range
    this.eventCategories = eventCategories
  }

}

export const eventSearchWithTitle = (title: string): EventSearch => {
  return new EventSearch(null,null,null,null,null,title,
    null,null,null,null,null,null)
}
