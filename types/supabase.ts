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
      users: {
        Row: {
          id: string
          email: string | null
          username: string | null
          avatar_url: string | null
          role: 'user' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          username?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          username?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      game_profiles: {
        Row: {
          id: string
          user_id: string
          total_gems: number
          current_level: number
          current_streak: number
          longest_streak: number
          last_played_date: string | null
          total_riddles_solved: number
          fastest_solve_time: number | null
          no_hint_solves: number
          perfect_streak_count: number
          total_gems_earned: number
          settings: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          total_gems?: number
          current_level?: number
          current_streak?: number
          longest_streak?: number
          last_played_date?: string | null
          total_riddles_solved?: number
          fastest_solve_time?: number | null
          no_hint_solves?: number
          perfect_streak_count?: number
          total_gems_earned?: number
          settings?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          total_gems?: number
          current_level?: number
          current_streak?: number
          longest_streak?: number
          last_played_date?: string | null
          total_riddles_solved?: number
          fastest_solve_time?: number | null
          no_hint_solves?: number
          perfect_streak_count?: number
          total_gems_earned?: number
          settings?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      solved_riddles: {
        Row: {
          id: string
          user_id: string
          riddle_id: string
          solved_at: string
          gems_earned: number
          hints_used: number[]
          solve_time_seconds: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          riddle_id: string
          solved_at?: string
          gems_earned: number
          hints_used?: number[]
          solve_time_seconds?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          riddle_id?: string
          solved_at?: string
          gems_earned?: number
          hints_used?: number[]
          solve_time_seconds?: number | null
          created_at?: string
        }
      }
      achievements_unlocked: {
        Row: {
          id: string
          user_id: string
          achievement_id: string
          unlocked_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          achievement_id: string
          unlocked_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          achievement_id?: string
          unlocked_at?: string
          created_at?: string
        }
      }
      admin_riddles: {
        Row: {
          id: string
          question: string
          answer: string | string[]
          difficulty: 'easy' | 'medium' | 'hard'
          category: string | null
          hint1: string | null
          hint2: string | null
          tags: string[] | null
          is_active: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          question: string
          answer: string | string[]
          difficulty: 'easy' | 'medium' | 'hard'
          category?: string | null
          hint1?: string | null
          hint2?: string | null
          tags?: string[] | null
          is_active?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          question?: string
          answer?: string | string[]
          difficulty?: 'easy' | 'medium' | 'hard'
          category?: string | null
          hint1?: string | null
          hint2?: string | null
          tags?: string[] | null
          is_active?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      leaderboard: {
        Row: {
          user_id: string
          username: string | null
          avatar_url: string | null
          total_gems: number
          total_riddles_solved: number
          current_streak: number
          rank: number
        }
      }
    }
    Functions: {
      get_weekly_leaderboard: {
        Args: Record<string, never>
        Returns: {
          user_id: string
          username: string | null
          avatar_url: string | null
          riddles_this_week: number
          rank: number
        }[]
      }
    }
  }
}
