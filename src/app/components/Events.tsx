import React, {Component} from 'react'
import {Redirect} from "react-router-dom"
import {connect} from 'react-redux'
import '../style/Events.css'
import {MDBTable, MDBTableBody, MDBTableHead} from 'mdbreact'
import {EventWithCategory} from "../model/EventWithCategory"
import {Event} from "../model/Event"
import { Page } from "../model/Page"
import {createEvent, deleteEvent, updateEvent, fetchAllUserEvents} from '../services/EventService'
import "../style/Event.css"
import {EventCommand} from "../model/EventCommand"
import {Category} from "../model/Category";
import {hasToken} from "../services/TokenService";
import {optional} from "../model/Types";
import Select from "react-dropdown-select";
import {fetchAllCategories} from "../services/CategoryService";

type Error = {
  code: number,
  description: string
}

interface IState {
  events?: Array<EventWithCategory>,
  error?: Error,
  eventCreateTitle: string,
  eventCreateDescription: string,
  eventCreateLatitude: Number,
  eventCreateLongitude: Number
  eventCreateStart: number
  eventCreateStop: number,
  eventCreateCategories: Array<Category>,
  eventDeleteId: string,
  eventUpdateId: string,
  categories: Array<Category>,
  dispatch: Function
}

interface IProp {
  isRedirectHome: boolean
}

class Events extends Component<IProp, IState> {

  constructor(props: IProp) {
    super(props)
    this.state = {
      events: undefined,
      error: undefined,
      eventCreateTitle: "",
      eventCreateDescription: "",
      eventCreateStart: 0,
      eventCreateStop: 0,
      eventCreateLatitude: 0,
      eventCreateLongitude: 0,
      eventCreateCategories: [],
      eventDeleteId: "",
      eventUpdateId: "",
      categories: [],
      dispatch: () => {}
    }
    setTimeout(() => this.fetchAndUpdateCategories(), 250)
    this.onCreateOrUpdateSubmit = this.onCreateOrUpdateSubmit.bind(this)
  }

  private fetchAndUpdateCategories(): void {
    this.getCategories()
      .then((categories: Array<Category>) => this.setState({...this.state, categories: categories}))
      .catch((error: Error) => console.log(error))
  }

  private async getCategories(): Promise<Array<Category>> {
    const response: optional<Response> = await fetchAllCategories()
    if (response && response.ok) {
      const data: string = await response.text()
      const categories: Array<Category>= JSON.parse(data)
      return categories
    } else {
      throw new Error("Could not fetch categories")
    }
  }

  private validateEvent(): boolean {
    return this.state.eventCreateTitle.length > 0
      && this.state.eventCreateLatitude != 0
      && this.state.eventCreateLongitude != 0
      && this.state.eventCreateCategories.length > 0
      && this.state.eventCreateStart > 0
      && this.state.eventCreateStop > this.state.eventCreateStart;
  }

  private onCreateOrUpdateSubmit(e: any): void {
    e.preventDefault()
    if (this.validateEvent()) {
      let location: Array<Number> = new Array<Number>(this.state.eventCreateLatitude, this.state.eventCreateLongitude)
      let event: EventCommand =
        new EventCommand((this.state.eventUpdateId.length > 0) ? this.state.eventUpdateId : null,
          this.state.eventCreateTitle, this.state.eventCreateDescription, this.state.eventCreateStart,
          this.state.eventCreateStop, location, this.state.eventCreateCategories.map(e => e.id))

      if (this.state.eventUpdateId.length > 0) {
        this.state.dispatch(this.update(event))
      } else {
        this.state.dispatch(this.create(event))
      }
      this.clearState()
    } else {
      alert('Please enter: event title, location, category, start and stop date')
    }
  }

  private onUpdateSubmit(id: string, title: string, description: string, start: number, stop: number,
                         location: Array<Number>, categories: Array<Category>): void {
    this.setState({
      ...this.state,
      eventUpdateId: id,
      eventCreateTitle: title,
      eventCreateDescription: description,
      eventCreateStart: start,
      eventCreateStop: stop,
      eventCreateLatitude: location[0],
      eventCreateLongitude: location[1],
      eventCreateCategories: categories
    })
  }

  private onDeleteSubmit(id: string): void {
    this.setState({...this.state, eventDeleteId: id})
    this.state.dispatch(this.delete(id))
  }

