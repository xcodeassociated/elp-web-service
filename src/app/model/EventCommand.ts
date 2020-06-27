export interface IEvent {
  id: string | null
  title: String,
  description: String,
  location: Array<Number>
}

export class EventCommand implements IEvent {
  id: string | null
  title: String
  description: String
  location: Array<Number>

  constructor(id: string | null, title: string, description: string, location: Array<Number>) {
    this.id = id
    this.title = title
    this.description = description
    this.location = location
  }
}
