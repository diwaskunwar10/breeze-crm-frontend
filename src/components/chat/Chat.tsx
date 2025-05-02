import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useAppSelector } from '@/redux/store';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { chatService, ChatMessage as ChatMessageType } from '@/api/chat.service';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Add user message to the chat
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Prepare the message for the API
      const chatMessage: ChatMessageType = {
        message: content,
        user_id: user?.id || 'user123', // Fallback user ID if not available
        role: 'user',
        format: 'role data',
        media_id: ['string'], // Using default value as per the curl example
      };

      // Send the message to the API
      const response = await chatService.sendChatMessage(chatMessage);

      if (!response.ok) {
        console.error('Response not OK:', await response.text());
        throw new Error(`Failed to send message: ${response.status} ${response.statusText}`);
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      let receivedText = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          // Convert the chunk to text
          const chunk = new TextDecoder().decode(value);
          receivedText += chunk;

          // Process the chunk to extract messages
          // This handles both SSE format (data: Message) and regular text
          if (chunk.includes('data:')) {
            // SSE format
            const lines = chunk.split('\n\n');

            for (const line of lines) {
              if (line.startsWith('data:')) {
                const messageContent = line.substring(5).trim();
                addAIMessage(messageContent);
              }
            }
          } else {
            // Regular text format
            addAIMessage(chunk);
          }
        }
      } else {
        // If no reader is available, try to parse the response as JSON
        try {
          const jsonResponse = await response.json();
          if (jsonResponse) {
            addAIMessage(JSON.stringify(jsonResponse));
          }
        } catch (e) {
          console.error('Failed to parse response as JSON:', e);
        }
      }

      // Helper function to add AI messages
      function addAIMessage(content: string) {
        const aiMessage: Message = {
          id: Date.now().toString(),
          content,
          isUser: false,
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>Send a message to start the conversation</p>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage
              key={message.id}
              content={message.content}
              isUser={message.isUser}
              timestamp={new Date(message.timestamp).toLocaleTimeString()}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default Chat;
