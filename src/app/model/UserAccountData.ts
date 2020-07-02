import {Base, IBase} from "./Base"
import {Category} from "./Category";
import {UserAccountContactData} from "./UserAccountContactData";

export interface IUserAccountData extends IBase {
  authId: string,
  username: string,
  firstName: string,
  lastName: string,
  createdTimestamp: number,
  enabled: boolean,
  contacts: Array<UserAccountContactData>
}

export class UserAccountData extends Base implements IUserAccountData {
  authId: string
  username: string
  firstName: string
  lastName: string
  createdTimestamp: number
  enabled: boolean
  contacts: Array<UserAccountContactData>


  constructor(createdBy: string, createdDate: number, id: string, lastModifiedDate: number,
              modifiedBy: string, uuid: string, version: number, authId: string, username: string,
              firstName: string, lastName: string, createdTimestamp: number, enabled: boolean,
              contacts: Array<UserAccountContactData>) {
    super(createdBy, createdDate, id, lastModifiedDate, modifiedBy, uuid, version)

    this.authId = authId
    this.username = username
    this.firstName = firstName
    this.lastName = lastName
    this.createdTimestamp = createdTimestamp
    this.enabled = enabled
    this.contacts = contacts
  }
}
