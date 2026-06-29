-- NORDHEM e-commerce - SQL schema (SQLite / MySQL / PostgreSQL compatible)
-- Price differentiation is expressed via product_variants (one row per tier).

PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS product_variants;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

CREATE TABLE categories (
  id          INTEGER PRIMARY KEY,
  slug        TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  description TEXT
);

CREATE TABLE products (
  id           INTEGER PRIMARY KEY,
  category_id  INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  name         TEXT    NOT NULL,
  description  TEXT    NOT NULL,
  material     TEXT,
  dimensions   TEXT,
  rating       REAL    DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  image_url    TEXT,
  created_at   TEXT    DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_products_category ON products(category_id);

-- The tier table: one product → up to 3 variants (basic / standard / premium)
CREATE TABLE product_variants (
  id          INTEGER PRIMARY KEY,
  product_id  INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  tier        TEXT    NOT NULL CHECK (tier IN ('basic','standard','premium')),
  sku         TEXT    NOT NULL UNIQUE,
  price       REAL    NOT NULL CHECK (price >= 0),
  stock       INTEGER NOT NULL DEFAULT 0,
  features    TEXT,                  -- JSON array of bullet features
  UNIQUE (product_id, tier)
);
CREATE INDEX idx_variants_tier ON product_variants(tier);

CREATE TABLE users (
  id         INTEGER PRIMARY KEY,
  email      TEXT NOT NULL UNIQUE,
  password   TEXT NOT NULL,          -- hashed in app layer
  name       TEXT NOT NULL,
  address    TEXT,
  phone      TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id          INTEGER PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  order_date  TEXT    DEFAULT CURRENT_TIMESTAMP,
  total_price REAL    NOT NULL,
  status      TEXT    NOT NULL DEFAULT 'pending'
              CHECK (status IN ('pending','paid','shipped','delivered','cancelled'))
);
CREATE INDEX idx_orders_user ON orders(user_id);

CREATE TABLE order_items (
  id          INTEGER PRIMARY KEY,
  order_id    INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  variant_id  INTEGER NOT NULL REFERENCES product_variants(id) ON DELETE RESTRICT,
  quantity    INTEGER NOT NULL CHECK (quantity > 0),
  unit_price  REAL    NOT NULL
);

CREATE TABLE reviews (
  id         INTEGER PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id    INTEGER NOT NULL REFERENCES users(id)    ON DELETE CASCADE,
  rating     INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment    TEXT,
  created_at TEXT    DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_reviews_product ON reviews(product_id);

CREATE TABLE cart_items (
  id         INTEGER PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  variant_id INTEGER NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
  quantity   INTEGER NOT NULL CHECK (quantity > 0),
  UNIQUE (user_id, variant_id)
);

-- Seed data

INSERT INTO categories (id, slug, name, description) VALUES
 (1,'living-room','Living Room','Sofas, tables, shelving and lighting'),
 (2,'bedroom',    'Bedroom',    'Beds, wardrobes, bedside essentials'),
 (3,'kitchen',    'Kitchen',    'Cookware, storage, dining'),
 (4,'office',     'Office',     'Desks, chairs, organisation'),
 (5,'bathroom',   'Bathroom',   'Towels, storage, accessories'),
 (6,'lighting',   'Lighting',   'Lamps and ambient lighting');

INSERT INTO products (id, category_id, name, description, material, dimensions, rating, review_count, image_url) VALUES
 (1, 1,'Fjord Sofa',        '3-seat sofa with deep cushions and removable covers.',          'Polyester / pine frame',     '210x88x76 cm', 4.5, 132,'fjord-sofa'),
 (2, 1,'Lagom Coffee Table','Low-profile coffee table with hidden storage.',                 'Engineered wood / oak veneer','110x60x42 cm', 4.2, 88, 'lagom-table'),
 (3, 1,'Bjork Bookshelf',   'Five-shelf open bookshelf, wall-anchorable.',                   'Particleboard / solid pine', '80x180x28 cm', 4.4, 210,'bjork-shelf'),
 (4, 2,'Drom Bed Frame',    'Queen bed frame with slatted base.',                            'Steel / wood',               '160x200 cm',   4.6, 174,'drom-bed'),
 (5, 2,'Natt Nightstand',   'Compact two-drawer nightstand.',                                'MDF / beech',                '45x40x55 cm',  4.1, 64, 'natt-nightstand'),
 (6, 2,'Linne Wardrobe',    'Three-door wardrobe with mirror option.',                       'Particleboard',              '150x60x202 cm',4.3, 92, 'linne-wardrobe'),
 (7, 3,'Koka Cookware Set', '5-piece non-stick cookware set.',                               'Aluminium / ceramic coating','-',            4.4, 311,'koka-set'),
 (8, 3,'Bord Dining Table', 'Extendable dining table seats 4-6.',                            'Oak / steel',                '140-180x85 cm',4.7, 145,'bord-table'),
 (9, 3,'Glas Tumbler Set',  'Set of 6 stackable tumblers.',                                  'Tempered glass',             '300 ml',       4.0, 58, 'glas-set'),
 (10,4,'Skriva Desk',       'Workspace desk with cable channel.',                            'MDF / steel',                '140x70x74 cm', 4.3, 121,'skriva-desk'),
 (11,4,'Sitta Office Chair','Ergonomic chair with lumbar support.',                          'Mesh / nylon',               '65x65x110 cm', 4.2, 198,'sitta-chair'),
 (12,4,'Ordna Organiser',   'Modular desk organiser tray.',                                  'Bamboo / felt',              '30x20x8 cm',   4.5, 73, 'ordna-organiser'),
 (13,5,'Bada Towel Set',    'Set of 4 cotton bath towels.',                                  '100% cotton',                '70x140 cm',    4.6, 240,'bada-towels'),
 (14,5,'Spegel Mirror',     'Round wall mirror with thin metal frame.',                      'Glass / steel',              'Ø 60 cm',      4.4, 87, 'spegel-mirror'),
 (15,5,'Tval Soap Dispenser','Refillable countertop soap dispenser.',                        'Ceramic',                    '250 ml',       4.1, 41, 'tval-dispenser'),
 (16,6,'Mane Floor Lamp',   'Adjustable arc floor lamp.',                                    'Steel / linen shade',        'H 175 cm',     4.5, 132,'mane-lamp'),
 (17,6,'Stjarna Pendant',   'Geometric pendant ceiling lamp.',                               'Aluminium',                  'Ø 40 cm',      4.3, 56, 'stjarna-pendant'),
 (18,6,'Ljus Table Lamp',   'Warm-light bedside table lamp.',                                'Ceramic / fabric',           'H 35 cm',      4.2, 110,'ljus-lamp'),
 (19,1,'Mys Armchair',      'Lounge armchair with high back.',                               'Velvet / pine frame',        '78x80x95 cm',  4.6, 99, 'mys-armchair'),
 (20,3,'Kniv Knife Block',  '6-piece stainless knife block set.',                            'Stainless steel / acacia',   '-',            4.5, 64, 'kniv-block');

-- Each product → 3 variants (basic / standard / premium)
INSERT INTO product_variants (product_id, tier, sku, price, stock, features) VALUES
 (1,'basic',   'FJ-B-001',  349.00, 12,'["Polyester cover","Foam cushions","2-year warranty"]'),
 (1,'standard','FJ-S-001',  549.00, 18,'["Stain-resistant fabric","Pocket springs","5-year warranty"]'),
 (1,'premium', 'FJ-P-001',  899.00,  6,'["Boucle fabric","Down-blend cushions","10-year warranty"]'),
 (2,'basic',   'LA-B-002',   79.00, 30,'["Laminate top"]'),
 (2,'standard','LA-S-002',  129.00, 22,'["Oak veneer","Hidden storage"]'),
 (2,'premium', 'LA-P-002',  229.00,  9,'["Solid oak top","Soft-close drawer"]'),
 (3,'basic',   'BJ-B-003',   59.00, 40,'["Particleboard","5 shelves"]'),
 (3,'standard','BJ-S-003',   99.00, 25,'["Reinforced shelves","Anti-tip kit"]'),
 (3,'premium', 'BJ-P-003',  189.00, 10,'["Solid pine","Adjustable shelving"]'),
 (4,'basic',   'DR-B-004',  179.00, 14,'["Steel frame","Slatted base"]'),
 (4,'standard','DR-S-004',  299.00, 12,'["Padded headboard"]'),
 (4,'premium', 'DR-P-004',  549.00,  5,'["Upholstered headboard","Under-bed storage"]'),
 (5,'basic',   'NA-B-005',   39.00, 50,'["Laminate","1 drawer"]'),
 (5,'standard','NA-S-005',   69.00, 35,'["2 drawers","Soft-close"]'),
 (5,'premium', 'NA-P-005',  129.00, 11,'["Solid beech","Wireless charge top"]'),
 (6,'basic',   'LI-B-006',  149.00, 10,'["3 doors"]'),
 (6,'standard','LI-S-006',  239.00,  8,'["Mirror door"]'),
 (6,'premium', 'LI-P-006',  399.00,  4,'["Full mirror","Interior lighting"]'),
 (7,'basic',   'KO-B-007',   49.00, 60,'["Non-stick","5 pieces"]'),
 (7,'standard','KO-S-007',   89.00, 40,'["Ceramic coating","Induction-ready"]'),
 (7,'premium', 'KO-P-007',  179.00, 15,'["Stainless tri-ply","Lifetime warranty"]'),
 (8,'basic',   'BO-B-008',  199.00, 12,'["Laminate top","Seats 4"]'),
 (8,'standard','BO-S-008',  349.00,  9,'["Oak veneer","Extendable"]'),
 (8,'premium', 'BO-P-008',  599.00,  4,'["Solid oak","Self-storing leaf"]'),
 (9,'basic',   'GL-B-009',   12.00,100,'["Set of 6"]'),
 (9,'standard','GL-S-009',   22.00, 70,'["Tempered glass"]'),
 (9,'premium', 'GL-P-009',   39.00, 25,'["Hand-blown","Lead-free crystal"]'),
 (10,'basic',  'SK-B-010',   89.00, 25,'["MDF top"]'),
 (10,'standard','SK-S-010', 159.00, 18,'["Cable channel","Height marks"]'),
 (10,'premium','SK-P-010',  299.00,  7,'["Electric height-adjust"]'),
 (11,'basic',  'SI-B-011',   79.00, 30,'["Mesh back"]'),
 (11,'standard','SI-S-011', 149.00, 20,'["Adjustable lumbar"]'),
 (11,'premium','SI-P-011',  299.00,  8,'["4D armrests","Headrest"]'),
 (12,'basic',  'OR-B-012',   14.00, 80,'["3 compartments"]'),
 (12,'standard','OR-S-012',  24.00, 50,'["Bamboo","Felt lined"]'),
 (12,'premium','OR-P-012',   39.00, 20,'["Modular","Wireless charging tile"]'),
 (13,'basic',  'BA-B-013',   19.00, 80,'["Cotton blend"]'),
 (13,'standard','BA-S-013',  34.00, 55,'["100% cotton","500 gsm"]'),
 (13,'premium','BA-P-013',   59.00, 22,'["Egyptian cotton","700 gsm"]'),
 (14,'basic',  'SP-B-014',   29.00, 40,'["Plastic frame"]'),
 (14,'standard','SP-S-014',  49.00, 30,'["Steel frame"]'),
 (14,'premium','SP-P-014',   89.00, 12,'["Brass frame","Anti-fog"]'),
 (15,'basic',  'TV-B-015',    7.00,120,'["Plastic"]'),
 (15,'standard','TV-S-015',  14.00, 80,'["Ceramic"]'),
 (15,'premium','TV-P-015',   29.00, 25,'["Stoneware","Brass pump"]'),
 (16,'basic',  'MA-B-016',   49.00, 25,'["Fixed arm"]'),
 (16,'standard','MA-S-016',  89.00, 18,'["Adjustable arm","Dimmer"]'),
 (16,'premium','MA-P-016',  179.00,  6,'["Marble base","Smart dimmer"]'),
 (17,'basic',  'ST-B-017',   29.00, 50,'["Aluminium"]'),
 (17,'standard','ST-S-017',  59.00, 30,'["Powder-coated"]'),
 (17,'premium','ST-P-017',  119.00, 10,'["Brushed brass"]'),
 (18,'basic',  'LJ-B-018',   19.00, 60,'["Fabric shade"]'),
 (18,'standard','LJ-S-018',  34.00, 40,'["Ceramic base"]'),
 (18,'premium','LJ-P-018',   59.00, 15,'["Hand-glazed","Linen shade"]'),
 (19,'basic',  'MY-B-019',  129.00, 14,'["Polyester"]'),
 (19,'standard','MY-S-019', 229.00, 10,'["Velvet","Pine frame"]'),
 (19,'premium','MY-P-019',  399.00,  5,'["Mohair","Beech frame"]'),
 (20,'basic',  'KN-B-020',   39.00, 30,'["Stainless steel"]'),
 (20,'standard','KN-S-020',  69.00, 20,'["High-carbon steel"]'),
 (20,'premium','KN-P-020',  149.00,  8,'["Damascus steel","Acacia block"]');
