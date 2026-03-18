# PARAM MAKERSPACE — PRODUCT REQUIREMENTS DOCUMENT
**Version:** 1.0  
**Target Platform:** Antigravity (Claude Code)  
**Focus:** Scalable, Maintainable, Deployable Community Platform

---

## 📋 TABLE OF CONTENTS
1. [Executive Summary](#executive-summary)
2. [Tech Stack & Architecture](#tech-stack--architecture)
3. [Project Structure](#project-structure)
4. [Database Schema Reference](#database-schema-reference)
5. [User Roles & Permissions](#user-roles--permissions)
6. [Feature Specifications](#feature-specifications)
7. [API Endpoints](#api-endpoints)
8. [File Storage Strategy](#file-storage-strategy)
9. [Security & Authentication](#security--authentication)
10. [Deployment & CI/CD](#deployment--cicd)
11. [Testing Strategy](#testing-strategy)
12. [Phase Planning](#phase-planning)

---

## 🎯 EXECUTIVE SUMMARY

**What:** Community platform for makers to collaborate, learn, and showcase projects.

**Core Value Proposition:**
- Makers: Share projects, earn badges, participate in challenges/events
- Mentors: Guide community, approve content, manage events
- Admins: Full platform control, analytics, moderation

**Key Metrics:**
- Total makers registered
- Projects published (approved)
- Events hosted (with attendance)
- Challenges completed
- Equipment utilization rate
- Store revenue

---

## 🏗️ TECH STACK & ARCHITECTURE

### Recommended Stack (Flexibility + Simplicity)

```yaml
Frontend:
  Framework: Next.js 14 (App Router)
  Language: TypeScript
  Styling: Tailwind CSS
  UI Components: shadcn/ui
  State Management: React Context + Zustand (for complex state)
  Forms: React Hook Form + Zod validation
  
Backend:
  Database: Supabase (PostgreSQL)
  Auth: Supabase Auth
  Storage: Supabase Storage
  Realtime: Supabase Realtime (comments, registrations)
  API: Next.js API Routes + Supabase Edge Functions (complex logic)
  
Infrastructure:
  Hosting: Vercel (frontend + API routes)
  CDN: Vercel Edge Network
  Environment: Development, Staging, Production
  
Monitoring:
  Error Tracking: Sentry
  Analytics: Vercel Analytics + Custom Events
  Logs: Supabase Logs + Vercel Logs
```

### Why This Stack?

**vs Vanilla JS:**
- ✅ Component reusability (write once, use everywhere)
- ✅ Type safety prevents runtime errors
- ✅ Built-in routing, no manual SPA setup
- ✅ SEO optimization (SSR/SSG)
- ✅ Easier for future developers to maintain
- ✅ Rich ecosystem of packages

**Alternative Stack (if simpler needed):**
```yaml
Frontend: Vanilla JS + Vite (build tool)
Styling: Tailwind CSS (no change)
Backend: Supabase only (no Edge Functions)
```

---

## 📁 PROJECT STRUCTURE

```
param-makerspace/
├── .github/
│   └── workflows/
│       ├── ci.yml                    # Run tests on PR
│       ├── deploy-staging.yml        # Auto-deploy to staging
│       └── deploy-production.yml     # Manual deploy to prod
├── supabase/
│   ├── migrations/
│   │   ├── 20240101000000_initial_schema.sql
│   │   ├── 20240102000000_add_media_tables.sql
│   │   └── 20240103000000_add_indexes.sql
│   ├── functions/                    # Edge Functions
│   │   ├── send-notification/
│   │   ├── process-badge-award/
│   │   └── check-equipment-availability/
│   ├── seed.sql                      # Initial data
│   └── config.toml
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (public)/                 # Public routes (no auth)
│   │   │   ├── page.tsx              # Homepage (Hero Landing + Inline Auth)
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx          # Projects listing
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx      # Single project
│   │   │   ├── challenges/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── events/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── makers/
│   │   │   │   ├── page.tsx          # Directory
│   │   │   │   └── [slug]/page.tsx   # Profile
│   │   │   ├── badges/page.tsx
│   │   │   ├── tags/
│   │   │   │   └── [slug]/page.tsx
│   │   │   └── store/page.tsx
│   │   ├── auth/                     # Auth callback routes only
│   │   │   ├── callback/route.ts     # Email verification callback
│   │   │   └── reset-password/page.tsx  # Password reset page
│   │   ├── onboarding/page.tsx       # Viewer → Maker onboarding
│   │   ├── (dashboard)/              # Maker dashboard (protected)
│   │   │   ├── layout.tsx            # Dashboard layout
│   │   │   ├── page.tsx              # Dashboard home
│   │   │   ├── profile/page.tsx
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx          # My projects
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [id]/edit/page.tsx
│   │   │   ├── challenges/page.tsx
│   │   │   ├── events/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── [id]/team/page.tsx
│   │   │   │   └── [id]/showcase/page.tsx
│   │   │   ├── equipment/
│   │   │   │   ├── page.tsx
│   │   │   │   └── bookings/page.tsx
│   │   │   └── orders/page.tsx
│   │   ├── (mentor)/                 # Mentor routes (protected)
│   │   │   ├── review/
│   │   │   │   ├── projects/page.tsx
│   │   │   │   └── challenges/page.tsx
│   │   │   ├── events/
│   │   │   │   ├── new/page.tsx
│   │   │   │   ├── [id]/edit/page.tsx
│   │   │   │   └── [id]/manage/page.tsx
│   │   │   └── inductions/page.tsx
│   │   ├── (admin)/                  # Admin panel (protected)
│   │   │   ├── users/page.tsx
│   │   │   ├── challenges/page.tsx
│   │   │   ├── badges/page.tsx
│   │   │   ├── tags/page.tsx
│   │   │   ├── store/page.tsx
│   │   │   ├── equipment/page.tsx
│   │   │   ├── inventory/page.tsx
│   │   │   ├── moderation/page.tsx
│   │   │   └── check-in/page.tsx
│   │   ├── api/                      # API routes
│   │   │   ├── projects/route.ts
│   │   │   ├── challenges/route.ts
│   │   │   ├── events/route.ts
│   │   │   ├── upload/route.ts       # File upload handler
│   │   │   └── webhooks/
│   │   │       └── supabase/route.ts
│   │   ├── layout.tsx                # Root layout
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                       # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── form.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   ├── auth/                     # Authentication components
│   │   │   ├── LoginModal.tsx        # Inline login form
│   │   │   ├── RegisterModal.tsx     # Inline register form
│   │   │   ├── ForgotPasswordForm.tsx
│   │   │   └── AuthDropdown.tsx      # Navbar auth dropdown
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── DashboardNav.tsx
│   │   ├── projects/
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── ProjectFilters.tsx
│   │   │   ├── ProjectForm.tsx
│   │   │   ├── ImageGallery.tsx
│   │   │   └── VideoEmbed.tsx
│   │   ├── challenges/
│   │   │   ├── ChallengeCard.tsx
│   │   │   ├── ChallengeSteps.tsx
│   │   │   └── CompletionForm.tsx
│   │   ├── events/
│   │   │   ├── EventCard.tsx
│   │   │   ├── RegistrationButton.tsx
│   │   │   ├── TeamManager.tsx
│   │   │   └── ShowcaseSlotForm.tsx
│   │   ├── makers/
│   │   │   ├── MakerCard.tsx
│   │   │   └── MakerStats.tsx
│   │   ├── badges/
│   │   │   ├── BadgeDisplay.tsx
│   │   │   └── BadgeCatalog.tsx
│   │   ├── equipment/
│   │   │   ├── EquipmentCard.tsx
│   │   │   └── BookingCalendar.tsx
│   │   ├── store/
│   │   │   ├── ProductCard.tsx
│   │   │   └── CheckoutForm.tsx
│   │   ├── comments/
│   │   │   ├── CommentThread.tsx
│   │   │   └── CommentForm.tsx
│   │   ├── reactions/
│   │   │   └── ReactionBar.tsx
│   │   └── shared/
│   │       ├── FileUpload.tsx
│   │       ├── ImageUpload.tsx
│   │       ├── VideoLinkInput.tsx
│   │       ├── TagSelector.tsx
│   │       ├── RoleGuard.tsx
│   │       ├── BookmarkButton.tsx    # For Viewers & Makers to save content
│   │       └── LoadingSpinner.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts             # Browser client
│   │   │   ├── server.ts             # Server client
│   │   │   ├── middleware.ts         # Auth middleware
│   │   │   └── types.ts              # Generated types
│   │   ├── utils/
│   │   │   ├── video-url.ts          # YouTube/Vimeo embed conversion
│   │   │   ├── file-upload.ts        # Upload utilities
│   │   │   ├── date.ts               # Date formatting
│   │   │   └── permissions.ts        # Role checks
│   │   ├── validations/
│   │   │   ├── project.ts            # Zod schemas
│   │   │   ├── challenge.ts
│   │   │   ├── event.ts
│   │   │   └── user.ts
│   │   └── constants/
│   │       ├── domains.ts
│   │       ├── tiers.ts
│   │       ├── event-types.ts
│   │       └── roles.ts
│   ├── hooks/
│   │   ├── use-user.ts               # Current user context
│   │   ├── use-projects.ts           # Project queries
│   │   ├── use-realtime.ts           # Realtime subscriptions
│   │   ├── use-bookmarks.ts          # Bookmark management (for Viewers & Makers)
│   │   └── use-upload.ts             # File upload hook
│   └── types/
│       ├── database.ts               # Supabase generated types
│       ├── api.ts                    # API response types
│       └── index.ts
├── public/
│   ├── images/
│   └── icons/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.local.example
├── .env.staging
├── .env.production
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── README.md
```

---

## 🗄️ DATABASE SCHEMA REFERENCE

### 35 Tables (from ER Diagram v6)

**USER MODULE (Yellow)**
- `app_user` - Core user table (id, email, name, role, is_active)
- `maker_profile` - Extended profile (bio, aspirations, avatar, slug, github, linkedin, public)
- `user_skill` - Maker skills (user_id, skill_name, domain, source)

**EXPLORER MODULE (Teal)**
- `project` - User projects (id, title, description, owner_id, status, visibility, domain, tier)
- `project_collaborator` - Project team members
- `project_milestone` - Project milestones
- `project_file` - Uploaded files (code, PDFs, STL)
- `project_image` ⭐ NEW - Image gallery (display_order, cover)
- `project_video` ⭐ NEW - Video links (YouTube/Vimeo)

**BADGE MODULE (Orange)**
- `badge` - Badge catalog (name, description, tier, domain, type, criteria, image)
- `user_badge` - Badges earned by users
- `badge_pathway` - Badge prerequisites

**COMMUNITY MODULE (Pink)**
- `challenge` - Platform challenges (title, mystery, core_idea, mission, tier, domain, status)
- `challenge_step` - Ordered steps
- `challenge_material` - Required materials
- `challenge_skill` - Required skills
- `challenge_vocab` - Vocabulary list
- `challenge_level` - Difficulty levels
- `challenge_completion` - User completions (verified_by, notes)
- `challenge_image` ⭐ NEW - Image gallery
- `challenge_video` ⭐ NEW - Video links
- `comment` - Polymorphic comments (target_type, target_id)
- `reaction` - Polymorphic reactions (like, upvote, bookmark)

**EVENT MODULE (Blue)**
- `event` - Events (title, description, type, start_date, end_date, capacity, registration_open)
- `event_registration` - User registrations
- `event_image` ⭐ NEW - Image gallery
- `event_video` ⭐ NEW - Video links
- `event_team` - Teams for build challenges
- `event_team_member` - Team rosters
- `event_submission` - Project submissions
- `event_showcase_slot` - Showcase bookings for maker meetups

**OPS MODULE (Green)**
- `equipment` - Makerspace equipment (name, category, status, location, requires_induction)
- `equipment_booking` - Booking calendar
- `user_induction` - Equipment certifications
- `inventory` - Materials/consumables (quantity, reorder_level)

**STORE MODULE (Red)**
- `product` - Store products (name, description, price, category, stock, required_badge_id)
- `order` - User orders
- `order_item` - Line items

**TAGS MODULE (Lime)** ⭐ NEW
- `tag` - Tag catalog (name, slug, category)
- `entity_tag` - Polymorphic tag assignments (target_type, target_id)

### Media Tables (v6 Updates)

```sql
-- Images for projects, challenges, events
CREATE TABLE project_image (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES project(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 1,
  uploaded_by UUID NOT NULL REFERENCES app_user(id),
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE challenge_image (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES challenge(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 1,
  uploaded_by UUID NOT NULL REFERENCES app_user(id),
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE event_image (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES event(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 1,
  uploaded_by UUID NOT NULL REFERENCES app_user(id),
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Video links for projects, challenges, events
CREATE TABLE project_video (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES project(id) ON DELETE CASCADE,
  title TEXT,
  video_url TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 1,
  added_by UUID NOT NULL REFERENCES app_user(id),
  added_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE challenge_video (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES challenge(id) ON DELETE CASCADE,
  title TEXT,
  video_url TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 1,
  added_by UUID NOT NULL REFERENCES app_user(id),
  added_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE event_video (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES event(id) ON DELETE CASCADE,
  title TEXT,
  video_url TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 1,
  added_by UUID NOT NULL REFERENCES app_user(id),
  added_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_project_image_project ON project_image(project_id, display_order);
CREATE INDEX idx_challenge_image_challenge ON challenge_image(challenge_id, display_order);
CREATE INDEX idx_event_image_event ON event_image(event_id, display_order);
CREATE INDEX idx_project_video_project ON project_video(project_id, display_order);
CREATE INDEX idx_challenge_video_challenge ON challenge_video(challenge_id, display_order);
CREATE INDEX idx_event_video_event ON event_video(event_id, display_order);
```

### Additional Schema for Viewer → Maker Upgrade System

```sql
-- Add upgrade tracking fields to app_user table
ALTER TABLE app_user ADD COLUMN upgraded_at TIMESTAMPTZ;
ALTER TABLE app_user ADD COLUMN upgraded_trigger TEXT;  -- 'project', 'challenge_completion', 'event_registration', 'equipment_booking'

-- Bookmark system (for ALL logged-in users to save content)
CREATE TABLE user_bookmark (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL,  -- 'project', 'challenge', 'event'
  target_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, target_type, target_id)
);

CREATE INDEX idx_user_bookmark_user ON user_bookmark(user_id, target_type);
CREATE INDEX idx_user_bookmark_target ON user_bookmark(target_type, target_id);

-- View tracking (for analytics and viewer activity)
CREATE TABLE user_view (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES app_user(id) ON DELETE SET NULL,  -- Nullable for anonymous views
  target_type TEXT NOT NULL,  -- 'project', 'challenge', 'event', 'maker'
  target_id UUID NOT NULL,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_user_view_user ON user_view(user_id, viewed_at DESC);
CREATE INDEX idx_user_view_target ON user_view(target_type, target_id);

-- Optional: Notification table for upgrade alerts and activity updates
CREATE TABLE user_notification (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  type TEXT NOT NULL,  -- 'role_upgraded', 'badge_earned', 'project_approved', 'bookmark_updated', etc.
  message TEXT NOT NULL,
  link TEXT,  -- Optional link to relevant content
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_user_notification_user ON user_notification(user_id, read, created_at DESC);
```

---

## 👥 USER ROLES & PERMISSIONS

### Role Hierarchy
```
Viewer (default on signup) → Maker (after first project approved) → Mentor (promoted by admin) → Admin (promoted by admin)
(Each role includes permissions of roles below)
```

### 🔄 Role Progression System

**Viewer → Maker Upgrade:**
- New users register with role = 'viewer'
- **ONLY ONE PATH TO MAKER:** Submit a project AND get it approved by admin/mentor
  - Viewer creates project (draft) → Submits for review → Admin/Mentor approves → ⚡ Viewer becomes Maker
  - No other paths (challenges, events, equipment do NOT unlock Maker status)
  
**Why this matters:**
- Ensures every Maker has contributed actual work (quality control)
- Prevents spam accounts (must create real project)
- Projects are the core of the platform (aligns incentives)
- Clear, single path (no confusion about how to unlock Maker)

**Implementation:**
```sql
-- Function to auto-upgrade to maker ONLY on project approval
CREATE OR REPLACE FUNCTION auto_upgrade_to_maker_on_approval()
RETURNS TRIGGER AS $$
DECLARE
  project_owner_role TEXT;
BEGIN
  -- Only trigger when status changes to 'active' (approved)
  IF NEW.status = 'active' AND OLD.status = 'pending_review' THEN
    
    -- Check if owner is currently a viewer
    SELECT role INTO project_owner_role
    FROM app_user
    WHERE id = NEW.owner_id;
    
    -- Upgrade to maker if they were a viewer
    IF project_owner_role = 'viewer' THEN
      UPDATE app_user 
      SET role = 'maker', 
          upgraded_at = now(),
          upgraded_trigger = 'project_approved'
      WHERE id = NEW.owner_id;
      
      -- Send notification
      INSERT INTO user_notification (user_id, type, message, link, created_at)
      VALUES (
        NEW.owner_id, 
        'role_upgraded', 
        'Congratulations! Your project was approved and you are now a MAKER! 🎉', 
        '/dashboard',
        now()
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger ONLY on project approval (not on challenge, event, or equipment)
CREATE TRIGGER upgrade_on_project_approval
  AFTER UPDATE ON project
  FOR EACH ROW
  EXECUTE FUNCTION auto_upgrade_to_maker_on_approval();
```

**NO triggers on:**
- ❌ challenge_completion
- ❌ event_registration  
- ❌ equipment_booking

These actions are available to Makers only.

### Permission Matrix

| Action | Viewer (default) | Maker (after project approved) | Mentor | Admin |
|--------|--------|-------|--------|-------|
| **Projects** |
| View public projects | ✅ | ✅ | ✅ | ✅ |
| Create project | ✅ (draft only) | ✅ | ✅ | ✅ |
| Submit project for review | ✅ ⭐ Path to Maker | ✅ | ✅ | ✅ |
| Edit own project | ✅ (draft only) | ✅ | ✅ | ✅ |
| Approve/reject projects | ❌ | ❌ | ✅ | ✅ |
| Delete any project | ❌ | ❌ | ❌ | ✅ |
| **Challenges** |
| View published challenges | ✅ | ✅ | ✅ | ✅ |
| Complete challenges | ✅ | ✅ | ✅ | ✅ |
| Verify completions | ❌ | ❌ | ✅ | ✅ |
| Create/edit challenges | ❌ | ❌ | ❌ | ✅ |
| **Events** |
| View events | ✅ | ✅ | ✅ | ✅ |
| Register for events | ✅ | ✅ | ✅ | ✅ |
| Join/create teams (build challenges) | ✅ | ✅ | ✅ | ✅ |
| Book showcase slots (meetups) | ✅ | ✅ | ✅ | ✅ |
| Create events | ❌ | ❌ | ✅ | ✅ |
| Manage event registrations | ❌ | ❌ | ✅ | ✅ |
| Manual check-in | ❌ | ❌ | ❌ | ✅ |
| **Equipment** |
| View equipment | ✅ | ✅ | ✅ | ✅ |
| Book equipment | ✅ | ✅ | ✅ | ✅ |
| Manage inductions | ❌ | ❌ | ✅ | ✅ |
| Add/edit equipment | ❌ | ❌ | ❌ | ✅ |
| **Store** |
| View products | ✅ | ✅ | ✅ | ✅ |
| Purchase products | ✅ | ✅ | ✅ | ✅ |
| Manage products/orders | ❌ | ❌ | ❌ | ✅ |
| **Community** |
| View comments/reactions | ✅ | ✅ | ✅ | ✅ |
| Post comments/reactions | ❌ | ✅ | ✅ | ✅ |
| Moderate comments | ❌ | ❌ | ❌ | ✅ |
| **Profile** |
| Setup basic profile | ✅ | ✅ | ✅ | ✅ |
| Bookmark content | ✅ | ✅ | ✅ | ✅ |
| Make profile public | ❌ | ✅ | ✅ | ✅ |
| **Admin** |
| User management | ❌ | ❌ | ❌ | ✅ |
| Badge management | ❌ | ❌ | ❌ | ✅ |
| Tag management | ❌ | ❌ | ❌ | ✅ |
| View analytics | ❌ | ❌ | ✅ | ✅ |

**⭐ = The ONLY action that unlocks Maker status (create project + get approved)**

**Key Philosophy:**
- **Viewers can PARTICIPATE** (challenges, events, equipment, store) - encourages engagement
- **Viewers cannot CONTRIBUTE to community** (no comments/reactions) - maintains quality
- **Only PROJECT APPROVAL unlocks Maker** - ensures every Maker has built something real
- **Makers unlock social features** (comments, reactions, public profile) - reward for contribution

### Implementation

```typescript
// lib/utils/permissions.ts
export enum Role {
  VIEWER = 'viewer',
  MAKER = 'maker',
  MENTOR = 'mentor',
  ADMIN = 'admin'
}

const roleHierarchy = {
  [Role.VIEWER]: 0,
  [Role.MAKER]: 1,
  [Role.MENTOR]: 2,
  [Role.ADMIN]: 3
}

export function hasRole(userRole: Role, requiredRole: Role): boolean {
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}

export function canApproveProjects(userRole: Role): boolean {
  return hasRole(userRole, Role.MENTOR)
}

export function canManageUsers(userRole: Role): boolean {
  return userRole === Role.ADMIN
}

// More permission checks...
```

---

## 🎨 FEATURE SPECIFICATIONS

### 1. PUBLIC PAGES (No Authentication Required)

#### 1.1 Homepage / Hero Landing Page (`/`)

**Purpose:** Showcase the platform's value proposition and inspire visitors to join

**Philosophy:** "Show the value first, then ask for signup"

**Layout:**
```
┌────────────────────────────────────────────────────────────┐
│  NAVBAR: Logo | Projects | Challenges | Events | Makers    │
│          | Badges | Store                    [ Login ▾ ]   │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│                    HERO SECTION                            │
│  ┌────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │   PARAM MAKERSPACE                                  │   │
│  │   Where Ideas Become Reality                        │   │
│  │                                                     │   │
│  │   A community of builders, thinkers, and creators  │   │
│  │   collaborating on real-world projects.            │   │
│  │                                                     │   │
│  │   ✨ Learn by Building                             │   │
│  │   🤝 Collaborate with Makers                        │   │
│  │   🏆 Showcase Your Work                             │   │
│  │   🔧 Access Tools & Resources                       │   │
│  │                                                     │   │
│  │   [ Start Your First Project ]                     │   │
│  │   [ Explore What Others Built ]                    │   │
│  │                                                     │   │
│  └────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│              PLATFORM STATISTICS                           │
│  ┌───────────┬───────────┬───────────┬───────────┐        │
│  │    500+   │    300+   │    50+    │    20+    │        │
│  │  Makers   │ Projects  │  Events   │Challenges │        │
│  └───────────┴───────────┴───────────┴───────────┘        │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│        FEATURED PROJECTS (4-6 cards, curated)              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│  │ IoT Plant│ │  Robot   │ │ 3D Print │ │ Smart    │     │
│  │ Monitor  │ │  Car     │ │ Drone    │ │ Mirror   │     │
│  │ by Sarah │ │ by Alex  │ │ by Mike  │ │ by Jane  │     │
│  │ ⭐⭐⭐⭐⭐ │ │ ⭐⭐⭐⭐   │ │ ⭐⭐⭐⭐⭐ │ │ ⭐⭐⭐⭐⭐  │     │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘     │
│                                                            │
│              [ View All Projects ]                         │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│        ACTIVE CHALLENGES (3-4 cards)                       │
│  ┌─────────────────────────────────────────┐              │
│  │  🏆 Build Your First Arduino Robot      │              │
│  │  Difficulty: Beginner | 50 completions  │              │
│  │  Learn basics while building something  │              │
│  │  [ Start Challenge ]                    │              │
│  └─────────────────────────────────────────┘              │
│                                                            │
│  ┌─────────────────────────────────────────┐              │
│  │  🚀 IoT Weather Station                 │              │
│  │  Difficulty: Intermediate | 23 completions │           │
│  │  Connect sensors to the cloud           │              │
│  │  [ Start Challenge ]                    │              │
│  └─────────────────────────────────────────┘              │
│                                                            │
│              [ Browse All Challenges ]                     │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│        UPCOMING EVENTS (3 cards, next events)              │
│  ┌─────────────────────────────────────────┐              │
│  │  📅 Weekend Build Challenge             │              │
│  │  March 20-21 | Makerspace Lab           │              │
│  │  Build a line-following robot in 2 days │              │
│  │  25/30 spots taken                      │              │
│  │  [ Learn More ]                         │              │
│  └─────────────────────────────────────────┘              │
│                                                            │
│              [ See All Events ]                            │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│        WHY JOIN PARAM MAKERSPACE?                          │
│                                                            │
│  ┌──────────────────┬──────────────────┬────────────────┐ │
│  │  🎓 Learn       │  🤝 Collaborate  │  🏆 Showcase   │ │
│  │  Real skills    │  Join teams      │  Build your    │ │
│  │  through        │  Work on group   │  portfolio     │ │
│  │  hands-on       │  projects        │  Earn badges   │ │
│  │  projects       │  Get mentored    │  Get recognized│ │
│  └──────────────────┴──────────────────┴────────────────┘ │
│                                                            │
│  ┌──────────────────┬──────────────────┬────────────────┐ │
│  │  🔧 Access      │  🎯 Challenge    │  🌟 Community  │ │
│  │  Equipment      │  Yourself        │  Be part of    │ │
│  │  3D printers    │  Complete        │  something     │ │
│  │  Laser cutters  │  guided          │  bigger        │ │
│  │  Electronics    │  projects        │  Make friends  │ │
│  └──────────────────┴──────────────────┴────────────────┘ │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│        HOW IT WORKS                                        │
│                                                            │
│  1. 🔍 Explore                                             │
│     Browse projects, challenges, and events freely         │
│     No signup required to see what's possible              │
│                                                            │
│  2. 📝 Create Account                                      │
│     Join as a Viewer - bookmark projects, setup profile    │
│     Start planning your first build                        │
│                                                            │
│  3. 🔨 Build Your First Project                            │
│     Create and submit your project for review              │
│     Get approved → Unlock full Maker access                │
│                                                            │
│  4. 🚀 Join the Community                                  │
│     Complete challenges, attend events, help others        │
│     Grow your skills and portfolio                         │
│                                                            │
│  [ Get Started - It's Free ]                               │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│        SUCCESS STORIES (Testimonials, optional)            │
│  "I went from zero electronics knowledge to building       │
│   my own IoT devices in 3 months!" - Sarah K.             │
│                                                            │
│  "The weekend build challenges pushed me to try things    │
│   I never thought I could do." - Alex M.                  │
└────────────────────────────────────────────────────────────┘

│  FOOTER: About | Contact | GitHub | Privacy | Terms       │
└────────────────────────────────────────────────────────────┘
```

**Key Elements:**

1. **Hero Value Proposition:**
   - Clear tagline: "Where Ideas Become Reality"
   - Four core values immediately visible
   - Dual CTAs: "Start Project" (for doers) + "Explore" (for browsers)

2. **Social Proof:**
   - Real statistics (500+ makers, 300+ projects)
   - Shows active, thriving community

3. **Featured Content:**
   - **Projects:** Curated best examples (not just recent)
   - **Challenges:** Active with completion counts (social proof)
   - **Events:** Real upcoming events with availability

4. **Benefits Section:**
   - 6 value propositions (Learn, Collaborate, Showcase, Access, Challenge, Community)
   - Concrete benefits (not vague promises)

5. **Clear Path:**
   - Step-by-step "How It Works"
   - Emphasizes: Explore → Join → Build → Unlock

6. **Trust Builders:**
   - Testimonials (optional but powerful)
   - Real maker names and projects

**What Makes This Work:**

✅ **Value First:** Shows what you GET before asking signup  
✅ **Inspiration:** Real projects inspire visitors  
✅ **Community:** Numbers show you're joining something active  
✅ **Clarity:** Exactly how to become a Maker (build + approve)  
✅ **Low Friction:** Can explore everything without login

---

#### 1.2 Projects Listing (`/projects`)

**Features:**
- Grid/list view toggle
- Filters:
  - Domain (dropdown with all unique domains)
  - Tier (beginner, intermediate, advanced, expert)
  - Tags (multi-select from tag catalog)
- Sort by: Recent, Popular (reaction count), A-Z
- Pagination (20 per page)
- Search by title/description

**Project Card:**
```typescript
// components/projects/ProjectCard.tsx
interface ProjectCardProps {
  project: {
    id: string
    title: string
    one_line_summary: string
    domain: string
    tier: string
    created_at: string
    app_user: { name: string }
    project_image: { image_url: string, display_order: number }[]
    entity_tag: { tag: { name: string } }[]
    reactions: { type: string }[]  // Aggregated
  }
}

export function ProjectCard({ project }: ProjectCardProps) {
  const coverImage = project.project_image.find(img => img.display_order === 1)
  const likeCount = project.reactions.filter(r => r.type === 'like').length
  
  return (
    <Card>
      <CardImage src={coverImage?.image_url || '/placeholder.jpg'} />
      <CardContent>
        <Badge variant={getTierVariant(project.tier)}>{project.tier}</Badge>
        <h3>{project.title}</h3>
        <p>{project.one_line_summary}</p>
        <div className="tags">
          {project.entity_tag.map(t => <Tag key={t.tag.name}>{t.tag.name}</Tag>)}
        </div>
        <div className="meta">
          <span>{project.app_user.name}</span>
          <span>{likeCount} likes</span>
        </div>
      </CardContent>
    </Card>
  )
}
```

**Filtering Query:**
```typescript
let query = supabase
  .from('project')
  .select(`
    *,
    app_user(name),
    project_image(image_url, display_order),
    entity_tag(tag(name)),
    reactions:reaction(type)
  `)
  .eq('status', 'active')
  .eq('visibility', 'public')

if (filters.domain) query = query.eq('domain', filters.domain)
if (filters.tier) query = query.eq('tier', filters.tier)
if (filters.tags?.length) {
  // Join with entity_tag for tag filtering
  query = query.in('id', taggedProjectIds)
}

const { data } = await query.range(offset, offset + limit - 1)
```

---

#### 1.3 Single Project Page (`/projects/[id]`)

**Layout:**
```
┌─────────────────────────────────────────┐
│  Cover Image (full width)              │
├─────────────────────────────────────────┤
│  ┌─────────────────────┬──────────────┐ │
│  │ Title               │ Reactions    │ │
│  │ One-line summary    │ Like Upvote  │ │
│  │ By: Maker Name      │ Bookmark     │ │
│  │                     │ 🔖 Save      │ │ ← Available to ALL logged-in users (Viewers + Makers)
│  ├─────────────────────┴──────────────┤ │
│  │ Domain | Tier | Duration           │ │
│  ├──────────────────────────────────  │ │
│  │ Description (full markdown)        │ │
│  ├────────────────────────────────────│ │
│  │ Image Gallery (2-3 columns)        │ │
│  ├────────────────────────────────────│ │
│  │ Video Embeds (YouTube/Vimeo)       │ │
│  ├────────────────────────────────────│ │
│  │ Milestones (timeline view)         │ │
│  ├────────────────────────────────────│ │
│  │ Team Members (if collaborative)    │ │
│  ├────────────────────────────────────│ │
│  │ Files (downloadable list)          │ │
│  ├────────────────────────────────────│ │
│  │ GitHub Link | Tags                 │ │
│  ├────────────────────────────────────│ │
│  │ Comment Thread (realtime)          │ │ ← Only Makers can comment
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Data Loading:**
```typescript
async function getProject(id: string) {
  const { data: project } = await supabase
    .from('project')
    .select(`
      *,
      app_user(name, maker_profile(avatar, slug)),
      project_image(image_url, display_order),
      project_video(id, title, video_url, display_order),
      project_file(id, file_name, file_type, file_url, file_size),
      project_milestone(id, title, description, due_date, is_completed),
      project_collaborator(app_user(name)),
      entity_tag(tag(name, slug)),
      reactions:reaction(type, app_user(name))
    `)
    .eq('id', id)
    .single()
    
  // Also fetch comments separately for realtime
  const { data: comments } = await supabase
    .from('comment')
    .select('*, app_user(name, maker_profile(avatar))')
    .eq('target_type', 'project')
    .eq('target_id', id)
    .order('created_at', { ascending: true })
    
  return { project, comments }
}
```

**Video Embed Conversion:**
```typescript
// lib/utils/video-url.ts
export function getEmbedUrl(url: string): string | null {
  // YouTube: https://www.youtube.com/watch?v=VIDEO_ID
  // Convert to: https://www.youtube.com/embed/VIDEO_ID
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)
  if (youtubeMatch) return `https://www.youtube.com/embed/${youtubeMatch[1]}`
  
  // Vimeo: https://vimeo.com/VIDEO_ID
  // Convert to: https://player.vimeo.com/video/VIDEO_ID
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`
  
  return null
}
```

**Realtime Comments:**
```typescript
// hooks/use-realtime.ts
export function useRealtimeComments(targetType: string, targetId: string) {
  const [comments, setComments] = useState<Comment[]>([])
  
  useEffect(() => {
    const channel = supabase
      .channel('comments')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'comment',
        filter: `target_type=eq.${targetType}&target_id=eq.${targetId}`
      }, (payload) => {
        setComments(prev => [...prev, payload.new as Comment])
      })
      .subscribe()
      
    return () => { supabase.removeChannel(channel) }
  }, [targetType, targetId])
  
  return comments
}
```

**Reaction System:**
```typescript
// components/reactions/ReactionBar.tsx
async function toggleReaction(type: 'like' | 'upvote' | 'bookmark') {
  const { data: existing } = await supabase
    .from('reaction')
    .select('id')
    .eq('target_type', 'project')
    .eq('target_id', projectId)
    .eq('user_id', userId)
    .eq('type', type)
    .single()
    
  if (existing) {
    await supabase.from('reaction').delete().eq('id', existing.id)
  } else {
    await supabase.from('reaction').insert({
      target_type: 'project',
      target_id: projectId,
      user_id: userId,
      type
    })
  }
}
```

---

#### 1.4 Challenges Listing (`/challenges`)

**Similar to Projects Listing but with:**
- Filter by: Tier, Domain, Tags, Time Estimate (<1hr, 1-4hr, 4+hr)
- Card shows: Cover image, title, tier, domain, time estimate, completion count
- Badge for completed (if logged in)

---

#### 1.5 Single Challenge Page (`/challenges/[id]`)

**Layout:**
```
┌─────────────────────────────────────────┐
│  Cover Image                            │
├─────────────────────────────────────────┤
│  Title | Tier | Domain | Time Estimate  │
├─────────────────────────────────────────┤
│  Mystery (hook/question)                │
│  Core Idea (concept overview)           │
│  Mission (what you'll build)            │
├─────────────────────────────────────────┤
│  Steps (ordered, numbered)              │
│    1. Step title                        │
│       Step description                  │
├─────────────────────────────────────────┤
│  Materials Needed                       │
│  Skills Required                        │
│  Vocabulary                             │
│  Levels (beginner, intermediate, etc.)  │
├─────────────────────────────────────────┤
│  Success Criteria                       │
├─────────────────────────────────────────┤
│  Image Gallery                          │
│  Video Embeds                           │
├─────────────────────────────────────────┤
│  [Mark as Completed] button (if maker)  │
│  Completion Count                       │
├─────────────────────────────────────────┤
│  Comments                               │
└─────────────────────────────────────────┘
```

**Completion Flow:**
```typescript
// components/challenges/CompletionForm.tsx
async function submitCompletion(challengeId: string, notes: string) {
  const { error } = await supabase
    .from('challenge_completion')
    .insert({
      challenge_id: challengeId,
      user_id: userId,
      completion_notes: notes,
      completed_at: new Date().toISOString()
    })
    
  if (!error) {
    toast.success('Completion submitted! Awaiting verification.')
  }
}
```

---

#### 1.6 Events Listing (`/events`)

**Grouping:**
- Build Challenges
- Maker Meetups
- Tech Tuesdays

**Event Card:**
- Cover image
- Title
- Date & time
- Location
- Type badge
- Registration status (Open / Closed / Full)
- Capacity remaining

**Filtering:**
- Type
- Date range (upcoming, this week, this month)
- Registration status

---

#### 1.7 Single Event Page (`/events/[id]`)

**Dynamic Content by Event Type:**

**Build Challenge:**
```
- Event details
- Registration button
- Teams list (if registered)
- Submissions (project links)
- Winners announcement (if past)
```

**Maker Meetup:**
```
- Event details
- Registration button
- Showcase slots (approved only)
- Schedule
```

**Tech Tuesday:**
```
- Event details
- Registration button
- Topic/speaker info
- Recap link (if past)
```

**Registration Logic:**
```typescript
async function registerForEvent(eventId: string) {
  // Check capacity
  const { data: event } = await supabase
    .from('event')
    .select('capacity, event_registration(count)')
    .eq('id', eventId)
    .single()
    
  const currentCount = event.event_registration[0].count
  if (currentCount >= event.capacity) {
    toast.error('Event is full')
    return
  }
  
  // Register
  await supabase.from('event_registration').insert({
    event_id: eventId,
    user_id: userId
  })
  
  // If auto_badge_id is set, award badge on registration
  if (event.auto_badge_id) {
    await supabase.from('user_badge').insert({
      user_id: userId,
      badge_id: event.auto_badge_id,
      reason: `Registered for ${event.title}`
    })
  }
}
```

---

#### 1.8 Makers Directory (`/makers`)

**Features:**
- Grid view with avatar, name, bio snippet, skills
- Filter by: Skills, Domain, Tags
- Search by name
- Sort by: Recent, Most badges, Most projects

**Maker Card:**
```typescript
interface MakerCardProps {
  maker: {
    name: string
    maker_profile: {
      avatar: string
      bio: string
      slug: string
    }
    user_skill: { skill_name: string, domain: string }[]
    user_badge: { badge: { name: string, image: string } }[]
    entity_tag: { tag: { name: string } }[]
  }
}
```

---

#### 1.9 Single Maker Profile (`/makers/[slug]`)

**Layout:**
```
┌─────────────────────────────────────────┐
│  Avatar | Name                          │
│  Bio                                    │
│  Aspirations                            │
│  GitHub | LinkedIn                      │
├─────────────────────────────────────────┤
│  Skills (grouped by domain)             │
├─────────────────────────────────────────┤
│  Badges Earned (with images)            │
├─────────────────────────────────────────┤
│  Public Projects                        │
├─────────────────────────────────────────┤
│  Tags                                   │
└─────────────────────────────────────────┘
```

---

#### 1.10 Badge Catalog (`/badges`)

**Features:**
- Group by: Domain, Tier, Type
- Each badge shows: Image, name, description, criteria
- Highlight earned badges (if logged in)

---

#### 1.11 Store Page (`/store`)

**Features:**
- Product grid with image, name, price
- Filter by category
- Badge-required products show lock icon
- Click to view details

**Product Card:**
```typescript
function ProductCard({ product }: { product: Product }) {
  const userHasBadge = product.required_badge_id 
    ? userBadges.includes(product.required_badge_id)
    : true
    
  return (
    <Card>
      <Image src={product.image} />
      <h3>{product.name}</h3>
      <p>{product.price}</p>
      {product.required_badge_id && !userHasBadge && (
        <Badge variant="locked">Badge Required</Badge>
      )}
      <Button disabled={!userHasBadge}>
        {userHasBadge ? 'Add to Cart' : 'Locked'}
      </Button>
    </Card>
  )
}
```

---

#### 1.12 Tag Browse Page (`/tags/[slug]`)

**Shows:**
- All projects with this tag
- All challenges with this tag
- All makers with this tag

**Query:**
```typescript
const { data } = await supabase
  .from('entity_tag')
  .select(`
    target_type,
    target_id,
    project(*),
    challenge(*),
    maker:app_user(*)
  `)
  .eq('tag.slug', slug)
```

---

### 2. AUTHENTICATION (Inline on Homepage)

**No separate auth pages** - all authentication happens inline on the homepage via dropdown or modal.

#### 2.1 Login Flow (Inline Dropdown/Modal)

**Trigger:** User clicks "Login" in navbar

**Form:**
```
┌────────────────────────────────┐
│  LOGIN TO PARAM MAKERSPACE     │
├────────────────────────────────┤
│  Email: [_______________]      │
│  Password: [____________]      │
│  [ Forgot Password? ]          │
│                                │
│  [ Login ]                     │
│                                │
│  Don't have an account?        │
│  [ Create Account ]            │
└────────────────────────────────┘
```

**Implementation:**
```typescript
// components/auth/LoginModal.tsx
export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login')
  
  async function handleLogin(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) {
      toast.error('Invalid credentials')
      return
    }
    
    // Get user role
    const { data: user } = await supabase
      .from('app_user')
      .select('role')
      .eq('email', email)
      .single()
    
    // Redirect based on role
    if (user.role === 'viewer') {
      router.push('/onboarding')
    } else {
      router.push('/dashboard')
    }
    
    onClose()
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        {mode === 'login' && <LoginForm onSubmit={handleLogin} />}
        {mode === 'register' && <RegisterForm />}
        {mode === 'forgot' && <ForgotPasswordForm />}
      </DialogContent>
    </Dialog>
  )
}
```

---

#### 2.2 Register Flow (Inline Dropdown/Modal)

**Trigger:** User clicks "Create Account" or "Get Started"

**Form:**
```
┌────────────────────────────────┐
│  CREATE YOUR ACCOUNT           │
├────────────────────────────────┤
│  Name: [________________]      │
│  Email: [_______________]      │
│  Password: [____________]      │
│  Confirm: [_____________]      │
│                                │
│  [ Create Account ]            │
│                                │
│  Already have an account?      │
│  [ Login ]                     │
└────────────────────────────────┘
```

**Flow:**
```typescript
async function handleRegister(data: RegisterForm) {
  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`
    }
  })
  
  if (authError) return
  
  // Create app_user record
  await supabase.from('app_user').insert({
    id: authData.user.id,
    email: data.email,
    name: data.name,
    role: 'viewer',  // ← DEFAULT ROLE (upgrades to 'maker' after first contribution)
    is_active: true
  })
  
  toast.success('Check your email to verify your account!')
  
  // Show verification message (don't close modal yet)
  setShowVerificationMessage(true)
}
```

**Post-Registration Message:**
```
┌────────────────────────────────┐
│  ✉️ VERIFY YOUR EMAIL          │
├────────────────────────────────┤
│  We sent a verification link   │
│  to: user@example.com          │
│                                │
│  Click the link to activate    │
│  your account and start        │
│  exploring!                    │
│                                │
│  [ Didn't receive? Resend ]    │
│  [ Close ]                     │
└────────────────────────────────┘
```

---

#### 2.3 Forgot Password (Inline)

**Trigger:** User clicks "Forgot Password?" in login form

**Form:**
```
┌────────────────────────────────┐
│  RESET PASSWORD                │
├────────────────────────────────┤
│  Enter your email address:     │
│  Email: [_______________]      │
│                                │
│  [ Send Reset Link ]           │
│                                │
│  [ ← Back to Login ]           │
└────────────────────────────────┘
```

**Flow:**
```typescript
async function sendResetEmail(email: string) {
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`
  })
  
  toast.success('Password reset email sent!')
}
```

---

#### 2.4 Email Verification Callback (`/auth/callback`)

**Purpose:** Handle email verification redirect from Supabase

**Flow:**
```typescript
// app/auth/callback/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  
  if (code) {
    const supabase = createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }
  
  // Redirect to onboarding (for viewers) or dashboard (for makers)
  return redirect('/onboarding')
}
```

---

#### 2.5 Password Reset Page (`/auth/reset-password`)

**Purpose:** Handle password reset after clicking email link

**Form:**
```
┌────────────────────────────────┐
│  SET NEW PASSWORD              │
├────────────────────────────────┤
│  New Password: [____________]  │
│  Confirm: [_________________]  │
│                                │
│  [ Update Password ]           │
└────────────────────────────────┘
```

---

#### 2.4 Onboarding Page (`/onboarding`) **NEW**

**Purpose:** Guide new viewers to become makers

**Who sees this:** 
- Viewers (role = 'viewer') after email verification
- Skippable, but shows helpful prompt

**Layout:**
```
┌─────────────────────────────────────────┐
│  Welcome, [Name]! 👋                    │
│  You're currently a Viewer              │
├─────────────────────────────────────────┤
│  Unlock MAKER status by completing      │
│  any ONE of these actions:              │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 🎨 Create Your First Project    │   │
│  │ Share what you're building      │   │
│  │ [ Start Creating ]              │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 🏆 Complete a Challenge         │   │
│  │ Learn by doing                  │   │
│  │ [ Browse Challenges ]           │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 📅 Register for an Event        │   │
│  │ Join the community              │   │
│  │ [ See Events ]                  │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 🔧 Book Equipment               │   │
│  │ Use makerspace tools            │   │
│  │ [ View Equipment ]              │   │
│  └─────────────────────────────────┘   │
│                                         │
│  [ Skip for now ]                       │
└─────────────────────────────────────────┘
```

**Implementation:**
```typescript
// app/(auth)/onboarding/page.tsx
export default function OnboardingPage() {
  const { user } = useUser()
  
  // Redirect if already a maker
  useEffect(() => {
    if (user.role !== 'viewer') {
      router.push('/dashboard')
    }
  }, [user.role])
  
  const actions = [
    {
      icon: '🎨',
      title: 'Create Your First Project',
      description: 'Share what you're building',
      action: '/dashboard/projects/new',
      buttonText: 'Start Creating'
    },
    {
      icon: '🏆',
      title: 'Complete a Challenge',
      description: 'Learn by doing',
      action: '/challenges',
      buttonText: 'Browse Challenges'
    },
    {
      icon: '📅',
      title: 'Register for an Event',
      description: 'Join the community',
      action: '/events',
      buttonText: 'See Events'
    },
    {
      icon: '🔧',
      title: 'Book Equipment',
      description: 'Use makerspace tools',
      action: '/equipment',
      buttonText: 'View Equipment'
    }
  ]
  
  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1>Welcome, {user.name}! 👋</h1>
      <Badge variant="secondary">Viewer</Badge>
      
      <p className="mt-4">
        Unlock <Badge variant="primary">MAKER</Badge> status by completing any ONE action:
      </p>
      
      <div className="grid gap-4 mt-6">
        {actions.map(action => (
          <Card key={action.title}>
            <CardHeader>
              <span className="text-4xl">{action.icon}</span>
              <CardTitle>{action.title}</CardTitle>
              <CardDescription>{action.description}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild>
                <Link href={action.action}>{action.buttonText}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <Button variant="ghost" className="mt-6" asChild>
        <Link href="/dashboard">Skip for now</Link>
      </Button>
    </div>
  )
}
```

---

### 3. MAKER DASHBOARD

**Access Control:**
- Available to users with role = 'maker', 'mentor', or 'admin'
- Viewers have limited dashboard access with upgrade prompts

---

#### 3.0 Viewer Dashboard (`/dashboard`) **FOR VIEWERS ONLY**

**Purpose:** Dashboard for viewers showing what they CAN do while encouraging project creation

**What Viewers Can Do:**
- ✅ Setup profile (bio, avatar, skills, GitHub, LinkedIn) - **stays private**
- ✅ Bookmark projects, challenges, events
- ✅ **Complete challenges** (fully accessible)
- ✅ **Register for events** (fully accessible)
- ✅ **Book equipment** (fully accessible)
- ✅ **Purchase products** (fully accessible)
- ✅ View saved content
- ✅ Track viewing history
- ❌ **Cannot comment or react** (Maker-only)
- ❌ **Cannot make profile public** (Maker-only)

**Dashboard Layout:**
```
┌─────────────────────────────────────────┐
│  Dashboard                              │
│  Status: 👀 Viewer                      │
├─────────────────────────────────────────┤
│  🎯 Unlock MAKER Status                 │
│  Create and submit your first project!  │
│                                         │
│  [ Create Your First Project ]          │
├─────────────────────────────────────────┤
│  YOUR ACTIVITY                          │
│  ┌───────┬─────────┬─────────┬────────┐│
│  │Saved  │Challenges│Events  │Bookings││
│  │  8    │    2     │   1    │   1    ││
│  └───────┴─────────┴─────────┴────────┘│
│                                         │
│  WHAT YOU CAN DO NOW                    │
│  ✅ Complete challenges                 │
│  ✅ Register for events                 │
│  ✅ Book equipment                      │
│  ✅ Purchase from store                 │
│  ✅ Bookmark & save content             │
│  ✅ Setup your profile                  │
│                                         │
│  UNLOCK AS MAKER                        │
│  ⭐ Comment & react on projects         │
│  ⭐ Make your profile public            │
│  ⭐ Earn badges                         │
│  ⭐ Full community recognition          │
│                                         │
│  HOW TO BECOME A MAKER:                 │
│  1. Create a project (draft)            │
│  2. Submit for review                   │
│  3. Get approved → Unlock Maker! 🎉     │
│                                         │
│  [ Start Your First Project ]           │
├─────────────────────────────────────────┤
│  SAVED CONTENT                          │
│  📚 Projects (3)                        │
│    • IoT Plant Monitor                  │
│    • Arduino Robot Car                  │
│                                         │
│  🏆 Challenges (2) - You can complete!  │
│    • LED Matrix Tutorial                │
│    • Build Your First PCB               │
│    [ Start a Challenge ]                │
│                                         │
│  📅 Events (1) - You're registered!     │
│    • Weekend Maker Meetup               │
│    [ Browse More Events ]               │
│                                         │
│  QUICK ACTIONS                          │
│  [ Browse Challenges ]                  │
│  [ See Upcoming Events ]                │
│  [ Book Equipment ]                     │
│  [ Visit Store ]                        │
└─────────────────────────────────────────┘
```

**Implementation:**
```typescript
// app/(dashboard)/page.tsx
export default async function DashboardPage() {
  const { user } = await getUser()
  
  // Show viewer-specific dashboard
  if (user.role === 'viewer') {
    return <ViewerDashboard user={user} />
  }
  
  // Show full maker dashboard
  return <MakerDashboard user={user} />
}

function ViewerDashboard({ user }) {
  const { 
    bookmarks, 
    challengeCompletions, 
    eventRegistrations, 
    equipmentBookings,
    profileCompletion 
  } = useViewerData(user.id)
  
  return (
    <div className="p-6">
      <div className="flex items-center gap-2">
        <h1>Dashboard</h1>
        <Badge variant="secondary">👀 Viewer</Badge>
      </div>
      
      {/* Upgrade CTA */}
      <Alert className="mt-4" variant="default">
        <Lightbulb className="h-4 w-4" />
        <AlertTitle>🎯 Unlock MAKER Status</AlertTitle>
        <AlertDescription>
          Create and submit your first project to unlock full community access!
        </AlertDescription>
        <Button asChild className="mt-2">
          <Link href="/dashboard/projects/new">Create Your First Project</Link>
        </Button>
      </Alert>
      
      {/* Activity Stats */}
      <div className="grid grid-cols-4 gap-4 mt-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Saved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookmarks.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Challenges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{challengeCompletions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{eventRegistrations.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{equipmentBookings.length}</div>
          </CardContent>
        </Card>
      </div>
      
      {/* What You Can Do */}
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>What You Can Do Now ✅</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>✅ Complete challenges</li>
              <li>✅ Register for events</li>
              <li>✅ Book equipment</li>
              <li>✅ Purchase from store</li>
              <li>✅ Bookmark & save content</li>
              <li>✅ Setup your profile</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Unlock as Maker ⭐</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-muted-foreground">
              <li>⭐ Comment & react on projects</li>
              <li>⭐ Make your profile public</li>
              <li>⭐ Earn badges</li>
              <li>⭐ Full community recognition</li>
            </ul>
            <Separator className="my-4" />
            <div className="text-sm">
              <p className="font-semibold mb-2">How to become a Maker:</p>
              <ol className="space-y-1">
                <li>1. Create a project (draft)</li>
                <li>2. Submit for review</li>
                <li>3. Get approved → Unlock Maker! 🎉</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Saved Content & Activity */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Your Activity</h2>
        
        {/* Bookmarked Projects */}
        {bookmarks.filter(b => b.target_type === 'project').length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">📚 Saved Projects</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {bookmarks
                .filter(b => b.target_type === 'project')
                .slice(0, 4)
                .map(bookmark => (
                  <ProjectBookmarkCard key={bookmark.id} bookmark={bookmark} />
                ))}
            </div>
          </div>
        )}
        
        {/* Challenges */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">🏆 Challenges - You can complete these!</h3>
          {challengeCompletions.length > 0 ? (
            <div className="space-y-2">
              {challengeCompletions.map(completion => (
                <ChallengeCompletionCard key={completion.id} completion={completion} />
              ))}
            </div>
          ) : (
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">
                You haven't completed any challenges yet.
              </p>
              <Button asChild variant="outline" size="sm" className="mt-2">
                <Link href="/challenges">Start a Challenge</Link>
              </Button>
            </Card>
          )}
        </div>
        
        {/* Events */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">📅 Your Events</h3>
          {eventRegistrations.length > 0 ? (
            <div className="space-y-2">
              {eventRegistrations.map(registration => (
                <EventRegistrationCard key={registration.id} registration={registration} />
              ))}
            </div>
          ) : (
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">
                You're not registered for any events.
              </p>
              <Button asChild variant="outline" size="sm" className="mt-2">
                <Link href="/events">Browse Events</Link>
              </Button>
            </Card>
          )}
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button asChild variant="outline">
            <Link href="/challenges">
              <Trophy className="mr-2 h-4 w-4" />
              Challenges
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/events">
              <Calendar className="mr-2 h-4 w-4" />
              Events
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/equipment">
              <Wrench className="mr-2 h-4 w-4" />
              Equipment
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/store">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Store
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
```

---

#### 3.1 Dashboard Home (`/dashboard`) **FOR MAKERS**

**Summary Cards:**
- My Projects: Draft (X), Pending (Y), Active (Z)
- Badges Earned: (count + recent badges)
- Events: Registered (upcoming count)
- Challenges: Completed (count)
- Equipment: Active bookings (count)
- Orders: Pending/Processing (count)

**Quick Actions:**
- Create New Project
- Browse Challenges
- Upcoming Events

---

#### 3.2 My Profile Setup (`/dashboard/profile`)

**Form Sections:**

**Basic Info:**
- Name (from app_user)
- Avatar upload (to Supabase Storage)
- Public URL slug (unique, validation)
- Bio (textarea, max 500 chars)
- Aspirations (textarea, max 300 chars)
- GitHub URL
- LinkedIn URL
- Profile visibility toggle (public/private)

**Skills:**
- Add skill: Name, Domain, Source (formal education, self-taught, bootcamp)
- List view with delete button
- Tag autocomplete

**Tags:**
- Multi-select from tag catalog
- Applied to entity_tag with target_type='maker'

**Save Logic:**
```typescript
async function saveProfile(data: ProfileForm) {
  // Update app_user
  await supabase.from('app_user').update({
    name: data.name
  }).eq('id', userId)
  
  // Upsert maker_profile
  await supabase.from('maker_profile').upsert({
    user_id: userId,
    bio: data.bio,
    aspirations: data.aspirations,
    avatar: avatarUrl,  // After upload
    public_url_slug: data.slug,
    github_url: data.github,
    linkedin_url: data.linkedin,
    is_public: data.isPublic
  })
  
  // Delete old skills, insert new
  await supabase.from('user_skill').delete().eq('user_id', userId)
  await supabase.from('user_skill').insert(
    data.skills.map(s => ({ user_id: userId, ...s }))
  )
  
  // Update tags
  await supabase.from('entity_tag').delete()
    .eq('target_type', 'maker')
    .eq('target_id', userId)
  await supabase.from('entity_tag').insert(
    data.tags.map(tagId => ({
      target_type: 'maker',
      target_id: userId,
      tag_id: tagId
    }))
  )
}
```

---

#### 3.3 My Projects (`/dashboard/projects`)

**Table Columns:**
- Cover image thumbnail
- Title
- Status (draft, pending_review, active, rejected)
- Visibility (public/private)
- Created date
- Actions: Edit, Delete (if draft), Submit for Review

**Status Colors:**
- Draft: Gray
- Pending Review: Orange
- Active: Green
- Rejected: Red

**Submit for Review:**
```typescript
async function submitForReview(projectId: string) {
  await supabase.from('project').update({
    status: 'pending_review'
  }).eq('id', projectId)
  
  // Optionally notify mentors via email/notification
}
```

---

#### 3.4 Create/Edit Project (`/dashboard/projects/new`, `/dashboard/projects/[id]/edit`)

**Form Layout:**

**Basic Info:**
- Title (required)
- One-line summary (max 100 chars)
- Description (rich text editor, markdown)
- Domain (dropdown: AI/ML, Robotics, IoT, Web Dev, etc.)
- Tier (dropdown: Beginner, Intermediate, Advanced, Expert)
- GitHub URL
- Duration estimate (dropdown: <1hr, 1-4hr, 1 day, 1 week, >1 week)
- Visibility toggle (public/private)
- Showcase-ready toggle

**Media Section:**

**Image Upload:**
```typescript
// components/shared/ImageUpload.tsx
async function uploadImages(files: File[]) {
  const uploads = await Promise.all(
    files.map(async (file, idx) => {
      const fileName = `${projectId}/${Date.now()}_${file.name}`
      const { data, error } = await supabase.storage
        .from('project-images')
        .upload(fileName, file)
        
      if (error) throw error
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('project-images')
        .getPublicUrl(fileName)
        
      // Save to project_image table
      await supabase.from('project_image').insert({
        project_id: projectId,
        image_url: publicUrl,
        display_order: idx + 1,
        uploaded_by: userId
      })
      
      return publicUrl
    })
  )
  
  return uploads
}
```

**Image Gallery Management:**
- Drag to reorder (updates display_order)
- First image is always cover
- Delete individual images

**Video Links:**
```typescript
// components/shared/VideoLinkInput.tsx
interface VideoLink {
  title: string
  url: string
}

function VideoLinkManager({ projectId }: { projectId: string }) {
  const [links, setLinks] = useState<VideoLink[]>([])
  
  async function addVideoLink(link: VideoLink) {
    const { data } = await supabase.from('project_video').insert({
      project_id: projectId,
      title: link.title,
      video_url: link.url,
      display_order: links.length + 1,
      added_by: userId
    }).select().single()
    
    setLinks([...links, data])
  }
  
  async function removeVideoLink(id: string) {
    await supabase.from('project_video').delete().eq('id', id)
    setLinks(links.filter(l => l.id !== id))
  }
  
  return (
    <div>
      {links.map(link => (
        <div key={link.id}>
          <input value={link.title} disabled />
          <input value={link.url} disabled />
          <Button onClick={() => removeVideoLink(link.id)}>Remove</Button>
        </div>
      ))}
      <AddVideoLinkForm onAdd={addVideoLink} />
    </div>
  )
}
```

**File Upload Section:**
```typescript
async function uploadFile(file: File) {
  const fileName = `${projectId}/${file.name}`
  const { data, error } = await supabase.storage
    .from('project-files')
    .upload(fileName, file)
    
  const { data: { publicUrl } } = supabase.storage
    .from('project-files')
    .getPublicUrl(fileName)
    
  await supabase.from('project_file').insert({
    project_id: projectId,
    file_name: file.name,
    file_type: file.type,
    file_url: publicUrl,
    file_size: file.size,
    uploaded_by: userId
  })
}
```

**Milestones:**
- Add/remove milestones
- Each milestone: Title, Description, Due Date, Completed checkbox

**Collaborators:**
- Add by email (autocomplete from app_user)
- Remove collaborator

**Tags:**
- Multi-select from tag catalog

**Save Options:**
- Save as Draft
- Submit for Review

---

#### 3.5 My Challenges (`/dashboard/challenges`)

**View:**
- All published challenges
- Completion status:
  - Not started
  - Completed (verified)
  - Pending verification

**Complete Challenge Form:**
```typescript
function CompleteChallenge({ challengeId }: { challengeId: string }) {
  async function submit(notes: string) {
    await supabase.from('challenge_completion').insert({
      challenge_id: challengeId,
      user_id: userId,
      completion_notes: notes
    })
  }
  
  return <textarea onSubmit={submit} />
}
```

---

#### 3.6 My Events (`/dashboard/events`)

**Tabs:**
- All Events (browse)
- My Registrations (registered events only)

**For Each Registered Event:**
- Event details
- Registration date
- Check-in status
- If Build Challenge: "Manage Team" button
- If Maker Meetup: "Book Showcase Slot" button

---

#### 3.7 Build Challenge Team Management (`/dashboard/events/[id]/team`)

**If No Team:**
- Create Team form (team name)
- Join Existing Team form (team code/invite)

**If Team Lead:**
- Team name
- Team members list
- Remove member button
- Submit Project dropdown (select from own projects)
- Submit button

**If Team Member:**
- Team info (read-only)
- Leave team button

**Team Creation:**
```typescript
async function createTeam(eventId: string, teamName: string) {
  const { data: team } = await supabase.from('event_team').insert({
    event_id: eventId,
    team_name: teamName,
    team_lead_id: userId
  }).select().single()
  
  // Add creator as member
  await supabase.from('event_team_member').insert({
    team_id: team.id,
    user_id: userId
  })
}
```

**Submit Project:**
```typescript
async function submitProject(teamId: string, projectId: string) {
  await supabase.from('event_submission').insert({
    event_id: eventId,
    team_id: teamId,
    project_id: projectId,
    submitted_by: userId
  })
}
```

---

#### 3.8 Showcase Slot Booking (`/dashboard/events/[id]/showcase`)

**Form:**
- Slot title (e.g., "Live Demo: IoT Plant Monitor")
- Slot type (dropdown: Speaker, Demo, Product Launch)
- Link to own project (optional, dropdown from own projects)
- Notes (textarea)

**Submit:**
```typescript
async function bookShowcaseSlot(data: ShowcaseSlotForm) {
  await supabase.from('event_showcase_slot').insert({
    event_id: eventId,
    user_id: userId,
    slot_title: data.title,
    slot_type: data.type,
    project_id: data.projectId,
    notes: data.notes,
    status: 'pending'  // Needs mentor approval
  })
}
```

**Display Current Booking:**
- Status: Pending / Approved / Rejected
- Mentor feedback (if rejected)

---

#### 3.9 Equipment Booking (`/dashboard/equipment`)

**Equipment List:**
- Name
- Category
- Status (available, in_use, maintenance)
- Location
- Requires induction? (badge)

**Booking Form (if available):**
- Start time (datetime picker)
- End time (datetime picker)
- Notes

**Validation:**
```typescript
async function bookEquipment(equipmentId: string, startTime: Date, endTime: Date) {
  // Check if induction required
  const { data: equipment } = await supabase
    .from('equipment')
    .select('requires_induction')
    .eq('id', equipmentId)
    .single()
    
  if (equipment.requires_induction) {
    const { data: induction } = await supabase
      .from('user_induction')
      .select('*')
      .eq('user_id', userId)
      .eq('equipment_id', equipmentId)
      .eq('is_active', true)
      .gte('expires_at', new Date().toISOString())
      .single()
      
    if (!induction) {
      toast.error('Induction required. Contact a mentor.')
      return
    }
  }
  
  // Check for booking conflicts
  const { data: conflicts } = await supabase
    .from('equipment_booking')
    .select('*')
    .eq('equipment_id', equipmentId)
    .or(`and(start_time.lte.${endTime.toISOString()},end_time.gte.${startTime.toISOString()})`)
    
  if (conflicts.length > 0) {
    toast.error('Time slot not available')
    return
  }
  
  // Create booking
  await supabase.from('equipment_booking').insert({
    equipment_id: equipmentId,
    user_id: userId,
    start_time: startTime,
    end_time: endTime,
    status: 'confirmed'
  })
}
```

---

#### 3.10 My Equipment Bookings (`/dashboard/equipment/bookings`)

**List:**
- Equipment name
- Start time
- End time
- Status (upcoming, active, completed, cancelled)
- Actions: Cancel (if upcoming)

---

#### 3.11 Store Purchase (`/store` with checkout)

**Checkout Flow:**
1. Add items to cart (session storage)
2. View cart
3. Fill shipping address
4. Confirm order

**Create Order:**
```typescript
async function createOrder(cartItems: CartItem[], shippingAddress: Address) {
  // Create order
  const { data: order } = await supabase.from('order').insert({
    user_id: userId,
    status: 'pending',
    shipping_address: JSON.stringify(shippingAddress),
    total_amount: calculateTotal(cartItems)
  }).select().single()
  
  // Create order items
  await supabase.from('order_item').insert(
    cartItems.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.price
    }))
  )
  
  // Send confirmation email via Edge Function
  await supabase.functions.invoke('send-order-confirmation', {
    body: { orderId: order.id }
  })
}
```

---

#### 3.12 My Orders (`/dashboard/orders`)

**List:**
- Order ID
- Date
- Status (pending, processing, shipped, delivered)
- Total amount
- Items (expandable)

---

### 4. MENTOR DASHBOARD

#### 4.1 Project Review Queue (`/mentor/review/projects`)

**List View:**
- All projects with status = 'pending_review'
- Columns: Cover image, Title, Owner, Submitted date, Domain, Tier

**Review Modal:**
- Full project details
- Image gallery preview
- Video links preview
- Files list
- Approve button → Sets status to 'active', visibility to 'public'
- Reject button → Sets status to 'rejected', opens feedback textarea

**Approve Logic:**
```typescript
async function approveProject(projectId: string) {
  await supabase.from('project').update({
    status: 'active',
    visibility: 'public',
    approved_at: new Date().toISOString(),
    approved_by: mentorUserId
  }).eq('id', projectId)
  
  // Notify maker via Edge Function
  await supabase.functions.invoke('send-notification', {
    body: {
      type: 'project_approved',
      userId: project.owner_id,
      projectId
    }
  })
}
```

**Reject Logic:**
```typescript
async function rejectProject(projectId: string, feedback: string) {
  await supabase.from('project').update({
    status: 'rejected',
    rejection_reason: feedback
  }).eq('id', projectId)
  
  // Notify maker
  await supabase.functions.invoke('send-notification', {
    body: {
      type: 'project_rejected',
      userId: project.owner_id,
      projectId,
      feedback
    }
  })
}
```

---

#### 4.2 Challenge Completion Verification (`/mentor/review/challenges`)

**Queue:**
- All challenge_completion records with verified_by = null
- Shows: Maker name, Challenge title, Completion notes, Date

**Actions:**
- Verify → Sets verified_by to mentor's user_id
- Decline → Deletes the completion record (or adds declined_reason field)

---

#### 4.3 Create/Edit Event (`/mentor/events/new`, `/mentor/events/[id]/edit`)

**Form:**

**Basic Info:**
- Title
- Description (rich text)
- Event type (dropdown: build_challenge, maker_meetup, tech_tuesday)
- Start date/time
- End date/time
- Location
- Capacity (number)
- Registration open toggle
- Is recurring toggle
- Recap URL (for past events)
- Auto badge (dropdown from badge catalog)

**Media:**
- Image upload (same as projects)
- Video links (same as projects)

**Save:**
```typescript
async function createEvent(data: EventForm) {
  const { data: event } = await supabase.from('event').insert({
    title: data.title,
    description: data.description,
    event_type: data.type,
    start_date: data.startDate,
    end_date: data.endDate,
    location: data.location,
    capacity: data.capacity,
    registration_open: data.registrationOpen,
    is_recurring: data.isRecurring,
    recap_url: data.recapUrl,
    auto_badge_id: data.autoBadgeId,
    created_by: mentorUserId
  }).select().single()
  
  // Upload images
  await uploadEventImages(event.id, data.images)
  
  // Add video links
  await addEventVideoLinks(event.id, data.videoLinks)
}
```

---

#### 4.4 Event Management (`/mentor/events/[id]/manage`)

**All Registrants:**
- Name, Email, Registration date
- Check-in status

**If Build Challenge:**
- Teams tab
  - List all teams
  - Team members
  - Submission status
- Submissions tab
  - All submitted projects
  - Review status (pending, reviewed, winner, disqualified)
  - Actions: Mark as winner, Disqualify

**If Maker Meetup:**
- Showcase Slots tab
  - All requests (pending, approved, rejected)
  - Approve/Reject buttons

---

#### 4.5 Induction Management (`/mentor/inductions`)

**Grant Induction:**
- Select maker (autocomplete by name/email)
- Select equipment
- Induction date
- Expiry date
- Certificate URL (upload to Supabase Storage)

**Active Inductions List:**
- Maker name
- Equipment name
- Expiry date
- Deactivate button

---

### 5. ADMIN PANEL

#### 5.1 User Management (`/admin/users`)

**Table:**
- Name
- Email
- Role (editable dropdown)
- Status (active/inactive toggle)
- Created date
- Last login

**Actions:**
- Change role → Updates app_user.role
- Toggle active → Updates app_user.is_active
- View user details (opens modal with all user data)

---

#### 5.2 Challenge Management (`/admin/challenges`)

**List:**
- All challenges (draft, published, archived)

**Create Challenge Form:**

**Basic Info:**
- Title
- Tier
- Domain
- Mystery (hook question)
- Core idea (concept overview)
- Mission (build objective)
- Time estimate
- Success criteria

**Media:**
- Image upload (multiple)
- Video links (multiple)

**After Creating:**

**Steps Section:**
- Add step: Order, Title, Description
- Reorder steps (drag-and-drop)
- Delete step

**Materials:**
- Add material: Name, Quantity, Optional flag

**Skills:**
- Add skill: Name, Domain

**Vocabulary:**
- Add term: Term, Definition

**Levels:**
- Add level: Name, Description

**Co-hosts:**
- Add by email

**Status:**
- Draft, Published, Archived

---

#### 5.3 Badge Management (`/admin/badges`)

**List:**
- All badges with image, name, tier, type

**Create Badge:**
- Name
- Description
- Tier (beginner, intermediate, advanced, expert)
- Domain
- Badge type (achievement, participation, skill, contribution)
- Image upload
- Criteria text

**Manual Badge Award:**
- Select user (autocomplete)
- Select badge
- Reason (text)

**Award Logic:**
```typescript
async function awardBadge(userId: string, badgeId: string, reason: string) {
  await supabase.from('user_badge').insert({
    user_id: userId,
    badge_id: badgeId,
    awarded_at: new Date().toISOString(),
    awarded_by: adminUserId,
    reason
  })
  
  // Notify user
  await supabase.functions.invoke('send-notification', {
    body: {
      type: 'badge_earned',
      userId,
      badgeId
    }
  })
}
```

---

#### 5.4 Tag Management (`/admin/tags`)

**List:**
- All tags with name, slug, category

**Create Tag:**
- Name (e.g., "3D Printing")
- Slug (auto-generated, editable: "3d-printing")
- Category (dropdown: Technology, Domain, Skill, Topic)

---

#### 5.5 Store Management (`/admin/store`)

**Products Tab:**

**List:**
- Name, Price, Category, Stock, Active status

**Create/Edit Product:**
- Name
- Description
- Price
- Category
- Image upload
- Stock quantity
- Required badge (dropdown, optional)
- Active toggle

**Orders Tab:**

**List:**
- Order ID, User, Date, Status, Total

**Update Order Status:**
- Pending → Processing → Shipped → Delivered

---

#### 5.6 Equipment Management (`/admin/equipment`)

**Equipment Tab:**

**List:**
- Name, Category, Status, Location, Requires Induction

**Create/Edit:**
- Name
- Description
- Category
- Status (available, in_use, maintenance, retired)
- Location
- Image upload
- Requires induction toggle

**Bookings Tab:**
- All bookings across all equipment
- Filter by equipment, user, date range
- Actions: Approve, Cancel, Mark Complete

**Inductions Tab:**
- All induction records (same as mentor view)

---

#### 5.7 Inventory Management (`/admin/inventory`)

**List:**
- Name, Category, Quantity, Unit, Reorder Level, Location
- Highlight items below reorder level (red background)

**Create/Edit:**
- Name
- Category
- Quantity
- Unit (pcs, kg, m, etc.)
- Reorder level
- Location

---

#### 5.8 Moderation (`/admin/moderation`)

**Comments Tab:**
- All comments from all targets
- Target type, Target ID, User, Content, Date
- Delete button

**Reactions Tab:**
- All reactions
- Target type, Target ID, User, Type, Date
- Remove button

---

#### 5.9 Manual Check-in (`/admin/check-in`)

**Flow:**
1. Select event (dropdown of current/recent events)
2. Search maker by name or email
3. Mark as checked in

**Auto Badge Award:**
```typescript
async function checkInMaker(eventId: string, userId: string) {
  // Update registration
  await supabase.from('event_registration').update({
    checked_in: true,
    checked_in_at: new Date().toISOString()
  }).eq('event_id', eventId).eq('user_id', userId)
  
  // Get event to check for auto_badge_id
  const { data: event } = await supabase
    .from('event')
    .select('auto_badge_id')
    .eq('id', eventId)
    .single()
    
  if (event.auto_badge_id) {
    // Check if user already has badge
    const { data: existing } = await supabase
      .from('user_badge')
      .select('id')
      .eq('user_id', userId)
      .eq('badge_id', event.auto_badge_id)
      .single()
      
    if (!existing) {
      await supabase.from('user_badge').insert({
        user_id: userId,
        badge_id: event.auto_badge_id,
        awarded_by: adminUserId,
        reason: `Attended ${event.title}`
      })
    }
  }
}
```

---

## 🔌 API ENDPOINTS

### REST API Routes (Next.js API Routes)

**Projects:**
```
GET    /api/projects              - List projects (public, with filters)
POST   /api/projects              - Create project (auth: maker+)
GET    /api/projects/:id          - Get single project
PATCH  /api/projects/:id          - Update project (auth: owner)
DELETE /api/projects/:id          - Delete project (auth: owner if draft, admin)
POST   /api/projects/:id/submit   - Submit for review (auth: owner)
POST   /api/projects/:id/approve  - Approve project (auth: mentor+)
POST   /api/projects/:id/reject   - Reject project (auth: mentor+)
```

**Challenges:**
```
GET    /api/challenges            - List challenges (published)
POST   /api/challenges            - Create challenge (auth: admin)
GET    /api/challenges/:id        - Get single challenge
PATCH  /api/challenges/:id        - Update challenge (auth: admin)
POST   /api/challenges/:id/complete - Mark as completed (auth: maker+)
```

**Events:**
```
GET    /api/events                - List events
POST   /api/events                - Create event (auth: mentor+)
GET    /api/events/:id            - Get single event
PATCH  /api/events/:id            - Update event (auth: mentor+)
POST   /api/events/:id/register   - Register for event (auth: maker+)
DELETE /api/events/:id/register   - Unregister (auth: maker+)
```

**Comments:**
```
GET    /api/comments?target_type=project&target_id=xxx
POST   /api/comments              - Create comment (auth: maker+)
DELETE /api/comments/:id          - Delete comment (auth: owner or admin)
```

**Reactions:**
```
POST   /api/reactions             - Toggle reaction (auth: maker+)
DELETE /api/reactions/:id         - Remove reaction (auth: owner)
```

**Upload:**
```
POST   /api/upload/image          - Upload image, returns URL
POST   /api/upload/file           - Upload file, returns URL
POST   /api/upload/avatar         - Upload avatar, returns URL
```

**Example API Route:**
```typescript
// app/api/projects/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  
  const { searchParams } = new URL(request.url)
  const domain = searchParams.get('domain')
  const tier = searchParams.get('tier')
  
  let query = supabase
    .from('project')
    .select('*, app_user(name), project_image(*)')
    .eq('status', 'active')
    .eq('visibility', 'public')
    
  if (domain) query = query.eq('domain', domain)
  if (tier) query = query.eq('tier', tier)
  
  const { data, error } = await query
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  
  // Check auth
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const body = await request.json()
  
  const { data, error } = await supabase.from('project').insert({
    ...body,
    owner_id: session.user.id,
    status: 'draft'
  }).select().single()
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
```

---

## 📦 FILE STORAGE STRATEGY

### Supabase Storage Buckets

**Bucket Configuration:**
```sql
-- Create buckets
INSERT INTO storage.buckets (id, name, public) VALUES
  ('avatars', 'avatars', true),
  ('project-images', 'project-images', true),
  ('project-files', 'project-files', false),  -- Auth required
  ('challenge-images', 'challenge-images', true),
  ('event-images', 'event-images', true),
  ('badge-images', 'badge-images', true),
  ('product-images', 'product-images', true),
  ('equipment-images', 'equipment-images', true),
  ('induction-certificates', 'induction-certificates', false);  -- Auth required
```

**RLS Policies:**
```sql
-- Avatars: Anyone can read, authenticated can upload their own
CREATE POLICY "Avatars are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Project images: Anyone can read, owners can upload
CREATE POLICY "Project images publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'project-images');

CREATE POLICY "Project owners can upload images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'project-images'
    AND EXISTS (
      SELECT 1 FROM project 
      WHERE id::text = (storage.foldername(name))[1]
      AND owner_id = auth.uid()
    )
  );

-- Project files: Only authenticated can read, owners can upload
CREATE POLICY "Authenticated users can read project files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'project-files' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Project owners can upload files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'project-files'
    AND EXISTS (
      SELECT 1 FROM project 
      WHERE id::text = (storage.foldername(name))[1]
      AND owner_id = auth.uid()
    )
  );
```

### File Size Limits

**Image Uploads:**
- Max file size: 5MB
- Allowed formats: JPEG, PNG, WebP, GIF
- Auto-resize: Generate thumbnails (400x400, 800x800)
- Compression: Optimize on upload

**File Uploads (project files):**
- Max file size: 50MB
- Allowed formats: .zip, .pdf, .stl, .py, .js, .cpp, .ino, .md, .txt

**Implementation:**
```typescript
// lib/utils/file-upload.ts
export const FILE_LIMITS = {
  image: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  },
  projectFile: {
    maxSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: [
      'application/zip',
      'application/pdf',
      'application/octet-stream', // .stl
      'text/plain',
      'text/markdown',
      'application/x-python-code',
      'text/x-python'
    ]
  }
}

export async function uploadImage(
  file: File, 
  bucket: string, 
  path: string
): Promise<string> {
  // Validate
  if (file.size > FILE_LIMITS.image.maxSize) {
    throw new Error('Image too large (max 5MB)')
  }
  
  if (!FILE_LIMITS.image.allowedTypes.includes(file.type)) {
    throw new Error('Invalid image format')
  }
  
  // Compress (optional, using browser-image-compression)
  const compressed = await imageCompression(file, {
    maxSizeMB: 2,
    maxWidthOrHeight: 1920
  })
  
  // Upload
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, compressed)
    
  if (error) throw error
  
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)
    
  return publicUrl
}
```

---

## 🔐 SECURITY & AUTHENTICATION

### Supabase Auth Configuration

**Email/Password Auth:**
```typescript
// lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
)
```

### Row Level Security (RLS)

**Core Principles:**
- All tables have RLS enabled
- Public content accessible without auth
- Users can only modify their own data
- Role-based access for admin/mentor functions

**Example Policies:**

```sql
-- Projects: Public can read active+public, owners can CRUD their own
ALTER TABLE project ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public projects are viewable by everyone" ON project
  FOR SELECT USING (status = 'active' AND visibility = 'public');

CREATE POLICY "Users can view their own projects" ON project
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Users can create projects" ON project
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own projects" ON project
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own draft projects" ON project
  FOR DELETE USING (auth.uid() = owner_id AND status = 'draft');

CREATE POLICY "Mentors can approve projects" ON project
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM app_user 
      WHERE id = auth.uid() 
      AND role IN ('mentor', 'admin')
    )
  );

-- Comments: Anyone can read, authenticated can post, owner/admin can delete
ALTER TABLE comment ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments are publicly viewable" ON comment
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create comments" ON comment
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own comments" ON comment
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can delete any comment" ON comment
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM app_user 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Equipment bookings: Users can CRUD their own bookings
ALTER TABLE equipment_booking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bookings" ON equipment_booking
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookings" ON equipment_booking
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND (
      -- Either no induction required
      NOT EXISTS (
        SELECT 1 FROM equipment 
        WHERE id = equipment_id 
        AND requires_induction = true
      )
      -- Or user has active induction
      OR EXISTS (
        SELECT 1 FROM user_induction
        WHERE user_id = auth.uid()
        AND equipment_id = equipment_booking.equipment_id
        AND is_active = true
        AND expires_at > now()
      )
    )
  );

-- Mentors/admins can view all bookings
CREATE POLICY "Mentors can view all bookings" ON equipment_booking
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM app_user 
      WHERE id = auth.uid() 
      AND role IN ('mentor', 'admin')
    )
  );
```

### Middleware for Protected Routes

```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  const { data: { session } } = await supabase.auth.getSession()
  
  // Protected routes
  if (req.nextUrl.pathname.startsWith('/dashboard') && !session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  
  if (req.nextUrl.pathname.startsWith('/mentor') && session) {
    const { data: user } = await supabase
      .from('app_user')
      .select('role')
      .eq('id', session.user.id)
      .single()
      
    if (!['mentor', 'admin'].includes(user?.role)) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }
  
  if (req.nextUrl.pathname.startsWith('/admin') && session) {
    const { data: user } = await supabase
      .from('app_user')
      .select('role')
      .eq('id', session.user.id)
      .single()
      
    if (user?.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }
  
  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/mentor/:path*', '/admin/:path*']
}
```

### Rate Limiting

**API Route Protection:**
```typescript
// lib/utils/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!
})

// 10 requests per 10 seconds
export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 s')
})

// Usage in API route
export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
  const { success } = await ratelimit.limit(ip)
  
  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests' }, 
      { status: 429 }
    )
  }
  
  // ... rest of handler
}
```

---

## 🚀 DEPLOYMENT & CI/CD

### Environment Variables

**.env.local (Development):**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...

# Optional
UPSTASH_REDIS_URL=https://...
UPSTASH_REDIS_TOKEN=...
SENTRY_DSN=https://...
```

**.env.staging:**
```bash
# Same structure, different Supabase project
```

**.env.production:**
```bash
# Same structure, different Supabase project
```

### Deployment Strategy

**Platform: Vercel**

**GitHub Actions Workflow:**

```yaml
# .github/workflows/ci.yml
name: CI
on:
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test

# .github/workflows/deploy-staging.yml
name: Deploy to Staging
on:
  push:
    branches: [develop]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          working-directory: ./

# .github/workflows/deploy-production.yml
name: Deploy to Production
on:
  workflow_dispatch:  # Manual trigger only

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID_PROD }}
          vercel-args: '--prod'
```

### Database Migrations

**Supabase CLI:**
```bash
# Generate migration
supabase migration new add_media_tables

# Apply migration
supabase db push

# Reset (dev only)
supabase db reset
```

**Migration Files:**
```sql
-- supabase/migrations/20240101000000_initial_schema.sql
-- (Full schema from ER diagram)

-- supabase/migrations/20240102000000_add_media_tables.sql
CREATE TABLE project_image (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES project(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 1,
  uploaded_by UUID NOT NULL REFERENCES app_user(id),
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- ... (other media tables)

-- supabase/migrations/20240103000000_add_indexes.sql
CREATE INDEX idx_project_status ON project(status);
CREATE INDEX idx_project_visibility ON project(visibility);
CREATE INDEX idx_project_owner ON project(owner_id);
-- ... (other indexes)
```

### Monitoring

**Sentry Error Tracking:**
```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1
})

// sentry.server.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1
})
```

**Vercel Analytics:**
```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

---

## 🧪 TESTING STRATEGY

### Unit Tests (Vitest)

**Utils:**
```typescript
// tests/unit/video-url.test.ts
import { describe, it, expect } from 'vitest'
import { getEmbedUrl } from '@/lib/utils/video-url'

describe('getEmbedUrl', () => {
  it('converts YouTube watch URL to embed', () => {
    const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    expect(getEmbedUrl(url)).toBe('https://www.youtube.com/embed/dQw4w9WgXcQ')
  })
  
  it('converts Vimeo URL to player', () => {
    const url = 'https://vimeo.com/123456789'
    expect(getEmbedUrl(url)).toBe('https://player.vimeo.com/video/123456789')
  })
  
  it('returns null for invalid URL', () => {
    expect(getEmbedUrl('https://example.com')).toBeNull()
  })
})
```

**Permissions:**
```typescript
// tests/unit/permissions.test.ts
import { describe, it, expect } from 'vitest'
import { hasRole, Role } from '@/lib/utils/permissions'

describe('hasRole', () => {
  it('admin has all permissions', () => {
    expect(hasRole(Role.ADMIN, Role.VIEWER)).toBe(true)
    expect(hasRole(Role.ADMIN, Role.MAKER)).toBe(true)
    expect(hasRole(Role.ADMIN, Role.MENTOR)).toBe(true)
  })
  
  it('maker does not have mentor permissions', () => {
    expect(hasRole(Role.MAKER, Role.MENTOR)).toBe(false)
  })
})
```

### Integration Tests (Playwright)

**Auth Flow:**
```typescript
// tests/integration/auth.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('user can register', async ({ page }) => {
    await page.goto('/register')
    await page.fill('input[name="name"]', 'Test Maker')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'SecurePass123')
    await page.click('button[type="submit"]')
    
    await expect(page).toHaveURL('/verify-email')
  })
  
  test('user can login', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'SecurePass123')
    await page.click('button[type="submit"]')
    
    await expect(page).toHaveURL('/dashboard')
  })
})
```

**Project Creation:**
```typescript
// tests/integration/projects.spec.ts
test('maker can create project', async ({ page }) => {
  // Login first
  await page.goto('/login')
  // ... login steps
  
  await page.goto('/dashboard/projects/new')
  await page.fill('input[name="title"]', 'My IoT Project')
  await page.fill('textarea[name="description"]', 'A smart home automation system')
  await page.selectOption('select[name="domain"]', 'IoT')
  await page.selectOption('select[name="tier"]', 'intermediate')
  
  await page.click('button:text("Save as Draft")')
  
  await expect(page).toHaveURL(/\/dashboard\/projects/)
  await expect(page.locator('text=My IoT Project')).toBeVisible()
})
```

### E2E Tests

**Complete User Journey:**
```typescript
// tests/e2e/maker-journey.spec.ts
test('complete maker journey', async ({ page }) => {
  // 1. Register
  // 2. Setup profile
  // 3. Create project
  // 4. Submit for review
  // 5. Complete challenge
  // 6. Register for event
  // 7. Book equipment
  // ... full flow
})
```

---

## 📅 PHASE PLANNING

### Phase 1: MVP (Weeks 1-6)

**Core Infrastructure:**
- ✅ Next.js setup with App Router
- ✅ Supabase connection (auth, database)
- ✅ UI component library (shadcn/ui)
- ✅ Database schema + migrations
- ✅ RLS policies

**Essential Features:**
- ✅ Auth (register, login, logout)
- ✅ Projects (create, list, view, edit)
- ✅ Image upload (single cover image only)
- ✅ Project approval workflow
- ✅ Basic maker profile
- ✅ Public homepage

**Out of Scope for MVP:**
- ❌ Multi-image galleries
- ❌ Video links
- ❌ Challenges
- ❌ Events
- ❌ Equipment booking
- ❌ Store
- ❌ Tags

### Phase 2: Community Features (Weeks 7-10)

**Add:**
- ✅ Challenges (create, complete, verify)
- ✅ Comments system (realtime)
- ✅ Reactions (like, upvote, bookmark)
- ✅ Badges (catalog, awards)
- ✅ Tags system

### Phase 3: Events & Equipment (Weeks 11-14)

**Add:**
- ✅ Events (create, register, manage)
- ✅ Build challenge teams
- ✅ Maker meetup showcase slots
- ✅ Equipment catalog
- ✅ Equipment booking
- ✅ Induction management

### Phase 4: Store & Polish (Weeks 15-18)

**Add:**
- ✅ Store (products, orders)
- ✅ Badge-gated products
- ✅ Multi-image galleries (projects, challenges, events)
- ✅ Video links
- ✅ Inventory management
- ✅ Admin moderation tools
- ✅ Analytics dashboard

### Phase 5: Optimization (Week 19+)

**Add:**
- ✅ Performance optimization
- ✅ SEO improvements
- ✅ Email notifications
- ✅ Search functionality
- ✅ Mobile app (React Native, optional)

---

## 📝 ADDITIONAL NOTES

### Email Notifications (Supabase Edge Functions)

**Setup:**
```typescript
// supabase/functions/send-notification/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from '@supabase/supabase-js'

serve(async (req) => {
  const { type, userId, ...data } = await req.json()
  
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )
  
  // Get user email
  const { data: user } = await supabase
    .from('app_user')
    .select('email, name')
    .eq('id', userId)
    .single()
  
  // Send email based on type
  switch (type) {
    case 'project_approved':
      await sendEmail(user.email, {
        subject: 'Your project was approved!',
        body: `Congrats ${user.name}, your project is now live.`
      })
      break
    case 'badge_earned':
      // ...
      break
    // ... other types
  }
  
  return new Response(JSON.stringify({ success: true }))
})
```

### Search Functionality

**Full-text Search (PostgreSQL):**
```sql
-- Add search vector column
ALTER TABLE project ADD COLUMN search_vector tsvector;

-- Update function
CREATE OR REPLACE FUNCTION update_project_search_vector() 
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.one_line_summary, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
CREATE TRIGGER project_search_vector_update 
BEFORE INSERT OR UPDATE ON project
FOR EACH ROW EXECUTE FUNCTION update_project_search_vector();

-- Index
CREATE INDEX idx_project_search ON project USING GIN(search_vector);

-- Query
SELECT * FROM project 
WHERE search_vector @@ to_tsquery('english', 'robotics & arduino')
ORDER BY ts_rank(search_vector, to_tsquery('english', 'robotics & arduino')) DESC;
```

### Analytics

**Custom Events:**
```typescript
// lib/analytics.ts
export const trackEvent = (event: string, properties?: object) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event, properties)
  }
}

// Usage
trackEvent('project_created', { domain: 'IoT', tier: 'intermediate' })
trackEvent('challenge_completed', { challengeId: 'xxx' })
trackEvent('event_registered', { eventType: 'build_challenge' })
```

---

## 🎯 SUCCESS CRITERIA

**Technical:**
- ✅ <2s page load (Lighthouse score >90)
- ✅ Mobile responsive (all pages)
- ✅ Accessibility (WCAG AA)
- ✅ SEO optimized (meta tags, sitemap, robots.txt)
- ✅ Zero data loss (backups every 6 hours)
- ✅ 99.9% uptime

**User Experience:**
- ✅ Onboarding flow <5 minutes (register → first project)
- ✅ Project creation <10 minutes
- ✅ Event registration <2 clicks
- ✅ Equipment booking <3 clicks

**Business:**
- ✅ 100 makers registered in Month 1
- ✅ 50 projects published in Month 1
- ✅ 5 events hosted in Month 1
- ✅ 20% monthly growth

---

## 🛠️ TOOLS & RESOURCES

**Development:**
- VS Code with extensions: Tailwind IntelliSense, Prettier, ESLint
- Supabase CLI for migrations
- Figma for design mockups (optional)

**Libraries:**
- React Hook Form (forms)
- Zod (validation)
- date-fns (date formatting)
- react-markdown (markdown rendering)
- react-dropzone (file uploads)
- @dnd-kit/core (drag-and-drop for reordering)

**Documentation:**
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
- shadcn/ui: https://ui.shadcn.com
- Tailwind CSS: https://tailwindcss.com

---

## 🚨 CRITICAL BUSINESS RULES (RECAP)

1. **Projects:**
   - Only visible when status='active' AND visibility='public'
   - Makers can only edit their own projects
   - Mentors approve/reject pending projects

2. **Equipment:**
   - Induction-required equipment: User must have active induction with future expiry date
   - No double bookings (validate time slots)

3. **Events:**
   - Build challenges: User must be registered to create/join team
   - Maker meetups: Showcase slots need approval
   - Auto badge award on check-in (if event.auto_badge_id set)

4. **Store:**
   - Badge-gated products: User must have required badge to purchase

5. **Media:**
   - First image (display_order=1) is always the cover
   - Video URLs converted to embeds client-side

6. **Tags:**
   - Polymorphic: One table (entity_tag) for projects, challenges, makers

---

## 📞 CONTACT & QUESTIONS

For any clarifications during development, reference:
- ER Diagram v6 (attached)
- This PRD document

**Next Steps:**
1. Review this PRD
2. Approve tech stack
3. Set up development environment
4. Generate Supabase types
5. Begin Phase 1 implementation

---

**END OF PRD**
