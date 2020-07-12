import React, {Component} from "react";
import {Provider} from 'react-redux';
import AppContext from "./AppContext";
import {KeycloakEvent, KeycloakProvider, KeycloakTokens} from "@react-keycloak/web";
import keycloak from "../components/Keycloak/Keycloak";
import {KeycloakError, KeycloakInitOptions} from "keycloak-js";
import ConfigureStore from "../store/config/StoreConfig";

const keycloakInitConfig: KeycloakInitOptions = {
  onLoad: 'check-sso'
}

interface IAppContextProviderProps {}

interface IAppContextProviderState {
  dispatch: Function,
  token: string,
  store: object
}

class AppContextProvider extends Component<IAppContextProviderProps, IAppContextProviderState> {


  constructor(props: IAppContextProviderProps, context: any) {
    super(props, context);
    this.state = {
      store: this.store(),
      token: '',
      dispatch: () => {}
    }
  }

  public store = (): object => {
    const store = Object.assign({}, this.props)
    return ConfigureStore(store)
  };

  private onKeycloakEvent = (event: KeycloakEvent, error?: KeycloakError): void => {
    console.info("Keycloak event: " + JSON.stringify(event))
    if (error) {
      console.error("Keycloak error: " + JSON.stringify(error))
    }
  }

  private onKeycloakTokens = (tokens: KeycloakTokens): void => {
    console.info("Keycloak token: " + JSON.stringify(tokens))
    if (tokens.token) {
      this.setState({...this.state, token: tokens.token})
    }
  }

  public render() {
    return (
      <KeycloakProvider keycloak={keycloak}
                        onEvent={this.onKeycloakEvent}
                        onTokens={this.onKeycloakTokens}
                        autoRefreshToken={true}
                        initConfig={keycloakInitConfig}
      >
        <Provider store={this.state.store}>
          <AppContext token={this.state.token}
                      dispatch={this.state.dispatch}
                      children={this.state.store} />
        </Provider>
      </KeycloakProvider>
    )
  }
}

export default AppContextProvider
