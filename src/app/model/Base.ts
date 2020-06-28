export interface IBase {
  id: string
  uuid: string
  createdDate: number
  version: number
  lastModifiedDate: number
  createdBy: string
  modifiedBy: string
}

export class Base implements IBase {
  createdBy: string
  createdDate: number
  id: string
  lastModifiedDate: number
  modifiedBy: string
  uuid: string
  version: number

  constructor(createdBy: string, createdDate: number, id: string, lastModifiedDate: number,
              modifiedBy: string, uuid: string, version: number) {
    this.createdBy = createdBy
    this.createdDate = createdDate
    this.id = id
    this.lastModifiedDate = lastModifiedDate
    this.modifiedBy = modifiedBy
    this.uuid = uuid
    this.version = version
  }
}
