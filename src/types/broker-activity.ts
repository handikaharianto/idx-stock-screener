export type Broker = {
  id: number;
  code: string;
  name: string;
  permission: string;
  group: BrokerGroup;
  color: string;
};

export enum BrokerGroup {
  LOCAL = "Lokal",
  FOREIGN = "Asing",
  GOVERNMENT = "Pemerintah",
}

export enum Investor {
  ALL_INVESTOR = "INVESTOR_TYPE_ALL",
  DOMESTIC = "INVESTOR_TYPE_DOMESTIC",
  FOREIGN = "INVESTOR_TYPE_FOREIGN",
}

export enum MarketBoard {
  ALL_MARKET = "MARKET_BOARD_ALL",
  REGULAR = "MARKET_BOARD_REGULER",
  TUNAI = "MARKET_BOARD_TUNAI",
  NEGO = "MARKET_BOARD_NEGO",
}

export enum Transaction {
  NET = "TRANSACTION_TYPE_NET",
  GROSS = "TRANSACTION_TYPE_GROSS",
}

export type BrokerBuy = {
  blot: string;
  blotv: string;
  bval: string;
  bvalv: string;
  netbs_broker_code: string;
  netbs_buy_avg_price: string;
  netbs_date: string;
  netbs_stock_code: string;
  type: BrokerGroup;
};

export type BrokerSell = {
  slot: string;
  slotv: string;
  sval: string;
  svalv: string;
  netbs_broker_code: string;
  netbs_sell_avg_price: string;
  netbs_date: string;
  netbs_stock_code: string;
  type: BrokerGroup;
};
