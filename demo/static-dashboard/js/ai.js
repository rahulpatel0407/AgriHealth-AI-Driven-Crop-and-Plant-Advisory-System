window.AIAssistantConfig = {
    AI_ASSISTANT_HISTORY_KEY: 'agrihealth_ai_assistant_history_v1',
    AI_ASSISTANT_PROMPTS: [
        { label: 'What crop should I grow here?', value: 'What crop should I grow here?', category: 'crop' },
        { label: 'Is irrigation needed today?', value: 'Is irrigation needed today?', category: 'irrigation' },
        { label: 'Check disease risk', value: 'Check disease risk for my field.', category: 'disease' },
        { label: 'How to improve soil health?', value: 'How can I improve my soil health?', category: 'soil' },
        { label: 'Government schemes', value: 'Which government scheme can I apply for?', category: 'scheme' },
        { label: 'What fertilizer should I use?', value: 'What fertilizer should I use for my crop?', category: 'soil' },
        { label: 'Should I sell now?', value: 'Should I sell my crop now or wait?', category: 'market' },
        { label: 'Weather advice', value: 'What should I do based on the current weather?', category: 'weather' }
    ],
    AI_ASSISTANT_ENDPOINTS: {
        general: '/api/ai/chat',
        crop: '/api/ai/advice',
        soil: '/api/ai/soil-help',
        weather: '/api/ai/weather-help',
        disease: '/api/ai/advice',
        irrigation: '/api/ai/advice',
        scheme: '/api/ai/advice',
        market: '/api/ai/advice'
    },
    AI_ASSISTANT_DEFAULT_WELCOME: {
        id: 'assistant-welcome',
        role: 'assistant',
        content: 'I can help with crop, soil, weather, disease, irrigation, market prices, and government schemes. Ask a question or tap a prompt.',
        createdAt: new Date().toISOString(),
        category: 'general',
        source: 'system'
    },
    assistantState: {
        messages: [],
        loadingMessageId: null,
        speechRecognition: null,
        historyLoaded: false
    }
};
