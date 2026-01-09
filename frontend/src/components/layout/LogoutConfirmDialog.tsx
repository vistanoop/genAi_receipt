import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../ui/alert-dialog";
import { LogOut } from "lucide-react";

interface LogoutConfirmDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
}

export function LogoutConfirmDialog({ isOpen, onOpenChange, onConfirm }: LogoutConfirmDialogProps) {
    return (
        <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
            <AlertDialogContent className="rounded-3xl border-border/50 bg-background/95 backdrop-blur-xl font-display">
                <AlertDialogHeader>
                    <div className="w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center mb-4">
                        <LogOut className="w-6 h-6 text-destructive" />
                    </div>
                    <AlertDialogTitle className="text-xl font-black uppercase tracking-tight">
                        Confirm Logout
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground font-bold">
                        Are you sure you want to sign out? You will need to log in again to access your startup analyses and funding intelligence.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-3 sm:gap-0 mt-2">
                    <AlertDialogCancel className="rounded-xl border-border/50 font-black uppercase tracking-widest text-[10px] h-11 px-6">
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className="rounded-xl bg-destructive hover:bg-destructive/90 text-destructive-foreground font-black uppercase tracking-widest text-[10px] h-11 px-8 shadow-lg shadow-destructive/20"
                    >
                        Logout
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
