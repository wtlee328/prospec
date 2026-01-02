
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
      profiles: {
        Row: {
          id: string
          credits_balance: number
          tier: 'free' | 'pro'
          created_at: string
        }
        Insert: {
          id: string
          credits_balance?: number
          tier?: 'free' | 'pro'
          created_at?: string
        }
        Update: {
          id?: string
          credits_balance?: number
          tier?: 'free' | 'pro'
          created_at?: string
        }
      }
      runs: {
        Row: {
          id: string
          user_id: string
          apify_run_id: string | null
          status: 'pending' | 'running' | 'completed' | 'failed' | null
          input_criteria: Json | null
          saved: boolean
          run_name: string | null
          archived_at: string | null
          expires_at: string | null
          number_of_leads: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          apify_run_id?: string | null
          status?: 'pending' | 'running' | 'completed' | 'failed' | null
          input_criteria?: Json | null
          saved?: boolean
          run_name?: string | null
          archived_at?: string | null
          expires_at?: string | null
          number_of_leads?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          apify_run_id?: string | null
          status?: 'pending' | 'running' | 'completed' | 'failed' | null
          input_criteria?: Json | null
          saved?: boolean
          run_name?: string | null
          archived_at?: string | null
          expires_at?: string | null
          number_of_leads?: number
          created_at?: string
        }
      }
      leads: {
        Row: {
          id: string
          run_id: string
          user_id: string
          first_name: string | null
          last_name: string | null
          email: string | null
          job_title: string | null
          company_name: string | null
          industry: string | null
          location: string | null
          linkedin_url: string | null
          city: string | null
          state: string | null
          country: string | null
          company_domain: string | null
          company_phone: string | null
          company_website: string | null
          keywords: string | null
          seniority_level: string | null
          functional_level: string | null
          company_annual_revenue: string | null
          company_size: string | null
          raw_data: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          run_id: string
          user_id: string
          first_name?: string | null
          last_name?: string | null
          email?: string | null
          job_title?: string | null
          company_name?: string | null
          industry?: string | null
          location?: string | null
          linkedin_url?: string | null
          city?: string | null
          state?: string | null
          country?: string | null
          company_domain?: string | null
          company_phone?: string | null
          company_website?: string | null
          keywords?: string | null
          seniority_level?: string | null
          functional_level?: string | null
          company_annual_revenue?: string | null
          company_size?: string | null
          raw_data?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          run_id?: string
          user_id?: string
          first_name?: string | null
          last_name?: string | null
          email?: string | null
          job_title?: string | null
          company_name?: string | null
          industry?: string | null
          location?: string | null
          linkedin_url?: string | null
          city?: string | null
          state?: string | null
          country?: string | null
          company_domain?: string | null
          company_phone?: string | null
          company_website?: string | null
          keywords?: string | null
          seniority_level?: string | null
          functional_level?: string | null
          company_annual_revenue?: string | null
          company_size?: string | null
          raw_data?: Json | null
          created_at?: string
        }
      }
      credit_logs: {
        Row: {
          id: string
          user_id: string
          amount: number
          run_id: string | null
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          run_id?: string | null
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          run_id?: string | null
          description?: string | null
          created_at?: string
        }
      }
    }
  }
}
