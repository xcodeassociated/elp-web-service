import {optional} from "./Types"

export interface ICategoryCommand {
  id: optional<string>
  title: string
  description: optional<string>
}

export class CategoryCommand implements ICategoryCommand {
  id: optional<string>
  title: string
  description: optional<string>

  constructor(id: optional<string>, title: string, description: optional<string>) {
    this.id = id
    this.title = title
    this.description = description
  }
}
