import Keycloak from 'keycloak-js'

// @ts-ignore
const keycloak: Keycloak.KeycloakInstance = new Keycloak("keycloak.json")

export default keycloak
