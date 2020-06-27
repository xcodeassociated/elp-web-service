import React, {Component} from 'react'
import {Redirect} from "react-router-dom"
import {connect} from 'react-redux'
import '../style/Reservations.css'
import {MDBTable, MDBTableBody, MDBTableHead} from 'mdbreact'
import {EventWithCategory} from "../model/EventWithCategory"
import { Page } from "../model/Page"
import {fetchAllEvents, createEvent, deleteEvent, updateEvent} from '../services/EventService'
import "../style/Event.css"
import {EventCommand} from "../model/EventCommand"
import {Category} from "../model/Category";

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
  eventDeleteId: string,
  eventUpdateId: string,
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
      eventCreateLatitude: 0,
      eventCreateLongitude: 0,
      eventDeleteId: "",
      eventUpdateId: "",
      dispatch: () => {}
    }

    this.onCreateOrUpdateSubmit = this.onCreateOrUpdateSubmit.bind(this)
  }

  private static hasToken(): boolean {
    return localStorage.getItem('token') != null
  }

  private onCreateOrUpdateSubmit(e: any): void {
    e.preventDefault()
    if (this.state.eventCreateTitle.length > 0) {
      let location: Array<Number> = new Array<Number>(this.state.eventCreateLatitude, this.state.eventCreateLongitude)
      let event: EventCommand =
        new EventCommand((this.state.eventUpdateId.length > 0) ? this.state.eventUpdateId : null,
          this.state.eventCreateTitle, this.state.eventCreateDescription, location)

      if (this.state.eventUpdateId.length > 0) {
        this.state.dispatch(this.update(event))
      } else {
        this.state.dispatch(this.create(event))
      }
      this.clearState()
    } else {
      alert('Please enter at least event title')
    }
  }

  private onUpdateSubmit(id: string, title: string, description: string,
                         location: Array<Number>): void {
    this.setState({
      ...this.state,
      eventUpdateId: id,
      eventCreateTitle: title,
      eventCreateDescription: description,
      eventCreateLatitude: location[0],
      eventCreateLongitude: location[1]
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
      eventCreateLongitude: 0
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

    let eventPromise: Promise<Response> | null = fetchAllEvents(null)
    if (eventPromise != null) {
      eventPromise.then(onFetchEvents)
    }
  }

  public componentDidMount(): void {
    this.getAllEvents()
  }

  private create(event: EventCommand): void {
    if (event) {
      let eventPromise: Promise<Response> | null = createEvent(event)
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
      let eventPromise: Promise<Response> | null = updateEvent(event)
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
    let eventPromise: Promise<Response> | null = deleteEvent(id)
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
      if (Events.hasToken() && this.state.error === undefined) {
        let {eventCreateTitle, eventCreateDescription, eventCreateLatitude, eventCreateLongitude} = this.state
        return (
          <div id="reservations-list">
            <div id="event-create-form">
              <MDBTable>
                <MDBTableBody>
                  <tr>
                    <td className="reservations-list-table-header-create-event">
                      <form name="eventCreateForm" onSubmit={this.onCreateOrUpdateSubmit}>
                        <div className="form-group-collection">
                          <div className="form-group">
                            <label className="location-label">Event Title:</label>
                            <input type="text" className="location-input" name="title"
                                   onChange={e => this.setState({...this.state, eventCreateTitle: e.target.value})}
                                   value={eventCreateTitle}/>
                          </div>
                          <div className="form-group">
                            <label className="location-label">Event Description:</label>
                            <input type="text" className="location-input" name="description"
                                   onChange={e => this.setState({...this.state, eventCreateDescription: e.target.value})}
                                   value={eventCreateDescription}/>
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
                  <th className="reservations-list-table-header-id">ID</th>
                  <th className="reservations-list-table-header-title">Title</th>
                  <th className="reservations-list-table-header-description">Description</th>
                  <th className="reservations-list-table-header-category">Category</th>
                  <th className="reservations-list-table-header-coordinate">Latitude</th>
                  <th className="reservations-list-table-header-coordinate">Longitude</th>
                </tr>
              </MDBTableHead>
              <MDBTableBody>
                {this.state.events !== undefined ?
                  this.state.events
                    .map((reservation: EventWithCategory, index: number) =>
                      <tr key={index} className="reservation-item">
                        <td>{reservation.id}</td>
                        <td>{reservation.title}</td>
                        <td>{reservation.description}</td>
                        <td>{reservation.categories.map((e: Category) => e.title + " ")}</td>
                        <td>{reservation.location[0]}</td>
                        <td>{reservation.location[1]}</td>
                        <td>
                          <button className="btn btn-primary"
                                  onClick={() => this.onUpdateSubmit(reservation.id, reservation.title,
                                    reservation.description, reservation.location)}>Update Event</button>
                          <button className="btn btn-danger"
                                  onClick={() => this.onDeleteSubmit(reservation.id)}>Delete Event</button>
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
