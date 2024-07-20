export type Credentials = { email: string; password: string };
export type UserDTO = Credentials & { name: string; lastName: string };
export type User = Omit<UserDTO, 'password'> & { _id: string };
