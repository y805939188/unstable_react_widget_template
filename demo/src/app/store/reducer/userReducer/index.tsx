import { handleActions, Reducer } from 'redux-actions';
import { IUser } from 'common/schemas/user';
import * as actionTypes from 'app/store/types';

export type UserState = {
  userInfo: IUser | null;
};

export interface IAction {
  payload: any;
}

export const initState: UserState = {
  userInfo: null,
};

// handleActions 是帮忙优化写法的 正常使用 switch
export const reducer: Reducer<UserState, IAction['payload']> = handleActions({
  [actionTypes.GET_LOGIN_USER]: (state: UserState, { payload }: IAction) => {
    return {
      ...state,
      userInfo: payload ?  payload.userInfo : null,
    };
  },
  [actionTypes.SET_USER_INFO]: (state: UserState, { payload }: IAction) => {
    return {
      ...state,
      userInfo: payload ?  payload.userInfo : null,
    };
  },
}, initState);
