'use client'

import { useEffect, useState } from 'react'
import { TASKS } from './LoadingTasks'

const TOTAL_DURATION = 11000 // ms — total sequence

export function useStartupController() {
  const [progress, setProgress]       = useState(0)
  const [taskIndex, setTaskIndex]     = useState(-1)
  const [msgIndex, setMsgIndex]       = useState(0)
  const [finished, setFinished]       = useState(false)

  const taskCount = TASKS.length

  useEffect(() => {
    const start = performance.now()

    // ── Progress & message ticker ───────────────────────────────────────────
    let raf: number
    const tick = (now: number) => {
      const elapsed = now - start
      const pct = Math.min((elapsed / TOTAL_DURATION) * 100, 100)
      setProgress(pct)

      // message index cycles every ~1100ms
      const mIdx = Math.min(Math.floor(elapsed / 1100), 9)
      setMsgIndex(mIdx)

      if (pct < 100) {
        raf = requestAnimationFrame(tick)
      } else {
        setProgress(100)
        setFinished(true)
      }
    }
    raf = requestAnimationFrame(tick)

    // ── Task sequencing ─────────────────────────────────────────────────────
    // Spread tasks evenly across TOTAL_DURATION, starting after 600ms
    const taskInterval = (TOTAL_DURATION - 600) / taskCount
    const timers: ReturnType<typeof setTimeout>[] = []

    for (let i = 0; i < taskCount; i++) {
      const t = setTimeout(() => setTaskIndex(i), 600 + i * taskInterval)
      timers.push(t)
    }

    return () => {
      cancelAnimationFrame(raf)
      timers.forEach(clearTimeout)
    }
  }, [taskCount])

  return { progress, taskIndex, msgIndex, finished }
}