  private onClearSubmit(e: any): void {
    e.preventDefault()
    this.clearState()
  }

  private clearState(): void {
    this.setState({
      ...this.state,
      eventUpdateId: "",
      eventCreateTitle: "",
      eventCreateDescription: "",
      eventCreateLatitude: 0,
      eventCreateLongitude: 0,
      eventCreateStart: 0,
      eventCreateStop: 0,
      eventCreateCategories: [],
    })
  }

  private clearDelete(): void {
    this.setState({
      ...this.state,
      eventDeleteId: ""
    })
  }

  private getAllEvents(): void {
    const onFetchEvents = (response: Response): void => {
      if (response.ok) {
        response.text().then(data => {
          let page: Page<EventWithCategory> = JSON.parse(data)
          if (page.content != null) {
              let objects: Array<EventWithCategory> = page.content
              this.setState({
                ...this.state,
                events: objects
              })
            }
          }
        )
      } else {
        response.text().then(text => {
          this.setState({
            ...this.state,
            error: {
              code: response.status,
              description: text
            }
          })
        })
      }
    }

    let eventPromise: optional<Promise<Response>> = fetchAllUserEvents()
    if (eventPromise != null) {
      eventPromise.then(onFetchEvents)
    }
  }

  public componentDidMount(): void {
    this.getAllEvents()
  }

  private create(event: EventCommand): void {
    if (event) {
      let eventPromise: optional<Promise<Response>> = createEvent(event)
      if (eventPromise != null) {
        eventPromise.then((response: Response) => {
          if (response.ok) {
            response.text().then(text => {
              let object: EventWithCategory = JSON.parse(text)
              if (this.state.events) {
                this.setState({
                  ...this.state,
                  events: this.state.events.concat(object)
                })
              }
            })
          } else {
            console.error("error: request returned non-ok response: " + JSON.stringify(response))
          }
        })
      } else {
        console.error("error: createEvent promise null")
      }
    }
  }

  private update(event: EventCommand): void {
    if (event) {
      let eventPromise: optional<Promise<Response>> = updateEvent(event)
      if (eventPromise != null) {
        eventPromise.then((response: Response) => {
          if (response.ok) {
            response.text().then(text => {
              let object: Event = JSON.parse(text)
              this.getAllEvents()
            })
          } else {
            console.error("error: request returned non-ok response: " + JSON.stringify(response))
            this.clearState()
          }
        })
      } else {
        console.error("error: createEvent promise null")
        this.clearState()
      }
    }
  }

  private delete(id: string): void {
    let eventPromise: optional<Promise<Response>> = deleteEvent(id)
    if (eventPromise != null) {
      eventPromise.then((response: Response) => {
        if (response.ok) {
          response.text().then(text => {
            if (this.state.events) {
              this.setState({
                ...this.state,
                events: this.state.events.filter((event: EventWithCategory) => event.id !== id),
                eventDeleteId: ""
              })
            }
          })
        } else {
          console.error("error: request returned non-ok response: " + JSON.stringify(response))
          this.clearDelete()
        }
      })
    } else {
      console.error("error: deleteEvent promise null")
      this.clearDelete()
    }
  }

