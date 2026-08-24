BEGIN;
-- 1. Genres        
INSERT INTO genres (name, description, date_added, date_modified) VALUES
('RPG', 'Role-Playing Game focused on character development and story.', NOW(), NOW()),
('Action', 'Fast-paced gameplay focusing on physical challenges.', NOW(), NOW()),
('Adventure', 'Exploration and puzzle-solving within a narrative framework.', NOW(), NOW()),
('Sci-Fi', 'Futuristic and speculative technology themes.', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- 2. Developers
INSERT INTO developers (name, logo, location, summary, country, date_added, date_modified) VALUES
('CD Projekt Red', 'devs/cdpr.png', 'Warsaw', 'Creators of The Witcher and Cyberpunk series.', 'Poland', NOW(), NOW()),
('FromSoftware', 'devs/fromsoft.png', 'Tokyo', 'Pioneers of the Soulsborne subgenre.', 'Japan', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- 3. Publishers
INSERT INTO publishers (name, logo, headquarters, summary, country, date_added, date_modified) VALUES
('Bandai Namco', 'pub/bandai.png', 'Tokyo', 'Major global video game publisher.', 'Japan', NOW(), NOW()),
('CD Projekt', 'pub/cdprojekt.png', 'Warsaw', 'Parent company and publisher of CDPR games.', 'Poland', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- 4. Platforms
INSERT INTO platforms (name, logo, release_date, summary, date_added, date_modified) VALUES
('PlayStation 5', 'platforms/ps5.png', '2020-11-12', 'Ninth-generation home console by Sony.', NOW(), NOW()),
('PC', 'platforms/pc.png', '1981-08-12', 'Personal Computer platform via Steam/GOG.', NOW(), NOW()),
('Xbox Series X', 'platforms/xboxsx.png', '2020-11-10', 'Ninth-generation home console by Microsoft.', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- 5. Actors
INSERT INTO actors (name, photo, bio, date_added, date_modified) VALUES
('Keanu Reeves', 'actors/keanu.jpg', 'Renowned actor known for Johnny Silverhand in Cyberpunk 2077.', NOW(), NOW()),
('Cherami Leigh', 'actors/cherami.jpg', 'Prolific voice actress playing Female V in Cyberpunk 2077.', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- 6. Users
INSERT INTO users (id, display_name, email, email_verified, image, banner, username, display_username, role, bio, dob, location, links) VALUES
('018f3a5e-1234-7111-8000-000000000001', 'GamerJohn', 'john@example.com', true, 'users/john.png', 'users/john_banner.jpg', 'gamerjohn', 'GamerJohn', 'user', 'Avid RPG fan and collector.', '1995-04-12', 'Seattle, WA', ARRAY['https://twitter.com/gamerjohn', 'https://github.com/gamerjohn']),
('018f3a5e-5678-7222-8000-000000000002', 'SarahCraft', 'sarah@example.com', true, 'users/sarah.png', 'users/sarah_banner.jpg', 'sarahcraft', 'SarahCraft', 'admin', 'Community manager and soulslike fan.', '1992-09-28', 'London, UK', ARRAY['https://twitch.tv/sarahcraft']) ON CONFLICT DO NOTHING;

-- 7. Sessions
INSERT INTO sessions (id, expires_at, token, ip_address, user_agent, user_id, created_at, updated_at) VALUES
('018f3a5e-9012-7333-8000-000000000003', NOW() + INTERVAL '30 days', 'sess_token_abc123xyz', '192.168.1.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '018f3a5e-1234-7111-8000-000000000001', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- 8. Accounts
INSERT INTO accounts (id, account_id, provider_id, user_id, access_token, refresh_token, scope, created_at, updated_at) VALUES
('018f3a5e-3456-7444-8000-000000000004', 'acc_google_12345', 'google', '018f3a5e-1234-7111-8000-000000000001', 'oauth_access_token_123', 'oauth_refresh_token_123', 'email profile', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- 9. Verifications
INSERT INTO verifications (id, identifier, value, expires_at, created_at, updated_at) VALUES
('018f3a5e-7890-7555-8000-000000000005', 'john@example.com', 'token_email_verify_999', NOW() + INTERVAL '24 hours', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- 10. Games
INSERT INTO games (title, summary, developer_id, publisher_id, release_date, cover, banner, trailer, date_added, date_modified) VALUES
('Cyberpunk 2077', 'An open-world, action-adventure RPG set in the megalopolis of Night City.', 1, 2, '2020-12-10', 'games/cp2077_cover.png', 'games/cp2077_banner.jpg', 'https://youtube.com/watch?v=v001', NOW(), NOW()),
('Elden Ring', 'A fantasy action-RPG adventure set within a world created by Hidetaka Miyazaki and George R. R. Martin.', 2, 1, '2022-02-25', 'games/eldenring_cover.png', 'games/eldenring_banner.jpg', 'https://youtube.com/watch?v=v002', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- 11. Game Actors
INSERT INTO game_actors (game_id, actor_id, character, role_type) VALUES
(1, 1, 'Johnny Silverhand', 'major character'),
(1, 2, 'V (Female)', 'player character') ON CONFLICT DO NOTHING;

-- 12. Game Platforms
INSERT INTO game_platforms (game_id, platform_id) VALUES
(1, 1), -- Cyberpunk 2077 on PS5
(1, 2), -- Cyberpunk 2077 on PC
(1, 3), -- Cyberpunk 2077 on Xbox SX
(2, 1), -- Elden Ring on PS5
(2, 2) ON CONFLICT DO NOTHING; -- Elden Ring on PC

-- 13. Game Genres
INSERT INTO game_genres (game_id, genre) VALUES
(1, 'RPG'),
(1, 'Sci-Fi'),
(1, 'Action'),
(2, 'RPG'),
(2, 'Adventure') ON CONFLICT DO NOTHING;

-- 14. Posts
INSERT INTO posts (user_id, title, game_id, text, views, link, created_at, edited_on) VALUES
('018f3a5e-1234-7111-8000-000000000001', 'Build for 2077', 1, 'Quickhack builds are ridiculously fun in the latest patch. What is your go-to build?', 142, 'https://example.com/builds/cp2077', NOW(), NOW()),
('018f3a5e-5678-7222-8000-000000000002', 'Elden Ring DLC', 2, 'The boss design in the expansion is top-tier. Highly recommend going in blind.', 89, NULL, NOW(), NOW()) ON CONFLICT DO NOTHING;

-- 15. Post Tags
INSERT INTO post_tags (tag_name, post_id) VALUES
('rpg', 1),
('builds', 1),
('discussion', 2) ON CONFLICT DO NOTHING;

-- 16. Comments
INSERT INTO comments (post_id, user_id, text, reply_to, created_at, edited_on) VALUES
(1, '018f3a5e-5678-7222-8000-000000000002', 'Sandevistan + Blade builds are way faster though!', NULL, NOW(), NOW()),
(1, '018f3a5e-1234-7111-8000-000000000001', 'Fair point, blades clear rooms in seconds.', 1, NOW(), NOW()) ON CONFLICT DO NOTHING;

-- 17. Post Reactions
INSERT INTO post_reactions (user_id, post_id, date, reaction) VALUES
('018f3a5e-5678-7222-8000-000000000002', 1, NOW(), 'like'),
('018f3a5e-1234-7111-8000-000000000001', 2, NOW(), 'like') ON CONFLICT DO NOTHING;

-- 18. Comment Reactions
INSERT INTO comment_reactions (user_id, comment_id, date, reaction) VALUES
('018f3a5e-1234-7111-8000-000000000001', 1, NOW(), 'like') ON CONFLICT DO NOTHING;

-- 19. Media
INSERT INTO media (key, content_type, post_id, game_id, metadata, created_at) VALUES
('media/posts/screenshot_01.jpg', 'image/jpeg', 1, 1, '{"width": 1920, "height": 1080, "alt": "Cyberpunk Quickhack UI"}'::jsonb, NOW()),
('media/games/elden_ring_art.png', 'image/png', NULL, 2, '{"width": 3840, "height": 2160, "type": "concept_art"}'::jsonb, NOW()) ON CONFLICT DO NOTHING;

-- 20. Follower / Followee
INSERT INTO follower_followee (follower_id, followee_id, date_followed) VALUES
('018f3a5e-1234-7111-8000-000000000001', '018f3a5e-5678-7222-8000-000000000002', NOW()) ON CONFLICT DO NOTHING;

COMMIT;        