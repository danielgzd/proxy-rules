import fs from "node:fs";
import vm from "node:vm";

export const CLASH_VERGE_CONFIG_PATH = "Clash/ClashVergeRev.js";
export const OPENCLASH_CONFIG_PATH = "Clash/OpenClashFineRouting.ini";

export function loadClashVergeConfig() {
  const source = fs.readFileSync(CLASH_VERGE_CONFIG_PATH, "utf8");
  const context = {};
  vm.createContext(context);
  vm.runInContext(source, context, { filename: CLASH_VERGE_CONFIG_PATH });

  if (typeof context.main !== "function") {
    throw new Error(`${CLASH_VERGE_CONFIG_PATH} does not expose main(config)`);
  }

  const config = context.main({
    proxies: [
      { name: "美国 01", type: "ss" },
      { name: "日本 01", type: "ss" },
      { name: "新加坡 01", type: "ss" },
      { name: "剩余流量 100 GB", type: "ss" },
    ],
    "proxy-groups": [{ name: "机场策略", type: "select" }],
    "rule-providers": { airport: { type: "http" } },
    rules: ["MATCH,机场策略"],
  });

  return { config, source };
}

export function loadConfig() {
  return loadClashVergeConfig();
}

export function loadOpenClashConfig() {
  const source = fs.readFileSync(OPENCLASH_CONFIG_PATH, "utf8");
  return { config: parseOpenClashIni(source), source };
}

export function parseOpenClashIni(source) {
  const groups = [];
  const rules = [];
  const remoteRules = [];
  const exclude = source.match(/^exclude=(.+)$/m)?.[1] || "";

  for (const rawLine of source.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith(";")) continue;

    if (line.startsWith("ruleset=")) {
      const body = line.slice("ruleset=".length);
      const [target, ...rest] = body.split(",");
      const rule = { target, body };
      const urlMatch = rest.join(",").match(/https?:\/\/[^,\s`]+/);
      if (urlMatch) {
        rule.url = urlMatch[0];
        const typeMatch = rest.join(",").match(/^(clash-[^:]+):/);
        rule.behavior = typeMatch?.[1] || "remote";
        remoteRules.push(rule);
      }
      rules.push(rule);
    }

    if (line.startsWith("custom_proxy_group=")) {
      const body = line.slice("custom_proxy_group=".length);
      const [name, type, ...parts] = body.split("`");
      const proxies = parts
        .filter((part) => part.startsWith("[]"))
        .map((part) => part.slice(2));
      groups.push({ name, type, proxies });
    }
  }

  return { exclude, groups, remoteRules, rules };
}

export async function fetchText(url) {
  const response = await fetch(url, {
    headers: { "user-agent": "proxy-rules-validator" },
    signal: AbortSignal.timeout(30000),
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${url}`);
  }

  return response.text();
}

export function countPayloadEntries(content) {
  return content
    .split(/\r?\n/)
    .filter((line) => /^\s*-\s+\S/.test(line)).length;
}
