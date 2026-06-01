export function getEmbedUrl(url: string): string | null {
  // YouTube: https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID
  const youtubeMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/
  )
  if (youtubeMatch) return `https://www.youtube.com/embed/${youtubeMatch[1]}`

  // Vimeo: https://vimeo.com/VIDEO_ID
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch)
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`

  return null
}

export function getVideoThumbnail(url: string): string | null {
  const youtubeMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/
  )
  if (youtubeMatch)
    return `https://img.youtube.com/vi/${youtubeMatch[1]}/mqdefault.jpg`

  return null
}
