import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Button } from "@/components/ui/button";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_test/test")({
  component: TestComponent,
});

function TestComponent() {
  return (
    <>
      <div>Page for various tests of new components</div>
      Copy
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add to library</p>
          <p>Add to library</p>
          <p>Add to library</p>
          <p>Add to library</p>
          <p>Add to library</p>
        </TooltipContent>
      </Tooltip>
    </>
  );
}
