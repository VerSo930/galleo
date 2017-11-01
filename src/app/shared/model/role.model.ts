export class RoleModel {
  id: number;
  name: string;
  permissions: string[];


  constructor(id: number, name: string, permissions: string[]) {
    this.id = id;
    this.name = name;
    this.permissions = permissions;
  }
}
