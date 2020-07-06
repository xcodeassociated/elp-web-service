import {EventWithCategory} from "../../../model/EventWithCategory";
import {optional} from "../../../model/Types";

export default interface EventWrapper {
  item: EventWithCategory,
  referance: optional<any>
}
