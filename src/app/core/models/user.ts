export type UserDTO = {
  email: string;
  name: string;
  lastName: string;
};

export type User = UserDTO & { _id: string };
