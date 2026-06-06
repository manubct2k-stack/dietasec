const { GoogleGenAI } = require('@google/genai');

// Inicializa o SDK (procura automaticamente pela variável GEMINI_API_KEY na Vercel)
const ai = new GoogleGenAI({});

module.exports = async function handler(req, res) {
    // Força cabeçalhos de CORS e tipo de conteúdo JSON
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Trata requisições de pré-vôo (CORS)
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido. Utilize POST.' });
    }

    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'O campo "message" está vazio.' });
        }

        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash', // Versão estável compatível com o SDK
            contents: message,
        });

        return res.status(200).json({ response: response.text });

    } catch (error) {
        console.error("Erro na Vercel Function:", error);
        return res.status(500).json({ 
            error: 'Erro interno no servidor', 
            details: error.message 
        });
    }
};
