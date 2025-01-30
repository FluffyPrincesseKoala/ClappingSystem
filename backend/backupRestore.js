const { exec } = require('child_process')
require('dotenv').config()

// Database credentials from environment variables
const {
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_HOST = 'localhost',
  DB_PORT = 5432,
} = process.env

// Generate a timestamped filename
const generateFilename = (action) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  return `backup-${DB_NAME}-${action}-${timestamp}.sql`
}

// Backup the database
const backupDatabase = () => {
  const backupFile = generateFilename('backup')
  const command = `PGPASSWORD=${DB_PASSWORD} pg_dump -U ${DB_USER} -h ${DB_HOST} -p ${DB_PORT} -F c -b -v -f ${backupFile} ${DB_NAME}`

  console.log(`Starting database backup: ${backupFile}`)
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Backup failed: ${error.message}`)
      return
    }
    console.log(`Backup completed successfully: ${backupFile}`)
    console.log(stderr)
  })
}

// Restore the database
const restoreDatabase = (backupFile) => {
  const command = `PGPASSWORD=${DB_PASSWORD} pg_restore -U ${DB_USER} -h ${DB_HOST} -p ${DB_PORT} -d ${DB_NAME} -v ${backupFile}`

  console.log(`Starting database restore from: ${backupFile}`)
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Restore failed: ${error.message}`)
      return
    }
    console.log(`Restore completed successfully from: ${backupFile}`)
    console.log(stderr)
  })
}

// Script actions
const action = process.argv[2] // 'backup' or 'restore'
const file = process.argv[3] // Filename for restore

if (action === 'backup') {
  backupDatabase()
} else if (action === 'restore') {
  if (!file) {
    console.error('Please specify the backup file to restore.')
    process.exit(1)
  }
  restoreDatabase(file)
} else {
  console.error('Unknown action. Use "backup" or "restore".')
  process.exit(1)
}
