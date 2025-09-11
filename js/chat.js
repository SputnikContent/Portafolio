document.addEventListener('DOMContentLoaded', () => {
    // 1. Elementos del Modal del Chat
    const chatModal = document.getElementById('chat-modal');
    const closeBtn = document.querySelector('.close-btn');
    const chatBtnContainer = document.querySelector('.chat-btn-container');

    // 2. Elementos del Chat
    const chatBody = document.querySelector('.chat-body');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-button');

    // 3. API de Gemini
    const API_KEY = 'AIzaSyD5kqoE6Y9_-fUAZDZpoRaniCuIJdXqqO4';
    const API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

    // **PROMPT DEL SISTEMA PARA ENFOCAR AL BOT**
    const SYSTEM_PROMPT = "Tu propósito es ser un mentor de crecimiento personal. Tu enfoque principal es ayudar a los usuarios a re-enmarcar los desafíos y problemas como valiosas oportunidades de aprendizaje y desarrollo personal. Responde a todas las preguntas con una perspectiva positiva, constructiva y orientada a la solución, guiando al usuario a encontrar las lecciones ocultas en sus dificultades. Evita dar consejos médicos, financieros o legales directos. En su lugar, fomenta la reflexión y la acción desde la mentalidad de crecimiento.";

    // 4. Funciones para la interfaz del chat
    chatBtnContainer.addEventListener('click', (e) => {
        e.preventDefault();
        chatModal.classList.add('active');
        appendMessage('bot', '¡Hola! Soy un asistente de crecimiento personal. ¿Quieres que hablemos de cómo convertir los problemas en oportunidades?');
    });

    closeBtn.addEventListener('click', () => {
        chatModal.classList.remove('active');
    });

    window.addEventListener('click', (e) => {
        if (e.target === chatModal) {
            chatModal.classList.remove('active');
        }
    });

    const appendMessage = (sender, message) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        messageElement.textContent = message;
        chatBody.appendChild(messageElement);
        chatBody.scrollTop = chatBody.scrollHeight;
    };

    // 5. Lógica del Chat
    const sendMessage = async () => {
        const userPrompt = userInput.value.trim();
        if (userPrompt === '') {
            return;
        }

        appendMessage('user', userPrompt);
        userInput.value = '';

        const loadingMessage = document.createElement('div');
        loadingMessage.classList.add('message', 'bot', 'loading');
        loadingMessage.textContent = 'Escribiendo...';
        chatBody.appendChild(loadingMessage);
        chatBody.scrollTop = chatBody.scrollHeight;

        sendBtn.disabled = true;

        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-goog-api-key': API_KEY
                },
                body: JSON.stringify({
                    "contents": [
                        // **Añadimos el prompt de sistema como la primera parte de la conversación**
                        {
                            "role": "user",
                            "parts": [
                                { "text": SYSTEM_PROMPT }
                            ]
                        },
                        {
                            "role": "model",
                            "parts": [
                                { "text": "Entendido. Estoy listo para ayudar a los usuarios desde una mentalidad de crecimiento personal." }
                            ]
                        },
                        // Y aquí, añadimos el mensaje del usuario
                        {
                            "role": "user",
                            "parts": [
                                { "text": userPrompt }
                            ]
                        }
                    ]
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error: ${response.status} - ${response.statusText} - ${JSON.stringify(errorData)}`);
            }

            const data = await response.json();
            const iaResponse = data.candidates[0].content.parts[0].text;

            chatBody.removeChild(loadingMessage);
            appendMessage('bot', iaResponse);
        } catch (error) {
            console.error('Error al llamar a la API:', error);
            chatBody.removeChild(loadingMessage);
            appendMessage('bot', 'Lo siento, no pude obtener una respuesta. Inténtalo de nuevo más tarde.');
        } finally {
            sendBtn.disabled = false;
        }
    };

    // 6. Asignar eventos a los botones
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    });
});