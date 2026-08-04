document.addEventListener('DOMContentLoaded', () => {
  const DEV_TOKEN = 'Bearer dev:23091A3349';
  const API_BASE = 'http://127.0.0.1:8000';

  // 1. Chat Logic (Tab 1)
  const form = document.getElementById('demo-chat-form');
  const input = document.getElementById('demo-chat-input');
  const feed = document.querySelector('#demo-chat-form').previousElementSibling;
  const submitBtn = document.getElementById('demo-chat-submit');

  if (form && input && feed) {
    input.addEventListener('input', () => {
      submitBtn.disabled = input.value.trim().length === 0;
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const message = input.value.trim();
      if (!message) return;

      appendMessage(message, 'user');
      input.value = '';
      submitBtn.disabled = true;

      const loadingId = 'loading-' + Date.now();
      appendLoading(loadingId);
      scrollToBottom();

      try {
        const response = await fetch(`${API_BASE}/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': DEV_TOKEN
          },
          body: JSON.stringify({ message: message })
        });

        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        
        removeElement(loadingId);
        if (data.answer) {
          appendMessage(data.answer, 'ai');
        } else {
          appendMessage("I'm sorry, I couldn't understand that.", 'ai');
        }
      } catch (error) {
        console.warn("Backend not reachable. Using fallback response.", error);
        removeElement(loadingId);
        setTimeout(() => {
          let fallbackMsg = "I'm currently running in offline demo mode. To see real answers, please start the Kratu AI backend.";
          if (message.toLowerCase().includes("leave")) {
            fallbackMsg = "Adjunct faculty are entitled to 12 days of paid leave per academic year, pro-rated by their active teaching months.";
          }
          appendMessage(fallbackMsg, 'ai');
        }, 800);
      }
    });

    function appendMessage(text, sender) {
      const row = document.createElement('div');
      row.className = `demo-msg-row demo-msg-row--${sender}`;

      const avatar = document.createElement('span');
      avatar.className = `demo-avatar demo-avatar--${sender}`;
      avatar.textContent = sender === 'user' ? 'YOU' : 'K';

      const msgDiv = document.createElement('div');
      msgDiv.className = `demo-msg demo-msg--${sender}`;
      msgDiv.textContent = text;

      if (sender === 'user') {
        row.append(msgDiv, avatar);
      } else {
        row.append(avatar, msgDiv);
      }
      feed.appendChild(row);
      scrollToBottom();
    }

    function appendLoading(id) {
      const row = document.createElement('div');
      row.className = 'demo-msg-row demo-msg-row--ai';
      row.id = id;

      const avatar = document.createElement('span');
      avatar.className = 'demo-avatar demo-avatar--ai';
      avatar.textContent = 'K';

      const msgDiv = document.createElement('div');
      msgDiv.className = 'demo-msg demo-msg--ai loading-msg';
      msgDiv.innerHTML = 'typing...';

      row.append(avatar, msgDiv);
      feed.appendChild(row);
    }

    function removeElement(id) {
      const el = document.getElementById(id);
      if (el) el.remove();
    }

    function scrollToBottom() {
      feed.scrollTop = feed.scrollHeight;
    }
  }

  // Fetch logic for other tabs
  let dataFetched = false;
  
  async function fetchWorkspaceData() {
    if (dataFetched) return;
    dataFetched = true;

    try {
      // Fetch Observability Stats (Tab 4)
      const statsRes = await fetch(`${API_BASE}/api/observability/stats`, {
        headers: { 'Authorization': DEV_TOKEN }
      });
      if (statsRes.ok) {
        const stats = await statsRes.json();
        if (stats.summary) {
          document.getElementById('obs-queries').textContent = (stats.summary.total_today || 0).toLocaleString();
          document.getElementById('obs-latency').textContent = (stats.summary.avg_latency_ms || 0) + 'ms';
          
          // Cost calculation mock if not provided natively by API
          const cost = ((stats.summary.total_tokens_today || 0) * 0.00001).toFixed(2);
          document.getElementById('obs-cost').textContent = '$' + cost;
        }

        // Update Chart if latency_trend is present
        if (stats.latency_trend && stats.latency_trend.length > 0) {
          const chart = document.getElementById('obs-chart');
          const maxCount = Math.max(...stats.latency_trend.map(t => t.trace_count || 1));
          
          chart.innerHTML = '';
          stats.latency_trend.slice(-7).forEach((day, i) => {
            const pct = Math.max(10, Math.round((day.trace_count / maxCount) * 100));
            const bar = document.createElement('div');
            bar.className = `demo-bar demo-bar--${i + 1}`;
            bar.style.setProperty('--target-height', `${pct}%`);
            bar.style.height = '0';
            chart.appendChild(bar);
          });
        }
      }

      // Fetch Traces (Tab 2)
      const tracesRes = await fetch(`${API_BASE}/api/observability/traces`, {
        headers: { 'Authorization': DEV_TOKEN }
      });
      if (tracesRes.ok) {
        const tracesData = await tracesRes.json();
        const traces = Array.isArray(tracesData) ? tracesData : tracesData.data || [];
        
        if (traces.length > 0) {
          const container = document.getElementById('demo-trace-container');
          container.innerHTML = '';
          
          traces.slice(0, 3).forEach(trace => {
            const name = trace.name || 'query';
            const latency = trace.latencyMs ? Math.round(trace.latencyMs) + 'ms' : '';
            
            const div = document.createElement('div');
            div.className = 'demo-trace';
            div.innerHTML = `<span class="demo-trace-blue">Evaluating:</span> "${trace.input || '...'}"\n<span class="demo-trace-green">[${name}]</span> ${latency ? `Took ${latency}` : ''}\n<span class="demo-trace-blue">Status:</span> ${trace.output ? 'Success' : 'Pending'}`;
            container.appendChild(div);
          });
        }
      }

      // Fetch Audit Logs (Tab 3)
      const auditRes = await fetch(`${API_BASE}/api/observability/audit`, {
        headers: { 'Authorization': DEV_TOKEN }
      });
      if (auditRes.ok) {
        const auditData = await auditRes.json();
        const audits = Array.isArray(auditData) ? auditData : auditData.data || [];
        
        if (audits.length > 0) {
          const container = document.getElementById('demo-audit-container');
          container.innerHTML = '';
          
          audits.slice(0, 4).forEach(log => {
            const action = log.action || 'ACCESS';
            const user = log.user_id || 'System';
            const resource = log.resource || 'Unknown Resource';
            
            const isDeny = action.toLowerCase().includes('deny') || log.status === 'deny';
            const chipClass = isDeny ? 'chip--warning' : 'chip--success';
            const actionText = isDeny ? 'DENY' : 'ALLOW';
            
            const div = document.createElement('div');
            div.className = 'demo-audit-row';
            div.innerHTML = `
              <span><span class="chip ${chipClass} u-mr-2">${actionText}</span> ${user} accessed <em>${resource}</em></span>
              <span class="u-color-dim">Recent</span>
            `;
            container.appendChild(div);
          });
        }
      }

    } catch (e) {
      console.warn("Failed to fetch backend data for workspace demo.", e);
      // Fallback mock data for demo if backend is offline
      document.getElementById('obs-queries').textContent = "1,248";
      document.getElementById('obs-latency').textContent = "840ms";
      document.getElementById('obs-cost').textContent = "$4.12";
      
      const chart = document.getElementById('obs-chart');
      if (chart) {
        chart.innerHTML = '';
        const heights = [40, 60, 30, 80, 50, 90, 70];
        heights.forEach((h, i) => {
          const bar = document.createElement('div');
          bar.className = `demo-bar demo-bar--${i + 1}`;
          bar.style.setProperty('--target-height', `${h}%`);
          bar.style.height = '0';
          chart.appendChild(bar);
        });
      }
      
      const traceContainer = document.getElementById('demo-trace-container');
      if (traceContainer) {
        traceContainer.innerHTML = `
          <div class="demo-trace"><span class="demo-trace-blue">Evaluating:</span> "Update grade for roll no 21B81A0501"
<span class="demo-trace-green">[student_db.update_grade]</span> Took 342ms
<span class="demo-trace-blue">Status:</span> Success</div>
          <div class="demo-msg demo-msg--ai">I've successfully updated the grade to 'A' for student 21B81A0501 in the main student database.</div>
        `;
      }

      const auditContainer = document.getElementById('demo-audit-container');
      if (auditContainer) {
        auditContainer.innerHTML = `
          <div class="demo-audit-row">
            <span class="demo-audit-who">
              <span class="demo-avatar demo-avatar--user demo-avatar--sm">PS</span>
              <span><span class="chip chip--blue u-mr-2">QUERY</span> Prof. Sharma</span>
            </span>
            <span class="u-color-dim">Recent</span>
          </div>
          <div class="demo-audit-row">
            <span class="demo-audit-who">
              <span class="demo-avatar demo-avatar--user demo-avatar--sm">PS</span>
              <span><span class="chip chip--success u-mr-2">ALLOW</span> Accessed <em>CS301_Midterm.pdf</em></span>
            </span>
            <span class="u-color-dim">Recent</span>
          </div>
          <div class="demo-audit-row">
            <span class="demo-audit-who">
              <span class="demo-avatar demo-avatar--user demo-avatar--sm">PS</span>
              <span><span class="chip chip--warning u-mr-2">DENY</span> Attempted to access <em>HR_Salaries_2025.xlsx</em></span>
            </span>
            <span class="u-color-dim">Recent</span>
          </div>
          <div class="demo-audit-row">
            <span class="demo-audit-who">
              <span class="demo-avatar demo-avatar--ai demo-avatar--sm">K</span>
              <span><span class="chip chip--pink u-mr-2">TOOL</span> Updated student record via MCP</span>
            </span>
            <span class="u-color-dim">Recent</span>
          </div>
        `;
      }
    }
  }

  // Trigger fetch when user interacts with tabs
  const tabs = document.querySelectorAll('.demo-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      fetchWorkspaceData();
    });
  });

  // Also prefetch after a short delay
  setTimeout(fetchWorkspaceData, 1000);
});
