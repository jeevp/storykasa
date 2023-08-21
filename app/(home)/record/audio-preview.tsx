import { DMMono } from '@/app/fonts'
import { Flex, Text } from '@radix-ui/themes'
import { useEffect } from 'react'
import { AudioPlayer } from 'react-audio-player-component'
export default function AudioPreview({ src }: { src: string }) {
  return (
    <Flex className={DMMono.className + ' preview-container'} justify="between">
      {/* <Flex align="center" gap="1">
        <Text weight="bold" size="2" color="gray">
          REC
        </Text>
        <div className="rec-indicator paused"></div>
      </Flex> */}
      <AudioPlayer
        src={src}
        minimal={true}
        width={330}
        trackHeight={40}
        barWidth={2}
        gap={2}
        visualise={true}
        backgroundColor="transparent"
        barColor="#c2bbbb"
        barPlayedColor="#575353"
        skipDuration={2}
        showLoopOption={true}
        showVolumeControl={true}
        hideSeekBar={true}
        // hideSeekKnobWhenPlaying={true}

        seekBarColor="black"
        // volumeControlColor="blue"
        // hideSeekBar={true}
        // hideTrackKnobWhenPlaying={true}
      />
    </Flex>
  )
}
