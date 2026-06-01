// ============================================================
// PARAM MAKERSPACE — Database Types (from ER Diagram v6)
// ============================================================

// USER MODULE
export interface AppUser {
  id: string
  name: string
  email: string
  password_hash?: string
  role: 'viewer' | 'maker' | 'mentor' | 'admin'
  profile_tier?: string
  email_verified: boolean
  is_active: boolean
  upgraded_at?: string
  upgraded_trigger?: string
  created_at: string
  updated_at: string
}

export interface MakerProfile {
  id: string
  user_id: string
  bio?: string
  aspirations?: string
  public_url_slug?: string
  avatar_url?: string
  github_url?: string
  linkedin_url?: string
  is_public: boolean
}

export interface UserSkill {
  id: string
  user_id: string
  skill_name: string
  domain?: string
  source: 'self' | 'platform' | 'supervised'
  created_at: string
}

// EXPLORER MODULE
export interface Challenge {
  id: string
  title: string
  tier: 1 | 2 | 3
  domain?: string
  mystery?: string
  core_idea?: string
  mission?: string
  time_estimate?: string
  success_criteria?: string
  status: 'draft' | 'published' | 'archived'
  created_at: string
  // Joined
  challenge_step?: ChallengeStep[]
  challenge_material?: ChallengeMaterial[]
  challenge_skill?: ChallengeSkill[]
  challenge_vocab?: ChallengeVocab[]
  challenge_level?: ChallengeLevel[]
  challenge_image?: ChallengeImage[]
  challenge_video?: ChallengeVideo[]
  entity_tag?: EntityTagWithTag[]
  completion_count?: number
}

export interface ChallengeHost {
  id: string
  challenge_id: string
  user_id: string
  role: 'creator' | 'co_host'
  added_at: string
}

export interface ChallengeStep {
  id: string
  challenge_id: string
  step_order: number
  description: string
}

export interface ChallengeMaterial {
  id: string
  challenge_id: string
  material_name: string
  quantity?: string
}

export interface ChallengeSkill {
  id: string
  challenge_id: string
  skill_name: string
}

export interface ChallengeVocab {
  id: string
  challenge_id: string
  term: string
  definition: string
}

export interface ChallengeLevel {
  id: string
  challenge_id: string
  level_order: number
  title: string
}

export interface ChallengeCompletion {
  id: string
  user_id: string
  challenge_id: string
  completed_at: string
  submission_notes?: string
  verified_by?: string
}

export interface ChallengeImage {
  id: string
  challenge_id: string
  image_url: string
  display_order: number
  uploaded_by: string
  uploaded_at: string
}

export interface ChallengeVideo {
  id: string
  challenge_id: string
  title?: string
  video_url: string
  display_order: number
  added_by: string
  added_at: string
}

// BADGE MODULE
export interface Badge {
  id: string
  name: string
  description?: string
  tier?: number
  domain?: string
  badge_type: 'completion' | 'event' | 'cert'
  image_url?: string
  criteria?: string
  created_at: string
}

export interface UserBadge {
  id: string
  user_id: string
  badge_id: string
  earned_at: string
  issued_by?: string
  source_event_id?: string
  source_challenge_id?: string
  // Joined
  badge?: Badge
}

// PROJECT MODULE
export interface Project {
  id: string
  title: string
  one_line_summary?: string
  description?: string
  owner_id: string
  mentor_id?: string
  tier?: number
  domain?: string
  status: 'draft' | 'pending_review' | 'active' | 'rejected'
  visibility: 'private' | 'public'
  github_url?: string
  duration_estimate?: string
  showcase_ready: boolean
  created_at?: string
  updated_at?: string
  // Joined
  app_user?: Pick<AppUser, 'name'> & { maker_profile?: Pick<MakerProfile, 'avatar_url' | 'public_url_slug'> }
  project_image?: ProjectImage[]
  project_video?: ProjectVideo[]
  project_file?: ProjectFile[]
  project_milestone?: ProjectMilestone[]
  project_member?: ProjectMember[]
  entity_tag?: EntityTagWithTag[]
  reaction?: Reaction[]
}

export interface ProjectMember {
  id: string
  project_id: string
  user_id: string
  role: 'owner' | 'member'
  joined_at: string
  // Joined
  app_user?: Pick<AppUser, 'name'>
}

export interface ProjectMilestone {
  id: string
  project_id: string
  title: string
  description?: string
  due_date?: string
  completed_at?: string
}

export interface ProjectFile {
  id: string
  project_id: string
  file_name: string
  file_url: string
  file_type?: string
  file_size_bytes?: number
  uploaded_by: string
  uploaded_at: string
}

export interface ProjectImage {
  id: string
  project_id: string
  image_url: string
  display_order: number
  uploaded_by: string
  uploaded_at: string
}

