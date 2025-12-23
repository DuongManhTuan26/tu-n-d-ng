import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export interface ChatAttachment {
  mimeType: string;
  base64Data: string;
}

export type ChatMode = 'marketing' | 'product';

export const sendMessageToGemini = async (
  message: string,
  history: { role: 'user' | 'model'; parts: { text: string }[] }[],
  isDeepLogic: boolean = false,
  attachment?: ChatAttachment | null, // New parameter for file handling
  chatMode: ChatMode = 'marketing' // Default to marketing
): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    
    // 1. PROMPT: CHAT AI (General Assistant - Placeholder)
    const marketingInstruction = `
VAI TRÒ: Bạn là Trợ Lý Ảo Chat AI của Dương Mạnh Tuấn.
TRẠNG THÁI: Đang chờ cấu hình vai trò cụ thể.

NHIỆM VỤ HIỆN TẠI:
• Trả lời thân thiện, ngắn gọn với người dùng.
• Thông báo rằng bạn là chatbot mới và đang đợi admin cập nhật kịch bản chi tiết.
`;

    // 2. PROMPT: SẢN PHẨM (Sales Consultant - Placeholder)
    const productInstruction = `
VAI TRÒ: Bạn là Bot Tư Vấn Bán Hàng của Dương Mạnh Tuấn.
TRẠNG THÁI: Đang chờ cấu hình vai trò cụ thể.

NHIỆM VỤ HIỆN TẠI:
• Trả lời thân thiện, ngắn gọn với người dùng.
• Thông báo rằng bạn là chatbot tư vấn sản phẩm mới và đang đợi admin cập nhật danh sách sản phẩm.
`;

    // Select instruction based on mode
    const systemInstructionText = chatMode === 'product' ? productInstruction : marketingInstruction;

    // Deep Logic Configuration
    const deepLogicConfig = {
      thinkingConfig: { thinkingBudget: 8192 }, // High budget for deep thought
      tools: [{ googleSearch: {} }], // Enable real-time web search
      systemInstruction: systemInstructionText,
    };

    // Standard Configuration
    const standardConfig = {
      systemInstruction: systemInstructionText,
    };

    const config = isDeepLogic ? deepLogicConfig : standardConfig;

    const chat = ai.chats.create({
      model: model,
      config: config,
      history: history,
    });

    // Construct the message payload
    // Note: Best practice is to put Image/File FIRST, then Text Prompt.
    let msgParts: any[] = [];
    
    // 1. Add Attachment (if exists)
    if (attachment) {
      msgParts.push({
        inlineData: {
          mimeType: attachment.mimeType,
          data: attachment.base64Data
        }
      });
    }

    // 2. Add Text Message
    // Even if message is empty but there is an attachment, it's valid.
    // If no attachment and no message, we send a space to avoid error.
    msgParts.push({ text: message || (attachment ? "" : " ") });

    // Send the message
    // FIX: The SDK expects an object with a 'message' property
    const result = await chat.sendMessage({ message: msgParts });
    
    return result.text || "Xin lỗi, hiện tại tôi chưa thể phản hồi. Vui lòng thử lại sau.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Hệ thống đang gặp sự cố kỹ thuật (File quá lớn hoặc lỗi mạng). Vui lòng thử lại.";
  }
};