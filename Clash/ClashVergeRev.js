/**
 * Clash Verge Rev Rules
 *
 * 基础规则：Loyalsoldier/clash-rules
 * AI 规则：MetaCubeX/meta-rules-dat
 * 服务规则：blackmatrix7/ios_rule_script
 */

const GROUPS = {
  ai: "AI",
  proxy: "节点选择",
  media: "流媒体",
  dev: "开发服务",
  auto: "自动选择",
  us: "美国节点",
  sg: "新加坡节点",
  jp: "日本节点",
  all: "全部节点",
};

const ICON_BASE =
  "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color";

const ICONS = {
  [GROUPS.ai]: `${ICON_BASE}/AI.png`,
  [GROUPS.proxy]: `${ICON_BASE}/Proxy.png`,
  [GROUPS.media]: `${ICON_BASE}/Media.png`,
  [GROUPS.dev]: `${ICON_BASE}/GitHub.png`,
  [GROUPS.auto]: `${ICON_BASE}/Auto.png`,
  [GROUPS.us]: `${ICON_BASE}/United_States.png`,
  [GROUPS.sg]: `${ICON_BASE}/Singapore.png`,
  [GROUPS.jp]: `${ICON_BASE}/Japan.png`,
  [GROUPS.all]: `${ICON_BASE}/Global.png`,
};

const FILTERS = {
  us: "(?i)(美国|美國|US|USA|United States|洛杉矶|洛杉磯|西雅图|西雅圖|圣何塞|聖何塞|硅谷|矽谷|纽约|紐約)",
  sg: "(?i)(新加坡|狮城|獅城|SG|Singapore)",
  jp: "(?i)(日本|东京|東京|大阪|JP|Japan)",
  excluded:
    "(?i)(超时|超時|timeout|订阅|訂閱|subscription|收藏|favorite|favourite|剩余|剩餘|remaining|流量|traffic|到期|有效期|过期|過期|expire|expiry|expired|时间|時間|日期|官网|官網|网址|網址|公告|通知|套餐|重置|reset|更新|客服|工单|工單|倍率|website|official|notice|info|剩余[:：]|剩餘[:：]|到期[:：]|\\d+(\\.\\d+)?\\s*[倍xX]|直连|DIRECT|香港|Hong Kong|HK|澳门|澳門|Macao|MO|中国|中國|China|CN)",
};

const LOYAL = "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release";
const META = "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite";
const BLACKMATRIX =
  "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash";

function provider(url, behavior, path) {
  return {
    type: "http",
    behavior,
    format: "yaml",
    url,
    path: `./ruleset/${path}.yaml`,
    interval: 86400,
  };
}

const RULE_PROVIDERS = {
  applications: provider(`${LOYAL}/applications.txt`, "classical", "applications"),
  private: provider(`${LOYAL}/private.txt`, "domain", "private"),
  reject: provider(`${LOYAL}/reject.txt`, "domain", "reject"),
  direct: provider(`${LOYAL}/direct.txt`, "domain", "direct"),
  proxy: provider(`${LOYAL}/proxy.txt`, "domain", "proxy"),
  lancidr: provider(`${LOYAL}/lancidr.txt`, "ipcidr", "lancidr"),
  cncidr: provider(`${LOYAL}/cncidr.txt`, "ipcidr", "cncidr"),
  telegramcidr: provider(`${LOYAL}/telegramcidr.txt`, "ipcidr", "telegramcidr"),
  "ai-cn": provider(`${META}/category-ai-cn.yaml`, "domain", "ai-cn"),
  ai: provider(`${META}/category-ai-!cn.yaml`, "domain", "ai"),
  "global-media": provider(
    `${BLACKMATRIX}/GlobalMedia/GlobalMedia.yaml`,
    "classical",
    "global-media"
  ),
  github: provider(
    `${BLACKMATRIX}/GitHub/GitHub.yaml`,
    "classical",
    "github"
  ),
};

// 顺序参考 Loyalsoldier 推荐的白名单模式，AI 规则置于普通代理规则之前。
const RULES = [
  "RULE-SET,applications,DIRECT",
  "RULE-SET,private,DIRECT",
  "RULE-SET,reject,REJECT",
  "RULE-SET,ai-cn,DIRECT",
  `RULE-SET,ai,${GROUPS.ai}`,
  `RULE-SET,global-media,${GROUPS.media}`,
  `RULE-SET,github,${GROUPS.dev}`,
  `RULE-SET,proxy,${GROUPS.proxy}`,
  "RULE-SET,direct,DIRECT",
  "RULE-SET,lancidr,DIRECT,no-resolve",
  "RULE-SET,cncidr,DIRECT,no-resolve",
  `RULE-SET,telegramcidr,${GROUPS.proxy},no-resolve`,
];

function autoGroup(name, filter) {
  const group = {
    name,
    type: "url-test",
    icon: ICONS[name],
    "include-all": true,
    "exclude-filter": FILTERS.excluded,
    url: "https://www.gstatic.com/generate_204",
    interval: 300,
    tolerance: 80,
    lazy: true,
  };
  if (filter) group.filter = filter;
  return group;
}

function main(config) {
  const choices = [
    GROUPS.auto,
    GROUPS.us,
    GROUPS.sg,
    GROUPS.jp,
    GROUPS.all,
    "DIRECT",
  ];

  const groups = [
    {
      name: GROUPS.ai,
      type: "select",
      icon: ICONS[GROUPS.ai],
      proxies: [
        GROUPS.us,
        GROUPS.sg,
        GROUPS.jp,
        GROUPS.auto,
        GROUPS.all,
      ],
    },
    {
      name: GROUPS.proxy,
      type: "select",
      icon: ICONS[GROUPS.proxy],
      proxies: choices,
    },
    {
      name: GROUPS.media,
      type: "select",
      icon: ICONS[GROUPS.media],
      proxies: [GROUPS.proxy, ...choices],
    },
    {
      name: GROUPS.dev,
      type: "select",
      icon: ICONS[GROUPS.dev],
      proxies: [GROUPS.proxy, ...choices],
    },
    autoGroup(GROUPS.auto),
    autoGroup(GROUPS.us, FILTERS.us),
    autoGroup(GROUPS.sg, FILTERS.sg),
    autoGroup(GROUPS.jp, FILTERS.jp),
    {
      name: GROUPS.all,
      type: "select",
      icon: ICONS[GROUPS.all],
      "include-all": true,
      "exclude-filter": FILTERS.excluded,
    },
  ];

  // 完全替换机场规则，只保留本脚本定义的远程规则集。
  config["rule-providers"] = RULE_PROVIDERS;
  // 完全替换机场策略组；机场原始 proxies 节点仍由订阅保留。
  config["proxy-groups"] = groups;
  config.rules = RULES.concat(`MATCH,${GROUPS.proxy}`);
  config.mode = "rule";
  return config;
}
