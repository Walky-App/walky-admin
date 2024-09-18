import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

try {
  const gitLog = execSync(
    'git log --pretty=format:"### %ad%n- **Message:** %s%n- **Commit:** %h%n" --date=short',
  ).toString()
  const changelogPath = path.join(__dirname, 'CHANGELOG.md')
  fs.writeFileSync(changelogPath, gitLog)
} catch (error) {
  // eslint-disable-next-line no-undef
  console.error('Error while generating changelog:', error)
}
