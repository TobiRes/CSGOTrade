export interface CSGOItem {
  type: ItemType,
  name: string,
  skinCategory?: SkinCategory,
  grade?: Grade,
  exterior?: Exterior,
  iconUrl?: string,
  inspectLink?: string
}

export enum ItemType {
  pistol = <any> "Pistol",
  smg = <any> "SMG",
  sniperRifle = <any> "Sniper Rifle",
  rifle = <any> "Rifle",
  shotgun = <any> "Shotgun",
  machinegun = <any> "Machinegun",
  container = <any> "Container",
  knife = <any> "Knife",
  sticker = <any> "Sticker",
  graffiti = <any> "Graffiti",
  gloves = <any> "Gloves",
  musicKit = <any> "Music Kit",
  key = <any> "Key",
  collectible = <any> "Collectible",
  pass = <any> "Pass",
  gift = <any> "Gift",
  tool = <any> "Tool",
  tag = <any> "Tag",
}

export enum SkinCategory {
  normal = <any> "Normal",
  statTrak = <any> "Stat Trak",
  souvenir = <any> "Souvenir"
}

export enum Grade {
  consumer = <any> "Consumer Grade",
  milcspec = <any> "Milc-Spec Grade",
  industrial = <any> "Industrial Grade",
  restricted = <any> "Restricted Grade",
  classified = <any> "Classified Grade",
  covert = <any> "Covert",
  base = <any> "Base Grade",
  high = <any> "High Grade",
  extraoridinary = <any> "Extraordinary ",
  exotic = <any> "Exotic",
  remarkable = <any> "Remarkable",
  contraband = <any> "Contraband",
}

export enum Exterior {
  fn = <any> "Factory New",
  mw = <any> "Minimal Wear",
  ft = <any> "Field-Tested",
  ww = <any> "Well-Worn",
  bs = <any> "Battle-Scarred",
  notPainted = <any> "Vanilla"
}
