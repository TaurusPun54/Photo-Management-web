import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function LockAlbumSwitch({
  isLocked,
  setIsLocked,
}: {
  isLocked: boolean;
  setIsLocked: (isLocked: boolean) => void;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center space-x-2">
            <Switch
              id="isAlbumLocked"
              checked={isLocked}
              onCheckedChange={setIsLocked}
            />
            <Label htmlFor="isAlbumLocked">Lock this album?</Label>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Locked albums cannot be deleted or modified</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}