export interface ProjectVideo {
  id: string
  project_id: string
  title?: string
  video_url: string
  display_order: number
  added_by: string
  added_at: string
}

export interface ProjectDownload {
  id: string
  project_id: string
  user_id: string
  downloaded_at: string
}

// EVENT MODULE
export interface Event {
  id: string
  title: string
  description?: string
  event_type: 'build_challenge' | 'maker_meetup' | 'tech_tuesday'
  start_date: string
  end_date?: string
  location?: string
  capacity?: number
  registration_open: boolean
  is_recurring: boolean
  recap_url?: string
  qr_code?: string
  auto_badge_id?: string
  created_by: string
  // Joined
  event_registration?: EventRegistration[]
  event_image?: EventImage[]
  event_video?: EventVideo[]
  event_team?: EventTeam[]
  registration_count?: number
}

export interface EventRegistration {
  id: string
  user_id: string
  event_id: string
  registered_at: string
  checked_in: boolean
  checked_in_at?: string
  badge_issued?: boolean
}

export interface EventImage {
  id: string
  event_id: string
  image_url: string
  display_order: number
  uploaded_by: string
  uploaded_at: string
}

export interface EventVideo {
  id: string
  event_id: string
  title?: string
  video_url: string
  display_order: number
  added_by: string
  added_at: string
}

export interface EventTeam {
  id: string
  event_id: string
  team_name: string
  created_by: string
  created_at: string
  // Joined
  event_team_member?: EventTeamMember[]
}

export interface EventTeamMember {
  id: string
  team_id: string
  user_id: string
  role: 'lead' | 'member'
  joined_at: string
  app_user?: Pick<AppUser, 'name'>
}

export interface ShowcaseSlot {
  id: string
  event_id: string
  user_id: string
  title: string
  slot_type: 'speaker' | 'demo' | 'product'
  status: 'pending' | 'approved' | 'rejected'
  project_id?: string
  notes?: string
  booked_at: string
}

export interface EventSubmission {
  id: string
  event_id: string
  project_id: string
  team_id?: string
  submitted_by: string
  submitted_at: string
  status: 'submitted' | 'reviewed' | 'winner' | 'disqualified'
}

// COMMUNITY MODULE
export interface Comment {
  id: string
  target_type: 'project' | 'challenge' | 'event'
  target_id: string
  user_id: string
  content: string
  parent_comment_id?: string
  created_at: string
  updated_at: string
  // Joined
  app_user?: Pick<AppUser, 'name'> & { maker_profile?: Pick<MakerProfile, 'avatar_url'> }
  replies?: Comment[]
}

export interface Reaction {
  id: string
  target_type: 'project' | 'challenge' | 'event'
  target_id: string
  user_id: string
  reaction_type: 'like' | 'upvote' | 'bookmark'
  created_at: string
}

// OPS MODULE
export interface Equipment {
  id: string
  name: string
  description?: string
  category?: string
  status: 'available' | 'in_use' | 'maintenance' | 'retired'
  location?: string
  image_url?: string
  requires_induction: boolean
}

export interface EquipmentBooking {
  id: string
  user_id: string
  equipment_id: string
  start_time: string
  end_time: string
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled'
  notes?: string
  // Joined
  equipment?: Equipment
}

export interface Induction {
  id: string
  user_id: string
  equipment_id: string
  inducted_by: string
  inducted_at: string
  expires_at?: string
  is_active: boolean
  certificate_url?: string
}

export interface InventoryItem {
  id: string
  name: string
  category?: string
  quantity: number
  unit?: string
  reorder_level: number
  location?: string
  updated_at: string
}

// STORE MODULE
export interface StoreProduct {
  id: string
  name: string
  description?: string
  price: number
  category?: string
  image_url?: string
  stock_quantity: number
  required_badge_id?: string
  is_active: boolean
}

export interface StoreOrder {
  id: string
  user_id: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered'
  total_amount: number
  shipping_address?: string
  created_at: string
  // Joined
  store_order_item?: StoreOrderItem[]
}

export interface StoreOrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  unit_price: number
  // Joined
  store_product?: StoreProduct
}

// TAGS MODULE
export interface Tag {
  id: string
  name: string
  slug: string
  category: 'domain' | 'skill' | 'tool' | 'theme'
}

export interface EntityTag {
  id: string
  target_type: 'project' | 'challenge' | 'maker_profile'
  target_id: string
  tag_id: string
  tagged_by: string
}

export interface EntityTagWithTag extends EntityTag {
  tag: Tag
}

// ADDITIONAL TABLES
export interface UserBookmark {
  id: string
  user_id: string
  target_type: 'project' | 'challenge' | 'event'
  target_id: string
  created_at: string
}

export interface UserNotification {
  id: string
  user_id: string
  type: string
  message: string
  link?: string
  read: boolean
  created_at: string
}
