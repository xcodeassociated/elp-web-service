import { Event } from "./Event";
import { Category } from './Category'

export interface EventWithCategory extends Event {
  categories: Array<Category>
}
