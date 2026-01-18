const fs = require('fs');
const path = require('path');

// Helper to write a simple WAV file
function writeWav(filename, frequency, durationMs, type = 'sine') {
  const sampleRate = 44100;
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = (sampleRate * durationMs * numChannels * bitsPerSample) / 8000;
  const chunkSize = 36 + dataSize;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF Chunk
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(chunkSize, 4);
  buffer.write('WAVE', 8);

  // fmt Chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size
  buffer.writeUInt16LE(1, 20); // AudioFormat (PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);

  // data Chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Generate samples
  const volume = 0.5;
  const totalSamples = (sampleRate * durationMs) / 1000;
  
  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    let sample = 0;

    // Simple waveform generation
    if (type === 'sine') {
      sample = Math.sin(2 * Math.PI * frequency * t);
    } else if (type === 'square') {
      sample = Math.sin(2 * Math.PI * frequency * t) > 0 ? 1 : -1;
    } else if (type === 'sawtooth') {
      sample = 2 * (frequency * t - Math.floor(frequency * t + 0.5));
    } else if (type === 'noise') {
      sample = Math.random() * 2 - 1;
    }

    // Envelope (fade in/out to avoid clicking)
    const envelope = Math.min(1, Math.min(i / 1000, (totalSamples - i) / 1000));
    
    // Write 16-bit sample
    const intSample = Math.max(-32768, Math.min(32767, sample * volume * envelope * 32767));
    buffer.writeInt16LE(intSample, 44 + i * 2);
  }

  const outputPath = path.join(__dirname, '../public/sounds', filename);
  fs.writeFileSync(outputPath, buffer);
  console.log(`Generated ${filename}`);
}

// Generate sounds
const sounds = [
  { name: 'success.wav', freq: 880, dur: 400, type: 'sine' },      // High ping
  { name: 'error.wav', freq: 150, dur: 300, type: 'sawtooth' },    // Low buzz
  { name: 'hint.wav', freq: 600, dur: 200, type: 'sine' },         // Subtle ping
  { name: 'gem.wav', freq: 1200, dur: 150, type: 'square' },       // Arcade coin
  { name: 'achievement.wav', freq: 500, dur: 800, type: 'square' },// Fanfare-ish
  { name: 'click.wav', freq: 2000, dur: 50, type: 'noise' },       // Click
];

// Ensure directory exists
const dir = path.join(__dirname, '../public/sounds');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

sounds.forEach(s => writeWav(s.name, s.freq, s.dur, s.type));
