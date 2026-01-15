/*
  # Fix Database Security Issues

  ## Summary
  Comprehensive security fixes to optimize performance and remove vulnerabilities

  ## Changes Made

  ### 1. Add Missing Index
  - Added index on `devoirs_conseil.user_id` foreign key for optimal query performance

  ### 2. Optimize RLS Policies (Auth Function Calls)
  - Updated all RLS policies on `lead_comments` to use `(select auth.uid())` instead of `auth.uid()`
  - This prevents re-evaluation of auth functions for each row, significantly improving performance at scale

  ### 3. Remove Unused Indexes
  - Dropped `idx_lead_comments_lead_id` - not being used by queries
  - Dropped `idx_lead_comments_user_id` - not being used by queries  
  - Dropped `idx_contracts_lead_id` - not being used by queries

  ### 4. Fix Multiple Permissive Policies
  - Consolidated conflicting SELECT policies on `devoirs_conseil`
  - Removed the conflicting "Anyone can view devoirs conseil" policy
  - Kept only the authenticated user policy for better security

  ### 5. Remove Anonymous Access
  - Removed all anonymous access policies from `devoirs_conseil`
  - Restored proper authentication-only access
  - Re-established user ownership validation for INSERT, UPDATE, DELETE

  ## Security Notes
  - All tables now require authentication
  - RLS policies are optimized for performance
  - User ownership is properly validated
  - No anonymous access allowed
*/

-- 1. Add missing index for devoirs_conseil.user_id foreign key
CREATE INDEX IF NOT EXISTS idx_devoirs_conseil_user_id_fk ON devoirs_conseil(user_id);

-- 2. Remove unused indexes
DROP INDEX IF EXISTS idx_lead_comments_lead_id;
DROP INDEX IF EXISTS idx_lead_comments_user_id;
DROP INDEX IF EXISTS idx_contracts_lead_id;

-- 3. Fix RLS policies on lead_comments to use (select auth.uid())
DROP POLICY IF EXISTS "Users can create comments" ON lead_comments;
DROP POLICY IF EXISTS "Users can update own comments" ON lead_comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON lead_comments;

CREATE POLICY "Users can create comments"
  ON lead_comments
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own comments"
  ON lead_comments
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own comments"
  ON lead_comments
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- 4. Fix multiple permissive policies and remove anonymous access on devoirs_conseil
DROP POLICY IF EXISTS "Anyone can view devoirs conseil" ON devoirs_conseil;
DROP POLICY IF EXISTS "Anyone can create devoirs conseil" ON devoirs_conseil;
DROP POLICY IF EXISTS "Anyone can update devoirs conseil" ON devoirs_conseil;
DROP POLICY IF EXISTS "Anyone can delete devoirs conseil" ON devoirs_conseil;
DROP POLICY IF EXISTS "Users can view own devoirs conseil" ON devoirs_conseil;
DROP POLICY IF EXISTS "Users can create devoirs conseil" ON devoirs_conseil;
DROP POLICY IF EXISTS "Users can update own devoirs conseil" ON devoirs_conseil;
DROP POLICY IF EXISTS "Users can delete own devoirs conseil" ON devoirs_conseil;

-- Recreate proper authenticated-only policies with optimized auth calls
CREATE POLICY "Users can view own devoirs conseil"
  ON devoirs_conseil
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can create devoirs conseil"
  ON devoirs_conseil
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own devoirs conseil"
  ON devoirs_conseil
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own devoirs conseil"
  ON devoirs_conseil
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);
