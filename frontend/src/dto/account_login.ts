export type AccountLoginDto = {
  id: string;
  accountId: string;
  loginAt: Date;
  loginIp?: string;
  userAgent?: string;
  success: boolean;
};