  public render() {
    if (this.props.isRedirectHome) {
      return (
        <Redirect to='/' />
      )
    } else {
      if (hasToken() && this.state.error === undefined) {
        let {eventCreateTitle, eventCreateDescription, eventCreateLatitude, eventCreateLongitude,
          eventCreateStart, eventCreateStop, eventCreateCategories, categories} = this.state
        return (
          <div id="events-list">
            <div id="event-create-form">
              <MDBTable>
                <MDBTableBody>
                  <tr>
                    <td className="events-list-table-header-create-event">
                      <form name="eventCreateForm" onSubmit={this.onCreateOrUpdateSubmit}>
                        <div className="form-group-collection">
                          <div className="form-group">
                            <label className="location-label">Event Title:</label>
                            <input type="text" className="location-input" name="title"
                                   onChange={e => this.setState({...this.state, eventCreateTitle: String(e.target.value)})}
                                   value={eventCreateTitle}/>
                          </div>
                          <div className="form-group">
                            <label className="location-label">Event Description:</label>
                            <input type="text" className="location-input" name="description"
                                   onChange={e => this.setState({...this.state, eventCreateDescription: String(e.target.value)})}
                                   value={eventCreateDescription}/>
                          </div>
                          <div className="form-group">
                            <label className="location-label">Event Start:</label>
                            <input type="text" className="location-input" name="description"
                                   onChange={e => this.setState({...this.state, eventCreateStart: Number(e.target.value)})}
                                   value={eventCreateStart}/>
                          </div>
                          <div className="form-group">
                            <label className="location-label">Event Stop:</label>
                            <input type="text" className="location-input" name="description"
                                   onChange={e => this.setState({...this.state, eventCreateStop: Number(e.target.value)})}
                                   value={eventCreateStop}/>
                          </div>
                          <div className="form-group">
                            <label className="location-label">Event Categories:</label>
                            <Select options={categories}
                                    onChange={(values: Array<Category>) => this.setState({...this.state, eventCreateCategories: values})}
                                    values={eventCreateCategories}
                                    labelField={"title"} valueField={"id"} multi={true} key={"id"} />
                          </div>
                          <div className="form-group">
                            <label>Event Location:</label>
                            <div className="location-form">
                              <label className="location-label">Latitude: </label>
                              <input type="text" className="location-input" name="latitude"
                                     onChange={e => this.setState({...this.state, eventCreateLatitude: Number(e.target.value)})}
                                     value={String(eventCreateLatitude)}/>
                              <label className="location-label">Longitude: </label>
                              <input type="text" className="location-input" name="longitude"
                                     onChange={e => this.setState({...this.state, eventCreateLongitude: Number(e.target.value)})}
                                     value={String(eventCreateLongitude)}/>
                            </div>
                          </div>
                        </div>
                        <div className="form-group">
                          {this.state.eventUpdateId.length > 0 ?
                            <button className="btn btn-info">Update Event</button> :
                            <button className="btn btn-success">Create Event</button>}
                          <button className="btn btn-default" onClick={this.onClearSubmit.bind(this)}>Clear</button>
                        </div>
                      </form>
                    </td>
                  </tr>
                </MDBTableBody>
              </MDBTable>
            </div>
            <MDBTable>
              <MDBTableHead>
                <tr className="reservations-list-table-header">
                  <th className="events-list-table-header-id">ID</th>
                  <th className="events-list-table-header-title">Title</th>
                  <th className="events-list-table-header-description">Description</th>
                  <th className="events-list-table-header-category">Category</th>
                  <th className="events-list-table-header-start">Start</th>
                  <th className="events-list-table-header-stop">Stop</th>
                  <th className="events-list-table-header-coordinate">Latitude</th>
                  <th className="events-list-table-header-coordinate">Longitude</th>
                </tr>
              </MDBTableHead>
              <MDBTableBody>
                {this.state.events !== undefined ?
                  this.state.events
                    .map((event: EventWithCategory, index: number) =>
                      <tr key={index} className="reservation-item">
                        <td>{event.id}</td>
                        <td>{event.title}</td>
                        <td>{event.description}</td>
                        <td>{(event.categories) ? event.categories.map((e: Category) => e.title + " ") : ''}</td>
                        <td>{(event.start) ? new Date(event.start).toLocaleString() : ''}</td>
                        <td>{(event.stop) ? new Date(event.stop).toLocaleString() : ''}</td>
                        <td>{event.location[0]}</td>
                        <td>{event.location[1]}</td>
                        <td>
                          {(event.stop && event.stop >= Date.now()) ?
                            <span>
                              <button className="btn btn-primary"
                                      onClick={() => this.onUpdateSubmit(event.id, event.title,
                                        event.description, event.start, event.stop,
                                        event.location, event.categories)}>Update Event</button>
                              <button className="btn btn-danger"
                                onClick={() => this.onDeleteSubmit(event.id)}>Delete Event</button>
                            </span> : null
                          }
                        </td>
                      </tr>)
                  : null
                }
              </MDBTableBody>
            </MDBTable>
          </div>
        )
      } else {
        return (
          <div id="reservations-error">
            <div id="reservations-error-code">
              <h2>
                {this.state.error !== undefined ?
                  this.state.error.code
                  : null}
              </h2>
            </div>
            <div id="reservations-error-description">
              <p>
                {this.state.error !== undefined ?
                  this.state.error.description
                  : null}
              </p>
            </div>
          </div>
        )
      }
    }
  }
}

const mapStateToProps = (state) => {
  return {
    ...state
  }
}

export default connect(mapStateToProps)(Events)
