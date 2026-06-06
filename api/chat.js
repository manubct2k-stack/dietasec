import { GoogleGenAI } from '@google/genai';

// Inicializa o SDK. Certifique-se de que GEMINI_API_KEY está configurada na Vercel.
const ai = new GoogleGenAI({});

export default async function handler(req, res) {
    // Garante que o método é POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'O campo "message" é obrigatório.' });
        }

        // Chame o modelo correto (gemini-2.5-flash ou gemini-1.5-flash)
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash', 
            contents: message,
        });

        // Garante que respondemos com JSON válido
        return res.status(200).json({ response: response.text });

    } catch (error) {
        console.error("Erro na Serverless Function:", error);
        
        // Em caso de falha, força o envio de um JSON estruturado em vez de deixar a Vercel cair
        return res.status(500).json({ 
            error: 'Erro interno no servidor', 
            details: error.message 
        });
    }
}
