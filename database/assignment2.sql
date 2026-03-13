-- 1. Insert Tony Stark into account table
INSERT INTO public.account (first_name, last_name, email, password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- 2. Update Tony Stark to Admin
UPDATE public.account
SET account_type = 'Admin'
WHERE email = 'tony@starkent.com';

-- 3. Delete Tony Stark
DELETE FROM public.account
WHERE email = 'tony@starkent.com';

-- 4. Update GM Hummer description
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- 5. Select make, model, classification for "Sport" category
SELECT i.inv_make, i.inv_model, c.classification_name
FROM public.inventory i
INNER JOIN public.classification c
ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';

-- 6. Add '/vehicles' to inv_image and inv_thumbnail paths
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');