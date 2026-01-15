/*
  # Update user profile photos

  1. Changes
    - Update photo_url for each user profile to use their specific profile photo
    - Map each user to their correct image file:
      - Mandjé Lebel: /Mandje.jpg
      - Moche Azran: /Moche.jpg
      - Benjamin Zaoui: /Benjamin.jpg
      - Ornella Attard: /Ornella.jpg

  2. Notes
    - Profile photos should be placed in the public directory
    - Images will be served from the root public path
*/

-- Update photo URLs for each user profile based on their name
UPDATE user_profiles
SET photo_url = '/Mandje.jpg'
WHERE first_name = 'Mandjé' AND last_name = 'Lebel';

UPDATE user_profiles
SET photo_url = '/Moche.jpg'
WHERE first_name = 'Moche' AND last_name = 'Azran';

UPDATE user_profiles
SET photo_url = '/Benjamin.jpg'
WHERE first_name = 'Benjamin' AND last_name = 'Zaoui';

UPDATE user_profiles
SET photo_url = '/Ornella.jpg'
WHERE first_name = 'Ornella' AND last_name = 'Attard';