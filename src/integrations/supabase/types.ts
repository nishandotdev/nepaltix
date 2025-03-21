export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      events: {
        Row: {
          available_tickets: number
          category: string
          created_at: string | null
          created_by: string | null
          date: string
          description: string
          featured: boolean | null
          id: string
          image_url: string
          location: string
          price: number
          short_description: string
          tags: string[] | null
          time: string
          title: string
          total_tickets: number
        }
        Insert: {
          available_tickets: number
          category: string
          created_at?: string | null
          created_by?: string | null
          date: string
          description: string
          featured?: boolean | null
          id?: string
          image_url: string
          location: string
          price: number
          short_description: string
          tags?: string[] | null
          time: string
          title: string
          total_tickets: number
        }
        Update: {
          available_tickets?: number
          category?: string
          created_at?: string | null
          created_by?: string | null
          date?: string
          description?: string
          featured?: boolean | null
          id?: string
          image_url?: string
          location?: string
          price?: number
          short_description?: string
          tags?: string[] | null
          time?: string
          title?: string
          total_tickets?: number
        }
        Relationships: []
      }
      orders: {
        Row: {
          actual_delivery_time: string | null
          created_at: string
          delivery_address: string
          estimated_delivery_time: string | null
          id: string
          items: Json
          rider_id: string | null
          status: string
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          actual_delivery_time?: string | null
          created_at?: string
          delivery_address: string
          estimated_delivery_time?: string | null
          id?: string
          items: Json
          rider_id?: string | null
          status?: string
          total_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          actual_delivery_time?: string | null
          created_at?: string
          delivery_address?: string
          estimated_delivery_time?: string | null
          id?: string
          items?: Json
          rider_id?: string | null
          status?: string
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_rider_id_fkey"
            columns: ["rider_id"]
            isOneToOne: false
            referencedRelation: "riders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string
          role: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          name: string
          role?: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          role?: string
        }
        Relationships: []
      }
      riders: {
        Row: {
          available: boolean | null
          avatar_url: string | null
          created_at: string
          current_location: Json | null
          email: string
          full_name: string
          id: string
          license_number: string | null
          phone_number: string
          rating: number | null
          vehicle_type: string | null
        }
        Insert: {
          available?: boolean | null
          avatar_url?: string | null
          created_at?: string
          current_location?: Json | null
          email: string
          full_name: string
          id?: string
          license_number?: string | null
          phone_number: string
          rating?: number | null
          vehicle_type?: string | null
        }
        Update: {
          available?: boolean | null
          avatar_url?: string | null
          created_at?: string
          current_location?: Json | null
          email?: string
          full_name?: string
          id?: string
          license_number?: string | null
          phone_number?: string
          rating?: number | null
          vehicle_type?: string | null
        }
        Relationships: []
      }
      tickets: {
        Row: {
          access_code: string
          barcode: string
          customer_id: string | null
          event_id: string | null
          id: string
          purchase_date: string | null
          qr_code: string
          quantity: number
          ticket_type: string
          used: boolean | null
        }
        Insert: {
          access_code: string
          barcode: string
          customer_id?: string | null
          event_id?: string | null
          id?: string
          purchase_date?: string | null
          qr_code: string
          quantity: number
          ticket_type: string
          used?: boolean | null
        }
        Update: {
          access_code?: string
          barcode?: string
          customer_id?: string | null
          event_id?: string | null
          id?: string
          purchase_date?: string | null
          qr_code?: string
          quantity?: number
          ticket_type?: string
          used?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "tickets_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          address: string | null
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          phone_number: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          phone_number?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          phone_number?: string | null
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
