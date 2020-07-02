import {Base, IBase} from "./Base"
import {Category} from "./Category";

export interface IUserAccountContactData extends IBase {
  email: string,
  verified: boolean
}

export class UserAccountContactData extends Base implements IUserAccountContactData {
  email: string
  verified: boolean


  constructor(createdBy: string, createdDate: number, id: string, lastModifiedDate: number,
              modifiedBy: string, uuid: string, version: number, email: string, verified: boolean) {
    super(createdBy, createdDate, id, lastModifiedDate, modifiedBy, uuid, version)

    this.email = email;
    this.verified = verified;
  }
}
