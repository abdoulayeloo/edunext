// src/app/admin/users/page.tsx
import { getAllUsers } from "@/actions/admin/get-users";
import { UsersClient } from "./_components/users-client";
import { Toaster } from "sonner";

const UserManagementPage = async () => {
  const result = await getAllUsers();
  const users = result.users || [];

  return (
    <div className="p-6">
      <Toaster position="top-center" richColors />
      <UsersClient data={users} />
    </div>
  );
};

export default UserManagementPage;