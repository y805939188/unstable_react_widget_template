import * as actionTypes from 'app/store/types/index';
import { createAction, ActionFunction1, Action } from 'redux-actions';
import { Dispatch } from 'redux';

export const getAction: ActionFunction1<string, Action<string>> = createAction<string, any>(
  actionTypes.CHANGE_OPERATOR_CLASSFICATION,
  (type: string) => type,
);

export const searchAction: ActionFunction1<string, Action<string>> = createAction<string, any>(
  actionTypes.SEARCH_OPERATOR,
  (key: string) => key,
);

export const runningAction: ActionFunction1<number, Action<number>> = createAction<number, any>(
  actionTypes.CHANGE_OPERATOR_RUNNING,
  (id: number) => id,
);

export const getOperator = (type: string) => (dispatch: Dispatch<Action<string>>) => {
  dispatch(getAction(type));
};

export const searchOperator = (key: string) => (dispatch: Dispatch<Action<string>>) => {
  dispatch(searchAction(key));
};

export const changeOperatorStatus = (id: number) => (dispatch: Dispatch<Action<number>>) => {
  dispatch(runningAction(id));
};
