import {Base, IBase} from "./Base"
import {Category} from "./Category";

export interface IUserData extends IBase {
  maxDistance: number
  preferredCategories: Array<Category>
}

export class UserData extends Base implements IUserData {
  maxDistance: number
  preferredCategories: Array<Category>

  constructor(createdBy: string, createdDate: number, id: string, lastModifiedDate: number,
              modifiedBy: string, uuid: string, version: number, maxDistance: number,
              preferredCategories: Array<Category>) {

    super(createdBy, createdDate, id, lastModifiedDate, modifiedBy, uuid, version)

    this.maxDistance = maxDistance
    this.preferredCategories = preferredCategories
  }
}
