export type BoardDto = {
    id: string;
    title: string;
    columns: { id: string; title: string; cardIds: string[] }[];
    cards: {
        id: string;
        title: string;
        description?: string;
        assigneeId?: string;
    }[];
};