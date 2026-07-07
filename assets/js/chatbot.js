function initTurponeChatbot() {
    if (document.getElementById('turpone-chat-fab')) return; // Already initialized

    // Inject HTML
    const chatbotHTML = `
        <div id="turpone-chat-fab" title="Chat with us">
            <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
        </div>
        <div id="turpone-chat-window">
            <div class="turpone-chat-header">
                <div class="turpone-chat-header-info">
                    <h4>Turpone Assistant</h4>
                    <p>We typically reply instantly</p>
                </div>
                <button class="turpone-chat-close">&times;</button>
            </div>
            <div class="turpone-chat-messages" id="turpone-chat-messages">
                <div class="turpone-chat-bubble assistant">
                    Hello! Welcome to Turpone Foods. How can I help you today? / ¡Hola! ¿Cómo puedo ayudarte? / Bonjour! Comment puis-je vous aider?
                </div>
                <div class="turpone-typing-indicator" id="turpone-typing-indicator">
                    <span></span><span></span><span></span>
                </div>
            </div>
            <div class="turpone-chat-input-area">
                <input type="text" id="turpone-chat-input" placeholder="Type a message..." autocomplete="off">
                <button id="turpone-chat-send">
                    <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                </button>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', chatbotHTML);

    const fab = document.getElementById('turpone-chat-fab');
    const chatWindow = document.getElementById('turpone-chat-window');
    const closeBtn = document.querySelector('.turpone-chat-close');
    const sendBtn = document.getElementById('turpone-chat-send');
    const inputField = document.getElementById('turpone-chat-input');
    const messagesContainer = document.getElementById('turpone-chat-messages');
    const typingIndicator = document.getElementById('turpone-typing-indicator');

    let conversationHistory = [];

    // Toggle window
    fab.addEventListener('click', () => {
        chatWindow.classList.add('show');
        chatWindow.classList.add('open');
        fab.style.display = 'none';
        inputField.focus();
    });

    closeBtn.addEventListener('click', () => {
        chatWindow.classList.remove('open');
        setTimeout(() => {
            fab.style.display = 'flex';
        }, 300);
    });

    function addMessageToUI(text, role) {
        const bubble = document.createElement('div');
        bubble.className = \`turpone-chat-bubble \${role}\`;
        bubble.textContent = text;
        // Insert before typing indicator
        messagesContainer.insertBefore(bubble, typingIndicator);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    async function sendMessage() {
        const text = inputField.value.trim();
        if (!text) return;

        inputField.value = '';
        addMessageToUI(text, 'user');
        conversationHistory.push({ role: 'user', content: text });

        // Show typing
        typingIndicator.style.display = 'inline-block';
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: conversationHistory })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const reply = data.reply || "Error connecting to assistant.";
            
            typingIndicator.style.display = 'none';
            addMessageToUI(reply, 'assistant');
            conversationHistory.push({ role: 'assistant', content: reply });

        } catch (error) {
            console.error("Chat error:", error);
            typingIndicator.style.display = 'none';
            addMessageToUI("Sorry, I'm having trouble connecting to the server. Please try again later.", 'assistant');
        }
    }

    sendBtn.addEventListener('click', sendMessage);
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTurponeChatbot);
} else {
    initTurponeChatbot();
}
