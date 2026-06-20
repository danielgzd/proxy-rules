import {
  LOON_CONFIG_PATH,
  OPENCLASH_CONFIG_PATH,
  fetchText,
  loadClashVergeConfig,
  loadLoonConfig,
  loadOpenClashConfig,
} from "./lib.mjs";

const errors = [];

function assert(condition, message) {
  if (!condition) errors.push(message);
}

const { config: clashVerge } = loadClashVergeConfig();
const clashGroups = clashVerge["proxy-groups"] || [];
const providers = clashVerge["rule-providers"] || {};
const clashRules = clashVerge.rules || [];
const clashGroupNames = new Set(clashGroups.map((group) => group.name));

assert(clashVerge.mode === "rule", "mode must be rule");
assert(clashGroups.length > 0, "proxy-groups must not be empty");
assert(clashRules.at(-1) === "MATCH,节点选择", "MATCH must be the final rule");
assert(!clashGroupNames.has("机场策略"), "airport proxy groups must be replaced");
assert(!providers.airport, "airport rule providers must be replaced");

for (const group of clashGroups) {
  assert(Boolean(group.icon), `${group.name} is missing an icon`);
  for (const target of group.proxies || []) {
    if (target === "DIRECT") continue;
    assert(
      clashGroupNames.has(target),
      `${group.name} references unknown group: ${target}`
    );
  }
}

for (const rule of clashRules) {
  const [type, providerName, target] = rule.split(",");
  if (type !== "RULE-SET") continue;
  assert(Boolean(providers[providerName]), `missing provider: ${providerName}`);
  if (!["DIRECT", "REJECT"].includes(target)) {
    assert(clashGroupNames.has(target), `rule references unknown group: ${target}`);
  }
}

const { config: openClash } = loadOpenClashConfig();
const openClashGroupNames = new Set(openClash.groups.map((group) => group.name));
const builtIns = new Set(["DIRECT", "REJECT"]);

assert(openClash.groups.length > 0, `${OPENCLASH_CONFIG_PATH} has no groups`);
assert(openClash.rules.at(-1)?.target === "漏网之鱼", "OpenClash FINAL must use 漏网之鱼");

for (const rule of openClash.rules) {
  assert(
    builtIns.has(rule.target) || openClashGroupNames.has(rule.target),
    `OpenClash ruleset target missing group: ${rule.target}`
  );
}

for (const group of openClash.groups) {
  for (const target of group.proxies) {
    assert(
      builtIns.has(target) || openClashGroupNames.has(target),
      `OpenClash ${group.name} references unknown group: ${target}`
    );
  }
}

const { config: loon, source: loonSource } = loadLoonConfig();
const loonBuiltIns = new Set(["DIRECT", "REJECT"]);

assert(loon.groups.size > 0, `${LOON_CONFIG_PATH} has no proxy groups`);
assert(
  !/ca-p12\s*=\s*\S{80,}/i.test(loonSource),
  `${LOON_CONFIG_PATH} must not include a real MITM certificate`
);
assert(
  !/token=(?!MOCK)[^,\s]+/i.test(loonSource),
  `${LOON_CONFIG_PATH} must not include real subscription tokens`
);

for (const group of loon.groups.values()) {
  for (const target of group.proxies) {
    assert(
      loonBuiltIns.has(target) ||
        loon.groups.has(target) ||
        loon.filters.has(target),
      `Loon ${group.name} references unknown policy: ${target}`
    );
  }
}

for (const rule of loon.remoteRules) {
  assert(Boolean(rule.policy), `Loon remote rule missing policy: ${rule.url}`);
  assert(
    loonBuiltIns.has(rule.policy) || loon.groups.has(rule.policy),
    `Loon remote rule references unknown policy: ${rule.policy}`
  );
}

const urls = [
  ...Object.values(providers).map((provider) => provider.url),
  ...clashGroups.map((group) => group.icon).filter(Boolean),
  ...openClash.remoteRules.map((rule) => rule.url),
  ...loon.remoteRules.map((rule) => rule.url),
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
  `Validated Clash Verge Rev (${clashGroups.length} groups, ` +
    `${clashRules.length} rules, ${Object.keys(providers).length} providers) ` +
    `and OpenClash (${openClash.groups.length} groups, ` +
    `${openClash.rules.length} rules, ${openClash.remoteRules.length} remote rulesets), ` +
    `and Loon (${loon.groups.size} groups, ${loon.remoteRules.length} remote rulesets).`
);
