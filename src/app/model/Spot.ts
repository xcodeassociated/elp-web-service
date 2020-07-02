import {Base, IBase} from "./Base"

export interface ISpot extends IBase {
  title: string,
  description: string,
  location: Array<Number>
}

export class Spot extends Base implements ISpot {
  title: string
  description: string
  location: Array<Number>

  constructor(createdBy: string, createdDate: number, id: string, lastModifiedDate: number,
              modifiedBy: string, uuid: string, version: number, title: string, description: string,
              location: Array<Number>) {
    super(createdBy, createdDate, id, lastModifiedDate, modifiedBy, uuid, version)

    this.title = title
    this.description = description
    this.location = location
  }
}
