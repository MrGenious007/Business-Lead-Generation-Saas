export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignupPayload extends AuthCredentials {
  fullName?: string;
  organizationName?: string;
}
