import {Base, IBase} from "./Base"

export interface IEvent extends IBase {
  title: string
  description: string,
  start: number,
  stop: number,
  location: Array<Number>,
}

export class Event extends Base implements IEvent {
  title: string
  description: string
  start: number
  stop: number
  location: Array<Number>

  constructor(createdBy: string, createdDate: number, id: string, lastModifiedDate: number,
              modifiedBy: string, uuid: string, version: number, title: string, description: string,
              start: number, stop: number, location: Array<Number>) {

    super(createdBy, createdDate, id, lastModifiedDate, modifiedBy, uuid, version)

    this.title = title
    this.description = description
    this.start = start
    this.stop = stop
    this.location = location
  }
}
