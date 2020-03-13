import { handleActions, ReduxCompatibleReducer } from 'redux-actions';
import * as actionTypes from 'app/store/types';

export type WorkspaceState = {
  workspaceId: number;
};

export interface IAction {
  payload: any;
}

export const initState: WorkspaceState = {
  workspaceId: 0,
};

export const reducer: ReduxCompatibleReducer<WorkspaceState, WorkspaceState> = handleActions({
  [actionTypes.CHANGE_WORKSPACE_ID]: (state: WorkspaceState, { payload }: IAction) => {
    return { ...state, workspaceId: Number(payload) };
  },
}, initState);
