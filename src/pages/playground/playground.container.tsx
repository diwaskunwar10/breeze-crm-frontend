
import Chat from '@/components/chat/Chat';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const PlaygroundContainer = () => {

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Chat Playground</h1>
        <p className="text-muted-foreground">Test the chat interface with streaming responses</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="h-[calc(100vh-240px)]">
          <CardHeader>
            <CardTitle>Chat</CardTitle>
            <CardDescription>
              Send messages and receive streaming responses
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 h-[calc(100%-5rem)]">
            <Chat />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlaygroundContainer;
