export interface ChatMessageModel {
  id: number | null,
  name: string,
  chatPartner: number | null,
  currentUserId: number | null,
  myTextMessage: string,
  chatPartnerMessage: string,
  messageTime: string
}
