export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      accounts: {
        Row: {
          account_id: string
          avatar_url: string | null
          created_at: string
          name: string
          username: string | null
        }
        Insert: {
          account_id: string
          avatar_url?: string | null
          created_at?: string
          name: string
          username?: string | null
        }
        Update: {
          account_id?: string
          avatar_url?: string | null
          created_at?: string
          name?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accounts_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      libraries: {
        Row: {
          account_id: string
          created_at: string
          library_id: string
          library_name: string | null
        }
        Insert: {
          account_id: string
          created_at?: string
          library_id?: string
          library_name?: string | null
        }
        Update: {
          account_id?: string
          created_at?: string
          library_id?: string
          library_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "libraries_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["account_id"]
          }
        ]
      }
      library_stories: {
        Row: {
          account_id: string
          created_at: string
          library_id: string
          library_stories_id: string
          story_id: string
        }
        Insert: {
          account_id: string
          created_at?: string
          library_id: string
          library_stories_id?: string
          story_id: string
        }
        Update: {
          account_id?: string
          created_at?: string
          library_id?: string
          library_stories_id?: string
          story_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "library_stories_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "library_stories_library_id_fkey"
            columns: ["library_id"]
            isOneToOne: false
            referencedRelation: "libraries"
            referencedColumns: ["library_id"]
          },
          {
            foreignKeyName: "library_stories_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["story_id"]
          }
        ]
      }
      profile_activity_log: {
        Row: {
          account_id: string | null
          activity: Json | null
          created_at: string
          profile_activity_log_id: string
        }
        Insert: {
          account_id?: string | null
          activity?: Json | null
          created_at?: string
          profile_activity_log_id?: string
        }
        Update: {
          account_id?: string | null
          activity?: Json | null
          created_at?: string
          profile_activity_log_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_activity_log_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["account_id"]
          }
        ]
      }
      profiles: {
        Row: {
          account_id: string
          avatar_url: string | null
          created_at: string
          profile_id: string
          profile_name: string
        }
        Insert: {
          account_id: string
          avatar_url?: string | null
          created_at?: string
          profile_id?: string
          profile_name: string
        }
        Update: {
          account_id?: string
          avatar_url?: string | null
          created_at?: string
          profile_id?: string
          profile_name?: string
        }
        Relationships: []
      }
      stories: {
        Row: {
          age_group: string | null
          age_groups: string[] | null
          category: string | null
          created_at: string
          description: string | null
          duration: number | null
          image_url: string | null
          is_public: boolean
          language: string | null
          last_updated: string
          recorded_by: string | null
          recording_url: string | null
          region: string | null
          story_id: string
          theme: string | null
          title: string
          transcript: string | null
        }
        Insert: {
          age_group?: string | null
          age_groups?: string[] | null
          category?: string | null
          created_at?: string
          description?: string | null
          duration?: number | null
          image_url?: string | null
          is_public?: boolean
          language?: string | null
          last_updated?: string
          recorded_by?: string | null
          recording_url?: string | null
          region?: string | null
          story_id?: string
          theme?: string | null
          title?: string
          transcript?: string | null
        }
        Update: {
          age_group?: string | null
          age_groups?: string[] | null
          category?: string | null
          created_at?: string
          description?: string | null
          duration?: number | null
          image_url?: string | null
          is_public?: boolean
          language?: string | null
          last_updated?: string
          recorded_by?: string | null
          recording_url?: string | null
          region?: string | null
          story_id?: string
          theme?: string | null
          title?: string
          transcript?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stories_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          }
        ]
      }
      stories_images: {
        Row: {
          created_at: string
          id: number
          image_url: string
          story_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          image_url?: string
          story_id: string
        }
        Update: {
          created_at?: string
          id?: number
          image_url?: string
          story_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
