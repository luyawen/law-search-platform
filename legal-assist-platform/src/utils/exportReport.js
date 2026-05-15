export function downloadTextFile(filename, content, mime = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export function buildProcessReport({ processList, results, meta = {} }) {
  const lines = []
  const now = new Date()
  const dateStr = now.toLocaleString('zh-CN', { hour12: false })

  lines.push('标准流程执行报告')
  lines.push('='.repeat(48))
  lines.push(`生成时间：${dateStr}`)
  if (meta.operator) lines.push(`执行人：${meta.operator}`)
  if (meta.department) lines.push(`部门：${meta.department}`)
  lines.push('')

  let passCount = 0
  let failCount = 0
  let pendingCount = 0

  processList.forEach((item, index) => {
    const status = results[item.id]
    let label = '未评定'
    if (status === 'pass') {
      label = '通过'
      passCount++
    } else if (status === 'fail') {
      label = '不通过'
      failCount++
    } else {
      pendingCount++
    }

    lines.push(`${index + 1}. ${item.name}`)
    lines.push(`   结果：${label}`)
    lines.push(`   说明：${item.description}`)
    lines.push(`   判定标准：${item.standard}`)
    lines.push('')
  })

  lines.push('-'.repeat(48))
  lines.push(`合计：${processList.length} 项 | 通过 ${passCount} | 不通过 ${failCount} | 未评定 ${pendingCount}`)
  lines.push('')
  lines.push('本报告由法律法规辅助平台自动生成（原型演示）。')

  return lines.join('\n')
}
