export interface CSGOItem {
  type: ItemType,
  fullName: string,
  name?: string,
  skinCategory?: SkinCategory,
  grade?: Grade,
  exterior?: Exterior,
  iconUrl?: string,
  inspectLink?: string,
  classId?: number,
  assetId?: number,
  tradable?: boolean,
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
  tag = <any> "Tag"
}

export enum SkinCategory {
  normal = <any> "Normal",
  statTrak = <any> "ST",
  souvenir = <any> "SV"
}

export enum Grade {
  consumer = <any> "Consumer Grade",
  milspec = <any> "Mil-Spec Grade",
  industrial = <any> "Industrial Grade",
  restricted = <any> "Restricted Grade",
  classified = <any> "Classified",
  covert = <any> "Covert",
  base = <any> "Base Grade",
  high = <any> "High Grade",
  extraoridinary = <any> "Extraordinary ",
  exotic = <any> "Exotic",
  remarkable = <any> "Remarkable",
  contraband = <any> "Contraband",
  unknown = <any> "Unknown"
}

export enum Exterior {
  fn = <any> "FN",
  mw = <any> "MW",
  ft = <any> "FT",
  ww = <any> "WW",
  bs = <any> "BS",
  notPainted = <any> ""
}
