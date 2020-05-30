import React, {Component} from 'react';
import ConfigureStore from '../store/config/StoreConfig'
import AppContextProvider from "./AppContextProvider";
import '../style/App.css';

class App extends Component {

  public store = (): object => {
    const store = Object.assign({}, this.props)
    return ConfigureStore(store)
  };

  public render(): JSX.Element {
    return (
      <div id="app">
        <AppContextProvider children={this.store()}/>
      </div>
    )

  }
}

export default App
