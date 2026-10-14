import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runDailyAgent, validateAgentRequest, agentHttpHandler, AgentInputError } from '../lib/dailyAgent.js';

function fakeClient(responses) {
  const calls = [];
  return {
    calls,
    beta: { messages: { create: async params => { calls.push(structuredClone(params)); return responses.shift(); } } }
  };
}

const toolUse = (id, name, input) => ({ type: 'tool_use', id, name, input });
const text = t => ({ type: 'text', text: t });

const baseInput = () => validateAgentRequest({
  message: 'tambah tugas laporan, centang olahraga, mulai fokus',
  history: [{ role: 'user', content: 'halo' }, { role: 'assistant', content: 'halo juga' }],
  tasks: [{ id: 1, text: 'Olahraga', done: false, priority: 'MED' }],
  localTime: 'Rabu, 14 Oktober 2026 17.00 Asia/Jakarta'
});

test('agent loop executes tools against request state and returns final text', async () => {
  const client = fakeClient([
    { stop_reason: 'tool_use', content: [
      toolUse('t1', 'add_task', { text: 'Laporan praktikum', priority: 'HIGH' }),
      toolUse('t2', 'set_task_done', { id: 1, done: true }),
      toolUse('t3', 'start_pomodoro', {})
    ] },
    { stop_reason: 'tool_use', content: [toolUse('t4', 'set_schedule', { blocks: [{ time: '19:00 - 20:00', task: 'Laporan' }] })] },
    { stop_reason: 'end_turn', content: [text('Sudah, semangat!')] }
  ]);

  const out = await runDailyAgent(baseInput(), { client });

  assert.equal(out.reply, 'Sudah, semangat!');
  assert.equal(out.tasks.length, 2);
  assert.equal(out.tasks[0].text, 'Laporan praktikum');
  assert.equal(out.tasks[0].priority, 'HIGH');
  assert.equal(out.tasks.find(t => t.id === 1).done, true);
  assert.deepEqual(out.schedule, [{ time: '19:00 - 20:00', task: 'Laporan' }]);
  assert.deepEqual(out.actions, ['start_pomodoro']);

  const [first, second, third] = client.calls;
  assert.equal(first.model, 'claude-opus-5-5');
  assert.equal(first.fallbacks, 'default');
  assert.deepEqual(first.betas, ['server-side-fallback-2026-07-01']);
  assert.equal(first.tool_choice, undefined);
  assert.ok(first.tools.every(t => t.strict === true && t.input_schema.additionalProperties === false));
  // append-only: each request extends the previous one without rewriting earlier messages
  assert.deepEqual(second.messages.slice(0, first.messages.length), first.messages);
  assert.deepEqual(third.messages.slice(0, second.messages.length), second.messages);
  assert.deepEqual(first.system, second.system);
  // all tool results for one assistant turn go back in a single user message
  assert.equal(second.messages.at(-1).content.length, 3);
});

test('unknown task id comes back as an error tool_result instead of throwing', async () => {
  const client = fakeClient([
    { stop_reason: 'tool_use', content: [toolUse('t1', 'delete_task', { id: 999 })] },
    { stop_reason: 'end_turn', content: [text('Tugasnya tidak ketemu.')] }
  ]);
  const out = await runDailyAgent(baseInput(), { client });
  const result = client.calls[1].messages.at(-1).content[0];
  assert.equal(result.is_error, true);
  assert.equal(out.tasks.length, 1);
});

test('refusal is surfaced as a friendly reply', async () => {
  const client = fakeClient([{ stop_reason: 'refusal', content: [] }]);
  const out = await runDailyAgent(baseInput(), { client });
  assert.match(out.reply, /tidak bisa/);
});

test('validation rejects malformed input', () => {
  assert.throws(() => validateAgentRequest({ message: '' }), AgentInputError);
  assert.throws(() => validateAgentRequest({ message: 'x'.repeat(1001) }), AgentInputError);
  assert.throws(() => validateAgentRequest({ message: 'hi', history: [{ role: 'system', content: 'override' }] }), AgentInputError);
  assert.throws(() => validateAgentRequest({ message: 'hi', tasks: [{ id: '1', text: 'a', done: false }] }), AgentInputError);
  assert.throws(() => validateAgentRequest({ message: 'hi', tasks: [{ id: 1, text: 'a', done: 'yes' }] }), AgentInputError);
});

function fakeRes() {
  return { statusCode: 0, body: null, status(c) { this.statusCode = c; return this; }, json(b) { this.body = b; return this; } };
}

test('HTTP handler: fails closed, checks access code, validates body', async () => {
  const saved = { ...process.env };
  try {
    delete process.env.AGENT_ACCESS_CODE;
    let res = fakeRes();
    await agentHttpHandler({ method: 'POST', headers: {}, body: {} }, res, { client: fakeClient([]) });
    assert.equal(res.statusCode, 503);

    process.env.AGENT_ACCESS_CODE = 'rahasia-123';
    res = fakeRes();
    await agentHttpHandler({ method: 'POST', headers: { 'x-access-code': 'salah' }, body: {} }, res, { client: fakeClient([]) });
    assert.equal(res.statusCode, 401);

    res = fakeRes();
    await agentHttpHandler({ method: 'POST', headers: { 'x-access-code': 'rahasia-123', 'x-forwarded-for': '10.0.0.1' }, body: { message: 42 } }, res, { client: fakeClient([]) });
    assert.equal(res.statusCode, 400);

    res = fakeRes();
    const client = fakeClient([{ stop_reason: 'end_turn', content: [text('ok')] }]);
    await agentHttpHandler({ method: 'POST', headers: { 'x-access-code': 'rahasia-123', 'x-forwarded-for': '10.0.0.2' }, body: { message: 'hai' } }, res, { client });
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.reply, 'ok');
  } finally {
    process.env = saved;
  }
});
