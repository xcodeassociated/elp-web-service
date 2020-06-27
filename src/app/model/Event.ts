import { Base } from "./Base";

export interface Event extends Base {
  title: string;
  description: string,
  start: number,
  stop: number,
  location: Array<Number>,
  eventCategories: Array<String>
}
