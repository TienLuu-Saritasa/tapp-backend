interface User {
  readonly email: string;
  readonly password: string;
}

type Login = User;

interface Register extends User {
  readonly confirmPassword: string;
}

export { Login, Register, User };
