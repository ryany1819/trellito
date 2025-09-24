export type BoardDto = {
    id: string;
    title: string;
    description?: string;
    ownerId: string;
    memberIds?: string[];
    columns: { id: string; title: string; cardIds: string[] }[];
    cards: {
        id: string;
        title: string;
        description?: string;
        assigneeId?: string;
    }[];
    isArchived?: boolean;
    createdAt: Date;
    updatedAt?: Date;
};