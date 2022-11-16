interface User {
  username: string;
  password: string;
}

type Login = User;

interface Register extends User {
  confirmPassword: string;
}

export { Login, Register, User };
