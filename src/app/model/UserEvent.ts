import {Base, IBase} from "./Base"
import {EventWithCategory} from "./EventWithCategory";

export interface IUserEvent extends IBase {
  userAuthId: String,
  eventDto: EventWithCategory
}

export class UserEvent extends Base implements IUserEvent {
  eventDto: EventWithCategory;
  userAuthId: String;

  constructor(createdBy: string, createdDate: number, id: string, lastModifiedDate: number,
              modifiedBy: string, uuid: string, version: number, eventDto: EventWithCategory,
              userAuthId: String) {
    super(createdBy, createdDate, id, lastModifiedDate, modifiedBy, uuid, version)

    this.eventDto = eventDto
    this.userAuthId = userAuthId
  }
}
