import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function SupportChatButton() {
  const location = useLocation();
  const path = location.pathname ?? '';
  if (path.startsWith('/admin')) return null;
  if (path.startsWith('/vendedor')) return null;
  if (path.startsWith('/suporte')) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <Link to="/suporte">
        <Button className="rounded-full h-12 px-4 font-body text-sm tracking-wide shadow-lg gap-2">
          <MessageSquare className="w-4 h-4" />
          Chat / Suporte
        </Button>
      </Link>
    </div>
  );
}
