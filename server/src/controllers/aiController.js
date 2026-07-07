import supabase from '../config/supabaseClient.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok, created } from '../utils/apiResponse.js';
import { AppError } from '../utils/AppError.js';
import { askCivicAssistant } from '../services/geminiService.js';

export const sendChatMessage = asyncHandler(async (req, res) => {
  const { message, language } = req.body;

  const { error: userMsgError } = await supabase.from('chat_messages').insert({
    user_id: req.user.id,
    role: 'user',
    content: message,
    language,
  });
  if (userMsgError) throw new AppError(500, userMsgError.message);

  const structured = await askCivicAssistant(message, language);

  const { data: assistantMessage, error: assistantMsgError } = await supabase
    .from('chat_messages')
    .insert({
      user_id: req.user.id,
      role: 'assistant',
      content: structured.shortAnswer,
      language,
      structured,
    })
    .select()
    .single();

  if (assistantMsgError) throw new AppError(500, assistantMsgError.message);

  created(res, {
    message: {
      id: assistantMessage.id,
      role: 'assistant',
      content: assistantMessage.content,
      structured,
      createdAt: assistantMessage.created_at,
    },
  });
});

export const getChatHistory = asyncHandler(async (req, res) => {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: true });

  if (error) throw new AppError(500, error.message);

  ok(
    res,
    data.map((row) => ({
      id: row.id,
      role: row.role,
      content: row.content,
      language: row.language,
      structured: row.structured,
      createdAt: row.created_at,
    }))
  );
});
