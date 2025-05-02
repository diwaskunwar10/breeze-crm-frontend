import http from './httpBase';

const PREFIX = '/v1';

export interface ChatMessage {
  message: string;
  user_id: string;
  role: 'user' | 'assistant' | 'system';
  format: 'role data' | 'role content';
  media_id: string[];
}

export const chatService = {
  sendChatMessage: async (chatMessage: ChatMessage): Promise<Response> => {
    const token = localStorage.getItem('token');

    // Using fetch directly to have more control over the request
    const response = await fetch(`${http.defaults.baseURL}${PREFIX}/chat`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(chatMessage)
    });

    return response;
  }
};
