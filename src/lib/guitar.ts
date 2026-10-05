/**
 * Violão sintetizado com Web Audio (Karplus-Strong): cada corda é um buffer de ruído que realimenta
 * a si mesmo com um filtro passa-baixa. Soa parecido com corda de aço e dispensa arquivo de áudio.
 */

/** Cordas soltas (E2 A2 D3 G3 B3 E4) em Hz. */
const OPEN = [82.41, 110, 146.83, 196, 246.94, 329.63]

export type Chord = { name: string; frets: number[] }

/** Casas por corda (grave → aguda); -1 = corda abafada. */
export const CHORDS: Chord[] = [
  { name: 'G', frets: [3, 2, 0, 0, 0, 3] },
  { name: 'D', frets: [-1, -1, 0, 2, 3, 2] },
  { name: 'Em', frets: [0, 2, 2, 0, 0, 0] },
  { name: 'C', frets: [-1, 3, 2, 0, 1, 0] },
  { name: 'Am', frets: [-1, 0, 2, 2, 1, 0] },
  { name: 'Bm', frets: [-1, 2, 4, 4, 3, 2] },
  { name: 'E', frets: [0, 2, 2, 1, 0, 0] },
  { name: 'A', frets: [-1, 0, 2, 2, 2, 0] },
]

export class Guitar {
  private ctx: AudioContext | null = null
  private out: GainNode | null = null
  private cache = new Map<number, AudioBuffer>()

  private ensure() {
    if (!this.ctx) {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      this.ctx = new Ctx()
      const tone = this.ctx.createBiquadFilter()
      tone.type = 'lowpass'
      tone.frequency.value = 3600
      this.out = this.ctx.createGain()
      this.out.gain.value = 0.55
      // "corpo" do violão: um leve realce nos médios-graves
      const body = this.ctx.createBiquadFilter()
      body.type = 'peaking'
      body.frequency.value = 180
      body.gain.value = 4
      this.out.connect(body).connect(tone).connect(this.ctx.destination)
    }
    if (this.ctx.state === 'suspended') this.ctx.resume()
    return this.ctx
  }

  private buffer(freq: number) {
    const ctx = this.ensure()
    const key = Math.round(freq * 100)
    const hit = this.cache.get(key)
    if (hit) return hit
    const sr = ctx.sampleRate
    const length = Math.floor(sr * 2.4)
    const buf = ctx.createBuffer(1, length, sr)
    const data = buf.getChannelData(0)
    const period = Math.max(2, Math.round(sr / freq))
    const ring = new Float32Array(period)
    for (let i = 0; i < period; i++) ring[i] = Math.random() * 2 - 1
    // cordas graves sustentam mais
    const decay = 0.994 + Math.min(0.0045, (110 / freq) * 0.003)
    for (let i = 0; i < length; i++) {
      const j = i % period
      const next = ring[(j + 1) % period]
      data[i] = ring[j]
      ring[j] = decay * 0.5 * (ring[j] + next)
    }
    this.cache.set(key, buf)
    return buf
  }

  /** Toca a corda `string` (0 = mais grave) do acorde; devolve false se ela estiver abafada. */
  pluck(chord: Chord, string: number, delay = 0, velocity = 1) {
    const fret = chord.frets[string]
    if (fret < 0) return false
    const ctx = this.ensure()
    const src = ctx.createBufferSource()
    src.buffer = this.buffer(OPEN[string] * Math.pow(2, fret / 12))
    const g = ctx.createGain()
    const t = ctx.currentTime + delay
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(0.32 * velocity, t + 0.006)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 2.3)
    src.connect(g).connect(this.out!)
    src.start(t)
    src.stop(t + 2.4)
    return true
  }

  /** Batida completa (para baixo: grave → aguda). */
  strum(chord: Chord, down = true) {
    const order = down ? [0, 1, 2, 3, 4, 5] : [5, 4, 3, 2, 1, 0]
    let k = 0
    for (const s of order) if (this.pluck(chord, s, k * 0.018, 0.85)) k++
  }
}
