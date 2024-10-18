export interface DecodedToken {
  loginData: {
    usernameOrEmail: string;
    password: string;
  };
  iat: number;
  exp: number;
}
