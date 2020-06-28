import {arrayOptional, optional} from "./Types"
import {BaseSearch, IBaseSearch} from "./BaseSearch"
import {Category} from "./Category";

export interface IEventSearch extends IBaseSearch {
  title: optional<string>,
  description: optional<string>,
  start: optional<number>,
  stop: optional<number>,
  location: arrayOptional<Number>,
  range: optional<number>
  eventCategories: arrayOptional<Category>
}

export class EventSearch extends BaseSearch implements IEventSearch {
  title: optional<string>
  description: optional<string>
  start: optional<number>
  stop: optional<number>
  location: arrayOptional<Number>
  range: optional<number>
  eventCategories: arrayOptional<Category>

  constructor(createdBy: optional<string>, createdDate: optional<number>, id: optional<string>,
              modifiedBy: optional<string>, uuid: optional<string>, title: optional<string>,
              description: optional<string>, start: optional<number>, stop: optional<number>,
              location: arrayOptional<Number>, range: optional<number>, eventCategories: arrayOptional<Category>) {

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

export const eventSearch = (title: optional<string>, categories: arrayOptional<Category>,
                            range: optional<number>, location: arrayOptional<Number>): EventSearch => {
  return new EventSearch(null,null,null,null,null,title,
    null,null,null,location,range,categories)
}
