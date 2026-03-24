import fs from 'fs/promises'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')

export async function readJson<T>(filename: string): Promise<T> {
  const filepath = path.join(DATA_DIR, filename)
  const raw = await fs.readFile(filepath, 'utf-8')
  return JSON.parse(raw) as T
}

export async function writeJson<T>(filename: string, data: T): Promise<void> {
  const filepath = path.join(DATA_DIR, filename)
  const tmp = filepath + '.tmp'
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), 'utf-8')
  await fs.rename(tmp, filepath)
}
