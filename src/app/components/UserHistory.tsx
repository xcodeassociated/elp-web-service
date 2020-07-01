import React, {Component} from 'react'
import {Redirect} from "react-router-dom"
import {connect} from 'react-redux'
import '../style/Reservations.css'
import {MDBTable, MDBTableBody, MDBTableHead} from 'mdbreact'
import {EventWithCategory} from "../model/EventWithCategory"
import { Page } from "../model/Page"
import "../style/Event.css"
import {Category} from "../model/Category";
import {deregister, fetchUserHistory} from "../services/UserHistoryService";
import {optional} from "../model/Types";
import {UserEvent} from "../model/UserEvent";

type Error = {
  code: number,
  description: string
}

interface IState {
  events?: Array<EventWithCategory>,
  error?: Error,
  eventDeleteId: string,
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
      eventDeleteId: "",
      dispatch: () => {}
    }
  }

  private static hasToken(): boolean {
    return localStorage.getItem('token') != null
  }

  private onDeleteSubmit(id: string): void {
    this.setState({...this.state, eventDeleteId: id})
    this.state.dispatch(this.delete(id))
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
          let page: Page<UserEvent> = JSON.parse(data)
          if (page.content != null) {
              let objects: Array<UserEvent> = page.content
              this.setState({
                ...this.state,
                events: objects.map((e: UserEvent) => e.eventDto)
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

    let eventPromise: optional<Promise<Response>> = fetchUserHistory()
    if (eventPromise != null) {
      eventPromise.then(onFetchEvents)
    }
  }

  public componentDidMount(): void {
    this.getAllEvents()
  }

  private delete(id: string): void {
    let eventPromise: optional<Promise<Response>> = deregister(id)
    if (eventPromise != null) {
      eventPromise.then((response: Response) => {
        if (response.ok) {
          this.getAllEvents()
        } else {
          console.error("error: request returned non-ok response: " + JSON.stringify(response))
          this.clearDelete()
        }
      }).catch((error: any) => console.error(error))
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
        return (
          <div id="reservations-list">
            <MDBTable>
              <MDBTableHead>
                <tr className="reservations-list-table-header">
                  <th className="reservations-list-table-header-id">ID</th>
                  <th className="reservations-list-table-header-title">Title</th>
                  <th className="reservations-list-table-header-description">Description</th>
                  <th className="reservations-list-table-header-category">Category</th>
                  <th className="reservations-list-table-header-start">Start</th>
                  <th className="reservations-list-table-header-stop">Stop</th>
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
                        <td>{(reservation.categories) ? reservation.categories.map((e: Category) => e.title + " ") : ''}</td>
                        <td>{reservation.start}</td>
                        <td>{reservation.stop}</td>
                        <td>{reservation.location[0]}</td>
                        <td>{reservation.location[1]}</td>
                        <td>
                          <button className="btn btn-danger"
                                  onClick={() => this.onDeleteSubmit(reservation.id)}>Leave</button>
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
