import { GoogleGenAI } from '@google/genai';

// A Vercel injeta as variáveis de ambiente automaticamente
const ai = new GoogleGenAI({});

export default async function handler(req, res) {
    // Permite requisições apenas via POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    try {
        const { message } = req.body;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: message,
        });

        return res.status(200).json({ response: response.text });
    } catch (error) {
        return res.status(500).json({ error: error.message || 'Erro interno no backend' });
    }
}
