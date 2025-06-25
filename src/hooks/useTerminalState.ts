"use client"

import { useState, useCallback } from "react"
import type { TerminalState, Process } from "../types/filesystem"
import { createInitialFileSystem } from "../utils/filesystem"

export const useTerminalState = () => {
  const [state, setState] = useState<TerminalState>({
    currentPath: ["home", "user"],
    fileSystem: createInitialFileSystem(),
    environment: {
      HOME: "/home/user",
      PATH: "/usr/local/bin:/usr/bin:/bin",
      USER: "user",
      SHELL: "/bin/bash",
      PWD: "/home/user",
    },
    user: "user",
    hostname: "vibe-terminal",
    processes: [
      { pid: 1, name: "init", status: "running", cpu: 0.1, memory: 2.1 },
      { pid: 123, name: "bash", status: "running", cpu: 0.0, memory: 1.2 },
      { pid: 456, name: "vibe-terminal", status: "running", cpu: 0.5, memory: 15.3 },
    ],
  })

  const updateState = useCallback((updates: Partial<TerminalState>) => {
    setState((prev) => ({ ...prev, ...updates }))
  }, [])

  const updateEnvironment = useCallback((key: string, value: string) => {
    setState((prev) => ({
      ...prev,
      environment: { ...prev.environment, [key]: value },
    }))
  }, [])

  const addProcess = useCallback((process: Omit<Process, "pid">) => {
    setState((prev) => ({
      ...prev,
      processes: [...prev.processes, { ...process, pid: Math.floor(Math.random() * 10000) + 1000 }],
    }))
  }, [])

  return {
    state,
    updateState,
    updateEnvironment,
    addProcess,
  }
}
