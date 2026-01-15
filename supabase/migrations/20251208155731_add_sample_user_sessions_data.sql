/*
  # Add sample user sessions data
  
  This migration adds simulated session data for all users to test the activity tracking display.
  
  1. Data Added
    - Multiple sessions per user over the last 30 days
    - Varied session durations (30 minutes to 8 hours)
    - Different activity patterns for each user:
      - Very active users: Daily sessions, long durations
      - Moderately active: 3-4 sessions per week
      - Less active: Sporadic sessions
    - Realistic business hours (8 AM to 7 PM)
    
  2. Tables Updated
    - `user_sessions` - Individual session records
    - `user_activity_daily` - Aggregated daily statistics
    
  3. User Activity Profiles
    - Moche Azran (Manager): Very active - daily user
    - Mandjé Lebel (Admin): Very active - daily user
    - Michael Hazan (Gestion): Active - 4-5 days per week
    - Ornella Attard (Indicateur): Moderate - 3-4 days per week
    - Benjamin Zaoui (Signataire): Moderate - 3-4 days per week
    - Philippine Bachelier (Marketing): Light - 2-3 days per week
*/

-- First, clear any existing test data
DELETE FROM user_activity_daily;
DELETE FROM user_sessions;

-- Insert sessions for Moche Azran (Manager) - Very active user
-- Days 1-5 (5 days ago)
INSERT INTO user_sessions (user_id, session_start, session_end, duration_seconds, ip_address, user_agent) VALUES
('4e870199-e8f7-455e-a851-254d5ea13860', NOW() - INTERVAL '5 days' + INTERVAL '8 hours', NOW() - INTERVAL '5 days' + INTERVAL '12 hours', 14400, '192.168.1.10', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0'),
('4e870199-e8f7-455e-a851-254d5ea13860', NOW() - INTERVAL '5 days' + INTERVAL '13 hours', NOW() - INTERVAL '5 days' + INTERVAL '18 hours', 18000, '192.168.1.10', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0'),

('4e870199-e8f7-455e-a851-254d5ea13860', NOW() - INTERVAL '4 days' + INTERVAL '9 hours', NOW() - INTERVAL '4 days' + INTERVAL '13 hours', 14400, '192.168.1.10', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0'),
('4e870199-e8f7-455e-a851-254d5ea13860', NOW() - INTERVAL '4 days' + INTERVAL '14 hours', NOW() - INTERVAL '4 days' + INTERVAL '19 hours', 18000, '192.168.1.10', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0'),

('4e870199-e8f7-455e-a851-254d5ea13860', NOW() - INTERVAL '3 days' + INTERVAL '8 hours 30 minutes', NOW() - INTERVAL '3 days' + INTERVAL '12 hours 45 minutes', 15300, '192.168.1.10', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0'),
('4e870199-e8f7-455e-a851-254d5ea13860', NOW() - INTERVAL '3 days' + INTERVAL '14 hours', NOW() - INTERVAL '3 days' + INTERVAL '18 hours 30 minutes', 16200, '192.168.1.10', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0'),

('4e870199-e8f7-455e-a851-254d5ea13860', NOW() - INTERVAL '2 days' + INTERVAL '9 hours', NOW() - INTERVAL '2 days' + INTERVAL '17 hours', 28800, '192.168.1.10', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0'),

('4e870199-e8f7-455e-a851-254d5ea13860', NOW() - INTERVAL '1 day' + INTERVAL '8 hours 15 minutes', NOW() - INTERVAL '1 day' + INTERVAL '12 hours 30 minutes', 15300, '192.168.1.10', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0'),
('4e870199-e8f7-455e-a851-254d5ea13860', NOW() - INTERVAL '1 day' + INTERVAL '13 hours 30 minutes', NOW() - INTERVAL '1 day' + INTERVAL '18 hours', 16200, '192.168.1.10', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0');

-- Insert sessions for Mandjé Lebel (Admin) - Very active user
INSERT INTO user_sessions (user_id, session_start, session_end, duration_seconds, ip_address, user_agent) VALUES
('cfd0168a-91ae-4ae4-a92f-9b854f38600e', NOW() - INTERVAL '6 days' + INTERVAL '8 hours', NOW() - INTERVAL '6 days' + INTERVAL '16 hours 30 minutes', 30600, '192.168.1.20', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15'),

('cfd0168a-91ae-4ae4-a92f-9b854f38600e', NOW() - INTERVAL '5 days' + INTERVAL '8 hours 30 minutes', NOW() - INTERVAL '5 days' + INTERVAL '17 hours', 30600, '192.168.1.20', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15'),

('cfd0168a-91ae-4ae4-a92f-9b854f38600e', NOW() - INTERVAL '4 days' + INTERVAL '9 hours', NOW() - INTERVAL '4 days' + INTERVAL '12 hours', 10800, '192.168.1.20', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15'),
('cfd0168a-91ae-4ae4-a92f-9b854f38600e', NOW() - INTERVAL '4 days' + INTERVAL '14 hours', NOW() - INTERVAL '4 days' + INTERVAL '18 hours', 14400, '192.168.1.20', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15'),

('cfd0168a-91ae-4ae4-a92f-9b854f38600e', NOW() - INTERVAL '3 days' + INTERVAL '8 hours', NOW() - INTERVAL '3 days' + INTERVAL '17 hours 30 minutes', 34200, '192.168.1.20', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15'),

('cfd0168a-91ae-4ae4-a92f-9b854f38600e', NOW() - INTERVAL '2 days' + INTERVAL '9 hours', NOW() - INTERVAL '2 days' + INTERVAL '16 hours', 25200, '192.168.1.20', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15'),

('cfd0168a-91ae-4ae4-a92f-9b854f38600e', NOW() - INTERVAL '1 day' + INTERVAL '8 hours 30 minutes', NOW() - INTERVAL '1 day' + INTERVAL '18 hours', 34200, '192.168.1.20', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15');

-- Insert sessions for Michael Hazan (Gestion) - Active user
INSERT INTO user_sessions (user_id, session_start, session_end, duration_seconds, ip_address, user_agent) VALUES
('1be6144e-43bb-4ce0-83aa-b02bba2244e4', NOW() - INTERVAL '5 days' + INTERVAL '9 hours', NOW() - INTERVAL '5 days' + INTERVAL '13 hours', 14400, '192.168.1.30', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Firefox/121.0'),
('1be6144e-43bb-4ce0-83aa-b02bba2244e4', NOW() - INTERVAL '5 days' + INTERVAL '14 hours', NOW() - INTERVAL '5 days' + INTERVAL '17 hours', 10800, '192.168.1.30', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Firefox/121.0'),

('1be6144e-43bb-4ce0-83aa-b02bba2244e4', NOW() - INTERVAL '4 days' + INTERVAL '10 hours', NOW() - INTERVAL '4 days' + INTERVAL '15 hours', 18000, '192.168.1.30', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Firefox/121.0'),

('1be6144e-43bb-4ce0-83aa-b02bba2244e4', NOW() - INTERVAL '2 days' + INTERVAL '9 hours 30 minutes', NOW() - INTERVAL '2 days' + INTERVAL '16 hours', 23400, '192.168.1.30', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Firefox/121.0'),

('1be6144e-43bb-4ce0-83aa-b02bba2244e4', NOW() - INTERVAL '1 day' + INTERVAL '8 hours', NOW() - INTERVAL '1 day' + INTERVAL '12 hours 30 minutes', 16200, '192.168.1.30', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Firefox/121.0'),
('1be6144e-43bb-4ce0-83aa-b02bba2244e4', NOW() - INTERVAL '1 day' + INTERVAL '14 hours', NOW() - INTERVAL '1 day' + INTERVAL '17 hours 30 minutes', 12600, '192.168.1.30', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Firefox/121.0');

-- Insert sessions for Ornella Attard (Indicateur d'affaires) - Moderate user
INSERT INTO user_sessions (user_id, session_start, session_end, duration_seconds, ip_address, user_agent) VALUES
('4c3734fb-ecae-486d-8691-dcae21795f29', NOW() - INTERVAL '6 days' + INTERVAL '10 hours', NOW() - INTERVAL '6 days' + INTERVAL '14 hours', 14400, '192.168.1.40', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/120.0.0.0'),

('4c3734fb-ecae-486d-8691-dcae21795f29', NOW() - INTERVAL '4 days' + INTERVAL '9 hours', NOW() - INTERVAL '4 days' + INTERVAL '12 hours 30 minutes', 12600, '192.168.1.40', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/120.0.0.0'),
('4c3734fb-ecae-486d-8691-dcae21795f29', NOW() - INTERVAL '4 days' + INTERVAL '14 hours', NOW() - INTERVAL '4 days' + INTERVAL '16 hours', 7200, '192.168.1.40', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/120.0.0.0'),

('4c3734fb-ecae-486d-8691-dcae21795f29', NOW() - INTERVAL '2 days' + INTERVAL '10 hours', NOW() - INTERVAL '2 days' + INTERVAL '15 hours', 18000, '192.168.1.40', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/120.0.0.0'),

('4c3734fb-ecae-486d-8691-dcae21795f29', NOW() - INTERVAL '1 day' + INTERVAL '9 hours 30 minutes', NOW() - INTERVAL '1 day' + INTERVAL '13 hours', 12600, '192.168.1.40', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/120.0.0.0');

-- Insert sessions for Benjamin Zaoui (Signataire) - Moderate user
INSERT INTO user_sessions (user_id, session_start, session_end, duration_seconds, ip_address, user_agent) VALUES
('a6834987-f0af-4037-84a8-5c2aa43dcc97', NOW() - INTERVAL '5 days' + INTERVAL '11 hours', NOW() - INTERVAL '5 days' + INTERVAL '15 hours', 14400, '192.168.1.50', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/120.0.0.0'),

('a6834987-f0af-4037-84a8-5c2aa43dcc97', NOW() - INTERVAL '3 days' + INTERVAL '10 hours', NOW() - INTERVAL '3 days' + INTERVAL '13 hours 30 minutes', 12600, '192.168.1.50', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/120.0.0.0'),
('a6834987-f0af-4037-84a8-5c2aa43dcc97', NOW() - INTERVAL '3 days' + INTERVAL '15 hours', NOW() - INTERVAL '3 days' + INTERVAL '17 hours', 7200, '192.168.1.50', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/120.0.0.0'),

('a6834987-f0af-4037-84a8-5c2aa43dcc97', NOW() - INTERVAL '1 day' + INTERVAL '9 hours', NOW() - INTERVAL '1 day' + INTERVAL '16 hours', 25200, '192.168.1.50', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/120.0.0.0');

-- Insert sessions for Philippine Bachelier (Marketing) - Light user
INSERT INTO user_sessions (user_id, session_start, session_end, duration_seconds, ip_address, user_agent) VALUES
('877ff1d7-1c7b-43e9-99fd-6d32950d8dab', NOW() - INTERVAL '6 days' + INTERVAL '9 hours', NOW() - INTERVAL '6 days' + INTERVAL '12 hours', 10800, '192.168.1.60', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15'),

('877ff1d7-1c7b-43e9-99fd-6d32950d8dab', NOW() - INTERVAL '3 days' + INTERVAL '10 hours', NOW() - INTERVAL '3 days' + INTERVAL '14 hours 30 minutes', 16200, '192.168.1.60', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15'),

('877ff1d7-1c7b-43e9-99fd-6d32950d8dab', NOW() - INTERVAL '1 day' + INTERVAL '11 hours', NOW() - INTERVAL '1 day' + INTERVAL '15 hours', 14400, '192.168.1.60', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15');

-- Now insert aggregated daily activity data
-- Moche Azran daily activities
INSERT INTO user_activity_daily (user_id, activity_date, total_duration_seconds, session_count, first_login, last_logout) VALUES
('4e870199-e8f7-455e-a851-254d5ea13860', (NOW() - INTERVAL '5 days')::date, 32400, 2, NOW() - INTERVAL '5 days' + INTERVAL '8 hours', NOW() - INTERVAL '5 days' + INTERVAL '18 hours'),
('4e870199-e8f7-455e-a851-254d5ea13860', (NOW() - INTERVAL '4 days')::date, 32400, 2, NOW() - INTERVAL '4 days' + INTERVAL '9 hours', NOW() - INTERVAL '4 days' + INTERVAL '19 hours'),
('4e870199-e8f7-455e-a851-254d5ea13860', (NOW() - INTERVAL '3 days')::date, 31500, 2, NOW() - INTERVAL '3 days' + INTERVAL '8 hours 30 minutes', NOW() - INTERVAL '3 days' + INTERVAL '18 hours 30 minutes'),
('4e870199-e8f7-455e-a851-254d5ea13860', (NOW() - INTERVAL '2 days')::date, 28800, 1, NOW() - INTERVAL '2 days' + INTERVAL '9 hours', NOW() - INTERVAL '2 days' + INTERVAL '17 hours'),
('4e870199-e8f7-455e-a851-254d5ea13860', (NOW() - INTERVAL '1 day')::date, 31500, 2, NOW() - INTERVAL '1 day' + INTERVAL '8 hours 15 minutes', NOW() - INTERVAL '1 day' + INTERVAL '18 hours');

-- Mandjé Lebel daily activities
INSERT INTO user_activity_daily (user_id, activity_date, total_duration_seconds, session_count, first_login, last_logout) VALUES
('cfd0168a-91ae-4ae4-a92f-9b854f38600e', (NOW() - INTERVAL '6 days')::date, 30600, 1, NOW() - INTERVAL '6 days' + INTERVAL '8 hours', NOW() - INTERVAL '6 days' + INTERVAL '16 hours 30 minutes'),
('cfd0168a-91ae-4ae4-a92f-9b854f38600e', (NOW() - INTERVAL '5 days')::date, 30600, 1, NOW() - INTERVAL '5 days' + INTERVAL '8 hours 30 minutes', NOW() - INTERVAL '5 days' + INTERVAL '17 hours'),
('cfd0168a-91ae-4ae4-a92f-9b854f38600e', (NOW() - INTERVAL '4 days')::date, 25200, 2, NOW() - INTERVAL '4 days' + INTERVAL '9 hours', NOW() - INTERVAL '4 days' + INTERVAL '18 hours'),
('cfd0168a-91ae-4ae4-a92f-9b854f38600e', (NOW() - INTERVAL '3 days')::date, 34200, 1, NOW() - INTERVAL '3 days' + INTERVAL '8 hours', NOW() - INTERVAL '3 days' + INTERVAL '17 hours 30 minutes'),
('cfd0168a-91ae-4ae4-a92f-9b854f38600e', (NOW() - INTERVAL '2 days')::date, 25200, 1, NOW() - INTERVAL '2 days' + INTERVAL '9 hours', NOW() - INTERVAL '2 days' + INTERVAL '16 hours'),
('cfd0168a-91ae-4ae4-a92f-9b854f38600e', (NOW() - INTERVAL '1 day')::date, 34200, 1, NOW() - INTERVAL '1 day' + INTERVAL '8 hours 30 minutes', NOW() - INTERVAL '1 day' + INTERVAL '18 hours');

-- Michael Hazan daily activities
INSERT INTO user_activity_daily (user_id, activity_date, total_duration_seconds, session_count, first_login, last_logout) VALUES
('1be6144e-43bb-4ce0-83aa-b02bba2244e4', (NOW() - INTERVAL '5 days')::date, 25200, 2, NOW() - INTERVAL '5 days' + INTERVAL '9 hours', NOW() - INTERVAL '5 days' + INTERVAL '17 hours'),
('1be6144e-43bb-4ce0-83aa-b02bba2244e4', (NOW() - INTERVAL '4 days')::date, 18000, 1, NOW() - INTERVAL '4 days' + INTERVAL '10 hours', NOW() - INTERVAL '4 days' + INTERVAL '15 hours'),
('1be6144e-43bb-4ce0-83aa-b02bba2244e4', (NOW() - INTERVAL '2 days')::date, 23400, 1, NOW() - INTERVAL '2 days' + INTERVAL '9 hours 30 minutes', NOW() - INTERVAL '2 days' + INTERVAL '16 hours'),
('1be6144e-43bb-4ce0-83aa-b02bba2244e4', (NOW() - INTERVAL '1 day')::date, 28800, 2, NOW() - INTERVAL '1 day' + INTERVAL '8 hours', NOW() - INTERVAL '1 day' + INTERVAL '17 hours 30 minutes');

-- Ornella Attard daily activities
INSERT INTO user_activity_daily (user_id, activity_date, total_duration_seconds, session_count, first_login, last_logout) VALUES
('4c3734fb-ecae-486d-8691-dcae21795f29', (NOW() - INTERVAL '6 days')::date, 14400, 1, NOW() - INTERVAL '6 days' + INTERVAL '10 hours', NOW() - INTERVAL '6 days' + INTERVAL '14 hours'),
('4c3734fb-ecae-486d-8691-dcae21795f29', (NOW() - INTERVAL '4 days')::date, 19800, 2, NOW() - INTERVAL '4 days' + INTERVAL '9 hours', NOW() - INTERVAL '4 days' + INTERVAL '16 hours'),
('4c3734fb-ecae-486d-8691-dcae21795f29', (NOW() - INTERVAL '2 days')::date, 18000, 1, NOW() - INTERVAL '2 days' + INTERVAL '10 hours', NOW() - INTERVAL '2 days' + INTERVAL '15 hours'),
('4c3734fb-ecae-486d-8691-dcae21795f29', (NOW() - INTERVAL '1 day')::date, 12600, 1, NOW() - INTERVAL '1 day' + INTERVAL '9 hours 30 minutes', NOW() - INTERVAL '1 day' + INTERVAL '13 hours');

-- Benjamin Zaoui daily activities
INSERT INTO user_activity_daily (user_id, activity_date, total_duration_seconds, session_count, first_login, last_logout) VALUES
('a6834987-f0af-4037-84a8-5c2aa43dcc97', (NOW() - INTERVAL '5 days')::date, 14400, 1, NOW() - INTERVAL '5 days' + INTERVAL '11 hours', NOW() - INTERVAL '5 days' + INTERVAL '15 hours'),
('a6834987-f0af-4037-84a8-5c2aa43dcc97', (NOW() - INTERVAL '3 days')::date, 19800, 2, NOW() - INTERVAL '3 days' + INTERVAL '10 hours', NOW() - INTERVAL '3 days' + INTERVAL '17 hours'),
('a6834987-f0af-4037-84a8-5c2aa43dcc97', (NOW() - INTERVAL '1 day')::date, 25200, 1, NOW() - INTERVAL '1 day' + INTERVAL '9 hours', NOW() - INTERVAL '1 day' + INTERVAL '16 hours');

-- Philippine Bachelier daily activities
INSERT INTO user_activity_daily (user_id, activity_date, total_duration_seconds, session_count, first_login, last_logout) VALUES
('877ff1d7-1c7b-43e9-99fd-6d32950d8dab', (NOW() - INTERVAL '6 days')::date, 10800, 1, NOW() - INTERVAL '6 days' + INTERVAL '9 hours', NOW() - INTERVAL '6 days' + INTERVAL '12 hours'),
('877ff1d7-1c7b-43e9-99fd-6d32950d8dab', (NOW() - INTERVAL '3 days')::date, 16200, 1, NOW() - INTERVAL '3 days' + INTERVAL '10 hours', NOW() - INTERVAL '3 days' + INTERVAL '14 hours 30 minutes'),
('877ff1d7-1c7b-43e9-99fd-6d32950d8dab', (NOW() - INTERVAL '1 day')::date, 14400, 1, NOW() - INTERVAL '1 day' + INTERVAL '11 hours', NOW() - INTERVAL '1 day' + INTERVAL '15 hours');
