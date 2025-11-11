
// This is a mock implementation of the Gemini API service.
// In a real application, this would use the @google/genai library.
// For demonstration purposes, we are simulating the API calls and responses.

import { GoogleGenAI, Chat, GenerateContentResponse, Type, Modality } from '@google/genai';
import { GroundingChunk } from '../types';

// Mocking the @google/genai library since it's not available in this environment.
// The code is written as if the library is present.
const mockGoogleGenAI = {
  chats: {
    create: (options: any) => ({
      sendMessageStream: async function*(payload: any) {
        const responses = [
          "Of course! ", "I can help with that. ", "Based on your data, ", "the primary insight is that your Q3 sales ", "saw a 15% increase in the 'Gadgets' category, ", "driven by the new product launch. ", "However, customer retention in the 'Services' category ", "has decreased by 5%. ", "I'd recommend focusing on a customer loyalty program for that segment."
        ];
        for (const res of responses) {
          await new Promise(resolve => setTimeout(resolve, 50));
          yield { text: res };
        }
      }
    })
  },
  models: {
    generateContent: async (request: any): Promise<GenerateContentResponse> => {
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      if(request.config?.tools?.some((t: any) => t.googleSearch)) {
        const groundingChunks: GroundingChunk[] = [
           { web: { uri: 'https://www.businessinsider.com/tech-trends-2024', title: 'Top Tech Trends for 2024 - Business Insider' }},
           { web: { uri: 'https://www.forbes.com/sites/bernardmarr/2023/10/09/the-10-biggest-business-trends-for-2024-everyone-must-be-ready-for-now/', title: 'The 10 Biggest Business Trends For 2024 - Forbes' }}
        ];
        return {
            text: `According to recent market analysis, key trends for small businesses in the upcoming year include hyper-personalization using AI, an increased focus on sustainable and ethical practices, and the adoption of remote collaboration tools. E-commerce is expected to continue its growth, with a particular emphasis on social commerce and live shopping experiences.`,
            candidates: [{ groundingMetadata: { groundingChunks } }]
        } as unknown as GenerateContentResponse;
      }

      if (request.model.includes('lite')) { // Quick Summary
        return { text: `In short, your sales are up 12% quarter-over-quarter, with the highest margin from online channels. Customer satisfaction is stable at 4.5/5 stars.`} as unknown as GenerateContentResponse;
      }
      
       if (request.model.includes('pro')) { // Deep Analysis
        return { text: `## Deep Dive Analysis

**Executive Summary:**
The business is showing strong growth in revenue, but there are underlying concerns regarding customer churn and operational efficiency that need to be addressed.

### 1. Sales Performance
*   **Positive Trend:** Overall sales have increased by 22% year-over-year. The 'Pro' subscription plan is the main driver, contributing 60% of new revenue.
*   **Area of Concern:** The 'Basic' plan has a churn rate of 18%, which is alarmingly high. This may be due to a lack of perceived value compared to the 'Pro' plan.

### 2. Customer Insights
*   **High Satisfaction:** Top-spending customers report high satisfaction (NPS score of 75).
*   **Geographic Concentration:** 70% of your customer base is located in urban centers on the East Coast. This presents both a strong market presence and a risk of over-concentration.

### 3. Actionable Recommendations
1.  **Retention Strategy:** Introduce a 'Basic+' plan with one or two key features from the 'Pro' plan to reduce churn.
2.  **Market Expansion:** Launch a targeted digital marketing campaign for West Coast metropolitan areas.
3.  **Operational A/B Test:** Experiment with a new inventory management workflow for your top 5 products to measure efficiency gains.
`} as unknown as GenerateContentResponse;
      }

       if (request.config?.responseModalities?.includes(Modality.AUDIO)) { // TTS
         // This would normally return audio data. We'll return a mock base64 string.
         // This mock string won't produce audible sound but will allow the flow to be tested.
         return { candidates: [{ content: { parts: [{ inlineData: { data: 'UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=', mimeType: 'audio/wav' } }] } }] } as unknown as GenerateContentResponse;
       }

      return { text: 'An unexpected error occurred in the mock service.'} as unknown as GenerateContentResponse;
    }
  }
};


// Simulate GoogleGenAI constructor
const GeminiService = () => mockGoogleGenAI;

const ai = GeminiService();

// We need a singleton chat instance for the chatbot
let chatInstance: any = null;
const getChatInstance = () => {
    if (!chatInstance) {
        chatInstance = ai.chats.create({
          model: 'gemini-2.5-flash',
        });
    }
    return chatInstance;
}

export const getChatbotResponseStream = (message: string) => {
    const chat = getChatInstance();
    return chat.sendMessageStream({ message });
};

export const getMarketInsights = async (query: string) => {
    return await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: query,
        config: {
            tools: [{googleSearch: {}}],
        },
    });
};

export const getQuickSummary = async (context: string) => {
    return await ai.models.generateContent({
        model: 'gemini-2.5-flash-lite',
        contents: `Provide a very short, one-sentence summary of the following data: ${context}`,
    });
};

export const getDeepAnalysis = async (context: string) => {
    return await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: `Provide a detailed, multi-point analysis with actionable recommendations for the following business data: ${context}`,
        config: {
            thinkingConfig: { thinkingBudget: 32768 },
        }
    });
};

export const getTextToSpeech = async (text: string) => {
    return await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text }] }],
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: 'Kore' },
                },
            },
        },
    });
};
