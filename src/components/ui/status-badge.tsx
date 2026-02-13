import { Badge } from "@/components/ui/badge";

export const StatusBadge = ({ status }: { status: 'pending' | 'approved' | 'rejected' }) => {
    switch (status) {
        case 'pending':
            return <Badge variant="secondary">Pending</Badge>;
        case 'approved':
            return <Badge className="bg-success/20 text-success-foreground border border-success/50 hover:bg-success/30">Approved</Badge>;
        case 'rejected':
            return <Badge variant="destructive">Rejected</Badge>;
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
};
