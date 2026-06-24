/* chat.js — Kratu v3.2: Typed.js for chat */

const CONVERSATION_SCRIPTS = {
  student: [
    { role:'user', text:'Do I have any backlogs this semester?', thinkTime:200, pauseAfter:400 },
    { role:'ai', text:'No backlogs across all 6 semesters. CGPA: 8.1. You are placement eligible.^500\nNext exam: Advanced Algorithms — July 14th (Monday).', source:'Academic Records · Updated June 21', meta:{ time:'0.9s', confidence:94 }, thinkTime:700, pauseAfter:900 },
    { role:'user', text:'What does the July exam circular say?', thinkTime:300, pauseAfter:400 },
    { role:'ai', text:'From Circular #47 (June 3rd):\nInternal exams: July 14–18\nMinimum attendance to appear: 75%\nYour attendance: 82% ✓\n\nAll exams in Block B, Room allocation posted June 28.', source:'Circular #47 · June 3rd, 2024', meta:{ time:'1.1s', confidence:97 }, thinkTime:800, pauseAfter:600 }
  ],
  faculty: [
    { role:'user', text:'Which students are at risk this semester?', thinkTime:300 },
    { role:'ai', text:'12 students flagged:\n→ 4 with CGPA below 6.0\n→ 6 with attendance below 70%\n→ 2 with 3+ active backlogs\n\nGenerating at-risk report...', meta:{ time:'1.4s', confidence:91 }, thinkTime:900, pauseAfter:300 },
    { role:'ai', special:'progress', text:'Report ready.\nHighest priority: Reg# 21A0334\nCGPA: 5.2 · Backlogs: 4 · Attendance: 64%\nRecommended action: Counselling this week.', source:'127 student records · HRMS sync', meta:{ time:'2.1s', confidence:89 }, pauseAfter:600 }
  ],
  hod: [
    { role:'user', text:'Placement readiness for this batch?', thinkTime:200 },
    { role:'ai', text:'68% of 4th years are placement eligible.\nAverage CGPA: 7.4 · Top 10%: 9.1+\n23 students need intervention before August.\nActive recruiter interest: TCS, Infosys, Wipro, Accenture\nRecommend: Remedial batch for 15 students.', source:'127 final year records · Updated today', meta:{ time:'1.7s', confidence:92 }, thinkTime:800, pauseAfter:600 }
  ],
  hr: [
    { role:'user', text:'What is our probation leave policy?', thinkTime:250 },
    { role:'ai', text:'Employees in probation (first 6 months):\n→ 12 casual leaves/year, pro-rated from join date\n→ 6 sick leaves/year\n→ No earned leave during probation\nNotice period during probation: 30 days.\n\nApplies to employees hired after Jan 2023.', source:'HR Policy Manual v3.2 · Section 4.1 · Jan 2024', meta:{ time:'0.8s', confidence:98 }, thinkTime:700, pauseAfter:800 },
    { role:'user', text:'How many open roles are unfilled for 30+ days?', thinkTime:300 },
    { role:'ai', text:'7 roles open 30+ days as of today:\n3 Engineering · 2 Sales · 2 Customer Support\nAverage days open: 47\nOldest role: Senior Backend Engineer (62 days).', source:'HRMS · Live sync · As of today', meta:{ time:'1.2s', confidence:95 }, thinkTime:600 }
  ],
  hospital: [
    { role:'user', text:'What is the high-alert medication protocol?', thinkTime:300 },
    { role:'ai', text:'High-alert medication dispensing requires 3-step verification:\n1. Prescribing physician sign-off\n2. Senior pharmacist review and override code\n3. Dispensing nurse confirmation\n\n23 drugs are currently flagged high-alert.', source:'Clinical SOP #HR-12 · March 2024', meta:{ time:'1.0s', confidence:96 }, thinkTime:800 }
  ],
  school: [
    { role:'user', text:'How many students have pending fee dues?', thinkTime:200 },
    { role:'ai', text:'142 students have outstanding dues as of today.\nTotal pending: ₹18.4 lakhs\n87 families notified · 31 requested extensions\nCurrent quarter deadline: July 5.\n\n23 students are overdue by 30+ days.', source:'Finance System · Live sync', meta:{ time:'0.7s', confidence:99 }, thinkTime:600 }
  ],
  factory: [
    { role:'user', text:'SOP if Assembly Line 3 halts unexpectedly?', thinkTime:300 },
    { role:'ai', text:'Assembly Line 3 unplanned halt:\n1. Trigger red-zone alert via panel switch\n2. Contact Maintenance Lead: Ravi K. (Ext 204)\n3. Log halt cause within 15 minutes\n4. Escalate to Plant Head if unresolved beyond 2 hours.\n\nLast drill: June 10. Response time: 18 minutes.', source:'Maintenance SOP v4.1 · Section 7.3', meta:{ time:'1.1s', confidence:93 }, thinkTime:800 }
  ]
};

