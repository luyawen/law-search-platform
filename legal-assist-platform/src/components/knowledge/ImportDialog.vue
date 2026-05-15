<script setup>
import { ref } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
function isPdfFile(file) {
  if (!file) return false
  const name = file.name?.toLowerCase() || ''
  return file.type === 'application/pdf' || name.endsWith('.pdf')
}

defineProps({
  modelValue: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue', 'success'])

const uploading = ref(false)
const fileList = ref([])

function close() {
  emit('update:modelValue', false)
  fileList.value = []
}

function handleChange(file) {
  fileList.value = [file]
}

function handleRemove() {
  fileList.value = []
}

async function readFileContent(rawFile) {
  if (isPdfFile(rawFile)) {
    const { extractTextFromPdf } = await import('@/utils/pdfParser')
    return extractTextFromPdf(rawFile)
  }
  const name = rawFile.name?.toLowerCase() || ''
  if (name.endsWith('.txt') || rawFile.type.startsWith('text/')) {
    return rawFile.text()
  }
  return ''
}

async function submitUpload() {
  if (!fileList.value.length) {
    ElMessage.warning('请先选择或拖拽文件')
    return
  }

  const uploadFile = fileList.value[0]
  const rawFile = uploadFile.raw ?? uploadFile

  uploading.value = true
  let content = ''
  const title = rawFile.name?.replace(/\.[^.]+$/, '') || '新导入文档'

  try {
    if (isPdfFile(rawFile)) {
      ElMessage.info('正在解析 PDF 正文，请稍候…')
      content = await readFileContent(rawFile)
      if (!content.trim()) {
        ElMessage.warning('未能从 PDF 中提取到文本，可能为扫描件')
        content = `【PDF 导入】\n\n文件「${rawFile.name}」已导入，但未能识别可检索文本（可能为图片型 PDF）。\n\n请人工补充正文或上传可复制文本的 PDF。`
      }
    } else {
      await new Promise((r) => setTimeout(r, 600))
      content = await readFileContent(rawFile)
      if (!content.trim()) {
        content = `【导入说明】\n\n本记录由文件「${rawFile.name}」导入。\n\n当前格式暂不支持自动提取正文（仅 PDF/TXT 可解析），请于详情中人工校对。`
      }
    }
  } catch (err) {
    console.error(err)
    const msg = String(err?.message || err)
    if (msg.includes('PDF.js') || msg.includes('网络')) {
      ElMessage.error(msg)
    } else {
      ElMessage.error('文件解析失败，请确认 PDF 可复制文字且网络正常')
    }
    uploading.value = false
    return
  }

  uploading.value = false
  emit('success', {
    fileName: rawFile.name,
    title,
    content,
    isPdf: isPdfFile(rawFile),
  })
  ElMessage.success(
    isPdfFile(rawFile) ? 'PDF 导入成功，正文已解析入库' : '导入成功，已加入知识库列表',
  )
  close()
}
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    title="导入法律法规文档"
    width="520px"
    destroy-on-close
    @update:model-value="emit('update:modelValue', $event)"
    @close="close"
  >
    <el-upload
      class="upload-zone"
      drag
      :auto-upload="false"
      :limit="1"
      accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
      :file-list="fileList"
      :on-change="handleChange"
      :on-remove="handleRemove"
    >
      <el-icon class="upload-icon"><UploadFilled /></el-icon>
      <div class="upload-tip">将文件拖到此处，或<em>点击上传</em></div>
      <template #tip>
        <div class="upload-hint">
          支持 PDF、TXT 自动提取正文；PDF 通过浏览器加载 pdf.js 解析（需联网，不实际上传服务器）
        </div>
      </template>
    </el-upload>
    <template #footer>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" :loading="uploading" @click="submitUpload">
        确认导入
      </el-button>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.upload-zone {
  width: 100%;

  :deep(.el-upload-dragger) {
    padding: 32px 20px;
    border-radius: 8px;
    border-color: #c5d4e8;
    background: #f8fafc;

    &:hover {
      border-color: #1a4b8c;
    }
  }
}

.upload-icon {
  font-size: 48px;
  color: #1a4b8c;
  margin-bottom: 8px;
}

.upload-tip {
  color: #64748b;
  em {
    color: #1a4b8c;
    font-style: normal;
  }
}

.upload-hint {
  color: #94a3b8;
  font-size: 12px;
  margin-top: 8px;
}
</style>
