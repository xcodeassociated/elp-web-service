import React, {Component} from "react";
import { Map, Marker, Popup, TileLayer } from "react-leaflet"
import { Icon } from "leaflet"
import "../style/App.css"
import "../style/Home.css"
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import { connect } from 'react-redux'
import { GeolocatedProps, geolocated } from "react-geolocated"
import {fetchAllActiveEvents, fetchAllRecommendedEvents, searchEvents} from "../services/EventService"
import { Page } from "../model/Page"
import { EventWithCategory } from "../model/EventWithCategory"
import {eventSearch, EventSearch} from "../model/EventSearch"
import {fetchAllCategories} from "../services/CategoryService"
import {Category} from "../model/Category"
import {Location} from "../model/Location"
import {arrayOptional, optional} from "../model/Types"
import NumericInput from 'react-numeric-input'
import Switch from "react-switch"

export const icon = new Icon({
  iconUrl: "/location.svg",
  iconSize: [25, 25]
})

export const userIcon = new Icon({
  iconUrl: "/user.svg",
  iconSize: [25, 25]
})

interface EventWrapper {
  item: EventWithCategory,
  referance: any | null
}

interface IItemProps {
  onClick: Function,
  item: EventWithCategory,
  active: EventWithCategory | null,
  setRef: any,
  title: String
}

class Item extends Component<IItemProps> {
  constructor(props) {
    super(props)
    this.state = {}
  }

  private active(): void {
    this.props.onClick()
  }

  public render() {
    return (
      <div className={(this.props.active && this.props.item.id === this.props.active.id) ? 'item active' : 'item'}
           onClick={() => this.active()}>
        <p ref={this.props.setRef}>
                    <span className="inline">
                        <img src='/location-item.svg' className="photo" />
                    </span>
          <span className="inline">{this.props.title}</span>
        </p>
      </div>
    )
  }
}

interface ICategoryItem {
  onClick: Function,
  selected: Array<Object>,
  item: Category
}

class CategoryItem extends Component<ICategoryItem> {
  constructor(props) {
    super(props)
    this.state = {}
  }

  private active(): void {
    this.props.onClick()
  }

  public render() {
    return (
      <div className={this.props.selected.includes(this.props.item) ? 'categoryItem active' : 'categoryItem'}>
        <a onClick={() => this.active()}>{this.props.item.title}</a>
      </div>
    )
  }
}

interface IHomeProps {
  isRedirectHome: boolean
}

interface IHomeState {
  events: Array<EventWrapper>,
  recommended: Array<EventWrapper>,
  categories: Array<Category>,
  activePark: EventWithCategory | null,
  selectedCategories: Array<Category>,
  searchTitle: string,
  selectedRange: number,
  searchActive: boolean,
  includeRange: boolean,
  timer: any | null,
  refreshOn: boolean,
  recommendedTab: boolean,
  eventListTabIndex: number
}

class Home extends Component<IHomeProps & GeolocatedProps, IHomeState> {
  constructor(props, context) {
    super(props, context)
    this.state = {
      events: [],
      recommended: [],
      categories: [],
      activePark: null,
      selectedCategories: [],
      searchTitle: "",
      selectedRange: 1,
      searchActive: true,
      includeRange: false,
      timer: null,
      refreshOn: true,
      recommendedTab: false,
      eventListTabIndex: 0
    }
    setTimeout(() => this.getEvents(), 250);
    setTimeout(() => this.getRecommendedEvents(), 250);
    setTimeout(() => this.fetchAndUpdateCategories(), 250);
  }

  public componentDidMount(): void {
    this.initRefreshTimer()
  }

  public componentWillUnmount(): void {
    clearInterval(this.state.timer);
  }

  public componentWillReceiveProps(props: Readonly<IHomeProps & GeolocatedProps>, nextContext: any): void {

  }

  private fetchAndUpdateCategories(): void {
    this.getCategories()
      .then((categories: Array<Category>) => this.setState({...this.state, categories: categories}))
      .catch((error: Error) => console.log(error))
  }

  private async getCategories(): Promise<Array<Category>> {
    const response: Response | null = await fetchAllCategories()
    if (response && response.ok) {
      const data: string = await response.text()
      const categories: Array<Category> = JSON.parse(data)
      return categories
    } else {
      throw new Error("Could not fetch categories")
    }
  }

  private initRefreshTimer(): void {
    let timer = setInterval(() =>
      (this.state.recommendedTab) ? this.getRecommendedEvents() : this.getEvents(), 10000)
    this.setState({...this.state, timer: timer})
  }

  private static hasToken(): boolean {
    return localStorage.getItem('token') != null
  }

