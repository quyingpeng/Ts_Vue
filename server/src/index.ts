/*
 * @Author: qyp
 * @Date: 2026-07-02 12:23:51
 * @LastEditors: qyp
 * @LastEditTime: 2026-07-10 22:25:33
 * @Description: 登录接口
 */
import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import db from './db'

const app = express()
const PORT = 3000
const JWT_SECRET = 'my-secret-key-2024'

// 中间件
app.use(cors())
app.use(express.json({ limit: '10mb' })) 

// ====== 登录接口 ======
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.json({ code: 400, message: '用户名和密码不能为空', data: null })
  }

  // 查数据库
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as any
  if (!user || user.password !== password) {
    return res.json({ code: 401, message: '用户名或密码错误', data: null })
  }

  // 生成 token（有效期 7 天）
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  )

  // 去掉密码再返回
  const { password: _, ...userWithoutPassword } = user
  res.json({
    code: 200,
    message: '登录成功',
    data: { token, user: userWithoutPassword }
  })
})

// ====== 获取当前用户 ======
app.get('/api/auth/me', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    return res.json({ code: 401, message: '未登录', data: null })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(decoded.id) as any
    if (!user) {
      return res.json({ code: 404, message: '用户不存在', data: null })
    }

    const { password: _, ...userWithoutPassword } = user
    res.json({ code: 200, message: 'ok', data: userWithoutPassword })
  } catch {
    res.json({ code: 401, message: 'token 无效或已过期', data: null })
  }
})

// ====== 鉴权中间件 ======
const authMiddleware = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    return res.json({ code: 401, message: '未登录', data: null })
  }
  try {
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    return res.json({ code: 401, message: 'token 无效', data: null })
  }
}

// ====== 用户列表（分页 + 搜索） ======
app.get('/api/users', authMiddleware, (req: any, res) => {
  const page = parseInt(req.query.page) || 1
  const pageSize = parseInt(req.query.pageSize) || 10
  const keyword = req.query.keyword || ''
  const offset = (page - 1) * pageSize

  let whereClause = ''
  const params: any[] = []
  if (keyword) {
    whereClause = 'WHERE username LIKE ? OR nickname LIKE ?'
    params.push(`%${keyword}%`, `%${keyword}%`)
  }

  const total = db.prepare(`SELECT COUNT(*) as count FROM users ${whereClause}`).get(...params) as any
  const list = db.prepare(`SELECT id, username, nickname, email, role, status, avatar, createdAt FROM users ${whereClause} ORDER BY id DESC LIMIT ? OFFSET ?`).all(...params, pageSize, offset)

  res.json({
    code: 200,
    message: 'ok',
    data: { list, total: total.count, page, pageSize }
  })
})

// ====== 新增用户 ======
app.post('/api/users', authMiddleware, (req: any, res) => {
  const { username, password, nickname, email, role } = req.body
  if (!username || !password) {
    return res.json({ code: 400, message: '用户名和密码必填', data: null })
  }

  try {
    const result = db.prepare(
      'INSERT INTO users (username, password, nickname, email, role) VALUES (?, ?, ?, ?, ?)'
    ).run(username, password, nickname || '', email || '', role || 'viewer')
    
    const newUser = db.prepare('SELECT id, username, nickname, email, role, status, avatar, createdAt FROM users WHERE id = ?').get(result.lastInsertRowid)
    res.json({ code: 200, message: '创建成功', data: newUser })
  } catch (err: any) {
    res.json({ code: 400, message: err.message.includes('UNIQUE') ? '用户名已存在' : err.message, data: null })
  }
})

// ====== 编辑用户 ======
app.put('/api/users/:id', authMiddleware, (req: any, res) => {
  const { nickname, email, role, status, password } = req.body
  const id = req.params.id

  const sets: string[] = []
  const params: any[] = []
  if (nickname !== undefined) { sets.push('nickname = ?'); params.push(nickname) }
  if (email !== undefined) { sets.push('email = ?'); params.push(email) }
  if (role !== undefined) { sets.push('role = ?'); params.push(role) }
  if (status !== undefined) { sets.push('status = ?'); params.push(status) }
  if (password) { sets.push('password = ?'); params.push(password) }

  if (sets.length === 0) {
    return res.json({ code: 400, message: '没有要更新的字段', data: null })
  }

  params.push(id)
  db.prepare(`UPDATE users SET ${sets.join(', ')} WHERE id = ?`).run(...params)
  const updated = db.prepare('SELECT id, username, nickname, email, role, status, avatar, createdAt FROM users WHERE id = ?').get(id)
  res.json({ code: 200, message: '更新成功', data: updated })
})

// ====== 删除用户 ======
app.delete('/api/users/:id', authMiddleware, (req: any, res) => {
  db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id)
  res.json({ code: 200, message: '删除成功', data: null })
})

// 获取单个用户
app.get('/api/users/:id', authMiddleware, (req: any, res) => {
  const user = db.prepare(
    'SELECT id, username, nickname, email, role, status, avatar, createdAt FROM users WHERE id = ?'
  ).get(req.params.id)

  if (!user) {
    return res.json({ code: 404, message: '用户不存在', data: null })
  }
  res.json({ code: 200, message: 'ok', data: user })
})

app.listen(PORT, () => {
  console.log(`后端服务已启动: http://localhost:${PORT}`)
})

// fetch('http://localhost:3000/api/auth/login', {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' },
//   body: JSON.stringify({ username: 'admin', password: 'admin123' })
// })
// .then(r => r.json())
// .then(console.log)