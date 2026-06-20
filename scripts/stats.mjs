import fs from "node:fs";
import {
  countPayloadEntries,
  fetchText,
  loadClashVergeConfig,
  loadOpenClashConfig,
} from "./lib.mjs";

const README_PATH = "README.md";
const STATS_PATH = "stats.json";
const START = "<!-- STATS:START -->";
const END = "<!-- STATS:END -->";

const { config: clashVerge, source } = loadClashVergeConfig();
const { config: openClash } = loadOpenClashConfig();
const providers = clashVerge["rule-providers"];
const providerStats = {};

for (const [name, provider] of Object.entries(providers)) {
  const content = await fetchText(provider.url);
  providerStats[name] = {
    rules: countPayloadEntries(content),
    behavior: provider.behavior,
    source: new URL(provider.url).hostname,
  };
}

const keywordMatch = source.match(/excluded:\s*\n?\s*"([^"]+)"/);
const filterKeywords = keywordMatch
  ? keywordMatch[1]
      .replace(/^\(\?i\)\(|\)$/g, "")
      .split("|")
      .filter((item) => item && !item.includes("\\"))
      .length
  : 0;

const now = new Date();
const openClashRemoteStats = {};
for (const rule of openClash.remoteRules) {
  const content = await fetchText(rule.url);
  const key = new URL(rule.url).pathname.split("/").pop().replace(/\.yaml$/, "");
  openClashRemoteStats[key] = {
    rules: countPayloadEntries(content),
    behavior: rule.behavior,
    source: new URL(rule.url).hostname,
  };
}

const openClashFilterKeywords = openClash.exclude
  .split("|")
  .filter(Boolean).length;

const stats = {
  updatedAt: now.toISOString(),
  groups: clashVerge["proxy-groups"].length,
  routingRules: clashVerge.rules.length,
  providers: Object.keys(providers).length,
  remoteRules: Object.values(providerStats).reduce(
    (total, provider) => total + provider.rules,
    0
  ),
  filterKeywords,
  providerStats,
  configs: {
    clashVergeRev: {
      groups: clashVerge["proxy-groups"].length,
      routingRules: clashVerge.rules.length,
      providers: Object.keys(providers).length,
      remoteRules: Object.values(providerStats).reduce(
        (total, provider) => total + provider.rules,
        0
      ),
      filterKeywords,
    },
    openClash: {
      groups: openClash.groups.length,
      routingRules: openClash.rules.length,
      remoteRulesets: openClash.remoteRules.length,
      remoteRules: Object.values(openClashRemoteStats).reduce(
        (total, provider) => total + provider.rules,
        0
      ),
      filterKeywords: openClashFilterKeywords,
      providerStats: openClashRemoteStats,
    },
  },
};

fs.writeFileSync(STATS_PATH, `${JSON.stringify(stats, null, 2)}\n`);

const table = Object.entries(providerStats)
  .map(
    ([name, provider]) =>
      `| \`${name}\` | ${provider.behavior} | ${provider.rules.toLocaleString("en-US")} |`
  )
  .join("\n");

const block = `${START}
| 配置 | 策略组 | 路由规则 | 远程规则集 | 收录规则 | 过滤关键词 |
| --- | ---: | ---: | ---: | ---: | ---: |
| Clash Verge Rev | ${stats.configs.clashVergeRev.groups} | ${stats.configs.clashVergeRev.routingRules} | ${stats.configs.clashVergeRev.providers} | ${stats.configs.clashVergeRev.remoteRules.toLocaleString("en-US")} | ${stats.configs.clashVergeRev.filterKeywords} |
| OpenClash | ${stats.configs.openClash.groups} | ${stats.configs.openClash.routingRules} | ${stats.configs.openClash.remoteRulesets} | ${stats.configs.openClash.remoteRules.toLocaleString("en-US")} | ${stats.configs.openClash.filterKeywords} |

<details>
<summary>查看 Clash Verge Rev 规则集统计</summary>

| 规则集 | 类型 | 条目数 |
| --- | --- | ---: |
${table}

统计更新时间：${stats.updatedAt.replace("T", " ").replace(/\.\d{3}Z$/, " UTC")}
</details>
${END}`;

const readme = fs.readFileSync(README_PATH, "utf8");
const pattern = new RegExp(`${START}[\\s\\S]*?${END}`);
if (!pattern.test(readme)) {
  throw new Error(`Missing stats markers in ${README_PATH}`);
}
fs.writeFileSync(README_PATH, readme.replace(pattern, block));

console.log(
  `Updated ${STATS_PATH}: ${stats.remoteRules.toLocaleString("en-US")} remote rules.`
);
