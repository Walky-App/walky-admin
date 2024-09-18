import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

try {
  const gitLog = execSync('git log --pretty=format:"%ad|%s|%h" --date=short').toString()

  const changelogPath = path.join(__dirname, 'public', 'CHANGELOG.md')

  if (!fs.existsSync(path.dirname(changelogPath))) {
    fs.mkdirSync(path.dirname(changelogPath), { recursive: true })
  }

  const formattedLog = gitLog
    .split('\n')
    .map(line => {
      const [date, message, hash] = line.split('|')
      return `
<li key="${hash}" class="rounded border p-2">
  <p class="font-semibold">${date}</p>
  <p>${message}</p>
  <p class="text-sm text-gray-500">Commit: ${hash.substring(0, 7)}</p>
</li>`
    })
    .join('\n')

  const changelogContent = `
<div class="p-4">
  <h1 class="mb-4 text-2xl font-bold">Changelog (API)</h1>
  <ul class="space-y-2">
    ${formattedLog}
  </ul>
</div>`

  fs.writeFileSync(changelogPath, changelogContent)
} catch (error) {
  throw new Error(`Error generating changelog: ${error.message}`)
}
