const { GoogleGenAI } = require('@google/genai');

module.exports = async (req, res) => {
  // Configuração de Cabeçalhos CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    // Garante a leitura do corpo da requisição independentemente do formato
    let body = req.body;
    if (typeof body === 'string') {
      body = JSON.parse(body);
    }
    
    const { message } = body || {};

    if (!message) {
      return res.status(400).json({ error: 'O campo "message" está vazio ou ausente.' });
    }

    // CORREÇÃO AQUI: Passar explicitamente a chave no objeto de configuração
    // Isto impede que o SDK tente adivinhar o projeto Google Cloud e falhe com chaves "AQ."
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const aiResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
    });

    return res.status(200).json({ response: aiResponse.text });

  } catch (error) {
    console.error('Erro detalhado na execução:', error);
    return res.status(500).json({ 
      error: 'Falha ao processar requisição na API', 
      details: error.message 
    });
  }
};
