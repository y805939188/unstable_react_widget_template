import * as actionTypes from 'app/store/types/index';
import { IUser } from 'common/schemas/user';
import userDAO from 'app/dao/user';
import { createAction, ActionFunction1, Action } from 'redux-actions';
import { Dispatch } from 'redux';

interface IPayload {
  userInfo: any;
}
export const loginUser: ActionFunction1<IUser, Action<IPayload>> = createAction<IPayload, IUser>(
    actionTypes.GET_LOGIN_USER,
    (userInfo: IUser) => ({ userInfo }),
  );

/**
 * redux-actions的源码中对于Dispatch有如下定义 其中 <T extends A> 就是指T 继承了 A中的属性
 * export interface Dispatch<A extends Action = AnyAction> {
 *   <T extends A>(action: T): T
 * }
 */
export const getLoginUser = () => (dispatch: Dispatch<Action<IPayload>>) => {
  userDAO.permission().then((res: any) => {
    const user: IUser = res.data && res.data.data;
    const action = loginUser(user);
    if (user && user.username) localStorage.setItem('4pd_username', user.username);
    dispatch(action);
  });
};

export const setUserInfo = (info: IUser) => (dispatch: Dispatch<Action<IPayload>>) => {
  dispatch(loginUser(info));
};
