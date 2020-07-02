import {optional} from "./Types";

export interface IUserAccountDataCommand {
  username: string,
  firstName: optional<string>,
  lastName: optional<string>,
  email: optional<string>,
}

export class UserAccountDataCommand implements IUserAccountDataCommand {
  username: string
  firstName: optional<string>
  lastName: optional<string>
  email: optional<string>

  constructor(username: string, firstName: optional<string>, lastName: optional<string>, email: optional<string>) {
    this.username = username
    this.firstName = firstName
    this.lastName = lastName
    this.email = email
  }
}
