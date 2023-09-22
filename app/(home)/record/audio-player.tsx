import { DMMono } from '@/app/fonts'
import STKAudioPlayer from "@/app/components/STKAudioPlayer/STKAudioPlayer";


export default function AudioPlayerX({ src }: { src: string }) {
  return (
    <div className={DMMono.className} key={src}>
        <STKAudioPlayer src={src} />
    </div>
  )
}
