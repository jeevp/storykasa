export const initials = (str: string) => {
  return str
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
}

export const resizeImage = async (file: Blob, size: number) => {
  size ??= 256
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = size
  canvas.height = size
  const bitmap = await createImageBitmap(file)
  const { width, height } = bitmap
  const ratio = Math.max(size / width, size / height)
  const x = (size - width * ratio) / 2
  const y = (size - height * ratio) / 2

  ctx?.drawImage(
    bitmap,
    0,
    0,
    width,
    height,
    x,
    y,
    width * ratio,
    height * ratio
  )

  return new Promise<Blob>((resolve) => {
    canvas.toBlob(
      (blob) => {
        resolve(blob as Blob)
      },
      'image/webp',
      1
    )
  })
}
