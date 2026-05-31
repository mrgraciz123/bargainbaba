const { GoogleGenerativeAI } = require('@google/generative-ai');

async function generateProcurementIntelligence(apiKey, prompt) {
  const genAI = new GoogleGenerativeAI(apiKey);

  const modelsToTry = [
    'gemini-2.5-flash',
    'gemini-2.0-flash'
  ];

  let lastError = null;

  for (let i = 0; i < modelsToTry.length; i++) {
    const modelName = modelsToTry[i];
    console.log(`[Gemini] Model: ${modelName} (Attempt ${i + 1}/${modelsToTry.length})`);
    
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 3500,
        },
      });

      const response = await result.response;
      const text = response.text();
      
      console.log(`[Gemini] Prompt Length: ${prompt.length} chars`);
      console.log(`[Gemini] Response Length: ${text.length} chars`);
      
      return text;
      
    } catch (err) {
      console.warn(`[Gemini] Model ${modelName} failed:`, err.message);
      lastError = err;
      console.log(`[Gemini] Fallback triggered: true`);
    }
  }

  throw new Error(`All Gemini fallback models failed. Last error: ${lastError.message}`);
}

module.exports = {
  generateProcurementIntelligence
};
