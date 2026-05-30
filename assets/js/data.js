/* NORDHEM - product catalogue (mirrors the SQL schema 1:1).
   In production replace with `fetch('/api/products').then(r => r.json())`. */
window.NORDHEM = window.NORDHEM || {};

NORDHEM.CATEGORIES = [
  { id: 1, slug: 'living-room', name: 'Living Room' },
  { id: 2, slug: 'bedroom',     name: 'Bedroom' },
  { id: 3, slug: 'kitchen',     name: 'Kitchen' },
  { id: 4, slug: 'office',      name: 'Office' },
  { id: 5, slug: 'bathroom',    name: 'Bathroom' },
  { id: 6, slug: 'lighting',    name: 'Lighting' },
];

NORDHEM.TIERS = [
  { id: 'basic',    label: 'Basic',    blurb: 'Entry-level essentials' },
  { id: 'standard', label: 'Standard', blurb: 'Best value - most popular' },
  { id: 'premium',  label: 'Premium',  blurb: 'Top-tier materials & finish' },
];

/* Tile colour pairs reused as placeholder media */
const _tiles = [
  ['#e8edf3','#cfd8e3'], ['#f5e9d7','#e2c89f'], ['#dee9df','#b9d2bd'],
  ['#e6dfee','#c4b2db'], ['#fde7e7','#f1bdbd'], ['#dde7ee','#b8cad9'],
];

const _p = (id, categoryId, name, description, material, dimensions, rating, reviewCount, tiles, keywords, variants) => ({
  id, categoryId, name, description, material, dimensions, rating, reviewCount,
  tileColors: tiles, keywords, variants,
});

