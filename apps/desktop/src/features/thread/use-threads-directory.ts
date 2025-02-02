import { useCallback, useState } from "react"

import { useInit } from "~features/inference-server/use-init"
import { InvokeCommand, invoke } from "~features/invoke"
import type { FileInfo } from "~features/model-downloader/model-file"

export const useThreadsDirectory = () => {
  const [threadsDirectory, setThreadsDirectory] = useState("")
  const [threads, setThreads] = useState<FileInfo[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  useInit(async () => {
    // get the models directory saved in config
    const resp = await invoke(InvokeCommand.InitializeThreadsDir)
    if (!resp) {
      return
    }
    setThreadsDirectory(resp.path)
    setThreads(resp.files)
  })

  const updateThreadsDirectory = useCallback(
    async (dir = threadsDirectory) => {
      setIsRefreshing(true)
      const resp = await invoke(InvokeCommand.UpdateThreadsDir, {
        dir
      })
      setThreadsDirectory(resp.path)
      setThreads(resp.files)
      setIsRefreshing(false)
      return resp
    },
    [threadsDirectory]
  )

  const removeThread = useCallback(async (thread: FileInfo) => {
    await invoke(InvokeCommand.DeleteThreadFile, {
      path: thread.path
    })
  }, [])

  const renameThread = useCallback(
    async (thread: FileInfo, newName: string) => {
      return invoke(InvokeCommand.RenameThreadFile, {
        path: thread.path,
        newName
      })
    },
    []
  )

  const createThread = useCallback(async () => {
    return invoke(InvokeCommand.CreateThreadFile)
  }, [])

  return {
    threads,
    threadsDirectory,
    isRefreshing,
    updateThreadsDirectory,
    removeThread,
    createThread,
    renameThread
  }
}