  private updateEvents(response: Response): void {
    if (response.ok) {
      response.text().then((data: string) => {
        let page: Page<EventWithCategory> = JSON.parse(data)
        if (page.content != null) {
          let objects: Array<EventWrapper> = page.content
            .map((e: EventWithCategory) => Object.assign({}, {item: e, referance: null}))
          let validated: Array<EventWrapper> = objects.filter(e => e.item.location != null)
          this.setState({
            ...this.state,
            events: validated
          })
        }
      }).catch((reason: any) => {
        console.error("request error in ok response: " + JSON.stringify(reason))
      })
    } else {
      response.text().then(text => {
        console.error("request return non-ok response: " + JSON.stringify(text))
      }).catch((reason: any) => {
        console.error("request error in non-ok response: " + JSON.stringify(reason))
      })
    }
  }

  private updateRecommendedEvents(response: Response): void {
    if (response.ok) {
      response.text().then((data: string) => {
          let page: Page<EventWithCategory> = JSON.parse(data)
          if (page.content != null) {
            let objects: Array<EventWrapper> = page.content
              .map((e: EventWithCategory) => Object.assign({}, {item: e, referance: null}))
            let validated: Array<EventWrapper> = objects.filter(e => e.item.location != null)
            this.setState({
              ...this.state,
              recommended: validated
            })
          }
        }
      ).catch((reason: any) => {
        console.error("request error in ok response: " + JSON.stringify(reason))
      })
    } else {
      response.text().then(text => {
        console.error("request return non-ok response: " + JSON.stringify(text))
      }).catch((reason: any) => {
        console.error("request error in non-ok response: " + JSON.stringify(reason))
      })
    }
  }

  private getEvents(): void {
    if (Home.hasToken() && this.state.refreshOn) {
      let eventPromise: Promise<Response> | null = fetchAllActiveEvents()
      if (eventPromise != null) {
        eventPromise.then((response: Response) => this.updateEvents(response)).catch((reason: any) => {
          console.error("request error 3: " + JSON.stringify(reason))
        })
      }
    }
  }

  private getRecommendedEvents(): void {
    if (Home.hasToken() && this.state.refreshOn && this.props.coords) {
      let eventPromise: Promise<Response> | null =
        fetchAllRecommendedEvents(new Location([this.props.coords.latitude, this.props.coords.longitude]))
      if (eventPromise != null) {
        eventPromise.then((response: Response) => this.updateRecommendedEvents(response))
          .catch((reason: any) => console.error("request error 3: " + JSON.stringify(reason)))
      }
    }
  }

  private searchEvents(title: optional<string>, categories: arrayOptional<Category>,
                       range: optional<number>, includeDistance: boolean, location: arrayOptional<Number>): void {
    if (Home.hasToken()) {
      const parsedCategories: arrayOptional<Category> = (categories && categories.length === 0) ? null : categories
      const search: EventSearch = (includeDistance) ?
        eventSearch(title, parsedCategories, range, location, this.state.searchActive)
        : eventSearch(title, parsedCategories, null, null, this.state.searchActive)
      let eventPromise: Promise<Response> | null = searchEvents(search)
      if (eventPromise != null) {
        eventPromise.then((response: Response) => {
          this.updateEvents(response)
          this.eventTabSelected(0)
        })
          .catch((reason: any) => console.error("request error: " + JSON.stringify(reason)))
      }
    }
  }

  private itemClick(e: EventWrapper): void {
    this.setState({...this.state, activePark: e.item})
    e.referance.scrollIntoView()
  }

  private mapItemClick(mapItem: EventWithCategory): void {
    this.setState({...this.state, activePark: mapItem})
    const item = (this.state.recommendedTab)
      ? this.state.recommended.find(e => e.item === mapItem)
      : this.state.events.find(e => e.item === mapItem)
    if (item) {
      item.referance.scrollIntoView()
    }
  }

  private categorySelected(category: Category): void {
    this.setState({...this.state, selectedCategories:
        !this.state.selectedCategories.includes(category)
          ? [...this.state.selectedCategories, category]
          : [...this.state.selectedCategories.filter(e => e !== category)]
    })
  }

  private areEventsSearchable(): boolean {
    return (this.state.searchTitle && this.state.searchTitle.length > 0)
      || (this.state.selectedCategories.length > 0) || this.state.includeRange
  }

  private search(e: any): void {
    if (this.areEventsSearchable()) {
      this.setState({...this.state, refreshOn: false, activePark: null})
      this.searchEvents(this.state.searchTitle, this.state.selectedCategories,
        this.state.selectedRange, this.state.includeRange,
        (this.props.coords) ? new Array<Number>(this.props.coords.latitude, this.props.coords.longitude) : null)
    }
  }

  private eventTabSelected(index: number) {
    this.setState({...this.state, recommendedTab: (index === 1), eventListTabIndex: index})
  }

  private handleSearchInputChange(event): void {
    this.setState({...this.state, searchTitle: event.target.value})
  }

  private clear(e: any): void {
    this.setState({...this.state, searchTitle: "", selectedCategories: [], refreshOn: true})
    this.getEvents()
  }

