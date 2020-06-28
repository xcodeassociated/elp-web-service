import {optional} from "./Types"

export interface IBaseSearch {
  id: optional<string>,
  uuid: optional<string>,
  createdDate: optional<number>,
  createdBy: optional<string>,
  modifiedBy: optional<string>,
}

export class BaseSearch implements IBaseSearch{
  createdBy: optional<string>
  createdDate: optional<number>
  id: optional<string>
  modifiedBy: optional<string>
  uuid: optional<string>

  constructor(createdBy: optional<string>, createdDate: optional<number>, id: optional<string>,
              modifiedBy: optional<string>, uuid: optional<string>) {
    this.createdBy = createdBy
    this.createdDate = createdDate
    this.id = id
    this.modifiedBy = modifiedBy
    this.uuid = uuid
  }
}
