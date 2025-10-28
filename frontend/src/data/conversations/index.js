import { sweetConversations } from "./sweet";

// TODO: Import all other conversation types
// import { cheerfulConversations } from './cheerful';
// import { shyConversations } from './shy';
// import { friendlyConversations } from './friendly';
// import { warmConversations } from './warm';
// import { mysteriousConversations } from './mysterious';

export const conversations = {
  sweet: sweetConversations,
  // TODO: Add other waifu types
  // cheerful: cheerfulConversations,
  // shy: shyConversations,
  // friendly: friendlyConversations,
  // warm: warmConversations,
  // mysterious: mysteriousConversations,
  
  // Temporary fallback - use sweet for all types until you create the other files
  cheerful: sweetConversations,
  shy: sweetConversations,
  friendly: sweetConversations,
  warm: sweetConversations,
  mysterious: sweetConversations,
};

// Also export as conversationDatabase for backward compatibility
export const conversationDatabase = conversations;
