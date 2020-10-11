import {EventWithCategory} from "../../../model/EventWithCategory";
import {optional} from "../../../model/Types";
import React, {Component} from "react";
import {deregister, register} from "../../../services/UserHistoryService";
import {Category} from "../../../model/Category";

export interface IItemProps {
  onClick: Function,
  reload: Function,
  item: EventWithCategory,
  active: optional<EventWithCategory>,
  setRef: any,
  title: String
}

export default class Item extends Component<IItemProps> {
  constructor(props) {
    super(props)
    this.state = {}
  }

  private active(): void {
    this.props.onClick()
  }

  private join(): void {
    const apiPromise: optional<Promise<Response>> = register(this.props.item.id)
    if (apiPromise) {
      apiPromise.then((response: Response) => {
        if (response.ok) {
          this.props.reload()
        }
      }).catch((e: any) => console.error(e))
    }
  }

  private leave(): void {
    const apiPromise: optional<Promise<Response>> = deregister(this.props.item.id)
    if (apiPromise) {
      apiPromise.then((response: Response) => {
        if (response.ok) {
          this.props.reload()
        }
      }).catch((e: any) => console.error(e))
    }
  }

  public render() {
    return (
      <div className={(this.props.active && this.props.item.id === this.props.active.id) ? 'item active' : 'item'}
           onClick={() => this.active()}>
        <div ref={this.props.setRef} className="item-info">
          <img src='/location-item.svg' className="inline item-photo" />
          <div className="inline item-title">
            {this.props.title}
          </div>
          <div className="inline item-button">
            {(this.props.item.userDetails && this.props.item.userDetails.registered) ?
              <button onClick={this.leave.bind(this)}>Leave</button>
              :
              (this.props.item.stop && this.props.item.stop >= Date.now())
                ? <button onClick={this.join.bind(this)}>Join</button> : null}
          </div>
        </div>
        <div className="item-categoryBox">
          {this.props.item.categories.map((e: Category) => (
            <span key={e.id} className="item-category">
              {e.title}
            </span>
          ))}
        </div>
      </div>
    )
  }
}
