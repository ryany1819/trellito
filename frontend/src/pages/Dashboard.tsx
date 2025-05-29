import { trellitoApi } from '@/api/trellitoApi';
import BoardList from '@/components/BoardList';

function Dashboard() {
    const { data, isLoading, error } = trellitoApi.useGetBoardsQuery();
    return (
        <div className="p-4">
            {isLoading && <p>Loading...</p>}
            {error && (
                <p>
                    Error loading boards:{' '}
                    {typeof error === 'object' && error !== null && 'message' in error
                        ? (error as any).message
                        : JSON.stringify(error)}
                </p>
            )}
            {!isLoading && !error && data && <BoardList boards={data} />}
        </div>
    );
}

export default Dashboard;