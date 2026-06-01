-- ============================================================
-- PARAM MAKERSPACE — Complete Supabase Schema
-- Run this entire file in: Supabase Dashboard > SQL Editor
-- ============================================================


-- ============================================================
-- 1. USER MODULE
-- ============================================================

CREATE TABLE public.app_user (
  id               UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name             TEXT NOT NULL,
  email            TEXT NOT NULL UNIQUE,
  role             TEXT NOT NULL DEFAULT 'viewer'
                     CHECK (role IN ('viewer', 'maker', 'mentor', 'admin')),
  profile_tier     TEXT,
  email_verified   BOOLEAN NOT NULL DEFAULT false,
  is_active        BOOLEAN NOT NULL DEFAULT true,
  upgraded_at      TIMESTAMPTZ,
  upgraded_trigger TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.maker_profile (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL UNIQUE REFERENCES public.app_user(id) ON DELETE CASCADE,
  bio             TEXT,
  aspirations     TEXT,
  public_url_slug TEXT UNIQUE,
  avatar_url      TEXT,
  github_url      TEXT,
  linkedin_url    TEXT,
  is_public       BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE public.user_skill (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.app_user(id) ON DELETE CASCADE,
  skill_name  TEXT NOT NULL,
  domain      TEXT,
  source      TEXT NOT NULL DEFAULT 'self' CHECK (source IN ('self', 'platform', 'supervised')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ============================================================
-- 2. TAGS MODULE (needed early — referenced by many tables)
-- ============================================================

CREATE TABLE public.tag (
  id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name     TEXT NOT NULL,
  slug     TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('domain', 'skill', 'tool', 'theme'))
);

CREATE TABLE public.entity_tag (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_type TEXT NOT NULL CHECK (target_type IN ('project', 'challenge', 'maker_profile')),
  target_id   UUID NOT NULL,
  tag_id      UUID NOT NULL REFERENCES public.tag(id) ON DELETE CASCADE,
  tagged_by   UUID NOT NULL REFERENCES public.app_user(id) ON DELETE CASCADE,
  UNIQUE (target_type, target_id, tag_id)
);


-- ============================================================
-- 3. PROJECT MODULE
-- ============================================================

CREATE TABLE public.project (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title             TEXT NOT NULL,
  one_line_summary  TEXT,
  description       TEXT,
  owner_id          UUID NOT NULL REFERENCES public.app_user(id) ON DELETE CASCADE,
  mentor_id         UUID REFERENCES public.app_user(id) ON DELETE SET NULL,
  tier              INT CHECK (tier IN (1, 2, 3)),
  domain            TEXT,
  status            TEXT NOT NULL DEFAULT 'draft'
                      CHECK (status IN ('draft', 'pending_review', 'active', 'rejected')),
  visibility        TEXT NOT NULL DEFAULT 'private'
                      CHECK (visibility IN ('private', 'public')),
  github_url        TEXT,
  duration_estimate TEXT,
  showcase_ready    BOOLEAN NOT NULL DEFAULT false,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.project_member (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.project(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES public.app_user(id) ON DELETE CASCADE,
  role       TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'member')),
  joined_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (project_id, user_id)
);

CREATE TABLE public.project_milestone (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id   UUID NOT NULL REFERENCES public.project(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  description  TEXT,
  due_date     DATE,
  completed_at TIMESTAMPTZ
);

CREATE TABLE public.project_file (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id      UUID NOT NULL REFERENCES public.project(id) ON DELETE CASCADE,
  file_name       TEXT NOT NULL,
  file_url        TEXT NOT NULL,
  file_type       TEXT,
  file_size_bytes BIGINT,
  uploaded_by     UUID NOT NULL REFERENCES public.app_user(id) ON DELETE CASCADE,
  uploaded_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.project_image (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id    UUID NOT NULL REFERENCES public.project(id) ON DELETE CASCADE,
  image_url     TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 1,
  uploaded_by   UUID NOT NULL REFERENCES public.app_user(id) ON DELETE CASCADE,
  uploaded_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.project_video (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id    UUID NOT NULL REFERENCES public.project(id) ON DELETE CASCADE,
  title         TEXT,
  video_url     TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 1,
  added_by      UUID NOT NULL REFERENCES public.app_user(id) ON DELETE CASCADE,
  added_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.project_download (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id    UUID NOT NULL REFERENCES public.project(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES public.app_user(id) ON DELETE CASCADE,
  downloaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ============================================================
-- 4. BADGE MODULE
-- ============================================================

CREATE TABLE public.badge (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT,
  tier        INT,
  domain      TEXT,
  badge_type  TEXT NOT NULL CHECK (badge_type IN ('completion', 'event', 'cert')),
  image_url   TEXT,
  criteria    TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.user_badge (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES public.app_user(id) ON DELETE CASCADE,
  badge_id            UUID NOT NULL REFERENCES public.badge(id) ON DELETE CASCADE,
  earned_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  issued_by           UUID REFERENCES public.app_user(id) ON DELETE SET NULL,
  source_event_id     UUID,
  source_challenge_id UUID,
  UNIQUE (user_id, badge_id)
);


-- ============================================================
-- 5. CHALLENGE MODULE
-- ============================================================

CREATE TABLE public.challenge (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title            TEXT NOT NULL,
  tier             INT NOT NULL CHECK (tier IN (1, 2, 3)),
  domain           TEXT,
  mystery          TEXT,
  core_idea        TEXT,
  mission          TEXT,
  time_estimate    TEXT,
  success_criteria TEXT,
  status           TEXT NOT NULL DEFAULT 'draft'
                     CHECK (status IN ('draft', 'published', 'archived')),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.challenge_host (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.challenge(id) ON DELETE CASCADE,
  user_id      UUID NOT NULL REFERENCES public.app_user(id) ON DELETE CASCADE,
  role         TEXT NOT NULL DEFAULT 'creator' CHECK (role IN ('creator', 'co_host')),
  added_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (challenge_id, user_id)
);

CREATE TABLE public.challenge_step (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.challenge(id) ON DELETE CASCADE,
  step_order   INT NOT NULL,
  description  TEXT NOT NULL
);

CREATE TABLE public.challenge_material (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id  UUID NOT NULL REFERENCES public.challenge(id) ON DELETE CASCADE,
  material_name TEXT NOT NULL,
  quantity      TEXT
);

CREATE TABLE public.challenge_skill (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.challenge(id) ON DELETE CASCADE,
  skill_name   TEXT NOT NULL
);

CREATE TABLE public.challenge_vocab (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.challenge(id) ON DELETE CASCADE,
  term         TEXT NOT NULL,
  definition   TEXT NOT NULL
);

CREATE TABLE public.challenge_level (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.challenge(id) ON DELETE CASCADE,
  level_order  INT NOT NULL,
  title        TEXT NOT NULL
);

CREATE TABLE public.challenge_completion (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES public.app_user(id) ON DELETE CASCADE,
  challenge_id     UUID NOT NULL REFERENCES public.challenge(id) ON DELETE CASCADE,
  completed_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  submission_notes TEXT,
  verified_by      UUID REFERENCES public.app_user(id) ON DELETE SET NULL,
  UNIQUE (user_id, challenge_id)
);

CREATE TABLE public.challenge_image (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id  UUID NOT NULL REFERENCES public.challenge(id) ON DELETE CASCADE,
  image_url     TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 1,
  uploaded_by   UUID NOT NULL REFERENCES public.app_user(id) ON DELETE CASCADE,
  uploaded_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.challenge_video (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id  UUID NOT NULL REFERENCES public.challenge(id) ON DELETE CASCADE,
  title         TEXT,
  video_url     TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 1,
  added_by      UUID NOT NULL REFERENCES public.app_user(id) ON DELETE CASCADE,
  added_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ============================================================
-- 6. EVENT MODULE
-- ============================================================

CREATE TABLE public.event (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title             TEXT NOT NULL,
  description       TEXT,
  event_type        TEXT NOT NULL CHECK (event_type IN ('build_challenge', 'maker_meetup', 'tech_tuesday')),
  start_date        TIMESTAMPTZ NOT NULL,
  end_date          TIMESTAMPTZ,
  location          TEXT,
  capacity          INT,
  registration_open BOOLEAN NOT NULL DEFAULT true,
  is_recurring      BOOLEAN NOT NULL DEFAULT false,
  recap_url         TEXT,
  qr_code           TEXT,
  auto_badge_id     UUID REFERENCES public.badge(id) ON DELETE SET NULL,
  created_by        UUID NOT NULL REFERENCES public.app_user(id) ON DELETE CASCADE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.event_registration (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES public.app_user(id) ON DELETE CASCADE,
  event_id      UUID NOT NULL REFERENCES public.event(id) ON DELETE CASCADE,
  registered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  checked_in    BOOLEAN NOT NULL DEFAULT false,
  checked_in_at TIMESTAMPTZ,
  badge_issued  BOOLEAN NOT NULL DEFAULT false,
  UNIQUE (user_id, event_id)
);

CREATE TABLE public.event_image (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id      UUID NOT NULL REFERENCES public.event(id) ON DELETE CASCADE,
  image_url     TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 1,
  uploaded_by   UUID NOT NULL REFERENCES public.app_user(id) ON DELETE CASCADE,
  uploaded_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.event_video (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id      UUID NOT NULL REFERENCES public.event(id) ON DELETE CASCADE,
  title         TEXT,
  video_url     TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 1,
  added_by      UUID NOT NULL REFERENCES public.app_user(id) ON DELETE CASCADE,
  added_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.event_team (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id   UUID NOT NULL REFERENCES public.event(id) ON DELETE CASCADE,
  team_name  TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES public.app_user(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.event_team_member (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id   UUID NOT NULL REFERENCES public.event_team(id) ON DELETE CASCADE,
  user_id   UUID NOT NULL REFERENCES public.app_user(id) ON DELETE CASCADE,
  role      TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('lead', 'member')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (team_id, user_id)
);

CREATE TABLE public.event_showcase_slot (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id   UUID NOT NULL REFERENCES public.event(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES public.app_user(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  slot_type  TEXT NOT NULL CHECK (slot_type IN ('speaker', 'demo', 'product')),
  status     TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  project_id UUID REFERENCES public.project(id) ON DELETE SET NULL,
  notes      TEXT,
  booked_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.event_submission (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id     UUID NOT NULL REFERENCES public.event(id) ON DELETE CASCADE,
  project_id   UUID NOT NULL REFERENCES public.project(id) ON DELETE CASCADE,
  team_id      UUID REFERENCES public.event_team(id) ON DELETE SET NULL,
  submitted_by UUID NOT NULL REFERENCES public.app_user(id) ON DELETE CASCADE,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status       TEXT NOT NULL DEFAULT 'submitted'
                 CHECK (status IN ('submitted', 'reviewed', 'winner', 'disqualified'))
);


-- ============================================================
-- 7. COMMUNITY MODULE (Comments & Reactions)
-- ============================================================

CREATE TABLE public.comment (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_type       TEXT NOT NULL CHECK (target_type IN ('project', 'challenge', 'event')),
  target_id         UUID NOT NULL,
  user_id           UUID NOT NULL REFERENCES public.app_user(id) ON DELETE CASCADE,
  content           TEXT NOT NULL,
  parent_comment_id UUID REFERENCES public.comment(id) ON DELETE CASCADE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.reaction (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_type   TEXT NOT NULL CHECK (target_type IN ('project', 'challenge', 'event')),
  target_id     UUID NOT NULL,
  user_id       UUID NOT NULL REFERENCES public.app_user(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('like', 'upvote', 'bookmark')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (target_type, target_id, user_id, reaction_type)
);


-- ============================================================
-- 8. OPS MODULE (Equipment & Inventory)
-- ============================================================

CREATE TABLE public.equipment (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              TEXT NOT NULL,
  description       TEXT,
  category          TEXT,
  status            TEXT NOT NULL DEFAULT 'available'
                      CHECK (status IN ('available', 'in_use', 'maintenance', 'retired')),
  location          TEXT,
  image_url         TEXT,
  requires_induction BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE public.equipment_booking (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES public.app_user(id) ON DELETE CASCADE,
  equipment_id UUID NOT NULL REFERENCES public.equipment(id) ON DELETE CASCADE,
  start_time   TIMESTAMPTZ NOT NULL,
  end_time     TIMESTAMPTZ NOT NULL,
  status       TEXT NOT NULL DEFAULT 'pending'
                 CHECK (status IN ('pending', 'confirmed', 'active', 'completed', 'cancelled')),
  notes        TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.user_induction (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.app_user(id) ON DELETE CASCADE,
  equipment_id    UUID NOT NULL REFERENCES public.equipment(id) ON DELETE CASCADE,
  inducted_by     UUID NOT NULL REFERENCES public.app_user(id) ON DELETE CASCADE,
  inducted_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at      TIMESTAMPTZ,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  certificate_url TEXT,
  UNIQUE (user_id, equipment_id)
);

CREATE TABLE public.inventory_item (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  category      TEXT,
  quantity      INT NOT NULL DEFAULT 0,
  unit          TEXT,
  reorder_level INT NOT NULL DEFAULT 0,
  location      TEXT,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ============================================================
-- 9. STORE MODULE
-- ============================================================

CREATE TABLE public.store_product (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              TEXT NOT NULL,
  description       TEXT,
  price             NUMERIC(10, 2) NOT NULL,
  category          TEXT,
  image_url         TEXT,
  stock_quantity    INT NOT NULL DEFAULT 0,
  required_badge_id UUID REFERENCES public.badge(id) ON DELETE SET NULL,
  is_active         BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE public.store_order (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES public.app_user(id) ON DELETE CASCADE,
  status           TEXT NOT NULL DEFAULT 'pending'
                     CHECK (status IN ('pending', 'processing', 'shipped', 'delivered')),
  total_amount     NUMERIC(10, 2) NOT NULL,
  shipping_address TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.store_order_item (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id   UUID NOT NULL REFERENCES public.store_order(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.store_product(id) ON DELETE CASCADE,
  quantity   INT NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL
);


-- ============================================================
-- 10. NOTIFICATIONS & BOOKMARKS
-- ============================================================

CREATE TABLE public.user_bookmark (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.app_user(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('project', 'challenge', 'event')),
  target_id   UUID NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, target_type, target_id)
);

CREATE TABLE public.user_notification (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES public.app_user(id) ON DELETE CASCADE,
  type       TEXT NOT NULL,
  message    TEXT NOT NULL,
  link       TEXT,
  read       BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ============================================================
-- 11. PERFORMANCE INDEXES
-- ============================================================

CREATE INDEX idx_project_owner       ON public.project(owner_id);
CREATE INDEX idx_project_status      ON public.project(status);
CREATE INDEX idx_project_image       ON public.project_image(project_id, display_order);
CREATE INDEX idx_project_video       ON public.project_video(project_id, display_order);
CREATE INDEX idx_challenge_status    ON public.challenge(status);
CREATE INDEX idx_challenge_image     ON public.challenge_image(challenge_id, display_order);
CREATE INDEX idx_challenge_video     ON public.challenge_video(challenge_id, display_order);
CREATE INDEX idx_event_start         ON public.event(start_date);
CREATE INDEX idx_event_image         ON public.event_image(event_id, display_order);
CREATE INDEX idx_event_video         ON public.event_video(event_id, display_order);
CREATE INDEX idx_comment_target      ON public.comment(target_type, target_id);
CREATE INDEX idx_reaction_target     ON public.reaction(target_type, target_id);
CREATE INDEX idx_entity_tag_target   ON public.entity_tag(target_type, target_id);
CREATE INDEX idx_user_bookmark_user  ON public.user_bookmark(user_id, target_type);
CREATE INDEX idx_user_notif_user     ON public.user_notification(user_id, read, created_at DESC);
CREATE INDEX idx_booking_user        ON public.equipment_booking(user_id);
CREATE INDEX idx_booking_equipment   ON public.equipment_booking(equipment_id, start_time);


-- ============================================================
-- 12. AUTO UPGRADE: Viewer → Maker on Project Approval
-- ============================================================

CREATE OR REPLACE FUNCTION auto_upgrade_to_maker_on_approval()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'active' AND OLD.status = 'pending_review' THEN
    UPDATE public.app_user
    SET role             = 'maker',
        upgraded_at      = now(),
        upgraded_trigger = 'project_approved'
    WHERE id = NEW.owner_id
      AND role = 'viewer';

    INSERT INTO public.user_notification (user_id, type, message, link)
    SELECT NEW.owner_id, 'role_upgraded',
           'Your project was approved — you are now a Maker! 🎉',
           '/dashboard'
    WHERE EXISTS (
      SELECT 1 FROM public.app_user
      WHERE id = NEW.owner_id AND role = 'maker'
        AND upgraded_trigger = 'project_approved'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER upgrade_on_project_approval
  AFTER UPDATE ON public.project
  FOR EACH ROW
  EXECUTE FUNCTION auto_upgrade_to_maker_on_approval();


-- ============================================================
-- 13. ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on every table
ALTER TABLE public.app_user           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maker_profile      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skill         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tag                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entity_tag         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_member     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_milestone  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_file       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_image      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_video      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_download   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badge              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badge         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_host     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_step     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_material ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_skill    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_vocab    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_level    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_completion ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_image    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_video    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registration ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_image        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_video        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_team         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_team_member  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_showcase_slot ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_submission   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reaction           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_booking  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_induction     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_item     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_product      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_order        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_order_item   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_bookmark      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notification  ENABLE ROW LEVEL SECURITY;

-- ── app_user ──────────────────────────────────────────────
CREATE POLICY "Users can insert own profile"
  ON public.app_user FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can read all profiles"
  ON public.app_user FOR SELECT USING (true);
CREATE POLICY "Users can update own profile"
  ON public.app_user FOR UPDATE USING (auth.uid() = id);

-- ── maker_profile ─────────────────────────────────────────
CREATE POLICY "Anyone can read public maker profiles"
  ON public.maker_profile FOR SELECT USING (true);
CREATE POLICY "Users can manage own maker profile"
  ON public.maker_profile FOR ALL USING (auth.uid() = user_id);

-- ── user_skill ────────────────────────────────────────────
CREATE POLICY "Users can manage own skills"
  ON public.user_skill FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Anyone can read skills"
  ON public.user_skill FOR SELECT USING (true);

-- ── tag ───────────────────────────────────────────────────
CREATE POLICY "Anyone can read tags"
  ON public.tag FOR SELECT USING (true);

-- ── entity_tag ────────────────────────────────────────────
CREATE POLICY "Anyone can read entity tags"
  ON public.entity_tag FOR SELECT USING (true);
CREATE POLICY "Authenticated users can tag"
  ON public.entity_tag FOR INSERT WITH CHECK (auth.uid() = tagged_by);

-- ── project ───────────────────────────────────────────────
CREATE POLICY "Anyone can read public active projects"
  ON public.project FOR SELECT
  USING (visibility = 'public' AND status = 'active' OR auth.uid() = owner_id);
CREATE POLICY "Authenticated users can create projects"
  ON public.project FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners can update their projects"
  ON public.project FOR UPDATE USING (auth.uid() = owner_id);

-- ── project sub-tables ────────────────────────────────────
CREATE POLICY "Anyone can view project members"
  ON public.project_member FOR SELECT USING (true);
CREATE POLICY "Anyone can view project milestones"
  ON public.project_milestone FOR SELECT USING (true);
CREATE POLICY "Anyone can view project files"
  ON public.project_file FOR SELECT USING (true);
CREATE POLICY "Anyone can view project images"
  ON public.project_image FOR SELECT USING (true);
CREATE POLICY "Anyone can view project videos"
  ON public.project_video FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert project media"
  ON public.project_image FOR INSERT WITH CHECK (auth.uid() = uploaded_by);
CREATE POLICY "Authenticated users can insert project videos"
  ON public.project_video FOR INSERT WITH CHECK (auth.uid() = added_by);

-- ── badge ─────────────────────────────────────────────────
CREATE POLICY "Anyone can view badges"
  ON public.badge FOR SELECT USING (true);
CREATE POLICY "Anyone can view user badges"
  ON public.user_badge FOR SELECT USING (true);

-- ── challenge ─────────────────────────────────────────────
CREATE POLICY "Anyone can view published challenges"
  ON public.challenge FOR SELECT USING (status = 'published' OR auth.uid() IS NOT NULL);
CREATE POLICY "Anyone can view challenge steps"
  ON public.challenge_step FOR SELECT USING (true);
CREATE POLICY "Anyone can view challenge materials"
  ON public.challenge_material FOR SELECT USING (true);
CREATE POLICY "Anyone can view challenge skills"
  ON public.challenge_skill FOR SELECT USING (true);
CREATE POLICY "Anyone can view challenge vocab"
  ON public.challenge_vocab FOR SELECT USING (true);
CREATE POLICY "Anyone can view challenge levels"
  ON public.challenge_level FOR SELECT USING (true);
CREATE POLICY "Anyone can view challenge images"
  ON public.challenge_image FOR SELECT USING (true);
CREATE POLICY "Anyone can view challenge videos"
  ON public.challenge_video FOR SELECT USING (true);
CREATE POLICY "Authenticated users can complete challenges"
  ON public.challenge_completion FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own completions"
  ON public.challenge_completion FOR SELECT USING (auth.uid() = user_id);

-- ── event ─────────────────────────────────────────────────
CREATE POLICY "Anyone can view events"
  ON public.event FOR SELECT USING (true);
CREATE POLICY "Users can register for events"
  ON public.event_registration FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view event registrations"
  ON public.event_registration FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view event images"
  ON public.event_image FOR SELECT USING (true);
CREATE POLICY "Anyone can view event videos"
  ON public.event_video FOR SELECT USING (true);
CREATE POLICY "Anyone can view event teams"
  ON public.event_team FOR SELECT USING (true);
CREATE POLICY "Anyone can view event team members"
  ON public.event_team_member FOR SELECT USING (true);
CREATE POLICY "Authenticated users can join teams"
  ON public.event_team_member FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Authenticated users can book showcase slots"
  ON public.event_showcase_slot FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Anyone can view showcase slots"
  ON public.event_showcase_slot FOR SELECT USING (true);

-- ── comment & reaction ────────────────────────────────────
CREATE POLICY "Anyone can read comments"
  ON public.comment FOR SELECT USING (true);
CREATE POLICY "Authenticated users can comment"
  ON public.comment FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments"
  ON public.comment FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view reactions"
  ON public.reaction FOR SELECT USING (true);
CREATE POLICY "Authenticated users can react"
  ON public.reaction FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove own reactions"
  ON public.reaction FOR DELETE USING (auth.uid() = user_id);

-- ── equipment ─────────────────────────────────────────────
CREATE POLICY "Anyone can view equipment"
  ON public.equipment FOR SELECT USING (true);
CREATE POLICY "Users can create bookings"
  ON public.equipment_booking FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own bookings"
  ON public.equipment_booking FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view inductions"
  ON public.user_induction FOR SELECT USING (true);

-- ── inventory ─────────────────────────────────────────────
CREATE POLICY "Authenticated users can view inventory"
  ON public.inventory_item FOR SELECT USING (auth.uid() IS NOT NULL);

-- ── store ─────────────────────────────────────────────────
CREATE POLICY "Anyone can view active products"
  ON public.store_product FOR SELECT USING (is_active = true);
CREATE POLICY "Users can create own orders"
  ON public.store_order FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own orders"
  ON public.store_order FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own order items"
  ON public.store_order_item FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.store_order WHERE id = order_id AND user_id = auth.uid()));

-- ── bookmarks & notifications ─────────────────────────────
CREATE POLICY "Users can manage own bookmarks"
  ON public.user_bookmark FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own notifications"
  ON public.user_notification FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can mark own notifications read"
  ON public.user_notification FOR UPDATE USING (auth.uid() = user_id);

-- ── mentor: allow reading and updating project status ──
CREATE POLICY "Mentors can read all projects"
  ON public.project FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.app_user
      WHERE id = auth.uid()
        AND role IN ('mentor', 'admin')
    )
  );

CREATE POLICY "Mentors can update project status"
  ON public.project FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.app_user
      WHERE id = auth.uid()
        AND role IN ('mentor', 'admin')
    )
  );

-- ── event_team: allow authenticated users to create teams ──
CREATE POLICY "Authenticated users can create teams"
  ON public.event_team FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Team leads can delete their team"
  ON public.event_team FOR DELETE USING (auth.uid() = created_by);
CREATE POLICY "Members can leave teams"
  ON public.event_team_member FOR DELETE USING (auth.uid() = user_id);


-- ============================================================
-- 14. STORAGE BUCKETS
-- Run this AFTER creating tables. Buckets are public-read
-- but upload-restricted to authenticated users.
-- ============================================================

-- Project images (public read, auth upload)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-images',
  'project-images',
  true,
  5242880,  -- 5 MB
  ARRAY['image/jpeg','image/png','image/webp','image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Project files (public read, auth upload)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-files',
  'project-files',
  true,
  52428800,  -- 50 MB
  NULL       -- allow all file types
) ON CONFLICT (id) DO NOTHING;

-- Avatars (public read, auth upload)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  2097152,  -- 2 MB
  ARRAY['image/jpeg','image/png','image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Challenge images (public read)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'challenge-images',
  'challenge-images',
  true,
  5242880,
  ARRAY['image/jpeg','image/png','image/webp','image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Event images (public read)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'event-images',
  'event-images',
  true,
  5242880,
  ARRAY['image/jpeg','image/png','image/webp','image/gif']
) ON CONFLICT (id) DO NOTHING;


-- ── Storage RLS Policies ──────────────────────────────────

-- project-images
CREATE POLICY "Public read project images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project-images');

CREATE POLICY "Auth users upload project images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'project-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users delete own project images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'project-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- project-files
CREATE POLICY "Public read project files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project-files');

CREATE POLICY "Auth users upload project files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'project-files' AND auth.role() = 'authenticated');

-- avatars
CREATE POLICY "Public read avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users update own avatar"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- challenge-images
CREATE POLICY "Public read challenge images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'challenge-images');

-- event-images
CREATE POLICY "Public read event images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'event-images');
