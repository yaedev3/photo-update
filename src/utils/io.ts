import fs from 'fs-extra'

const inputPath = 'input'
const output = 'output'

const getInputFilePath = (file: string) => `${inputPath}/${file}.txt`
const getOutputFilePath = (file: string) => `${output}/${file}.json`

const readInputFile = (file: string): string[] => {
  try {
    const inputPath = getInputFilePath(file)
    return fs
      .readFileSync(inputPath, 'utf-8')
      .split('\n')
      .map((f) => f.replace('\r', ''))
  } catch {
    return []
  }
}

const readOutputFile = <T>(file: string): T => {
  const outputPath = getOutputFilePath(file)
  return fs.readJsonSync(outputPath)
}

const checkIfOutputFileExists = (file: string): boolean => {
  const outputPath = getOutputFilePath(file)
  return fs.existsSync(outputPath)
}

const writeOutputFile = (file: string, data: any): void => {
  const outputPath = getOutputFilePath(file)
  fs.writeJsonSync(outputPath, data, { spaces: 2 })
}

export default {
  readInputFile,
  readOutputFile,
  checkIfOutputFileExists,
  writeOutputFile,
}
