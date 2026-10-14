import { agentHttpHandler } from '../lib/dailyAgent.js';

export default function handler(req, res) {
  return agentHttpHandler(req, res);
}
