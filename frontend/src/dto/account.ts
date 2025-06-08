export type AccountDto = {
    id: string;
    email: string;
    username?: string;
    password?: string;
    isActive?: boolean;
    createdAt: Date;
}