import fs from "node:fs";
import vm from "node:vm";

export const CONFIG_PATH = "Clash/ClashVergeRev.js";

export function loadConfig() {
  const source = fs.readFileSync(CONFIG_PATH, "utf8");
  const context = {};
  vm.createContext(context);
  vm.runInContext(source, context, { filename: CONFIG_PATH });

  if (typeof context.main !== "function") {
    throw new Error(`${CONFIG_PATH} does not expose main(config)`);
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