class KratuChat {
  constructor(containerEl) {
    this.container = containerEl;
    this.messagesEl = containerEl.querySelector('.chat-messages');
    this.scripts = CONVERSATION_SCRIPTS;
    this.currentRole = 'student';
    this.isTyping = false;
    this.restartTimeout = null;
    this.active = true;
    this.currentTyped = null;
  }
  
  setRole(role) {
    if (!this.scripts[role]) return;
    this.currentRole = role;
    this.stop();
    this.clear();
    this.active = true;
    this.play(this.scripts[role]);
  }
  
  stop() {
    clearTimeout(this.restartTimeout);
    this.active = false;
    this.isTyping = false;
    if (this.currentTyped) {
      this.currentTyped.destroy();
      this.currentTyped = null;
    }
  }
  
  clear() {
    const done = () => {
      this.messagesEl.innerHTML = '';
      if (typeof anime !== 'undefined') {
        anime({ targets: this.messagesEl, opacity: 1, duration: 250 });
      } else {
        this.messagesEl.style.opacity = 1;
      }
    };

    if (typeof anime === 'undefined') {
      done();
      return;
    }

    anime({
      targets: this.messagesEl,
      opacity: 0, 
      duration: 250,
      complete: done
    });
  }
  
  scrollToBottom() {
    this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
  }

  async play(script) {
    for (const msg of script) {
      if (!this.active) return;
      this.isTyping = true;
      
      await this.showTypingIndicator(msg.thinkTime || 500);
      if (!this.active) return;
      
      const el = this.createMessageEl(msg);
      this.messagesEl.appendChild(el);
      this.scrollToBottom();
      
      await this.typeMessage(el.querySelector('.msg-text'), msg.text, msg.speed || 18);
      if (!this.active) return;
      
      if (msg.source) this.showSource(el, msg.source);
      if (msg.meta) this.showMeta(el, msg.meta);
      
      await new Promise(r => setTimeout(r, msg.pauseAfter || 600));
    }
    
    this.isTyping = false;
    if (this.active) {
      document.dispatchEvent(new CustomEvent('chat:complete', { detail: { role: this.currentRole } }));
      
      this.restartTimeout = setTimeout(() => {
        if (this.active) {
          this.clear();
          setTimeout(() => { if (this.active) this.play(this.scripts[this.currentRole]); }, 500);
        }
      }, 3500);
    }
  }
  
  async typeMessage(el, text, speed) {
    return new Promise(resolve => {
      // Use Typed.js
      if (typeof Typed !== 'undefined') {
        // Pre-replace \n with <br> for HTML typed
        const typedText = text.replace(/\\n/g, '<br>').replace(/\n/g, '<br>');
        this.currentTyped = new Typed(el, {
          strings: [typedText],
          typeSpeed: speed,
          backSpeed: 0,
          showCursor: true,
          cursorChar: '|',
          onStringTyped: () => {
             this.scrollToBottom();
          },
          onComplete: (self) => {
            self.cursor.remove();
            resolve();
          }
        });
      } else {
        // Fallback
        el.innerHTML = text.replace(/\\n/g, '<br>').replace(/\n/g, '<br>');
        resolve();
      }
    });
  }
  
