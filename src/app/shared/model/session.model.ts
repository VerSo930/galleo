import {UserModel} from './user.model';

export class SessionModel {

  token: string;
  user: UserModel;
  isAuthenticated: boolean;
  message: string;


  constructor(token: string, user: UserModel, isAuthenticated: boolean) {
    this.token = token;
    this.user = user;
    this.isAuthenticated = isAuthenticated;
  }


}
