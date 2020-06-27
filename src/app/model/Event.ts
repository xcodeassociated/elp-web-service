import { Base } from "./Base";

export interface Event extends Base {
  title: string;
  description: string,
  location: Array<Number>,
  eventCategories: Array<String>
}