  showTypingIndicator(duration) {
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator msg msg--ai';
    indicator.innerHTML = `
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
    `;
    this.messagesEl.appendChild(indicator);
    this.scrollToBottom();
    
    return new Promise(resolve => {
      setTimeout(() => {
        indicator.remove();
        resolve();
      }, duration);
    });
  }
  
  createMessageEl(msg) {
    const div = document.createElement('div');
    div.className = `msg msg--${msg.role}`;
    
    if (msg.role === 'ai') {
      div.innerHTML = `
        <div class="msg-header">
          <span class="msg-avatar"></span>
          <span class="msg-name">Kratu</span>
          <span class="msg-live">● Live</span>
        </div>
        <div class="msg-text"></div>
      `;
    } else {
      div.innerHTML = `<div class="msg-text"></div>`;
    }
    
    if (typeof anime !== 'undefined') {
      anime({ targets: div, opacity: [0, 1], translateY: [10, 0], duration: 300, easing: 'easeOutQuad' });
    }
    return div;
  }

  showSource(el, sourceText) {
    const src = document.createElement('div');
    src.className = 'msg-source';
    src.innerHTML = `↳ Source: <span>${sourceText}</span>`;
    el.appendChild(src);
    if (typeof anime !== 'undefined') {
      anime({ targets: src, opacity: [0, 1], duration: 400, delay: 100, easing: 'linear' });
    }
  }

  showMeta(el, meta) {
    const m = document.createElement('div');
    m.className = 'msg-meta';
    m.innerHTML = `
      <span class="msg-time">${meta.time}</span>
      <div class="msg-confidence"><div class="msg-confidence-fill" style="width: ${meta.confidence}%"></div></div>
    `;
    el.appendChild(m);
    if (typeof anime !== 'undefined') {
      anime({ targets: m, opacity: [0, 1], duration: 400, delay: 200, easing: 'linear' });
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.hero-chat');
  if (container) {
    window.kratuChat = new KratuChat(container);
    document.querySelectorAll('[data-role]').forEach(tab => {
      tab.addEventListener('click', () => {
        const role = tab.dataset.role;
        window.kratuChat.setRole(role);
        tab.parentElement.querySelectorAll('[data-role]').forEach(item => {
          item.classList.toggle('active', item === tab);
        });
      });
    });

    document.querySelectorAll('.role-btn[data-role]').forEach(button => {
      button.addEventListener('click', () => {
        const role = button.dataset.role;
        window.kratuChat.setRole(role);
        document.querySelectorAll('.role-btn[data-role]').forEach(item => {
          item.classList.toggle('active', item === button);
        });
      });
    });

    // Auto-advance logic
    document.addEventListener('chat:complete', (e) => {
      const currentRole = e.detail.role;
      const tabs = Array.from(document.querySelectorAll('.role-tab[data-role]'));
      if (!tabs.length) return;
      
      const currentIndex = tabs.findIndex(tab => tab.dataset.role === currentRole);
      if (currentIndex >= 0) {
        const nextIndex = (currentIndex + 1) % tabs.length;
        const nextTab = tabs[nextIndex];
        // Trigger click on next tab after 3 seconds
        setTimeout(() => {
          if (window.kratuChat && window.kratuChat.currentRole === currentRole) {
            nextTab.click();
          }
        }, 3000);
      }
    });

    // Start after page load timeline
    setTimeout(() => {
      window.kratuChat.play(CONVERSATION_SCRIPTS['student']);
    }, 2500);
  }
});
