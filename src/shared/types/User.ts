export enum UserType {
  Regular = 'regular',
  Pro = 'pro'
}

export interface User {
  name: string;
  email: string;
  avatar?: string;
  type: UserType;
}