import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function LoadMoreControls({
  leftText,
  onLess,
  lessDisabled,
  onMore,
  moreDisabled,
  lessLabel = 'Mostrar menos',
  moreLabel = 'Carregar mais',
  className = '',
}) {
  return (
    <div className={`flex items-center justify-between mt-4 gap-3 flex-wrap ${className}`.trim()}>
      <div className="font-body text-xs text-muted-foreground">{leftText}</div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="rounded-none font-body text-sm gap-2"
          onClick={onLess}
          disabled={lessDisabled}
        >
          <ChevronUp className="w-4 h-4" />
          {lessLabel}
        </Button>
        <Button className="rounded-none font-body text-sm gap-2" onClick={onMore} disabled={moreDisabled}>
          <ChevronDown className="w-4 h-4" />
          {moreLabel}
        </Button>
      </div>
    </div>
  );
}

