import { combineReducers } from 'redux';
import { reducer as user } from './userReducer';
import { reducer as operator } from './operatorReducer';
import { reducer as workspace } from './workspaceReducer';

export default combineReducers<any>({ user, operator, workspace });
