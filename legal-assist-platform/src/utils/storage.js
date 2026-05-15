export function loadProcessResults(key, defaultValue = {}) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return { ...defaultValue }
    return { ...defaultValue, ...JSON.parse(raw) }
  } catch {
    return { ...defaultValue }
  }
}

export function saveProcessResults(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}
