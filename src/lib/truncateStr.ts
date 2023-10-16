export function truncateStr(str: string, length: number) {
  if (str.length <= length) {
    return str
  }
  const truncated = str.slice(0, length).trim()
  if (truncated[truncated.length - 1] === ',') {
    return `${truncated.slice(0, -1)}…`
  }

  return `${truncated}…`
}
