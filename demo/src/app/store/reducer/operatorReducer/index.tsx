import { handleActions, ReduxCompatibleReducer } from 'redux-actions';
import * as actionTypes from 'app/store/types';

export type OperatorState = {
  operaotrType: string;
  searchOperatorKey: string;
  running: number;
};

export interface IAction {
  payload: any;
}

export const initState: OperatorState = {
  operaotrType: 'all',
  searchOperatorKey: '',
  running: 0, // 0是没有正在试跑中的 >0 就是正在试跑中的taskid 可以根据这个id终止任务
};

export const reducer: ReduxCompatibleReducer<OperatorState, OperatorState> = handleActions({
  [actionTypes.CHANGE_OPERATOR_CLASSFICATION]: (state: OperatorState, { payload }: IAction) => {
    return { ...state, operaotrType: payload || 'all', searchOperatorKey: '' };
  },
  [actionTypes.SEARCH_OPERATOR]: (state: OperatorState, { payload }: IAction) => {
    return { ...state, operaotrType: payload ? '' : 'all', searchOperatorKey: payload };
  },
  [actionTypes.CHANGE_OPERATOR_RUNNING]: (state: OperatorState, { payload }: IAction) => {
    return { ...state,  running: payload };
  },
}, initState);
