export enum UserRole {
  Admin = "admin",
  Reception = "reception",
  Guest = "guest"
}

export interface UserCreationFormData {
  username: string,
  password: string,
  email: string,
  phone: string,
  full_name: string, //* Non è in camelCase altrimenti non va bene per il back
  role: UserRole
}