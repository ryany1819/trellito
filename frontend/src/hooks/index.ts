import { trellitoApi } from '@/api/trellitoApi';
import { useMemo } from 'react';
import type { User } from '@/models/user';

export const useBoard = (boardId: string) => {
  const { data: boardData, isLoading: boardLoading, error: boardError } = trellitoApi.useGetBoardByIdQuery(boardId);

  const userIds = useMemo(() => {
    if (!boardData) return [];
    const ids = new Set<string>();
    ids.add(boardData.owner.id);
    boardData.members.forEach(({id}) => ids.add(id));
    return Array.from(ids);
  }, [boardData]);

  const { data: users, isLoading: usersLoading, error: usersError } = trellitoApi.useGetUsersByIdsQuery(userIds, {
    skip: userIds.length === 0,
  });

  const board = useMemo(() => {
    if (!boardData || !users) return null;
    const owner = users.find((u) => u.id === boardData.owner.id);
    if (!owner) {
      console.error("Owner not found for board", boardData);
      return null; // Owner must be found
    }
    const members = boardData.members?.map(({id}) => (users.find((u) => u.id === id))).filter((u): u is NonNullable<User> => u !== undefined) as User[] || [];
    return {
      ...boardData,
      owner,
      members
    };
  }, [boardData, users]);

  return { 
    board,
    isLoading: boardLoading || usersLoading,
    error: boardError || usersError,
  };
}