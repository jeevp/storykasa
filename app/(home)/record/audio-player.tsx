import { DMMono } from '@/app/fonts'
import { useEffect } from 'react'
import { AudioPlayer as ReactAudioPlayer } from 'react-audio-player-component'
export default function AudioPlayer({ src }: { src: string }) {
  return (
    <div className={DMMono.className}>
      <ReactAudioPlayer
        src={src}
        minimal={false}
        width={300}
        trackHeight={40}
        barWidth={3}
        gap={1}
        visualise={false}
        backgroundColor="transparent"
        barColor="#C1D0B5"
        barPlayedColor="#99A98F"
        skipDuration={2}
        showLoopOption={true}
        showVolumeControl={true}
        hideSeekBar={false}
        // hideSeekKnobWhenPlaying={true}

        // seekBarColor="purple"
        // volumeControlColor="blue"
        // hideSeekBar={true}
        // hideTrackKnobWhenPlaying={true}
      />
    </div>
  )
}
