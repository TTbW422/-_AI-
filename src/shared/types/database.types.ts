export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type SubscriptionStatus = 'free' | 'active' | 'past_due' | 'canceled';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          subscription_status: SubscriptionStatus;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          subscription_status?: SubscriptionStatus;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          subscription_status?: SubscriptionStatus;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      diagnosis_records: {
        Row: {
          id: string;
          user_id: string;
          maker: string;
          model_name: string;
          model_year: string | null;
          model_code: string | null;
          engine_code: string | null;
          mileage: number | null;
          symptoms: string;
          primary_cause: Json;
          cascade_causes: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          maker: string;
          model_name: string;
          model_year?: string | null;
          model_code?: string | null;
          engine_code?: string | null;
          mileage?: number | null;
          symptoms: string;
          primary_cause: Json;
          cascade_causes: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          maker?: string;
          model_name?: string;
          model_year?: string | null;
          model_code?: string | null;
          engine_code?: string | null;
          mileage?: number | null;
          symptoms?: string;
          primary_cause?: Json;
          cascade_causes?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
