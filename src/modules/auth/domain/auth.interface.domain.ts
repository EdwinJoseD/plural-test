export interface IAuthDomain {
  login(email: string, password: string): Promise<string>;
  register(email: string, password: string): Promise<string>;
  getProfile(userId: string): Promise<any>;
}
