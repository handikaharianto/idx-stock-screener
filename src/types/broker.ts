export type Broker = {
  code: string;
  name: string;
  investor_type: string;
  total_value: string;
  net_value: string;
  buy_value: string;
  sell_value: string;
  total_volume: string;
  total_frequency: string;
  group: BrokerGroup;
};

export enum BrokerGroup {
  LOCAL = "BROKER_GROUP_LOCAL",
  FOREIGN = "BROKER_GROUP_FOREIGN",
  GOVERNMENT = "BROKER_GROUP_GOVERNMENT",
}

export enum MarketType {
  ALL_MARKET = "MARKET_TYPE_ALL",
  REGULAR = "MARKET_TYPE_REGULER",
  TUNAI = "MARKET_TYPE_TUNAI",
  NEGO = "MARKET_TYPE_NEGO",
}

export enum BrokerPeriod {
  LATEST = "TB_PERIOD_LAST_1_DAY",
  PREVIOUS_DAY = "TB_PERIOD_PREVIOUS_DAY",
  LAST_7_DAYS = "TB_PERIOD_LAST_7_DAYS",
  LAST_1_MONTH = "TB_PERIOD_LAST_1_MONTH",
  YEAR_TO_DATE = "TB_PERIOD_YEAR_TO_DATE",
  LAST_1_YEAR = "TB_PERIOD_LAST_1_YEAR",
}
