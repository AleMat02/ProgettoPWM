export enum UserRole {
  Admin = "admin",
  Reception = "reception",
  Guest = "guest"
}

export interface UserData {
  id: number,
  username: string,
  password: string,
  email: string,
  phone: string, //Nel db è un campo string
  full_name: string, //Non è in camelCase altrimenti non va bene per il back
  role: UserRole,
  hotel_id : number //Nel db è un campo integer, non è in camelCase altrimenti non va bene per il back
}