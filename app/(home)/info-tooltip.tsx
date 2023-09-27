import { Info } from '@phosphor-icons/react'
import { Tooltip } from '@radix-ui/themes'

export default function InfoTooltip({ content }: { content: string }) {
  return (
    <Tooltip multiline content={content}>
      <Info size={18} style={{ opacity: 0.5 }} />
    </Tooltip>
  )
}
