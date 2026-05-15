const PDFJS_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174'

let pdfjsLoading = null

/**
 * 通过 CDN 加载 pdf.js（不依赖 npm 包，避免 Vite 无法 resolve pdfjs-dist）
 */
function loadPdfJsLib() {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('PDF 解析仅支持浏览器环境'))
  }
  if (window.pdfjsLib?.getDocument) {
    return Promise.resolve(window.pdfjsLib)
  }
  if (pdfjsLoading) return pdfjsLoading

  pdfjsLoading = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-pdfjs-cdn]')
    if (existing) {
      existing.addEventListener('load', () => resolve(window.pdfjsLib))
      existing.addEventListener('error', () => reject(new Error('PDF.js 脚本加载失败')))
      return
    }

    const script = document.createElement('script')
    script.src = `${PDFJS_CDN}/pdf.min.js`
    script.dataset.pdfjsCdn = 'true'
    script.async = true
    script.onload = () => {
      const lib = window.pdfjsLib
      if (!lib) {
        reject(new Error('PDF.js 未正确初始化'))
        return
      }
      lib.GlobalWorkerOptions.workerSrc = `${PDFJS_CDN}/pdf.worker.min.js`
      resolve(lib)
    }
    script.onerror = () => reject(new Error('无法加载 PDF.js，请检查网络后重试'))
    document.head.appendChild(script)
  })

  return pdfjsLoading
}

/**
 * 从本地 PDF 文件提取纯文本
 * @param {File} file
 * @returns {Promise<string>}
 */
export async function extractTextFromPdf(file) {
  const pdfjsLib = await loadPdfJsLib()
  const data = new Uint8Array(await file.arrayBuffer())
  const pdf = await pdfjsLib.getDocument({ data }).promise
  const parts = []

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum += 1) {
    const page = await pdf.getPage(pageNum)
    const textContent = await page.getTextContent()
    const pageText = textContent.items
      .map((item) => ('str' in item ? item.str : ''))
      .join('')
    if (pageText.trim()) parts.push(pageText.trim())
  }

  return parts.join('\n\n')
}

export function isPdfFile(file) {
  if (!file) return false
  const name = file.name?.toLowerCase() || ''
  return file.type === 'application/pdf' || name.endsWith('.pdf')
}
