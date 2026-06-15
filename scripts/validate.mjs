import { fetchText, loadConfig } from "./lib.mjs";

const { config } = loadConfig();
const errors = [];

function assert(condition, message) {
  if (!condition) errors.push(message);
}

const groups = config["proxy-groups"] || [];
const providers = config["rule-providers"] || {};
const rules = config.rules || [];
const groupNames = new Set(groups.map((group) => group.name));

assert(config.mode === "rule", "mode must be rule");
assert(groups.length > 0, "proxy-groups must not be empty");
assert(rules.at(-1) === "MATCH,节点选择", "MATCH must be the final rule");
assert(!groupNames.has("机场策略"), "airport proxy groups must be replaced");
assert(!providers.airport, "airport rule providers must be replaced");

for (const group of groups) {
  assert(Boolean(group.icon), `${group.name} is missing an icon`);
  for (const target of group.proxies || []) {
    if (target === "DIRECT") continue;
    assert(groupNames.has(target), `${group.name} references unknown group: ${target}`);
  }
}

for (const rule of rules) {
  const [type, providerName, target] = rule.split(",");
  if (type !== "RULE-SET") continue;
  assert(Boolean(providers[providerName]), `missing provider: ${providerName}`);
  if (!["DIRECT", "REJECT"].includes(target)) {
    assert(groupNames.has(target), `rule references unknown group: ${target}`);
  }
}

const urls = [
  ...Object.values(providers).map((provider) => provider.url),
  ...groups.map((group) => group.icon).filter(Boolean),
];

const checks = await Promise.allSettled(urls.map((url) => fetchText(url)));
checks.forEach((result, index) => {
  if (result.status === "rejected") {
    errors.push(`unreachable URL: ${urls[index]} (${result.reason.message})`);
  }
});

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log(
  `Validated ${groups.length} groups, ${rules.length} rules, ` +
    `${Object.keys(providers).length} providers and ${urls.length} remote URLs.`
);
