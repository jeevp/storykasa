import { useEffect } from 'react'
import { AudioPlayer } from 'react-audio-player-component'
export default function AudioPreview({ src }: { src: string }) {
  return (
    <div style={{ fontFamily: 'monospace' }}>
      <AudioPlayer
        src={src}
        minimal={true}
        width={140}
        trackHeight={40}
        barWidth={3}
        gap={1}
        visualise={true}
        backgroundColor="transparent"
        barColor="#C1D0B5"
        barPlayedColor="#99A98F"
        skipDuration={2}
        showLoopOption={true}
        showVolumeControl={true}
        hideSeekBar={true}
        // hideSeekKnobWhenPlaying={true}

        // seekBarColor="purple"
        // volumeControlColor="blue"
        // hideSeekBar={true}
        // hideTrackKnobWhenPlaying={true}
      />
    </div>
  )
}