  public render() {
    return (
      <div className="grid-container">
        <div className="item2">
          {Home.hasToken() ?
            <div className="item2-panel">
              <div className="categoryLabel">
                <label>Event categories:</label>
              </div>
              <div className="categoryBox">
                {this.state.categories.map((e: Category) => (
                  <CategoryItem key={e.id} item={e} selected={this.state.selectedCategories}
                                onClick={() => this.categorySelected(e)} />
                ))}
              </div>
            <div className="searchBox">
              <input className="searchInput" type='text' name='searchInput' placeholder='Search Event...' value={this.state.searchTitle}
                     onChange={this.handleSearchInputChange.bind(this)}/>
              <button className="searchButton" name='searchButton' onClick={this.search.bind(this)}>Search</button>
              <button className="clearButton" name='clearButton' onClick={this.clear.bind(this)}>Clear</button>
              {(this.props.coords) ?
                <div className="locationBox">
                  <span className="distanceInput">
                    <span>
                      <label>
                        Latitude: <b>{String(this.props.coords.latitude).substring(0, 7)}</b> Longitude: <b>{String(this.props.coords.longitude).substring(0, 7)}</b>
                      </label>
                    </span>
                    <span> Distance: </span>
                    <NumericInput min={1} max={10} value={this.state.selectedRange} onChange={(valueAsNumber: number) => {
                      this.setState({...this.state, selectedRange: valueAsNumber})
                    }} className="distanceInput" />
                  </span>
                  <span className="locationInclude">
                    <Switch checked={this.state.includeRange}
                            onChange={() => {this.setState({...this.state, includeRange: !this.state.includeRange})}}
                            height={20} />
                  </span>
                </div> : null}
              <div className="locationBox">
                <span className="distanceInput">
                  <label>
                    Active events only:
                  </label>
                </span>
                <span>
                   <Switch checked={this.state.searchActive}
                           onChange={() => {this.setState({...this.state, searchActive: !this.state.searchActive})}}
                           height={20} />
                </span>
              </div>
            </div>
          </div> : null}
          {Home.hasToken() ?
          <div className="item2-list">
            <Tabs selectedIndex={this.state.eventListTabIndex} onSelect={(index: number) => this.eventTabSelected(index)}>
              <TabList>
                <Tab>All</Tab>
                <Tab>Recommended</Tab>
              </TabList>
                <TabPanel>
                  {(this.state.events.length > 0) ?
                    this.state.events.map(e => (
                      <Item title={e.item.title}
                            item={e.item}
                            active={this.state.activePark}
                            onClick={() => this.itemClick(e)}
                            setRef={el => e.referance = el}
                            key={e.item.id}
                      />
                  )) : <p>No active events found</p>}
                </TabPanel>
                <TabPanel>
                  {(this.state.recommended.length > 0) ?
                    this.state.recommended.map(e => (
                      <Item title={e.item.title}
                            item={e.item}
                            active={this.state.activePark}
                            onClick={() => this.itemClick(e)}
                            setRef={el => e.referance = el}
                            key={e.item.id}
                      />
                    )) : <p>No recommended events in this area</p>}
                </TabPanel>
            </Tabs>
          </div> : <p className="login-hint">Please login to see events</p>}
        </div>
        <div className="item3">
          <Map center={(this.props.coords)
            ? [this.props.coords.latitude, this.props.coords.longitude] : [52.23, 21.00]}
               zoom={13}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {(this.state.recommendedTab) ?
              this.state.recommended.map(eventWrapper => (
                <Marker
                  key={eventWrapper.item.id}
                  position={[
                    eventWrapper.item.location[0],
                    eventWrapper.item.location[1]
                  ]}
                  onClick={() => {
                    this.mapItemClick(eventWrapper.item)
                  }}
                  icon={icon}
                />
              ))
              :
              this.state.events.map(eventWrapper => (
                <Marker
                  key={eventWrapper.item.id}
                  position={[
                    eventWrapper.item.location[0],
                    eventWrapper.item.location[1]
                  ]}
                  onClick={() => {
                    this.mapItemClick(eventWrapper.item)
                  }}
                  icon={icon}
                />
            ))}
            {this.state.activePark && (
              <Popup
                position={[
                  this.state.activePark.location[0],
                  this.state.activePark.location[1]
                ]}
                onClose={() => {
                  this.setState({...this.state, activePark: null})
                }}
              >
                <div>
                  <h2>{this.state.activePark.title}</h2>
                  <p>{this.state.activePark.description}</p>
                </div>
              </Popup>
            )}
            {this.props.coords && this.props.coords.latitude && this.props.coords.longitude ?
              <Marker
                position={[
                  this.props.coords.latitude,
                  this.props.coords.longitude
                ]}
                icon={userIcon}
              />
              : null}
          </Map>
        </div>
        <div className="item4">Footer</div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ...state
  }
}

export default connect(mapStateToProps)(geolocated()(Home))
