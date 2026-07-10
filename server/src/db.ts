/*
 * @Author: qyp
 * @Date: 2026-07-02 12:22:57
 * @LastEditors: qyp
 * @LastEditTime: 2026-07-02 12:23:09
 * @Description: 初始化数据库
 */
import Database from 'better-sqlite3'
import path from 'path'

const dbPath = path.join(__dirname, '..', 'data.db')
const db = new Database(dbPath)

// 建表
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    nickname TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL DEFAULT '',
    role TEXT NOT NULL DEFAULT 'viewer',
    status TEXT NOT NULL DEFAULT 'active',
    avatar TEXT NOT NULL DEFAULT '',
    createdAt TEXT NOT NULL DEFAULT (datetime('now'))
  )
`)

// 插入默认管理员（密码 admin123，实际项目中加密）
const existing = db.prepare('SELECT id FROM users WHERE username = ?').get('admin')
if (!existing) {
  db.prepare(`
    INSERT INTO users (username, password, nickname, email, role)
    VALUES ('admin', 'admin123', '管理员', 'admin@test.com', 'admin')
  `).run()
  console.log('默认管理员已创建: admin / admin123')
}

export default db