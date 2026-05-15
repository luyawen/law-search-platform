/** 转义 HTML，防止 v-html 注入 */
export function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** 关键词高亮，返回可安全用于 v-html 的字符串 */
export function highlightKeyword(text, keyword) {
  if (!text || !keyword?.trim()) return escapeHtml(text)
  const kw = keyword.trim()
  const escaped = escapeHtml(text)
  const pattern = new RegExp(
    `(${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`,
    'gi',
  )
  return escaped.replace(pattern, '<mark class="search-mark">$1</mark>')
}

export function getDocNumber(row) {
  return row.docNumber || row.docNo || '—'
}

export function getExecuteDate(row) {
  return row.executeDate || row.effectiveDate || '—'
}

export function getDepartment(row) {
  return row.department || '—'
}

/** 是否命中（标题、目录、内文及元数据） */
export function matchesKeyword(row, keyword) {
  const kw = keyword.trim().toLowerCase()
  if (!kw) return true

  const haystack = [
    row.title,
    row.content,
    row.categoryPath,
    getDocNumber(row),
    row.publishDate,
    getExecuteDate(row),
    getDepartment(row),
    row.summary,
    ...(row.keywords || []),
  ]
    .filter(Boolean)
    .join('\n')
    .toLowerCase()

  return haystack.includes(kw)
}

/** 从正文中截取含关键词的 1–2 句上下文 */
export function extractContentSnippet(content, keyword, maxLen = 120) {
  if (!content || !keyword?.trim()) return ''

  const kw = keyword.trim()
  const plain = content.replace(/\s+/g, ' ')
  const lower = plain.toLowerCase()
  const idx = lower.indexOf(kw.toLowerCase())
  if (idx === -1) return ''

  let start = Math.max(0, idx - 40)
  let end = Math.min(plain.length, idx + kw.length + 80)

  if (start > 0) {
    const prevPause = plain.lastIndexOf('。', idx)
    const prevComma = plain.lastIndexOf('；', idx)
    const prevDot = plain.lastIndexOf('.', idx)
    const boundary = Math.max(prevPause, prevComma, prevDot)
    if (boundary > start - 20 && boundary < idx) start = boundary + 1
  }

  if (end < plain.length) {
    const nextPause = plain.indexOf('。', idx + kw.length)
    if (nextPause !== -1 && nextPause < end + 30) end = nextPause + 1
  }

  let snippet = plain.slice(start, end).trim()
  if (start > 0) snippet = `…${snippet}`
  if (end < plain.length) snippet = `${snippet}…`

  if (snippet.length > maxLen) {
    const rel = snippet.toLowerCase().indexOf(kw.toLowerCase())
    const cutStart = Math.max(0, rel - 30)
    snippet =
      (cutStart > 0 ? '…' : '') +
      snippet.slice(cutStart, cutStart + maxLen) +
      (cutStart + maxLen < snippet.length ? '…' : '')
  }

  return snippet
}

/** 为列表项附加检索展示字段 */
export function enrichSearchResult(row, keyword) {
  const kw = keyword.trim()
  const contentHit =
    row.content && kw && row.content.toLowerCase().includes(kw.toLowerCase())

  return {
    ...row,
    _titleHtml: highlightKeyword(row.title, kw),
    _snippetHtml: contentHit
      ? highlightKeyword(extractContentSnippet(row.content, kw), kw)
      : '',
    _hasContentHit: contentHit,
  }
}
