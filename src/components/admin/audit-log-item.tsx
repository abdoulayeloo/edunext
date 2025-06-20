// src/components/admin/audit-log-item.tsx
import { AuditLog } from "@prisma/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AuditLogItemProps {
  log: AuditLog;
}

export const AuditLogItem = ({ log }: AuditLogItemProps) => {
  const generateLogMessage = (log: AuditLog) => {
    const { action, entityType, entityTitle } = log;
    switch (action) {
      case "CREATE": return `a créé ${entityType.toLowerCase()} "${entityTitle}"`;
      case "UPDATE": return `a mis à jour ${entityType.toLowerCase()} "${entityTitle}"`;
      case "DELETE": return `a supprimé ${entityType.toLowerCase()} "${entityTitle}"`;
      default: return `a effectué une action inconnue sur "${entityTitle}"`;
    }
  };
  console.log(log);

  return (
    <li className="flex items-center gap-x-2">
      <Avatar className="h-8 w-8">
        {/* On pourrait utiliser une image si elle existe */}
        <AvatarFallback>{log.userName?.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col space-y-0.5">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-primary">{log.userName}</span> {generateLogMessage(log)}
        </p>
        <p className="text-xs text-muted-foreground">
          {format(new Date(log.createdAt), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
        </p>
      </div>
    </li>
  );
};