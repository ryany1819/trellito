import type { Column } from './column';
import type { Card } from './card';

export type Board = {
    id: string;
    title: string;
    columns: Record<string, Column>;
    cards: Record<string, Card>;
}