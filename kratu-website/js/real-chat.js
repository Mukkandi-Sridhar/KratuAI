document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('demo-chat-form');
  const input = document.getElementById('demo-chat-input');
  const feed = document.getElementById('demo-chat-feed');
  const submitBtn = document.getElementById('demo-chat-submit');

  if (!form || !input || !feed) return;

  // Track input to enable/disable button
  input.addEventListener('input', () => {
    submitBtn.disabled = input.value.trim().length === 0;
  });

  // Handle submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = input.value.trim();
    if (!message) return;

    // 1. Add user message
    appendMessage(message, 'user');
    input.value = '';
    submitBtn.disabled = true;

    // 2. Add loading indicator
    const loadingId = 'loading-' + Date.now();
    appendLoading(loadingId);
    scrollToBottom();

    try {
      // 3. Make real API call to aiml_rag backend
      const response = await fetch('http://127.0.0.1:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer dev:23091A3349'
        },
        body: JSON.stringify({ message: message })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      // 4. Remove loading indicator
      removeElement(loadingId);

      // 5. Append AI response
      if (data.answer) {
        appendMessage(data.answer, 'ai');
      } else {
        appendMessage("I'm sorry, I couldn't understand that.", 'ai');
      }

    } catch (error) {
      console.warn("Backend not reachable. Using fallback response.", error);
      // Fallback mode if Python backend is offline
      removeElement(loadingId);
      
      setTimeout(() => {
        let fallbackMsg = "I'm currently running in offline demo mode. To see real answers, please start the Kratu AI backend.";
        if (message.toLowerCase().includes("leave")) {
          fallbackMsg = "Adjunct faculty are entitled to 12 days of paid leave per academic year, pro-rated by their active teaching months.";
        } else if (message.toLowerCase().includes("backlog")) {
          fallbackMsg = "You currently have 0 backlogs.";
        } else if (message.toLowerCase().includes("cgpa")) {
          fallbackMsg = "Your current CGPA is 7.83.";
        }
        
        appendMessage(fallbackMsg, 'ai');
        scrollToBottom();
      }, 800);
    }
  });

  function appendMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `demo-msg demo-msg--${sender}`;
    msgDiv.textContent = text;
    feed.appendChild(msgDiv);
    scrollToBottom();
  }

  function appendLoading(id) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `demo-msg demo-msg--ai loading-msg`;
    msgDiv.id = id;
    msgDiv.innerHTML = `typing...`;
    feed.appendChild(msgDiv);
  }

  function removeElement(id) {
    const el = document.getElementById(id);
    if (el) {
      el.remove();
    }
  }

  function scrollToBottom() {
    feed.scrollTop = feed.scrollHeight;
  }
});
