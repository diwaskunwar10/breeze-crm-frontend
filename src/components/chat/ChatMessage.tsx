import React from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAppSelector } from '@/redux/store';

interface ChatMessageProps {
  content: string;
  isUser: boolean;
  timestamp?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ content, isUser, timestamp }) => {
  const { user } = useAppSelector((state) => state.auth);
  
  return (
    <div className={cn(
      "flex w-full mb-4",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "flex max-w-[80%]",
        isUser ? "flex-row-reverse" : "flex-row"
      )}>
        <Avatar className={cn("h-8 w-8", isUser ? "ml-2" : "mr-2")}>
          <AvatarImage src="" />
          <AvatarFallback>
            {isUser ? user?.name?.charAt(0) || 'U' : 'AI'}
          </AvatarFallback>
        </Avatar>
        
        <div className={cn(
          "rounded-lg p-3",
          isUser 
            ? "bg-primary text-primary-foreground" 
            : "bg-muted"
        )}>
          <p className="text-sm">{content}</p>
          {timestamp && (
            <p className="text-xs opacity-70 mt-1">{timestamp}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
