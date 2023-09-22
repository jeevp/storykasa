import { DMMono } from '@/app/fonts'
import { Flex, Text } from '@radix-ui/themes'
import STKAudioPlayer from "@/app/components/STKAudioPlayer/STKAudioPlayer";
export default function AudioPreview({ src }: { src: string }) {
  return (
    <Flex className={DMMono.className + ' preview-container'} justify="between">
      <STKAudioPlayer src={src} />
    </Flex>
  )
}
