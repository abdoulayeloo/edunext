// src/app/admin/users/_components/users-client.tsx
"use client";

import { User } from "@prisma/client";
import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
// import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UserForm } from "./user-form";
import { DataTable } from "./data-table";

export const UsersClient = ({ data }: { data: User[] }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent>
                <DialogHeader><DialogTitle>Créer un nouvel utilisateur</DialogTitle></DialogHeader>
                <UserForm onClose={() => setIsModalOpen(false)} />
            </DialogContent>
        </Dialog>
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Utilisateurs ({data.length})</h1>
            <Button onClick={() => setIsModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Créer un utilisateur
            </Button>
        </div>
        <DataTable columns={columns} data={data} />
        </>
    )
}