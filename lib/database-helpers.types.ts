import { Database } from '@/lib/database.types'

export type Account = Database['public']['Tables']['accounts']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Story = Database['public']['Tables']['stories']['Row']
export interface StoryWithProfile extends Story {
  profiles: Profile
}
