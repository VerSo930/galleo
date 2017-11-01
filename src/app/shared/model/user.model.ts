import {PhotoModel} from './photo.model';
import {RoleModel} from './role.model';

export class UserModel {
  id: number;
  name: string;
  lastName: string;
  email: string;
  userName: string;
  password: string;
  createdAt: number;
  lastActivity: number;
  isEnabled: boolean;
  avatar: PhotoModel;
  role: number;
  photosCount: number;
  galleriesCount: number;


  constructor() {

  }
}
