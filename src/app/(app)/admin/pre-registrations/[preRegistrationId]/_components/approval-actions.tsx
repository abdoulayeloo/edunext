// src/app/(app)/admin/pre-registrations/[id]/_components/approval-actions.tsx
"use client";

import { useTransition } from "react";
import { PreRegistration } from "@prisma/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  approvePreRegistration,
  rejectPreRegistration,
} from "@/actions/preregistration";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ApprovalActionsProps {
  application: PreRegistration;
}

export const ApprovalActions = ({ application }: ApprovalActionsProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onApprove = () => {
    startTransition(() => {
      approvePreRegistration(application.id).then((data) => {
        if (data.error) toast.error(data.error);
        if (data.success) {
          toast.success(data.success);
          router.push("/admin/pre-registrations");
        }
      });
    });
  };

  const onReject = () => {
    startTransition(() => {
      rejectPreRegistration(application.id).then((data) => {
        if (data.error) toast.error(data.error);
        if (data.success) {
          toast.warning(data.success); // On utilise un toast 'warning' pour le rejet
          router.push("/admin/pre-registrations");
        }
      });
    });
  };

  return (
    <div className="flex gap-x-2">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            disabled={isPending || application.status !== "PENDING"}
          >
            Rejeter
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Êtes-vous sûr de vouloir rejeter cette candidature ?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={onReject} disabled={isPending}>
              {isPending ? "Rejet en cours..." : "Confirmer le Rejet"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Button
        onClick={onApprove}
        disabled={isPending || application.status !== "PENDING"}
      >
        {isPending
          ? "Inscription en cours..."
          : "Approuver et Inscrire l'étudiant"}
      </Button>
    </div>
  );
};
