import {Base, IBase} from "./Base"

export interface ICategory extends IBase {
  title: string
  description: string
}

export class Category extends Base implements ICategory {
  title: string
  description: string


  constructor(createdBy: string, createdDate: number, id: string, lastModifiedDate: number,
              modifiedBy: string, uuid: string, version: number, title: string, description: string) {

    super(createdBy, createdDate, id, lastModifiedDate, modifiedBy, uuid, version)

    this.title = title
    this.description = description
  }
}
