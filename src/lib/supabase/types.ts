export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      issues: {
        Row: {
          id: string;
          ticket_id: string;
          reporter_id: string;
          title: string;
          description: string | null;
          category: string | null;
          priority: "LOW" | "MEDIUM" | "HIGH" | null;
          status:
            | "REPORTED"
            | "ASSIGNED"
            | "IN_PROGRESS"
            | "RESOLVED"
            | "VERIFIED"
            | "CLOSED"
            | "REOPENED"
            | "OVERDUE"
            | "ESCALATED";
          location: string | null;
          latitude: number | null;
          longitude: number | null;
          images: string[] | null;
          assigned_department: string | null;
          assigned_staff: string | null;
          due_date: string | null;
          resolved_at: string | null;
          closed_at: string | null;
          created_at: string;
          updated_at: string;
          public_visibility: "PUBLIC" | "PRIVATE" | "SENSITIVE" | "HIDDEN";
          public_title: string | null;
          public_description: string | null;
          public_location: string | null;
          public_images: string[] | null;
          show_as_campus_improvement: boolean | null;
          deleted_at: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["issues"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["issues"]["Row"]>;
      };
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          role: "STUDENT" | "ADMIN" | "STAFF" | "DEPT_MANAGER";
          department_id: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["users"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["users"]["Row"]>;
      };
      departments: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          manager_id: string | null;
          staff_members: string[] | null;
        };
        Insert: Partial<Database["public"]["Tables"]["departments"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["departments"]["Row"]>;
      };
    };
    Views: {
      public_issues_view: {
        Row: {
          ticket_id: string;
          title: string | null;
          category: string | null;
          description: string | null;
          location: string | null;
          priority: "LOW" | "MEDIUM" | "HIGH" | null;
          status:
            | "REPORTED"
            | "ASSIGNED"
            | "IN_PROGRESS"
            | "RESOLVED"
            | "VERIFIED"
            | "CLOSED"
            | "REOPENED"
            | "OVERDUE"
            | "ESCALATED";
          created_at: string;
          updated_at: string;
          images: string[] | null;
          show_as_campus_improvement: boolean | null;
        };
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
