import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runDailyAgent, validateAgentRequest, agentHttpHandler, AgentInputError } from '../lib/dailyAgent.js';

// Minimal stand-in for GoogleGenAI: each scripted turn is { calls: [...] } or { text } or { blocked }.
function fakeClient(turns) {
  const requests = [];
  return {
    requests,
    models: {
      generateContent: async params => {
        requests.push(structuredClone(params));
        const turn = turns.shift();
        if (turn.blocked) return { promptFeedback: { blockReason: 'SAFETY' }, candidates: [] };
        const parts = turn.calls
          ? turn.calls.map((c, i) => ({ functionCall: { id: `c${requests.length}-${i}`, ...c }, thoughtSignature: `sig-${requests.length}-${i}` }))
          : [{ text: turn.text }];
        return {
          candidates: [{ content: { role: 'model', parts }, finishReason: 'STOP' }],
          functionCalls: turn.calls ? parts.map(p => p.functionCall) : undefined,
          text: turn.text
        };
      }
    }
  };
}

const baseInput = () => validateAgentRequest({
  message: 'tambah tugas laporan, centang olahraga, mulai fokus',
  history: [{ role: 'user', content: 'halo' }, { role: 'assistant', content: 'halo juga' }],
  tasks: [{ id: 1, text: 'Olahraga', done: false, priority: 'MED' }],
  localTime: 'Rabu, 14 Oktober 2026 17.00 Asia/Jakarta'
});

test('agent loop executes function calls against request state and returns final text', async () => {
  const client = fakeClient([
    { calls: [
      { name: 'add_task', args: { text: 'Laporan praktikum', priority: 'HIGH' } },
      { name: 'set_task_done', args: { id: 1, done: true } },
      { name: 'start_pomodoro', args: {} }
    ] },
    { calls: [{ name: 'set_schedule', args: { blocks: [{ time: '19:00 - 20:00', task: 'Laporan' }] } }] },
    { text: 'Sudah, semangat!' }
  ]);

  const out = await runDailyAgent(baseInput(), { client });

  assert.equal(out.reply, 'Sudah, semangat!');
  assert.equal(out.tasks.length, 2);
  assert.equal(out.tasks[0].text, 'Laporan praktikum');
  assert.equal(out.tasks[0].priority, 'HIGH');
  assert.equal(out.tasks.find(t => t.id === 1).done, true);
  assert.deepEqual(out.schedule, [{ time: '19:00 - 20:00', task: 'Laporan' }]);
  assert.deepEqual(out.actions, ['start_pomodoro']);

  const [first, second, third] = client.requests;
  assert.equal(first.contents[0].role, 'user');
  assert.equal(first.contents[1].role, 'model');
  assert.ok(first.config.tools[0].functionDeclarations.some(d => d.name === 'add_task'));
  // append-only, and the model turn is replayed unchanged (thought signatures preserved)
  assert.deepEqual(second.contents.slice(0, first.contents.length), first.contents);
  assert.deepEqual(third.contents.slice(0, second.contents.length), second.contents);
  assert.equal(second.contents.at(-2).parts[0].thoughtSignature, 'sig-1-0');
  // all function responses for one model turn go back in a single user turn, matched by id
  const responses = second.contents.at(-1).parts.map(p => p.functionResponse);
  assert.deepEqual(responses.map(r => r.id), ['c1-0', 'c1-1', 'c1-2']);
});

test('invalid function args and unknown ids come back as errors instead of throwing', async () => {
  const client = fakeClient([
    { calls: [
      { name: 'delete_task', args: { id: 999 } },
      { name: 'add_task', args: { text: 'x', priority: 'URGENT' } },
      { name: 'set_task_done', args: { id: 1, done: 'yes' } }
    ] },
    { text: 'Ada yang gagal.' }
  ]);
  const out = await runDailyAgent(baseInput(), { client });
  const responses = client.requests[1].contents.at(-1).parts.map(p => p.functionResponse.response);
  assert.ok(responses.every(r => r.error));
  assert.equal(out.tasks.length, 1);
  assert.equal(out.tasks[0].done, false);
});

test('blocked prompt is surfaced as a friendly reply', async () => {
  const out = await runDailyAgent(baseInput(), { client: fakeClient([{ blocked: true }]) });
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
    await agentHttpHandler({ method: 'POST', headers: { 'x-access-code': 'rahasia-123', 'x-forwarded-for': '10.0.0.2' }, body: { message: 'hai' } }, res, { client: fakeClient([{ text: 'ok' }]) });
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.reply, 'ok');
  } finally {
    process.env = saved;
  }
});
