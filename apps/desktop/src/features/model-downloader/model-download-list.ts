import { type ModelDownloadInfo, toList } from "@models/_shared"
import { gpt4AllModelMap } from "@models/gpt4all"
import { guanacoModelMap } from "@models/guanaco"
import { mptModelMap } from "@models/mpt"

export const modelList: ModelDownloadInfo[] = [
  ...toList(guanacoModelMap),
  ...toList(mptModelMap),
  ...toList(gpt4AllModelMap)
]

export const modelMap = modelList.reduce((acc, model) => {
  acc[model.blake3] = {
    ...model
  }
  return acc
}, {}) as Record<string, ModelDownloadInfo>
