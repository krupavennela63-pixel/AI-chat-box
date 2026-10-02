/**
 * PyBot - Rule-Based Chatbot Frontend Logic
 * Connects frontend interface to Flask API endpoint (/chat)
 */

document.addEventListener("DOMContentLoaded", () => {
    // DOM Element References
    const chatMessages = document.getElementById("chat-messages");
    const chatForm = document.getElementById("chat-form");
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");
    const clearBtn = document.getElementById("clear-btn");
    const typingIndicator = document.getElementById("typing-indicator");
    const quickSuggestions = document.getElementById("quick-suggestions");

    // Auto-focus input on page load
    userInput.focus();

    /**
     * Format current time as 'H:MM AM/PM'
     */
    function getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    /**
     * Scroll the chat window to the bottom smoothly
     */
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    /**
     * Escape HTML characters to prevent XSS attacks
     */
    function escapeHtml(text) {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Show animated typing indicator before bot replies
     */
    function showTypingIndicator() {
        if (typingIndicator) {
            typingIndicator.style.display = "flex";
            chatMessages.appendChild(typingIndicator);
            scrollToBottom();
        }
    }

    /**
     * Hide animated typing indicator
     */
    function hideTypingIndicator() {
        if (typingIndicator) {
            typingIndicator.style.display = "none";
        }
    }

    /**
     * Append a new message to the chat window
     * @param {'user'|'bot'} sender 
     * @param {string} text 
     * @param {string} timeString 
     */
    function appendMessage(sender, text, timeString = null) {
        const timestamp = timeString || getCurrentTime();
        const isUser = sender === "user";

        const messageWrapper = document.createElement("div");
        messageWrapper.className = `message-wrapper ${isUser ? "user-message" : "bot-message"} animate-in`;

        // Avatar SVG
        const avatarSvg = isUser
            ? `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                 <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                 <circle cx="12" cy="7" r="4"></circle>
               </svg>`
            : `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                 <rect x="3" y="11" width="18" height="10" rx="2"></rect>
                 <circle cx="12" cy="5" r="2"></circle>
                 <path d="M12 7v4"></path>
               </svg>`;

        messageWrapper.innerHTML = `
            <div class="message-avatar" aria-hidden="true">
                ${avatarSvg}
            </div>
            <div class="message-content">
                <div class="bubble ${isUser ? "user-bubble" : "bot-bubble"}">
                    ${escapeHtml(text)}
                </div>
                <span class="message-timestamp">${timestamp}</span>
            </div>
        `;

        // Insert before typing indicator if it is in the container
        if (typingIndicator && typingIndicator.parentNode === chatMessages) {
            chatMessages.insertBefore(messageWrapper, typingIndicator);
        } else {
            chatMessages.appendChild(messageWrapper);
        }

        scrollToBottom();
    }

    /**
     * Send message to Flask API (/chat)
     * @param {string} messageText 
     */
    async function handleSendMessage(messageText) {
        const trimmedMessage = messageText.trim();
        if (!trimmedMessage) return;

        // 1. Render User Message
        appendMessage("user", trimmedMessage);
        userInput.value = "";
        userInput.focus();

        // 2. Disable UI while waiting
        sendBtn.disabled = true;
        userInput.disabled = true;

        // 3. Show typing indicator
        showTypingIndicator();

        try {
            // Realistic small delay for conversational feel (400ms)
            await new Promise(resolve => setTimeout(resolve, 400));

            // 4. Fetch response from Flask API
            const response = await fetch("/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ message: trimmedMessage })
            });

            if (!response.ok) {
                throw new Error(`Server returned HTTP ${response.status}`);
            }

            const data = await response.json();

            // 5. Hide typing indicator & render bot response
            hideTypingIndicator();
            const botReply = data.response || "No response received.";
            const replyTime = data.timestamp || getCurrentTime();
            appendMessage("bot", botReply, replyTime);

        } catch (error) {
            console.error("Chat error:", error);
            hideTypingIndicator();
            appendMessage(
                "bot",
                "⚠️ Could not reach the chatbot server. Please ensure the Flask app is running."
            );
        } finally {
            // Re-enable input and button
            sendBtn.disabled = false;
            userInput.disabled = false;
            userInput.focus();
            scrollToBottom();
        }
    }

    // Form submission listener
    chatForm.addEventListener("submit", (e) => {
        e.preventDefault();
        handleSendMessage(userInput.value);
    });

    // Enter key listener on text input
    userInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            chatForm.dispatchEvent(new Event("submit"));
        }
    });

    // Quick suggestion chip click listener
    if (quickSuggestions) {
        quickSuggestions.addEventListener("click", (e) => {
            const chip = e.target.closest(".suggestion-chip");
            if (chip && chip.dataset.msg) {
                handleSendMessage(chip.dataset.msg);
            }
        });
    }

    // Reset / Clear chat conversation
    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            // Keep typing indicator reference preserved
            chatMessages.innerHTML = `
                <div class="message-wrapper bot-message animate-in">
                    <div class="message-avatar" aria-hidden="true">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="3" y="11" width="18" height="10" rx="2"></rect>
                            <circle cx="12" cy="5" r="2"></circle>
                            <path d="M12 7v4"></path>
                        </svg>
                    </div>
                    <div class="message-content">
                        <div class="bubble bot-bubble">
                            Conversation restarted. ✨ Send a message like <strong>"hello"</strong> or <strong>"how are you"</strong> to begin!
                        </div>
                        <span class="message-timestamp">${getCurrentTime()}</span>
                    </div>
                </div>
            `;
            chatMessages.appendChild(typingIndicator);
            typingIndicator.style.display = "none";
            userInput.value = "";
            userInput.focus();
        });
    }
});
