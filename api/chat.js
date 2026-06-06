const { GoogleGenAI } = require('@google/genai');

module.exports = async (req, res) => {
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
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Mensagem em falta' });
    }

    // Inicialização direta do novo ecossistema com suporte ao prefixo AQ.
    const ai = new GoogleGenAI();

    // Alteração obrigatória para a arquitetura Gemini 2.5
    const aiResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash', 
      contents: message,
    });

    return res.status(200).json({ response: aiResponse.text });

  } catch (error) {
    console.error('Erro na execução:', error);
    return res.status(500).json({ 
      error: 'Falha ao processar requisição na API', 
      details: error.message 
    });
  }
};
