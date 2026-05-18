export interface ClassSchedule {
  id: string;
  course_code: string;
  course_name: string;
  days: string[];
  start_time: string;
  end_time: string;
  building?: string;
}

export interface WellnessLog {
  id: string;
  week_start: string;
  stress_rating: number;
  fatigue_rating?: "yes_often" | "sometimes" | "rarely" | "no";
  notes?: string;
  created_date: string;
}

export interface UserProfile {
  id?: string;
  full_name: string;
  preferred_name?: string;
  email: string;
  home_location?: string;
  transit_systems?: string[];
  preferred_commute_mode?: string;
  average_commute_duration?: string;
  arrival_buffer?: string;
  gap_preferences?: string[];
  commute_days_per_week?: number;
  stress_level?: number;
  fatigue_level?: string;
  onboarding_complete?: boolean;
  notification_leave_alerts?: boolean;
  notification_delay_warnings?: boolean;
  notification_class_reminders?: boolean;
  notification_wellness_checkins?: boolean;
  notification_gap_suggestions?: boolean;
}