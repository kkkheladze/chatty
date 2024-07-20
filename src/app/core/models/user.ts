export type UserDTO = {
  email: string;
  password: string;
  name: string;
  lastName: string;
};

export type User = UserDTO & { _id: string };
