// Generated from the Supabase project schema. Regenerate after any migration:
//   supabase gen types typescript --project-id aqizthcpjohxsepbemjm

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      islands: {
        Row: {
          id: string
          name: string
          slug: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      market_sessions: {
        Row: {
          day_of_week: number
          ends: string
          id: string
          market_id: string
          starts: string
        }
        Insert: {
          day_of_week: number
          ends: string
          id?: string
          market_id: string
          starts: string
        }
        Update: {
          day_of_week?: number
          ends?: string
          id?: string
          market_id?: string
          starts?: string
        }
        Relationships: [
          {
            foreignKeyName: "market_sessions_market_id_fkey"
            columns: ["market_id"]
            isOneToOne: false
            referencedRelation: "markets"
            referencedColumns: ["id"]
          },
        ]
      }
      market_vendors: {
        Row: {
          confirmed_at: string | null
          market_id: string
          sort_order: number
          stall: string | null
          usual_days: string | null
          vendor_id: string
        }
        Insert: {
          confirmed_at?: string | null
          market_id: string
          sort_order?: number
          stall?: string | null
          usual_days?: string | null
          vendor_id: string
        }
        Update: {
          confirmed_at?: string | null
          market_id?: string
          sort_order?: number
          stall?: string | null
          usual_days?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "market_vendors_market_id_fkey"
            columns: ["market_id"]
            isOneToOne: false
            referencedRelation: "markets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "market_vendors_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      markets: {
        Row: {
          area: string
          created_at: string
          description: string | null
          distance_mi: number | null
          getting_there: string | null
          id: string
          instagram: string | null
          is_active: boolean
          island_id: string
          location_notes: string | null
          name: string
          slug: string
        }
        Insert: {
          area: string
          created_at?: string
          description?: string | null
          distance_mi?: number | null
          getting_there?: string | null
          id?: string
          instagram?: string | null
          is_active?: boolean
          island_id: string
          location_notes?: string | null
          name: string
          slug: string
        }
        Update: {
          area?: string
          created_at?: string
          description?: string | null
          distance_mi?: number | null
          getting_there?: string | null
          id?: string
          instagram?: string | null
          is_active?: boolean
          island_id?: string
          location_notes?: string | null
          name?: string
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "markets_island_id_fkey"
            columns: ["island_id"]
            isOneToOne: false
            referencedRelation: "islands"
            referencedColumns: ["id"]
          },
        ]
      }
      popups: {
        Row: {
          ends_at: string | null
          id: string
          location_note: string | null
          market_id: string | null
          name: string
          starts_at: string
          status: string
          vendor_id: string | null
        }
        Insert: {
          ends_at?: string | null
          id?: string
          location_note?: string | null
          market_id?: string | null
          name: string
          starts_at: string
          status?: string
          vendor_id?: string | null
        }
        Update: {
          ends_at?: string | null
          id?: string
          location_note?: string | null
          market_id?: string | null
          name?: string
          starts_at?: string
          status?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "popups_market_id_fkey"
            columns: ["market_id"]
            isOneToOne: false
            referencedRelation: "markets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "popups_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          id: string
          kind: string
          note: string | null
          reported_at: string
          subject_id: string
          subject_type: string
        }
        Insert: {
          id?: string
          kind: string
          note?: string | null
          reported_at?: string
          subject_id: string
          subject_type: string
        }
        Update: {
          id?: string
          kind?: string
          note?: string | null
          reported_at?: string
          subject_id?: string
          subject_type?: string
        }
        Relationships: []
      }
      vendor_hours: {
        Row: {
          closes: string
          day_of_week: number
          id: string
          opens: string
          vendor_id: string
        }
        Insert: {
          closes: string
          day_of_week: number
          id?: string
          opens: string
          vendor_id: string
        }
        Update: {
          closes?: string
          day_of_week?: number
          id?: string
          opens?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_hours_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_products: {
        Row: {
          id: string
          in_season_until: string | null
          label: string
          note: string | null
          sort_order: number
          vendor_id: string
        }
        Insert: {
          id?: string
          in_season_until?: string | null
          label: string
          note?: string | null
          sort_order?: number
          vendor_id: string
        }
        Update: {
          id?: string
          in_season_until?: string | null
          label?: string
          note?: string | null
          sort_order?: number
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_products_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          area: string
          category_id: string
          contact_method: string
          created_at: string
          description: string | null
          distance_mi: number | null
          good_to_know: string | null
          id: string
          is_active: boolean
          island_id: string
          lat: number | null
          lng: number | null
          name: string
          payment_notes: string | null
          phone: string | null
          slug: string
          story: string | null
        }
        Insert: {
          area: string
          category_id: string
          contact_method?: string
          created_at?: string
          description?: string | null
          distance_mi?: number | null
          good_to_know?: string | null
          id?: string
          is_active?: boolean
          island_id: string
          lat?: number | null
          lng?: number | null
          name: string
          payment_notes?: string | null
          phone?: string | null
          slug: string
          story?: string | null
        }
        Update: {
          area?: string
          category_id?: string
          contact_method?: string
          created_at?: string
          description?: string | null
          distance_mi?: number | null
          good_to_know?: string | null
          id?: string
          is_active?: boolean
          island_id?: string
          lat?: number | null
          lng?: number | null
          name?: string
          payment_notes?: string | null
          phone?: string | null
          slug?: string
          story?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendors_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendors_island_id_fkey"
            columns: ["island_id"]
            isOneToOne: false
            referencedRelation: "islands"
            referencedColumns: ["id"]
          },
        ]
      }
      verification_events: {
        Row: {
          id: string
          method: string
          note: string | null
          subject_id: string
          subject_type: string
          verified_at: string
        }
        Insert: {
          id?: string
          method: string
          note?: string | null
          subject_id: string
          subject_type: string
          verified_at?: string
        }
        Update: {
          id?: string
          method?: string
          note?: string | null
          subject_id?: string
          subject_type?: string
          verified_at?: string
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
