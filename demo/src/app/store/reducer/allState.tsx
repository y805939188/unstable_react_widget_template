import { UserState } from './userReducer';
import { OperatorState } from './operatorReducer';
import { WorkspaceState } from './workspaceReducer';

export namespace StoreState {
  export type IUserState = {
    [K in keyof UserState]: UserState[K];
  };

  export type IOperatorState = {
    [K in keyof OperatorState]: OperatorState[K];
  };

  export type IWorkspaceState = {
    [K in keyof WorkspaceState]: WorkspaceState[K];
  };

  export interface AllState {
    user: IUserState;
    operator: IOperatorState;
    workspace: IWorkspaceState;
  }
}
