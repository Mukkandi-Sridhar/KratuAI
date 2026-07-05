const personas = {
  college: {
    query: '"Which students need intervention before placements?"',
    tags: ['Student Records', 'Attendance DB', 'CGPA Data', 'Circulars'],
    answer: '23 students flagged. 15 remedial support, 6 attendance review, 2 backlogs.',
    meta: ['0.9s response', '3 sources cited', 'RBAC enforced']
  },
  hospital: {
    query: '"What is the SOP for post-op infection protocol?"',
    tags: ['Clinical SOPs', 'Ward Logs', 'Formulary'],
    answer: 'Administer IV cefazolin 1g q8h for 48hrs. Wound check at 24h.',
    meta: ['0.7s response', '2 sources cited', 'Doctor role only']
  },
  enterprise: {
    query: '"What is our WFH policy for contractors?"',
    tags: ['HR Policy', 'Contracts DB', 'Onboarding Docs'],
    answer: 'Contractors: max 3 days WFH/week. Manager approval required beyond.',
    meta: ['0.6s response', '1 source cited', 'HR role only']
  },
  factory: {
    query: '"Who reported the Line 3 incident yesterday?"',
    tags: ['Incident Logs', 'Shift Handover', 'Safety DB'],
    answer: 'Ramesh Kumar (Shift B) filed IR-2024-441 at 14:32. Escalated to QA.',
    meta: ['1.1s response', '2 sources cited', 'Admin role only']
  },
  govt: {
    query: '"What are the eligibility criteria for PM Awas Yojana?"',
    tags: ['Scheme DB', 'Citizen Records', 'Circulars'],
    answer: 'Annual income below ₹3L, no pucca house, Aadhaar linked bank account.',
    meta: ['0.8s response', '1 source cited', 'Public access']
  },
  bank: {
    query: '"What documents are needed for MSME loan under ₹25L?"',
    tags: ['Policy Manual', 'RBI Guidelines', 'Branch Ops'],
    answer: 'ITR 2yr, GST returns, business proof, 6mo bank statement, KYC.',
    meta: ['0.7s response', '2 sources cited', 'Officer role']
  }
};

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.ptab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.ptab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const p = personas[tab.dataset.persona];
      const panel = document.querySelector('.persona-panel');
      if (!panel || !p) return;

      gsap.to(panel, {
        opacity: 0, y: 10, duration: 0.2, onComplete: () => {
          document.getElementById('pp-query').textContent = p.query;
          document.getElementById('pp-tags').innerHTML = p.tags.map(t => `<span>${t}</span>`).join('');
          document.getElementById('pp-answer').textContent = p.answer;
          document.getElementById('pp-meta').innerHTML = p.meta.map(m => `<span>${m}</span>`).join('');
          gsap.to(panel, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' });
        }
      });
    });
  });
});
