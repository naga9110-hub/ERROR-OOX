/*
 * AURA is intentionally a static, frontend-only demonstration.
 * All investigations, evidence, approvals, and resolutions below are simulated.
 * No network requests, diagnostic commands, or real system changes are performed.
 */
(() => {
  'use strict';

  const STORAGE_KEY = 'aura-helpdesk-demo-v1';
  const agentStages = [
    { id: 'triage', label: 'TRIAGE AGENT', active: 'ANALYZING', detail: 'Understanding and classifying the employee issue.' },
    { id: 'knowledge', label: 'KNOWLEDGE AGENT', active: 'SEARCHING', detail: 'Searching troubleshooting knowledge and documentation.' },
    { id: 'diagnosis', label: 'DIAGNOSIS AGENT', active: 'CHECKING', detail: 'Analyzing available system and network information.' },
    { id: 'history', label: 'HISTORY AGENT', active: 'SEARCHING', detail: 'Checking previous tickets and their outcomes.' },
    { id: 'troubleshooting', label: 'TROUBLESHOOTING', active: 'SYNTHESIZING', detail: 'Combining evidence into safe, ordered next steps.' },
    { id: 'resolution', label: 'RESOLUTION AGENT', active: 'RECOMMENDING', detail: 'Preparing a human-reviewed recommendation.' },
  ];

  const seedTickets = [
    { id: 'AUR-2481', title: 'VPN keeps disconnecting', requester: 'Maya Chen', department: 'Finance', priority: 'High', status: 'Investigating', age: '4 min ago', assignee: 'Admin', description: 'The VPN drops every few minutes while I work remotely.' },
    { id: 'AUR-2479', title: 'Can’t access shared drive', requester: 'Jordan Lee', department: 'Design', priority: 'Normal', status: 'Awaiting approval', age: '18 min ago', assignee: 'Admin', description: 'The design shared drive says access denied after I changed teams.' },
    { id: 'AUR-2476', title: 'Laptop running unusually hot', requester: 'Sam Rivera', department: 'Product', priority: 'Low', status: 'In progress', age: '42 min ago', assignee: 'IT Support', description: 'My laptop fan is loud and the machine is running hot.' },
    { id: 'AUR-2472', title: 'MFA prompt never arrives', requester: 'Priya Patel', department: 'People', priority: 'High', status: 'Resolved', age: '1 hr ago', assignee: 'Admin', description: 'I am not receiving the push notification for multi-factor authentication.' },
    { id: 'AUR-2468', title: 'Outlook calendar not syncing', requester: 'Ethan Brooks', department: 'Sales', priority: 'Normal', status: 'Escalated', age: '2 hr ago', assignee: 'IT Support', description: 'My calendar changes on desktop are not showing up on mobile.' },
    { id: 'AUR-2465', title: 'Teams audio cuts out in calls', requester: 'Nina Park', department: 'People', priority: 'Normal', status: 'Resolved', age: '3 hr ago', assignee: 'Admin', description: 'Teams audio cuts out during video calls.' },
    { id: 'AUR-2462', title: 'Printer queue is stuck', requester: 'Noah Wilson', department: 'Operations', priority: 'Low', status: 'In progress', age: '4 hr ago', assignee: 'IT Support', description: 'A document is stuck in the office printer queue.' },
    { id: 'AUR-2458', title: 'Password reset link expired', requester: 'Ava Johnson', department: 'Finance', priority: 'High', status: 'Resolved', age: '5 hr ago', assignee: 'Admin', description: 'The password reset link expired before I could use it.' },
    { id: 'AUR-2452', title: 'Wi-Fi drops in meeting room', requester: 'Leo Martin', department: 'Engineering', priority: 'Normal', status: 'Investigating', age: '6 hr ago', assignee: 'Admin', description: 'The Wi-Fi connection drops in the south meeting room.' },
    { id: 'AUR-2449', title: 'Second monitor not detected', requester: 'Zoe Taylor', department: 'Design', priority: 'Low', status: 'Resolved', age: 'Yesterday', assignee: 'IT Support', description: 'My external monitor is no longer detected.' },
    { id: 'AUR-2446', title: 'Browser keeps crashing', requester: 'Max Kim', department: 'Sales', priority: 'Normal', status: 'Resolved', age: 'Yesterday', assignee: 'Admin', description: 'My browser closes unexpectedly when I open several tabs.' },
    { id: 'AUR-2441', title: 'Shared mailbox permission request', requester: 'Isla Brown', department: 'People', priority: 'Low', status: 'Awaiting approval', age: 'Yesterday', assignee: 'Admin', description: 'Please help me get access to our department shared mailbox.' },
  ];

  const knowledge = {
    network: { title: 'Wi-Fi connected but internet is unavailable', source: 'KB-1042 · Network troubleshooting', detail: 'Distinguish local Wi-Fi, DNS resolution, and general internet access before proposing changes.' },
    vpn: { title: 'VPN connection troubleshooting', source: 'KB-0785 · Remote access', detail: 'Confirm a working network connection before troubleshooting the VPN client. Do not change profiles or certificates.' },
    email: { title: 'Outlook mail and calendar troubleshooting', source: 'KB-0910 · Microsoft 365', detail: 'Compare desktop and web symptoms, record the displayed error, and avoid changing mailbox settings.' },
    device: { title: 'Windows performance and resource checks', source: 'KB-0614 · End-user devices', detail: 'Check scope and recent changes; use read-only resource observations before escalating persistent performance issues.' },
    teams: { title: 'Teams audio and meeting troubleshooting', source: 'KB-0832 · Collaboration tools', detail: 'Confirm the intended audio device and employee-granted microphone permission in Teams settings.' },
    printer: { title: 'Printer queue troubleshooting', source: 'KB-0539 · Printing', detail: 'Check displayed errors and whether multiple users are affected. Driver and spooler changes require technician review.' },
    identity: { title: 'Password and account recovery', source: 'KB-0107 · Identity & access', detail: 'Never collect passwords or recovery codes. Route identity verification through the approved recovery process.' },
    general: { title: 'IT support initial triage', source: 'KB-0001 · Service desk', detail: 'Confirm impact, affected device, start time, and recent changes before recommending a safe next step.' },
  };

  const previousCases = {
    network: { id: 'AUR-2318', title: 'Wi-Fi connected, DNS lookup timed out', diagnosis: 'A demo history record reports a DNS lookup issue.', resolution: 'Employee followed the network troubleshooting checklist.', result: 'Resolved after technician verification.' },
    vpn: { id: 'AUR-2398', title: 'VPN disconnects on home network', diagnosis: 'A demo record notes repeated client disconnects.', resolution: 'Employee retried the approved client after checking the network.', result: 'Resolved; no configuration changes.' },
    email: { id: 'AUR-2352', title: 'Outlook messages stayed in Outbox', diagnosis: 'A demo record describes a client-side send issue.', resolution: 'Employee verified connectivity and retried after restarting Outlook.', result: 'Employee confirmed delivery.' },
    device: { id: 'AUR-2294', title: 'Windows device slow after update', diagnosis: 'A demo record required resource checks before diagnosis.', resolution: 'Desktop support reviewed device health.', result: 'Resolved by support technician.' },
    teams: { id: 'AUR-2411', title: 'Teams microphone unavailable', diagnosis: 'A demo record notes the wrong selected input device.', resolution: 'Employee selected the intended microphone in Teams.', result: 'Resolved after an employee test call.' },
    printer: { id: 'AUR-2206', title: 'Office printer not clearing jobs', diagnosis: 'A demo record was escalated for queue review.', resolution: 'Desktop support reviewed the print queue.', result: 'Resolved by support technician.' },
    identity: { id: 'AUR-2187', title: 'Account recovery request', diagnosis: 'A demo record required identity verification.', resolution: 'Identity support directed employee to approved recovery.', result: 'Resolved by identity support.' },
    general: { id: 'AUR-2001', title: 'General device support request', diagnosis: 'No close symptom-specific match in the demo records.', resolution: 'Technician gathered more information.', result: 'Escalated for review.' },
  };

  const runbook = {
    network: 'Verify affected scope → compare the known-good device → review DNS and network symptoms → escalate unresolved connectivity.',
    vpn: 'Confirm internet access → capture the VPN client message → retry once with the employee → escalate persistent connection failures.',
    email: 'Check whether web and desktop clients differ → capture the displayed error → avoid changing mailbox configuration.',
    device: 'Confirm when the slowdown began → review safe performance checks → escalate persistent resource or thermal issues.',
    teams: 'Confirm selected microphone → check Teams device settings → have employee run a test call.',
    printer: 'Confirm printer error and affected users → inspect user-visible queue → route spooler and driver changes to support.',
    identity: 'Do not ask for passwords or MFA codes → use the official recovery route → escalate identity verification.',
    general: 'Confirm scope, device, start time, and recent changes → follow the relevant approved support procedure.',
  };

  const state = {
    tickets: loadStoredTickets(),
    selectedId: null,
    filter: 'all',
    workflowTimer: null,
    activity: loadStoredActivity(),
    currentReport: null,
    stageCursor: 0,
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const issueInput = $('#issue-input');

  function loadStoredTickets() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return Array.isArray(saved?.tickets) && saved.tickets.length ? saved.tickets : seedTickets.map((ticket) => ({ ...ticket }));
    } catch (_) {
      return seedTickets.map((ticket) => ({ ...ticket }));
    }
  }

  function loadStoredActivity() {
    try {
      const saved = JSON.parse(localStorage.getItem(`${STORAGE_KEY}-activity`));
      return Array.isArray(saved) ? saved.slice(0, 15) : [];
    } catch (_) {
      return [];
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ tickets: state.tickets }));
      localStorage.setItem(`${STORAGE_KEY}-activity`, JSON.stringify(state.activity.slice(0, 15)));
    } catch (_) {
      // Private browsing or storage limits do not interrupt the in-memory demo.
    }
  }

  function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
  }

  function ticketStatusClass(status) {
    return String(status || '').toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '');
  }

  function getInitials(name = 'AURA User') {
    return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0] || '').join('').toUpperCase();
  }

  function persistActivity(message, kind = 'investigation', ticketId = '') {
    state.activity.unshift({ message, kind, ticketId, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
    state.activity = state.activity.slice(0, 12);
    saveState();
    renderActivity();
  }

  function showToast(message, kind = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${kind === 'error' ? 'error' : ''}`;
    const icon = document.createElement('span');
    icon.className = 'toast-icon';
    icon.textContent = kind === 'error' ? '!' : '✓';
    const text = document.createElement('span');
    text.textContent = message;
    toast.append(icon, text);
    $('#toast-region').append(toast);
    window.setTimeout(() => toast.remove(), 3800);
  }

  function animateStats() {
    $$('[data-count]').forEach((element) => {
      const target = Number(element.dataset.count);
      const suffix = element.dataset.suffix || '';
      const start = performance.now();
      const duration = 1100;
      const draw = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = `${Math.round(target * eased)}${suffix}`;
        if (progress < 1) requestAnimationFrame(draw);
      };
      requestAnimationFrame(draw);
    });
  }

  function renderTickets() {
    const filtered = state.tickets.filter((ticket) => {
      if (state.filter === 'mine' && ticket.assignee !== 'Admin') return false;
      if (state.filter === 'urgent' && !['High', 'Urgent'].includes(ticket.priority)) return false;
      return true;
    });
    const visible = filtered.slice(0, 5);
    $('#queue-total').textContent = state.tickets.length;
    $('#all-ticket-count').textContent = state.tickets.length;
    $('.nav-ticket-count').textContent = state.tickets.filter((ticket) => !['Resolved', 'Escalated'].includes(ticket.status)).length;
    $('.urgent-count').textContent = state.tickets.filter((ticket) => ['High', 'Urgent'].includes(ticket.priority)).length;
    const queue = $('#ticket-list');
    if (!visible.length) {
      queue.innerHTML = '<div class="queue-empty">No tickets in this view.</div>';
      return;
    }
    queue.innerHTML = visible.map((ticket, index) => `<button class="ticket-row ${ticket.id === state.selectedId ? 'selected' : ''}" type="button" data-ticket-id="${escapeHTML(ticket.id)}" aria-label="Open ${escapeHTML(ticket.id)}: ${escapeHTML(ticket.title)}"><span class="ticket-avatar tone-${index % 4}">${escapeHTML(getInitials(ticket.requester))}</span><span class="ticket-copy"><strong>${escapeHTML(ticket.title)}</strong><small>${escapeHTML(ticket.id)} · ${escapeHTML(ticket.requester)}</small></span><span class="ticket-priority ${ticket.priority.toLowerCase()}">${escapeHTML(ticket.priority)}</span><span class="ticket-state ${ticketStatusClass(ticket.status)}">${escapeHTML(ticket.status)}</span></button>`).join('');
  }

  function identifyIssue(text) {
    const value = text.toLowerCase();
    if (/wifi|wi-fi|wireless|internet|dns|ethernet|network/.test(value)) return 'network';
    if (/vpn|virtual private network|tunnel/.test(value)) return 'vpn';
    if (/outlook|email|e-mail|mailbox|calendar|outbox/.test(value)) return 'email';
    if (/teams|microphone|speaker|camera|meeting/.test(value)) return 'teams';
    if (/printer|printing|print queue/.test(value)) return 'printer';
    if (/password|sign[ -]?in|login|account|mfa|locked out/.test(value)) return 'identity';
    if (/slow|performance|freeze|freezing|hot|fan|memory|cpu|computer|laptop/.test(value)) return 'device';
    return 'general';
  }

  function getCategoryLabel(category) {
    return ({ network: 'Network', vpn: 'VPN & remote access', email: 'Email & collaboration', teams: 'Email & collaboration', printer: 'Printing', identity: 'Identity & access', device: 'Device performance', general: 'General IT' })[category] || 'General IT';
  }

  function getPriority(text, category) {
    const value = text.toLowerCase();
    if (/company.?wide|entire team|security breach|data loss|critical outage/.test(value)) return 'Urgent';
    if (/cannot work|can't work|no internet|internet is not working|internet not working|cannot access the internet|can't access the internet|cannot access internet|can't access internet|production down|locked out|urgent|critical/.test(value)) return 'High';
    return category === 'identity' ? 'High' : category === 'network' || category === 'vpn' ? 'Normal' : 'Low';
  }

  function nextTicketId() {
    const maxNumber = state.tickets.reduce((maximum, ticket) => {
      const number = Number(String(ticket.id).match(/(\d+)$/)?.[1] || 0);
      return Math.max(maximum, number);
    }, 2481);
    return `AUR-${maxNumber + 1}`;
  }

  function addTicket(text, requester = 'You', department = 'General') {
    const trimmed = text.trim();
    const category = identifyIssue(trimmed);
    const ticket = {
      id: nextTicketId(),
      title: trimmed.length > 48 ? `${trimmed.slice(0, 45).trimEnd()}…` : trimmed,
      description: trimmed,
      requester: requester.trim() || 'You',
      department,
      priority: getPriority(trimmed, category),
      status: 'Investigating',
      age: 'Just now',
      assignee: 'Admin',
    };
    state.tickets.unshift(ticket);
    state.selectedId = ticket.id;
    saveState();
    renderTickets();
    persistActivity(`New ticket ${ticket.id} submitted by ${ticket.requester}.`, 'investigation', ticket.id);
    return ticket;
  }

  function setWorkflowHeader(title, caption) {
    $('#workflow-state-title').textContent = title;
    $('#workflow-state-caption').textContent = caption;
  }

  function clearWorkflow() {
    if (state.workflowTimer) {
      window.clearInterval(state.workflowTimer);
      state.workflowTimer = null;
    }
    state.stageCursor = 0;
    $$('.agent-card').forEach((card) => {
      card.classList.remove('is-working', 'is-done', 'is-attention');
      $('.agent-status', card).textContent = 'READY';
    });
    $('#result-section').hidden = true;
  }

  function updateAgentStage(index) {
    const stage = agentStages[index];
    const card = $(`.agent-card[data-agent="${stage.id}"]`);
    card.classList.add('is-working');
    $('.agent-status', card).textContent = stage.active;
    state.stageCursor = index;
    setWorkflowHeader(`AGENT ${String(index + 1).padStart(2, '0')} OF 06`, stage.detail);
    card.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  function completeAgentStage(index) {
    const stage = agentStages[index];
    const card = $(`.agent-card[data-agent="${stage.id}"]`);
    card.classList.remove('is-working');
    card.classList.add('is-done');
    $('.agent-status', card).textContent = 'COMPLETE';
  }

  function classifyRecommendation(category, issue) {
    const recommendations = {
      network: { title: 'Run the guided Wi-Fi checks', action: 'Guided troubleshooting · no device changes', reason: 'The demo knowledge article recommends checking the connection scope and DNS symptoms before changing any settings.', risk: 'LOW RISK', steps: ['Confirm whether another device on the same Wi-Fi can browse.', 'Check the expected Wi-Fi network and note any visible connection error.', 'If the example DNS evidence persists, ask an IT technician to verify before changing settings.'] },
      vpn: { title: 'Check the network before retrying VPN', action: 'Employee-guided check · no profile changes', reason: 'The matched demo procedure says to confirm internet access before troubleshooting the VPN client.', risk: 'LOW RISK', steps: ['Confirm regular internet access without the VPN.', 'Capture the VPN app error message and when it occurs.', 'Retry once with the employee; escalate repeated failures.'] },
      email: { title: 'Compare Outlook web and desktop behavior', action: 'Guided troubleshooting · no account changes', reason: 'The demo knowledge article recommends comparing clients and documenting the displayed error.', risk: 'LOW RISK', steps: ['Check whether the issue appears in the desktop and web client.', 'Record the exact error and when it started.', 'Escalate mailbox or profile changes to a support technician.'] },
      teams: { title: 'Check the selected Teams audio device', action: 'Employee-guided check · no device changes', reason: 'The matched demo procedure recommends checking the selected microphone and running a test call.', risk: 'LOW RISK', steps: ['Open Teams device settings and confirm the intended microphone.', 'Check microphone permission in Teams settings.', 'Ask the employee to run a test call and report the result.'] },
      printer: { title: 'Verify the printer symptom with support', action: 'Technician review · no queue changes', reason: 'The demo procedure does not authorize clearing jobs or changing printer settings.', risk: 'HUMAN REVIEW', steps: ['Confirm the printer model and displayed error.', 'Check whether other users are affected.', 'Route printer queue, driver, or spooler changes to desktop support.'] },
      identity: { title: 'Use the approved account recovery process', action: 'Escalate to identity support', reason: 'Identity changes require a verified employee. Never ask for passwords, MFA codes, or recovery codes.', risk: 'HUMAN REVIEW', steps: ['Direct the employee to the organization’s official recovery route.', 'Do not collect any password or one-time code.', 'Escalate identity verification to an authorized support technician.'] },
      device: { title: 'Collect safe performance details', action: 'Read-only triage · technician review if persistent', reason: 'The demo runbook recommends identifying scope and recent changes before troubleshooting device settings.', risk: 'LOW RISK', steps: ['Confirm whether one application or the full computer is affected.', 'Ask when the issue started and whether anything changed.', 'Escalate persistent heat, fan, or performance symptoms to desktop support.'] },
      general: { title: 'Gather one more detail, then route appropriately', action: 'Information gathering · no system changes', reason: 'The demo evidence does not point to one reliable fix; more context or technician review is appropriate.', risk: 'HUMAN REVIEW', steps: ['Ask for the exact error and when the issue began.', 'Confirm which device and applications are affected.', 'Escalate if the issue is urgent or remains unclear.'] },
    };
    const recommendation = recommendations[category];
    if (category === 'network' && /company.?wide|entire team|security breach|data loss|production down/.test(issue.toLowerCase())) {
      return { ...recommendation, title: 'Escalate the broader network impact', action: 'Route to IT operations', risk: 'HUMAN REVIEW', reason: 'A broad reported impact warrants technician review. This is a suggested route, not a confirmed outage.' };
    }
    return recommendation;
  }

  function buildReport(ticket) {
    const category = identifyIssue(ticket.description);
    const article = knowledge[category];
    const past = previousCases[category];
    const recommendation = classifyRecommendation(category, ticket.description);
    const facts = [
      `Ticket ${ticket.id} was classified as ${getCategoryLabel(category)} with ${ticket.priority} priority.`,
      `The local demo knowledge base matched “${article.title}” (${article.source}).`,
      `Mock system-status panel currently displays network: Operational; collaboration tools: Degraded. These are illustrative values, not live checks.`,
      `Demo ticket-history match: ${past.id} — ${past.title}; result: ${past.result}`,
      `Matched demo troubleshooting procedure: ${runbook[category]}`,
    ];
    return {
      ticket,
      category,
      article,
      past,
      recommendation,
      facts,
      confidence: category === 'general' || category === 'printer' ? 'LOW' : 'MEDIUM',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  }

  function renderReport(report) {
    state.currentReport = report;
    const section = $('#result-section');
    $('#report-ticket-id').textContent = `· ${report.ticket.id}`;
    $('#confidence-badge').textContent = `CONFIDENCE · ${report.confidence}`;
    $('#observed-facts').innerHTML = report.facts.map((fact) => `<li>${escapeHTML(fact)}</li>`).join('');
    $('#evidence-sources').innerHTML = `<span class="source-chip"><span>◈</span> ${escapeHTML(report.article.source)}</span><span class="source-chip"><span>⌘</span> Simulated status</span><span class="source-chip"><span>◉</span> ${escapeHTML(report.past.id)} · demo ticket</span><span class="source-chip"><span>≋</span> Demo runbook</span>`;
    $('#recommendation-body').innerHTML = `<div class="recommendation-title">${escapeHTML(report.recommendation.title)}</div><p>${escapeHTML(report.recommendation.reason)}</p><ol>${report.recommendation.steps.map((step) => `<li>${escapeHTML(step)}</li>`).join('')}</ol><div class="detail-pill-row"><span class="detail-pill ${report.recommendation.risk === 'LOW RISK' ? 'risk-low' : ''}">${escapeHTML(report.recommendation.risk)}</span><span class="detail-pill">${escapeHTML(report.recommendation.action)}</span></div>`;
    $('#resolution-state').className = 'resolution-state';
    $('#resolution-state').textContent = '';
    $('#approve-button').disabled = false;
    $('#reject-button').disabled = false;
    $('#escalate-button').disabled = false;
    section.hidden = false;
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function runInvestigation(ticket) {
    if (!ticket) return;
    clearWorkflow();
    $('#issue-input').value = ticket.description;
    updateCharCount();
    const button = $('#investigate-button');
    button.disabled = true;
    button.innerHTML = '<span class="spinner" aria-hidden="true"></span> Agents Investigating…';
    persistActivity(`Investigation started for ${ticket.id} · ${getCategoryLabel(identifyIssue(ticket.description))}.`, 'investigation', ticket.id);
    updateAgentStage(0);
    let stage = 0;
    state.workflowTimer = window.setInterval(() => {
      completeAgentStage(stage);
      stage += 1;
      if (stage >= agentStages.length) {
        window.clearInterval(state.workflowTimer);
        state.workflowTimer = null;
        const report = buildReport(ticket);
        renderReport(report);
        ticket.status = 'Awaiting approval';
        ticket.age = 'Just now';
        state.selectedId = ticket.id;
        saveState();
        renderTickets();
        setWorkflowHeader('INVESTIGATION COMPLETE', 'Recommendation ready for human review');
        button.disabled = false;
        button.innerHTML = '<span>✦</span> Investigate Issue <span class="button-arrow">→</span>';
        persistActivity(`Six agents completed the investigation for ${ticket.id}. No changes were made.`, 'investigation', ticket.id);
        showToast(`Investigation complete for ${ticket.id}. Review the recommendation below.`);
        return;
      }
      updateAgentStage(stage);
    }, 680);
  }

  function updateCharCount() {
    $('#char-count').textContent = `${issueInput.value.length} / 800`;
  }

  function focusComposer() {
    $('#create-ticket-card').scrollIntoView({ behavior: 'smooth', block: 'center' });
    window.setTimeout(() => issueInput.focus(), 350);
  }

  function openTicketDialog() {
    const dialog = $('#ticket-dialog');
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    window.setTimeout(() => $('#requester-name').focus(), 50);
  }

  function resolveDecision(decision) {
    const report = state.currentReport;
    if (!report) {
      showToast('Run an investigation before reviewing a recommendation.', 'error');
      return;
    }
    const ticket = state.tickets.find((item) => item.id === report.ticket.id);
    const statePanel = $('#resolution-state');
    const buttons = $$('.approval-actions button');
    buttons.forEach((button) => { button.disabled = true; });
    if (decision === 'approve') {
      ticket.status = 'Resolved';
      ticket.assignee = 'Admin';
      statePanel.className = 'resolution-state';
      statePanel.textContent = '✓ Approved in demo. No command ran and no real system was changed.';
      persistActivity(`Human approval simulated for ${ticket.id}. Demo ticket marked resolved; no real action executed.`, 'approved', ticket.id);
      showToast('Approval recorded in the demo. No system changes were made.');
    } else if (decision === 'reject') {
      ticket.status = 'In progress';
      statePanel.className = 'resolution-state state-rejected';
      statePanel.textContent = '↺ Recommendation rejected. No action was taken; the ticket remains open.';
      persistActivity(`Recommendation rejected for ${ticket.id}. Ticket remains open.`, 'rejected', ticket.id);
      showToast('Recommendation rejected. No action was taken.');
    } else {
      ticket.status = 'Escalated';
      ticket.assignee = 'IT Support';
      statePanel.className = 'resolution-state state-escalated';
      statePanel.textContent = '↗ Escalation simulated. The ticket is now assigned to the IT Support queue.';
      persistActivity(`${ticket.id} was escalated to the demo IT Support queue.`, 'escalated', ticket.id);
      showToast('Ticket escalated in the demo queue.');
    }
    saveState();
    renderTickets();
    window.setTimeout(() => buttons.forEach((button) => { button.disabled = false; }), 900);
  }

  function renderActivity() {
    const activity = $('#activity-list');
    if (!state.activity.length) {
      activity.innerHTML = '<div class="activity-empty"><span>✳</span> No investigations yet. Submit an issue to start.</div>';
      return;
    }
    const symbols = { investigation: '✳', approved: '✓', rejected: '↺', escalated: '↗' };
    activity.innerHTML = state.activity.slice(0, 4).map((item) => `<div class="activity-item"><span class="activity-icon ${escapeHTML(item.kind)}">${symbols[item.kind] || '·'}</span><span class="activity-copy"><p>${escapeHTML(item.message)}</p><small>${escapeHTML(item.ticketId || 'AURA helpdesk')} · ${escapeHTML(item.time)}</small></span></div>`).join('');
  }

  function updateTodayDate() {
    $('#today-date').textContent = new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  }

  function addCurrentIssue() {
    const value = issueInput.value.trim();
    if (value.length < 8) {
      showToast('Add a little more detail so the agents can investigate.', 'error');
      issueInput.focus();
      return;
    }
    const ticket = addTicket(value);
    runInvestigation(ticket);
  }

  $('#ticket-form').addEventListener('submit', (event) => {
    event.preventDefault();
    addCurrentIssue();
  });

  issueInput.addEventListener('input', updateCharCount);

  $('#example-list').addEventListener('click', (event) => {
    const button = event.target.closest('[data-example]');
    if (!button) return;
    issueInput.value = button.dataset.example;
    updateCharCount();
    $$('.example-chip').forEach((chip) => chip.classList.toggle('selected', chip === button));
    issueInput.focus();
    showToast('Example added. Add details or investigate when you’re ready.');
  });

  $('#hero-create').addEventListener('click', focusComposer);
  $('#queue-view-all').addEventListener('click', () => {
    $$('.queue-tab').forEach((tab) => tab.classList.remove('active'));
    $$('.queue-tab')[0].classList.add('active');
    state.filter = 'all';
    renderTickets();
    $('#tickets').scrollIntoView({ behavior: 'smooth', block: 'start' });
    showToast('Showing all tickets in the demo queue.');
  });
  $('#queue-menu').addEventListener('click', () => showToast('Queue actions are illustrative in this static demo.'));
  $('#admin-button').addEventListener('click', () => showToast('Signed in as demo administrator. No account service is connected.'));

  $$('.queue-tab').forEach((tab) => tab.addEventListener('click', () => {
    state.filter = tab.dataset.filter;
    $$('.queue-tab').forEach((item) => item.classList.toggle('active', item === tab));
    renderTickets();
  }));

  $('#ticket-list').addEventListener('click', (event) => {
    const row = event.target.closest('[data-ticket-id]');
    if (!row) return;
    const ticket = state.tickets.find((item) => item.id === row.dataset.ticketId);
    if (!ticket) return;
    state.selectedId = ticket.id;
    renderTickets();
    runInvestigation(ticket);
  });

  $('#approve-button').addEventListener('click', () => resolveDecision('approve'));
  $('#reject-button').addEventListener('click', () => resolveDecision('reject'));
  $('#escalate-button').addEventListener('click', () => resolveDecision('escalate'));

  $('#dialog-ticket-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const requester = String(form.get('requester') || 'You').trim();
    const department = String(form.get('department') || 'General');
    const issue = String(form.get('issue') || '').trim();
    if (issue.length < 8) {
      showToast('Please describe the issue in a little more detail.', 'error');
      return;
    }
    const ticket = addTicket(issue, requester, department);
    const dialog = $('#ticket-dialog');
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
    event.currentTarget.reset();
    runInvestigation(ticket);
    $('#agents').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  $('#dialog-cancel').addEventListener('click', () => $('#ticket-dialog').close());
  $('#ticket-dialog').addEventListener('click', (event) => {
    if (event.target === event.currentTarget) event.currentTarget.close();
  });

  $('#activity-clear').addEventListener('click', () => {
    state.activity = [];
    saveState();
    renderActivity();
    showToast('Demo activity log cleared.');
  });

  $('#mobile-menu').addEventListener('click', () => {
    const nav = $('#main-nav');
    const isOpen = nav.classList.toggle('open');
    $('#mobile-menu').setAttribute('aria-expanded', String(isOpen));
  });

  $$('.nav-link').forEach((link) => link.addEventListener('click', () => {
    $$('.nav-link').forEach((item) => item.classList.toggle('active', item === link));
    $('#main-nav').classList.remove('open');
    $('#mobile-menu').setAttribute('aria-expanded', 'false');
  }));

  document.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      focusComposer();
    }
    if (event.key === 'Escape') {
      $('#main-nav').classList.remove('open');
      $('#mobile-menu').setAttribute('aria-expanded', 'false');
    }
  });

  animateStats();
  updateTodayDate();
  renderTickets();
  renderActivity();
  updateCharCount();
})();
