export interface ChatMessageModel {
  id: number | null,
  name: string,
  chat_partner: number | null,
  current_user_id: number | null,
  my_text_message: string,
  chat_partner_message: string,
  message_time: string
}

export interface ChatResponse {
  loadedChat: ChatMessageModel[];
}
