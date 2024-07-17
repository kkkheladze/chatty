export type RawUser = {
  email: string;
  password: string;
  name: string;
  lastName: string;
};

export type User = RawUser & { id: string };
