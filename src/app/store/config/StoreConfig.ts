import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';
import RootReducer from '../reducers/RootReducer'

const middleware: any[] = []

middleware.push(thunk)

export default function ConfigureStore(initialState) {
  return createStore(
    RootReducer,
    initialState,
    applyMiddleware(...middleware)
  );
}
