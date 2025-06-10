import type { Board } from "@/models/board";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { useNavigate } from "react-router-dom";

function BoardCard({ board, link }: { board: Board; link?: string }) {
  const navigate = useNavigate();
  return (
    // <div className="p-4 border rounded shadow mb-4">
    //   <h2 className="text-xl font-semibold">{board.title}</h2>
    //   <a href={link} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
    //     View Board
    //   </a>
    // </div>
    <Card>
      <CardContent>
        <h2 className="text-xl font-semibold">{board.title}</h2>
        {/* <p className="text-sm text-muted-foreground">{board.description}</p> */}
      </CardContent>
      <CardFooter>
        <Button onClick={() => link && navigate(link)}>View Board</Button>
      </CardFooter>
    </Card>
  );
}

export default function BoardList({ boards }: { boards: Board[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {boards?.map((board) => (
        <BoardCard board={board} link={`/board/${board.id}`} />
      ))}
    </div>
  );
}
