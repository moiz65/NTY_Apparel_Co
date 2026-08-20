export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      affiliate_applications: {
        Row: {
          additional_notes: string | null
          audience_description: string | null
          created_at: string
          email: string
          first_name: string | null
          how_did_you_find: string | null
          id: string
          instagram_followers: number | null
          instagram_handle: string | null
          last_name: string | null
          name: string | null
          notes: string | null
          phone: string | null
          platform_info: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          social_handles: string | null
          status: string
          tiktok_followers: number | null
          tiktok_handle: string | null
          total_followers_range: string | null
          why_join: string | null
        }
        Insert: {
          additional_notes?: string | null
          audience_description?: string | null
          created_at?: string
          email: string
          first_name?: string | null
          how_did_you_find?: string | null
          id?: string
          instagram_followers?: number | null
          instagram_handle?: string | null
          last_name?: string | null
          name?: string | null
          notes?: string | null
          phone?: string | null
          platform_info?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          social_handles?: string | null
          status?: string
          tiktok_followers?: number | null
          tiktok_handle?: string | null
          total_followers_range?: string | null
          why_join?: string | null
        }
        Update: {
          additional_notes?: string | null
          audience_description?: string | null
          created_at?: string
          email?: string
          first_name?: string | null
          how_did_you_find?: string | null
          id?: string
          instagram_followers?: number | null
          instagram_handle?: string | null
          last_name?: string | null
          name?: string | null
          notes?: string | null
          phone?: string | null
          platform_info?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          social_handles?: string | null
          status?: string
          tiktok_followers?: number | null
          tiktok_handle?: string | null
          total_followers_range?: string | null
          why_join?: string | null
        }
        Relationships: []
      }
      affiliate_coupon_links: {
        Row: {
          active: boolean
          affiliate_id: string
          code: string
          commission_percent: number
          created_at: string
          discount_percent: number
          id: string
          uses_count: number
        }
        Insert: {
          active?: boolean
          affiliate_id: string
          code: string
          commission_percent?: number
          created_at?: string
          discount_percent?: number
          id?: string
          uses_count?: number
        }
        Update: {
          active?: boolean
          affiliate_id?: string
          code?: string
          commission_percent?: number
          created_at?: string
          discount_percent?: number
          id?: string
          uses_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_coupon_links_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_messages: {
        Row: {
          affiliate_id: string | null
          body: string
          created_at: string
          from_email: string
          from_name: string
          id: string
          read: boolean
          subject: string | null
        }
        Insert: {
          affiliate_id?: string | null
          body: string
          created_at?: string
          from_email: string
          from_name: string
          id?: string
          read?: boolean
          subject?: string | null
        }
        Update: {
          affiliate_id?: string | null
          body?: string
          created_at?: string
          from_email?: string
          from_name?: string
          id?: string
          read?: boolean
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_messages_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_payouts: {
        Row: {
          affiliate_id: string
          amount: number
          created_at: string
          id: string
          notes: string | null
          paid_at: string | null
          payout_method: string | null
          reference: string | null
          status: string
        }
        Insert: {
          affiliate_id: string
          amount?: number
          created_at?: string
          id?: string
          notes?: string | null
          paid_at?: string | null
          payout_method?: string | null
          reference?: string | null
          status?: string
        }
        Update: {
          affiliate_id?: string
          amount?: number
          created_at?: string
          id?: string
          notes?: string | null
          paid_at?: string | null
          payout_method?: string | null
          reference?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_payouts_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_referrals: {
        Row: {
          affiliate_id: string | null
          commission_amount: number
          created_at: string
          customer_email: string | null
          id: string
          order_amount: number
          order_number: string | null
          referral_code: string | null
          status: string
        }
        Insert: {
          affiliate_id?: string | null
          commission_amount?: number
          created_at?: string
          customer_email?: string | null
          id?: string
          order_amount?: number
          order_number?: string | null
          referral_code?: string | null
          status?: string
        }
        Update: {
          affiliate_id?: string | null
          commission_amount?: number
          created_at?: string
          customer_email?: string | null
          id?: string
          order_amount?: number
          order_number?: string | null
          referral_code?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_referrals_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_visits: {
        Row: {
          affiliate_id: string | null
          country: string | null
          created_at: string
          id: string
          path: string | null
          referral_code: string
          user_agent: string | null
        }
        Insert: {
          affiliate_id?: string | null
          country?: string | null
          created_at?: string
          id?: string
          path?: string | null
          referral_code: string
          user_agent?: string | null
        }
        Update: {
          affiliate_id?: string | null
          country?: string | null
          created_at?: string
          id?: string
          path?: string | null
          referral_code?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_visits_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliates: {
        Row: {
          approved_at: string | null
          created_at: string
          earnings: number
          email: string
          id: string
          instagram_followers: number | null
          instagram_handle: string | null
          name: string
          referral_code: string | null
          status: string
          tiktok_followers: number | null
          tiktok_handle: string | null
        }
        Insert: {
          approved_at?: string | null
          created_at?: string
          earnings?: number
          email: string
          id?: string
          instagram_followers?: number | null
          instagram_handle?: string | null
          name: string
          referral_code?: string | null
          status?: string
          tiktok_followers?: number | null
          tiktok_handle?: string | null
        }
        Update: {
          approved_at?: string | null
          created_at?: string
          earnings?: number
          email?: string
          id?: string
          instagram_followers?: number | null
          instagram_handle?: string | null
          name?: string
          referral_code?: string | null
          status?: string
          tiktok_followers?: number | null
          tiktok_handle?: string | null
        }
        Relationships: []
      }
      bench_club_applications: {
        Row: {
          bench_tier: number
          created_at: string
          email: string
          id: string
          instagram_handle: string | null
          name: string
          notes: string | null
          phone: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          video_url: string | null
        }
        Insert: {
          bench_tier: number
          created_at?: string
          email: string
          id?: string
          instagram_handle?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          video_url?: string | null
        }
        Update: {
          bench_tier?: number
          created_at?: string
          email?: string
          id?: string
          instagram_handle?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          video_url?: string | null
        }
        Relationships: []
      }
      bench_club_members: {
        Row: {
          application_id: string | null
          approved_at: string
          approved_by: string | null
          bench_tier: number
          email: string
          id: string
          member_number: number
          name: string
          user_id: string | null
        }
        Insert: {
          application_id?: string | null
          approved_at?: string
          approved_by?: string | null
          bench_tier: number
          email: string
          id?: string
          member_number?: number
          name: string
          user_id?: string | null
        }
        Update: {
          application_id?: string | null
          approved_at?: string
          approved_by?: string | null
          bench_tier?: number
          email?: string
          id?: string
          member_number?: number
          name?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bench_club_members_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "bench_club_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      dashboard_metrics: {
        Row: {
          id: string
          metric_key: string
          metric_value: number
          updated_at: string
        }
        Insert: {
          id?: string
          metric_key: string
          metric_value?: number
          updated_at?: string
        }
        Update: {
          id?: string
          metric_key?: string
          metric_value?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      generated_coupons: {
        Row: {
          amount: number
          code: string
          created_at: string
          discount_type: string
          email: string
          expires_at: string | null
          id: string
          source: string | null
          times_used: number
          usage_limit: number
        }
        Insert: {
          amount: number
          code: string
          created_at?: string
          discount_type: string
          email: string
          expires_at?: string | null
          id?: string
          source?: string | null
          times_used?: number
          usage_limit?: number
        }
        Update: {
          amount?: number
          code?: string
          created_at?: string
          discount_type?: string
          email?: string
          expires_at?: string | null
          id?: string
          source?: string | null
          times_used?: number
          usage_limit?: number
        }
        Relationships: []
      }
      orders: {
        Row: {
          amount: number
          billing_email: string | null
          coupon_code: string | null
          created_at: string
          customer_email: string | null
          customer_name: string
          id: string
          line_items: Json | null
          order_number: string
          payment_method: string | null
          payment_verified: boolean
          shipping_address: string | null
          shipping_city: string | null
          shipping_country: string | null
          shipping_name: string | null
          shipping_state: string | null
          shipping_zip: string | null
          status: string
          subtotal: number
          total: number
          tracking_number: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number
          billing_email?: string | null
          coupon_code?: string | null
          created_at?: string
          customer_email?: string | null
          customer_name: string
          id?: string
          line_items?: Json | null
          order_number: string
          payment_method?: string | null
          payment_verified?: boolean
          shipping_address?: string | null
          shipping_city?: string | null
          shipping_country?: string | null
          shipping_name?: string | null
          shipping_state?: string | null
          shipping_zip?: string | null
          status?: string
          subtotal?: number
          total?: number
          tracking_number?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          billing_email?: string | null
          coupon_code?: string | null
          created_at?: string
          customer_email?: string | null
          customer_name?: string
          id?: string
          line_items?: Json | null
          order_number?: string
          payment_method?: string | null
          payment_verified?: boolean
          shipping_address?: string | null
          shipping_city?: string | null
          shipping_country?: string | null
          shipping_name?: string | null
          shipping_state?: string | null
          shipping_zip?: string | null
          status?: string
          subtotal?: number
          total?: number
          tracking_number?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      page_views: {
        Row: {
          country: string | null
          created_at: string
          id: string
          path: string
          source: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string
          id?: string
          path: string
          source?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string
          id?: string
          path?: string
          source?: string | null
        }
        Relationships: []
      }
      point_transactions: {
        Row: {
          created_at: string
          description: string | null
          id: string
          order_id: string | null
          points: number
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          order_id?: string | null
          points: number
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          order_id?: string | null
          points?: number
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          birth_month: string | null
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          points: number
          updated_at: string
          user_id: string
        }
        Insert: {
          birth_month?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          points?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          birth_month?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          points?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      rewards_transactions: {
        Row: {
          created_at: string
          description: string | null
          id: string
          order_id: string | null
          points: number
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          order_id?: string | null
          points: number
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          order_id?: string | null
          points?: number
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      signups: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      user_rewards: {
        Row: {
          lifetime_earned: number
          lifetime_redeemed: number
          points_balance: number
          updated_at: string
          user_id: string
        }
        Insert: {
          lifetime_earned?: number
          lifetime_redeemed?: number
          points_balance?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          lifetime_earned?: number
          lifetime_redeemed?: number
          points_balance?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "affiliate" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "affiliate", "user"],
    },
  },
} as const
