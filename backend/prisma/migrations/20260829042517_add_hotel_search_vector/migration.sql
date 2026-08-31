-- 1. Add the column that will hold the normalized, weighted search vector
ALTER TABLE "Hotel" ADD COLUMN "searchVector" tsvector;

-- 2. Function: recompute searchVector for a single Hotel row
--    Weighting: name (A, highest) > city name (B) > description (C, lowest)
CREATE OR REPLACE FUNCTION hotel_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW."searchVector" :=
    setweight(to_tsvector('english', coalesce(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce((SELECT name FROM "City" WHERE id = NEW."cityId"), '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.description, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Trigger: run the function automatically before insert, or before update
--    of the specific columns the vector is built from
CREATE TRIGGER hotel_search_vector_trigger
BEFORE INSERT OR UPDATE OF name, description, "cityId" ON "Hotel"
FOR EACH ROW EXECUTE FUNCTION hotel_search_vector_update();

-- 4. Backfill: the trigger only fires on FUTURE writes, so existing rows
--    need this one-time manual computation
UPDATE "Hotel" h SET "searchVector" =
  setweight(to_tsvector('english', coalesce(h.name, '')), 'A') ||
  setweight(to_tsvector('english', coalesce((SELECT c.name FROM "City" c WHERE c.id = h."cityId"), '')), 'B') ||
  setweight(to_tsvector('english', coalesce(h.description, '')), 'C');

-- 5. GIN index: the actual performance mechanism, makes @@ lookups fast
CREATE INDEX hotel_search_vector_idx ON "Hotel" USING GIN ("searchVector");

-- 6. Edge case: keep hotels in sync if a City is ever renamed after hotels
--    already reference it (city name is baked into searchVector at write time)
CREATE OR REPLACE FUNCTION city_name_update_hotels() RETURNS trigger AS $$
BEGIN
  UPDATE "Hotel" h SET "searchVector" =
    setweight(to_tsvector('english', coalesce(h.name, '')), 'A') ||
    setweight(to_tsvector('english', NEW.name), 'B') ||
    setweight(to_tsvector('english', coalesce(h.description, '')), 'C')
  WHERE h."cityId" = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER city_name_update_trigger
AFTER UPDATE OF name ON "City"
FOR EACH ROW EXECUTE FUNCTION city_name_update_hotels();