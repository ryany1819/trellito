import type { AccountDto } from "./account";

export type AccountLoginDto = AccountDto & {
  id: string;
  accountId: string;
  loginAt: Date;
  loginIp?: string;
  userAgent?: string;
  success: boolean;
};