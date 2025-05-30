import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useState } from 'react';
import { trellitoApi } from '@/api/trellitoApi';

export default function CreateBoardDialog() {
    const [title, setTitle] = useState('');
    const [open, setOpen] = useState(false);
    const [addBoard, {isLoading}] = trellitoApi.useAddBoardMutation();

    const handleCreate = async () => {
        if (!title.trim()) {
            alert('Title cannot be empty');
            return;
        }
        await addBoard({title}).unwrap();
        setTitle('');
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={"default"}>
                    +Create Board
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Board</DialogTitle>
                </DialogHeader>
                <Input
                    placeholder="Board title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mb-4"
                />
                <DialogFooter>
                    <Button onClick={handleCreate} disabled={isLoading || !title.trim()}>
                        Create
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}