export function formatDateTime(value?: string) {
  if (!value) return '-'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())
  const hour = pad(date.getHours())
  const minute = pad(date.getMinutes())

  return `${year}-${month}-${day} ${hour}:${minute}`
}

export function formatCronText(cron?: string) {
  if (!cron) return '-'

  const parts = cron.trim().split(/\s+/)

  if (parts.length !== 5) {
    return cron
  }

  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts

  const minuteText = formatMinute(minute)
  const hourText = formatHour(hour)
  const dayText = formatDayOfMonth(dayOfMonth)
  const monthText = formatMonth(month)
  const weekText = formatDayOfWeek(dayOfWeek)

  return [monthText, dayText, weekText, hourText, minuteText]
    .filter(Boolean)
    .join('，')
}

function pad(value: number) {
  return String(value).padStart(2, '0')
}

function formatMinute(value: string) {
  if (value === '*') return '每分钟'

  if (value.includes(',')) {
    return `第 ${value} 分钟`
  }

  if (value.includes('/')) {
    const [start, step] = value.split('/')

    if (start === '*') {
      return `每 ${step} 分钟`
    }

    return `从第 ${start} 分钟开始，每 ${step} 分钟`
  }

  if (value.includes('-')) {
    return `第 ${value} 分钟之间`
  }

  return `第 ${value} 分钟`
}

function formatHour(value: string) {
  if (value === '*') return '每小时'

  if (value.includes(',')) {
    return `${value} 点`
  }

  if (value.includes('/')) {
    const [start, step] = value.split('/')

    if (start === '*') {
      return `每 ${step} 小时`
    }

    return `从 ${start} 点开始，每 ${step} 小时`
  }

  if (value.includes('-')) {
    return `${value} 点之间`
  }

  return `${value} 点`
}

function formatDayOfMonth(value: string) {
  if (value === '*') return '每天'

  if (value.includes(',')) {
    return `每月 ${value} 日`
  }

  if (value.includes('/')) {
    const [start, step] = value.split('/')

    if (start === '*') {
      return `每 ${step} 天`
    }

    return `从每月 ${start} 日开始，每 ${step} 天`
  }

  if (value.includes('-')) {
    return `每月 ${value} 日之间`
  }

  return `每月 ${value} 日`
}

function formatMonth(value: string) {
  if (value === '*') return ''

  if (value.includes(',')) {
    return `${value} 月`
  }

  if (value.includes('/')) {
    const [start, step] = value.split('/')

    if (start === '*') {
      return `每 ${step} 个月`
    }

    return `从 ${start} 月开始，每 ${step} 个月`
  }

  if (value.includes('-')) {
    return `${value} 月之间`
  }

  return `${value} 月`
}

function formatDayOfWeek(value: string) {
  if (value === '*') return ''

  const weekMap: Record<string, string> = {
    '0': '周日',
    '1': '周一',
    '2': '周二',
    '3': '周三',
    '4': '周四',
    '5': '周五',
    '6': '周六',
    '7': '周日'
  }

  if (value.includes(',')) {
    return value
      .split(',')
      .map((item) => weekMap[item] || item)
      .join('、')
  }

  if (value.includes('-')) {
    const [start, end] = value.split('-')

    return `${weekMap[start] || start} 至 ${weekMap[end] || end}`
  }

  return weekMap[value] || value
}