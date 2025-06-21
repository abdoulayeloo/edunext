// src/lib/audit-log.ts
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

interface AuditLogProps {
  action: "CREATE" | "UPDATE" | "DELETE";
  entityId: string;
  entityType: string;
  entityTitle: string;
}

export const createAuditLog = async (props: AuditLogProps) => {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user) {
      throw new Error("Utilisateur non authentifié pour l'audit log.");
    }

    const { action, entityId, entityType, entityTitle } = props;

    await prisma.auditLog.create({
      data: {
        action,
        entityId,
        entityType,
        entityTitle,
        userId: user.id as string,
        userName: user.name,
        userEmail: user.email,
      },
    });
  } catch (error) {
    console.error("[AUDIT_LOG_ERROR]", error);
  }
};