import { createStore, applyMiddleware, compose, Store } from 'redux';
import { Provider, connect } from 'react-redux';
import thunk from 'redux-thunk';
import { StoreState } from './reducer/allState';
import rootReducer from './reducer';
import * as actionCreators from './actions';
import * as actionTypes from './types';
import * as ISchemas from './schemas';

const store: Store<StoreState.AllState> = createStore(rootReducer, compose(applyMiddleware(thunk)));
export { store, rootReducer, actionCreators, actionTypes, Provider, connect, ISchemas, StoreState };
export default store;
