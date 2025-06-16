"use client";

import { Progress } from "@/components/ui/progress";
import { userInterface } from "@/lib/types/userInterface";

interface StorageUsageProps {
  user: userInterface;
  token: string;
}

export function StorageUsage({ user, token }: StorageUsageProps) {
  const usedPercentage = Math.min(
    100,
    Math.round((user.storage_used / user.storage_limit) * 100)
  );

  const formatStorage = (bytes: number): string => {
    if (bytes < 1000) return `${bytes} B`;
    if (bytes < 1000 * 1000) return `${(bytes / 1000).toFixed(1)} KB`;
    if (bytes < 1000 * 1000 * 1000)
      return `${(bytes / (1000 * 1000)).toFixed(1)} MB`;
    return `${(bytes / (1000 * 1000 * 1000)).toFixed(1)} GB`;
  };

  const getColorClass = (percentage: number): string => {
    if (percentage < 70) return "text-green-600 dark:text-green-400";
    if (percentage < 90) return "text-amber-600 dark:text-amber-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className="px-3 py-4 border-t">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">Storage</span>
        <span className={`text-xs font-medium ${getColorClass(usedPercentage)}`}>
          {usedPercentage}%
        </span>
      </div>
      <Progress value={usedPercentage} className="h-2 mb-2" />
      <p className="text-xs text-muted-foreground">
        {formatStorage(user.storage_used)} of {formatStorage(user.storage_limit)} used
      </p>
    </div>
  );
}