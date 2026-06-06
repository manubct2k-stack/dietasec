const { GoogleGenAI } = require('@google/genai');

module.exports = async (req, res) => {
  // Configuração de Cabeçalhos CORS para evitar bloqueios no navegador
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Trata requisições OPTIONS (Pre-flight) do navegador
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Mensagem em falta no corpo da requisição' });
    }

    // Inicializa o cliente dentro do handler para isolar falhas de runtime
    // Procura automaticamente por process.env.GEMINI_API_KEY
    const ai = new GoogleGenAI();

    const aiResponse = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
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