NORDHEM.PRODUCTS = [
  _p(1,1,'Fjord Sofa','3-seat sofa with deep cushions and removable covers.','Polyester / pine frame','210x88x76 cm',4.5,132,_tiles[0],'sofa,couch',[
    { tier:'basic',    sku:'FJ-B-001', price:349, stock:12, features:['Polyester cover','Foam cushions','2-year warranty'] },
    { tier:'standard', sku:'FJ-S-001', price:549, stock:18, features:['Stain-resistant fabric','Pocket springs','5-year warranty'] },
    { tier:'premium',  sku:'FJ-P-001', price:899, stock:6,  features:['Boucle fabric','Down-blend cushions','10-year warranty'] },
  ]),
  _p(2,1,'Lagom Coffee Table','Low-profile coffee table with hidden storage.','Engineered wood / oak veneer','110x60x42 cm',4.2,88,_tiles[1],'coffee-table,living-room',[
    { tier:'basic',    sku:'LA-B-002', price:79,  stock:30, features:['Laminate top'] },
    { tier:'standard', sku:'LA-S-002', price:129, stock:22, features:['Oak veneer','Hidden storage'] },
    { tier:'premium',  sku:'LA-P-002', price:229, stock:9,  features:['Solid oak top','Soft-close drawer'] },
  ]),
  _p(3,1,'Bjork Bookshelf','Five-shelf open bookshelf, wall-anchorable.','Particleboard / solid pine','80x180x28 cm',4.4,210,_tiles[2],'bookshelf,shelves',[
    { tier:'basic',    sku:'BJ-B-003', price:59,  stock:40, features:['Particleboard','5 shelves'] },
    { tier:'standard', sku:'BJ-S-003', price:99,  stock:25, features:['Reinforced shelves','Anti-tip kit'] },
    { tier:'premium',  sku:'BJ-P-003', price:189, stock:10, features:['Solid pine','Adjustable shelving'] },
  ]),
  _p(4,2,'Drom Bed Frame','Queen bed frame with slatted base.','Steel / wood','160x200 cm',4.6,174,_tiles[3],'bed,bedroom',[
    { tier:'basic',    sku:'DR-B-004', price:179, stock:14, features:['Steel frame','Slatted base'] },
    { tier:'standard', sku:'DR-S-004', price:299, stock:12, features:['Padded headboard'] },
    { tier:'premium',  sku:'DR-P-004', price:549, stock:5,  features:['Upholstered headboard','Under-bed storage'] },
  ]),
  _p(5,2,'Natt Nightstand','Compact two-drawer nightstand.','MDF / beech','45x40x55 cm',4.1,64,_tiles[4],'nightstand,bedside',[
    { tier:'basic',    sku:'NA-B-005', price:39,  stock:50, features:['Laminate','1 drawer'] },
    { tier:'standard', sku:'NA-S-005', price:69,  stock:35, features:['2 drawers','Soft-close'] },
    { tier:'premium',  sku:'NA-P-005', price:129, stock:11, features:['Solid beech','Wireless charge top'] },
  ]),
  _p(6,2,'Linne Wardrobe','Three-door wardrobe with mirror option.','Particleboard','150x60x202 cm',4.3,92,_tiles[5],'wardrobe,closet',[
    { tier:'basic',    sku:'LI-B-006', price:149, stock:10, features:['3 doors'] },
    { tier:'standard', sku:'LI-S-006', price:239, stock:8,  features:['Mirror door'] },
    { tier:'premium',  sku:'LI-P-006', price:399, stock:4,  features:['Full mirror','Interior lighting'] },
  ]),
  _p(7,3,'Koka Cookware Set','5-piece non-stick cookware set.','Aluminium / ceramic coating','-',4.4,311,_tiles[0],'cookware,pots',[
    { tier:'basic',    sku:'KO-B-007', price:49,  stock:60, features:['Non-stick','5 pieces'] },
    { tier:'standard', sku:'KO-S-007', price:89,  stock:40, features:['Ceramic coating','Induction-ready'] },
    { tier:'premium',  sku:'KO-P-007', price:179, stock:15, features:['Stainless tri-ply','Lifetime warranty'] },
  ]),
  _p(8,3,'Bord Dining Table','Extendable dining table seats 4–6.','Oak / steel','140-180x85 cm',4.7,145,_tiles[1],'dining-table,table',[
    { tier:'basic',    sku:'BO-B-008', price:199, stock:12, features:['Laminate top','Seats 4'] },
    { tier:'standard', sku:'BO-S-008', price:349, stock:9,  features:['Oak veneer','Extendable'] },
    { tier:'premium',  sku:'BO-P-008', price:599, stock:4,  features:['Solid oak','Self-storing leaf'] },
  ]),
  _p(9,3,'Glas Tumbler Set','Set of 6 stackable tumblers.','Tempered glass','300 ml',4.0,58,_tiles[2],'glassware,tumbler',[
    { tier:'basic',    sku:'GL-B-009', price:12, stock:100, features:['Set of 6'] },
    { tier:'standard', sku:'GL-S-009', price:22, stock:70,  features:['Tempered glass'] },
    { tier:'premium',  sku:'GL-P-009', price:39, stock:25,  features:['Hand-blown','Lead-free crystal'] },
  ]),
  _p(10,4,'Skriva Desk','Workspace desk with cable channel.','MDF / steel','140x70x74 cm',4.3,121,_tiles[3],'desk,office',[
    { tier:'basic',    sku:'SK-B-010', price:89,  stock:25, features:['MDF top'] },
    { tier:'standard', sku:'SK-S-010', price:159, stock:18, features:['Cable channel','Height marks'] },
    { tier:'premium',  sku:'SK-P-010', price:299, stock:7,  features:['Electric height-adjust'] },
  ]),
  _p(11,4,'Sitta Office Chair','Ergonomic chair with lumbar support.','Mesh / nylon','65x65x110 cm',4.2,198,_tiles[4],'office-chair,ergonomic',[
    { tier:'basic',    sku:'SI-B-011', price:79,  stock:30, features:['Mesh back'] },
    { tier:'standard', sku:'SI-S-011', price:149, stock:20, features:['Adjustable lumbar'] },
    { tier:'premium',  sku:'SI-P-011', price:299, stock:8,  features:['4D armrests','Headrest'] },
  ]),
  _p(12,4,'Ordna Organiser','Modular desk organiser tray.','Bamboo / felt','30x20x8 cm',4.5,73,_tiles[5],'desk-organizer,stationery',[
    { tier:'basic',    sku:'OR-B-012', price:14, stock:80, features:['3 compartments'] },
    { tier:'standard', sku:'OR-S-012', price:24, stock:50, features:['Bamboo','Felt lined'] },
    { tier:'premium',  sku:'OR-P-012', price:39, stock:20, features:['Modular','Wireless charging tile'] },
  ]),
  _p(13,5,'Bada Towel Set','Set of 4 cotton bath towels.','100% cotton','70x140 cm',4.6,240,_tiles[0],'towels,bathroom',[
    { tier:'basic',    sku:'BA-B-013', price:19, stock:80, features:['Cotton blend'] },
    { tier:'standard', sku:'BA-S-013', price:34, stock:55, features:['100% cotton','500 gsm'] },
    { tier:'premium',  sku:'BA-P-013', price:59, stock:22, features:['Egyptian cotton','700 gsm'] },
  ]),
  _p(14,5,'Spegel Mirror','Round wall mirror with thin metal frame.','Glass / steel','Ø 60 cm',4.4,87,_tiles[1],'mirror,interior',[
    { tier:'basic',    sku:'SP-B-014', price:29, stock:40, features:['Plastic frame'] },
    { tier:'standard', sku:'SP-S-014', price:49, stock:30, features:['Steel frame'] },
    { tier:'premium',  sku:'SP-P-014', price:89, stock:12, features:['Brass frame','Anti-fog'] },
  ]),
  _p(15,5,'Tval Soap Dispenser','Refillable countertop soap dispenser.','Ceramic','250 ml',4.1,41,_tiles[2],'soap-dispenser,bathroom',[
    { tier:'basic',    sku:'TV-B-015', price:7,  stock:120, features:['Plastic'] },
    { tier:'standard', sku:'TV-S-015', price:14, stock:80,  features:['Ceramic'] },
    { tier:'premium',  sku:'TV-P-015', price:29, stock:25,  features:['Stoneware','Brass pump'] },
  ]),
  _p(16,6,'Mane Floor Lamp','Adjustable arc floor lamp.','Steel / linen shade','H 175 cm',4.5,132,_tiles[3],'floor-lamp,lighting',[
    { tier:'basic',    sku:'MA-B-016', price:49,  stock:25, features:['Fixed arm'] },
    { tier:'standard', sku:'MA-S-016', price:89,  stock:18, features:['Adjustable arm','Dimmer'] },
    { tier:'premium',  sku:'MA-P-016', price:179, stock:6,  features:['Marble base','Smart dimmer'] },
  ]),
  _p(17,6,'Stjarna Pendant','Geometric pendant ceiling lamp.','Aluminium','Ø 40 cm',4.3,56,_tiles[4],'pendant-lamp,ceiling',[
    { tier:'basic',    sku:'ST-B-017', price:29,  stock:50, features:['Aluminium'] },
    { tier:'standard', sku:'ST-S-017', price:59,  stock:30, features:['Powder-coated'] },
    { tier:'premium',  sku:'ST-P-017', price:119, stock:10, features:['Brushed brass'] },
  ]),
  _p(18,6,'Ljus Table Lamp','Warm-light bedside table lamp.','Ceramic / fabric','H 35 cm',4.2,110,_tiles[5],'table-lamp,bedside',[
    { tier:'basic',    sku:'LJ-B-018', price:19, stock:60, features:['Fabric shade'] },
    { tier:'standard', sku:'LJ-S-018', price:34, stock:40, features:['Ceramic base'] },
    { tier:'premium',  sku:'LJ-P-018', price:59, stock:15, features:['Hand-glazed','Linen shade'] },
  ]),
  _p(19,1,'Mys Armchair','Lounge armchair with high back.','Velvet / pine frame','78x80x95 cm',4.6,99,_tiles[0],'armchair,velvet',[
    { tier:'basic',    sku:'MY-B-019', price:129, stock:14, features:['Polyester'] },
    { tier:'standard', sku:'MY-S-019', price:229, stock:10, features:['Velvet','Pine frame'] },
    { tier:'premium',  sku:'MY-P-019', price:399, stock:5,  features:['Mohair','Beech frame'] },
  ]),
  _p(20,3,'Kniv Knife Block','6-piece stainless knife block set.','Stainless steel / acacia','-',4.5,64,_tiles[1],'kitchen-knives,knife',[
    { tier:'basic',    sku:'KN-B-020', price:39,  stock:30, features:['Stainless steel'] },
    { tier:'standard', sku:'KN-S-020', price:69,  stock:20, features:['High-carbon steel'] },
    { tier:'premium',  sku:'KN-P-020', price:149, stock:8,  features:['Damascus steel','Acacia block'] },
  ]),
];

/* ---------- helpers exposed on the namespace ---------- */
NORDHEM.findProduct = (id) => NORDHEM.PRODUCTS.find(p => p.id === Number(id));
NORDHEM.findVariant = (product, tier) => product.variants.find(v => v.tier === tier);
NORDHEM.findCategory = (id) => NORDHEM.CATEGORIES.find(c => c.id === Number(id));
NORDHEM.minPrice = (p) => Math.min(...p.variants.map(v => v.price));
NORDHEM.maxPrice = (p) => Math.max(...p.variants.map(v => v.price));
NORDHEM.formatPrice = (n) => '€' + n.toFixed(2);
