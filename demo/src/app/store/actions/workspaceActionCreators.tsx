import * as actionTypes from 'app/store/types/index';
import { createAction, ActionFunction1, Action } from 'redux-actions';
import { Dispatch } from 'redux';

export const changeAction: ActionFunction1<number, Action<number>> = createAction<number, any>(
  actionTypes.CHANGE_WORKSPACE_ID,
  (type: number) => type,
);

export const changeWorkspaceId = (id: number) => (dispatch: Dispatch<Action<number>>) => {
  dispatch(changeAction(id));
};
