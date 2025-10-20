import { handleChatRequest } from '@/modules/chat/chatApi';

export async function POST(request: Request) {
  return handleChatRequest(request);
}
