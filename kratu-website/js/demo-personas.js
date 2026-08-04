/* ═══════════════════════════════════════════════════════════
   DEMO-PERSONAS.JS — Domain switcher for the hero product demo
═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  const personas = {
    college: {
      label: 'College',
      time: '10:42',
      query: 'Which students need intervention before placements?',
      retrieval: 'Searched 1,204 indexed documents — 3 relevant passages retrieved',
      answer: '23 students flagged. 15 need remedial support, 6 need attendance review, 2 have pending backlogs.',
      tags: ['Student Records', 'Attendance DB', 'CGPA Data'],
      meta: ['0.9s response', '3 sources cited', 'RBAC enforced'],
    },
    hospital: {
      label: 'Hospital',
      time: '09:15',
      query: 'What is the SOP for post-op infection protocol?',
      retrieval: 'Searched 860 clinical documents — 2 relevant passages retrieved',
      answer: 'Administer IV cefazolin 1g every 8 hours for 48 hours. Wound check required at the 24-hour mark.',
      tags: ['Clinical SOPs', 'Ward Logs', 'Formulary'],
      meta: ['0.7s response', '2 sources cited', 'Doctor role only'],
    },
    enterprise: {
      label: 'Enterprise',
      time: '14:08',
      query: 'What is our WFH policy for contractors?',
      retrieval: 'Searched 2,410 HR documents — 1 relevant passage retrieved',
      answer: 'Contractors may work from home up to 3 days per week. Manager approval is required beyond that.',
      tags: ['HR Policy', 'Contracts DB', 'Onboarding Docs'],
      meta: ['0.6s response', '1 source cited', 'HR role only'],
    },
    factory: {
      label: 'Factory',
      time: '07:30',
      query: 'Who reported the Line 3 incident yesterday?',
      retrieval: 'Searched 5,120 shift and safety records — 2 relevant entries retrieved',
      answer: 'Shift B filed incident report IR-2024-441 at 14:32. It has been escalated to Quality Assurance.',
      tags: ['Incident Logs', 'Shift Handover', 'Safety DB'],
      meta: ['1.1s response', '2 sources cited', 'Admin role only'],
    },
    govt: {
      label: 'Government',
      time: '11:20',
      query: 'What are the eligibility criteria for the housing scheme?',
      retrieval: 'Searched 640 circulars and scheme documents — 1 relevant passage retrieved',
      answer: 'Annual household income below ₹3L, no existing pucca house, and an Aadhaar-linked bank account.',
      tags: ['Scheme Database', 'Citizen Records', 'Circulars'],
      meta: ['0.8s response', '1 source cited', 'Public access'],
    },
    bank: {
      label: 'Banking',
      time: '16:45',
      query: 'What documents are needed for an MSME loan under ₹25L?',
      retrieval: 'Searched 1,780 policy and regulatory documents — 2 relevant passages retrieved',
      answer: '2 years of ITR, GST returns, business proof, 6 months of bank statements, and KYC documents.',
      tags: ['Policy Manual', 'RBI Guidelines', 'Branch Ops'],
      meta: ['0.7s response', '2 sources cited', 'Officer role'],
    },
  };

  const select = document.getElementById('demo-domain-select');
  const feed = document.getElementById('demo-chat-feed');
  const domainLabel = document.getElementById('demo-domain-label');
  const urlBar = document.querySelector('.device-frame-url');
  if (!select || !feed) return;

  // Mirrors the markup in index.html so switching personas keeps the
  // full thread chrome (byline, retrieval trace, hover actions) intact.
  function renderFeed(persona) {
    const time = persona.time || '10:42';
    feed.innerHTML = `
      <div class="demo-day-divider"><span>Today</span></div>

      <div class="demo-msg-row demo-msg-row--user">
        <div class="demo-msg-col">
          <div class="demo-msg-byline"><span>You</span><time>${time}</time></div>
          <div class="demo-msg demo-msg--user">${persona.query}</div>
        </div>
        <span class="demo-avatar demo-avatar--user">YOU</span>
      </div>

      <div class="demo-retrieval">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path></svg>
        ${persona.retrieval}
      </div>

      <div class="demo-msg-row demo-msg-row--ai">
        <span class="demo-avatar demo-avatar--ai">K</span>
        <div class="demo-msg-col">
          <div class="demo-msg-byline"><span>Kratu</span><time>${time}</time></div>
          <div class="demo-msg demo-msg--ai">${persona.answer}</div>
          <div class="demo-cite-row">${persona.tags.map((t) => `<span class="demo-cite">${t}</span>`).join('')}</div>
          <div class="demo-meta-row">${persona.meta.map((m) => `<span>${m}</span>`).join('')}</div>
          <div class="demo-msg-actions">
            <button type="button" aria-label="Helpful"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 10v12M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"></path></svg></button>
            <button type="button" aria-label="Not helpful"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 14V2M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z"></path></svg></button>
            <button type="button" aria-label="Copy answer"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg></button>
            <span class="demo-msg-actions-hint">Every answer is traceable to its source</span>
          </div>
        </div>
      </div>
    `;
  }

  function applyPersona(key) {
    const persona = personas[key];
    if (!persona) return;

    if (domainLabel) domainLabel.textContent = persona.label;
    if (urlBar) urlBar.textContent = `app.kratu.ai/${key}/workspace`;

    feed.style.transition = 'opacity 0.15s ease-out';
    feed.style.opacity = '0';
    setTimeout(() => {
      renderFeed(persona);
      feed.style.opacity = '1';
    }, 150);
  }

  select.addEventListener('change', () => applyPersona(select.value));

  // Trust editorial: clicking an industry jumps to the hero demo
  // and previews that persona there, tying the two sections together.
  const verticalButtons = document.querySelectorAll('.trust-vertical-list button');
  const demoWrapper = document.querySelector('.product-demo-wrapper');

  verticalButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.persona;
      if (!personas[key]) return;

      verticalButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      select.value = key;
      applyPersona(key);

      if (demoWrapper) {
        demoWrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
        demoWrapper.classList.add('product-demo-wrapper--pulse');
        setTimeout(() => demoWrapper.classList.remove('product-demo-wrapper--pulse'), 900);
      }
    });
  });
});
