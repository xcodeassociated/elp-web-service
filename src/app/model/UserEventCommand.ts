export interface IUserEventCommand {
  userAuthId: String,
  eventId: String
}

export class UserEventCommand implements IUserEventCommand {
  eventId: String;
  userAuthId: String;

  constructor(eventId: String, userAuthId: String) {
    this.eventId = eventId
    this.userAuthId = userAuthId
  }
}
