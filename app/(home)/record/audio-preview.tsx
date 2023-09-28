import { DMMono } from '@/app/fonts'
import STKAudioPlayer from "@/app/components/STKAudioPlayer/STKAudioPlayer";
export default function AudioPreview({ src }: { src: string }) {
  return (
    <div className={DMMono.className + ' preview-container flex justify-between'}>
      <STKAudioPlayer src={src} />
    </div>
  )
}
