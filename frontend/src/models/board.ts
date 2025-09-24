import type { Column } from './column';
import type { Card } from './card';
import type { User } from './user';

export type Board = {
    id: string;
    title: string;
    owner: User;
    members: User[];
    columns: Record<string, Column>;
    cards: Record<string, Card>;
}