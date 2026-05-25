"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertCircle,
  Clock,
  CheckCircle2,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  Play,
  MapPin,
  Calendar,
  User,
} from "lucide-react";
import { MaintenanceRequest, MaintenanceStatus } from "@/lib/types";
import {
  getMaintenanceStatusLabel,
  getPriorityLabel,
  getCategoryLabel,
  getStatusColor,
  getPriorityColor,
} from "@/lib/maintenance-utils";
import { formatPersianDate, toPersianDigits } from "@/lib/booking-utils";
import { cn } from "@/lib/utils";

interface MaintenanceKanbanProps {
  requests: MaintenanceRequest[];
  onViewDetails: (request: MaintenanceRequest) => void;
  onUpdateStatus: (requestId: string, newStatus: MaintenanceStatus) => void;
  onAssign: (requestId: string) => void;
  onDelete: (requestId: string) => void;
}

const statusColumns: {
  status: MaintenanceStatus;
  label: string;
  icon: React.ElementType;
  color: string;
}[] = [
  {
    status: "reported",
    label: "گزارش شده",
    icon: AlertCircle,
    color: "text-blue-600",
  },
  {
    status: "assigned",
    label: "واگذار شده",
    icon: UserPlus,
    color: "text-purple-600",
  },
  {
    status: "in_progress",
    label: "در حال انجام",
    icon: Clock,
    color: "text-yellow-600",
  },
  {
    status: "completed",
    label: "تکمیل شده",
    icon: CheckCircle2,
    color: "text-green-600",
  },
];

export function MaintenanceKanban({
  requests,
  onViewDetails,
  onUpdateStatus,
  onAssign,
  onDelete,
}: MaintenanceKanbanProps) {
  const getRequestsByStatus = (status: MaintenanceStatus) => {
    return requests.filter((req) => req.status === status);
  };

  const RequestCard = ({ request }: { request: MaintenanceRequest }) => {
    return (
      <Card className="mb-3 hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-4 space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 space-y-1">
              <h4 className="font-semibold text-sm leading-tight line-clamp-2">
                {request.title}
              </h4>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn("text-xs", getPriorityColor(request.priority))}
                >
                  {getPriorityLabel(request.priority)}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {getCategoryLabel(request.category)}
                </Badge>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onViewDetails(request)}>
                  <Eye className="ml-2 h-4 w-4" />
                  مشاهده جزئیات
                </DropdownMenuItem>
                {request.status === "reported" && (
                  <DropdownMenuItem onClick={() => onAssign(request.id)}>
                    <UserPlus className="ml-2 h-4 w-4" />
                    واگذاری
                  </DropdownMenuItem>
                )}
                {request.status === "assigned" && (
                  <DropdownMenuItem
                    onClick={() => onUpdateStatus(request.id, "in_progress")}
                  >
                    <Play className="ml-2 h-4 w-4" />
                    شروع کار
                  </DropdownMenuItem>
                )}
                {request.status === "in_progress" && (
                  <DropdownMenuItem
                    onClick={() => onUpdateStatus(request.id, "completed")}
                  >
                    <CheckCircle2 className="ml-2 h-4 w-4" />
                    تکمیل
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(request.id)}
                  className="text-red-600"
                >
                  <Trash2 className="ml-2 h-4 w-4" />
                  حذف
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Venue */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span className="line-clamp-1">{request.venueName}</span>
          </div>

          {/* Description */}
          <p className="text-xs text-muted-foreground line-clamp-2">
            {request.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatPersianDate(new Date(request.createdAt))}</span>
            </div>
            {request.assignedToName && (
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{request.assignedToName}</span>
              </div>
            )}
          </div>

          {/* Photos indicator */}
          {request.photos && request.photos.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>📷</span>
              <span>{toPersianDigits(request.photos.length.toString())} تصویر</span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statusColumns.map((column) => {
        const columnRequests = getRequestsByStatus(column.status);
        const Icon = column.icon;

        return (
          <div key={column.status} className="space-y-3">
            {/* Column Header */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-base">
                  <div className="flex items-center gap-2">
                    <Icon className={cn("h-5 w-5", column.color)} />
                    <span>{column.label}</span>
                  </div>
                  <Badge variant="secondary">
                    {toPersianDigits(columnRequests.length.toString())}
                  </Badge>
                </CardTitle>
              </CardHeader>
            </Card>

            {/* Column Content */}
            <ScrollArea className="h-[calc(100vh-20rem)]">
              <div className="pr-4">
                {columnRequests.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Icon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        موردی وجود ندارد
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  columnRequests.map((request) => (
                    <RequestCard key={request.id} request={request} />
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        );
      })}
    </div>
  );
}
