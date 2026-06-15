import fs from "node:fs";
import { countPayloadEntries, fetchText, loadConfig } from "./lib.mjs";

const README_PATH = "README.md";
const STATS_PATH = "stats.json";
const START = "<!-- STATS:START -->";
const END = "<!-- STATS:END -->";

const { config, source } = loadConfig();
const providers = config["rule-providers"];
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
const stats = {
  updatedAt: now.toISOString(),
  groups: config["proxy-groups"].length,
  routingRules: config.rules.length,
  providers: Object.keys(providers).length,
  remoteRules: Object.values(providerStats).reduce(
    (total, provider) => total + provider.rules,
    0
  ),
  filterKeywords,
  providerStats,
};

fs.writeFileSync(STATS_PATH, `${JSON.stringify(stats, null, 2)}\n`);

const table = Object.entries(providerStats)
  .map(
    ([name, provider]) =>
      `| \`${name}\` | ${provider.behavior} | ${provider.rules.toLocaleString("en-US")} |`
  )
  .join("\n");

const block = `${START}
| 策略组 | 路由规则 | 远程规则集 | 收录规则 | 过滤关键词 |
| ---: | ---: | ---: | ---: | ---: |
| ${stats.groups} | ${stats.routingRules} | ${stats.providers} | ${stats.remoteRules.toLocaleString("en-US")} | ${stats.filterKeywords} |

<details>
<summary>查看各规则集统计</summary>

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
