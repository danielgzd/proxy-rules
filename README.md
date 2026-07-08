# Proxy Rules

[![Validate](https://github.com/danielgzd/proxy-rules/actions/workflows/validate.yml/badge.svg)](https://github.com/danielgzd/proxy-rules/actions/workflows/validate.yml)
[![Update Stats](https://github.com/danielgzd/proxy-rules/actions/workflows/update-stats.yml/badge.svg)](https://github.com/danielgzd/proxy-rules/actions/workflows/update-stats.yml)
[![GitHub stars](https://img.shields.io/github/stars/danielgzd/proxy-rules?style=flat)](https://github.com/danielgzd/proxy-rules/stargazers)
[![License](https://img.shields.io/github/license/danielgzd/proxy-rules)](LICENSE)

个人代理工具规则与配置集合，按客户端分类维护。

当前包含 Clash Verge Rev、OpenClash/subconverter、Loon、Shadowrocket、Quantumult X 和 sing-box 配置模板。

## Clash

- 海外 AI 统一使用 `AI` 策略组。
- 国内 AI 直接连接。
- 支持流媒体、GitHub、社交、交易所、云与软件和基础国内外分流。
- 自动筛选香港、台湾、美国、新加坡、日本和冷门节点。
- 过滤流量、到期、订阅、收藏、超时等非节点条目。
- 完全替换机场自带规则和策略组，仅保留原始节点。
- 使用成熟的远程规则集，每日自动更新。

- [`Clash/ClashVergeRev.js`](Clash/ClashVergeRev.js)：Clash Verge Rev 扩展脚本。
- [`Clash/OpenClashFineRouting.ini`](Clash/OpenClashFineRouting.ini)：OpenClash/subconverter 精细分流模板。
- [`Clash/README.md`](Clash/README.md)：安装方法和策略组说明。

## Loon

- [`Loon/Default.lcf`](Loon/Default.lcf)：Loon 精简分流模板，订阅和个人节点均使用 mock 占位。
- [`Loon/README.md`](Loon/README.md)：替换方法和策略组说明。

## Shadowrocket

- [`Shadowrocket/Default.conf`](Shadowrocket/Default.conf)：Shadowrocket 精简分流模板。
- [`Shadowrocket/README.md`](Shadowrocket/README.md)：使用说明。

## Quantumult X

- [`QuantumultX/Default.conf`](QuantumultX/Default.conf)：Quantumult X 精简分流模板。
- [`QuantumultX/README.md`](QuantumultX/README.md)：使用说明。

## sing-box

- [`sing-box/config.json`](sing-box/config.json)：sing-box 精简分流模板。
- [`sing-box/README.md`](sing-box/README.md)：使用说明。

## 数据统计

以下数据由 [`scripts/stats.mjs`](scripts/stats.mjs) 每日自动生成。

<!-- STATS:START -->
| 配置 | 策略组 | 路由规则 | 远程规则集 | 收录规则 | 过滤关键词 |
| --- | ---: | ---: | ---: | ---: | ---: |
| Clash Verge Rev | 9 | 13 | 12 | 310,499 | 58 |
| OpenClash | 18 | 38 | 0 | 0 | 33 |

<details>
<summary>查看 Clash Verge Rev 规则集统计</summary>

| 规则集 | 类型 | 条目数 |
| --- | --- | ---: |
| `applications` | classical | 96 |
| `private` | domain | 130 |
| `reject` | domain | 164,070 |
| `direct` | domain | 112,334 |
| `proxy` | domain | 26,831 |
| `lancidr` | ipcidr | 18 |
| `cncidr` | ipcidr | 5,752 |
| `telegramcidr` | ipcidr | 12 |
| `ai-cn` | domain | 109 |
| `ai` | domain | 163 |
| `global-media` | classical | 953 |
| `github` | classical | 31 |

统计更新时间：2026-07-08 06:08:24 UTC
</details>
<!-- STATS:END -->

## 自动化

- `npm run check`：同时验证 Clash Verge Rev、OpenClash、Loon、Shadowrocket、Quantumult X 和 sing-box 模板。
- Clash Verge Rev 校验项：脚本结构、策略组引用、规则集引用、图标链接和远程规则链接。
- OpenClash 校验项：`ruleset` 目标策略组、`custom_proxy_group` 引用闭合、最终兜底和远程规则链接。
- Loon/Shadowrocket/Quantumult X/sing-box 校验项：远程规则链接、mock 敏感信息、Loon 策略引用和 sing-box JSON 结构。
- `npm run stats`：统计 Clash Verge Rev 远程规则条目，并把 Clash Verge Rev 与 OpenClash 的策略组、规则数、过滤关键词写入 README 和 `stats.json`。
- GitHub Actions 会在提交时运行校验，并每天自动刷新统计数据。

如果 OpenClash 模板新增 `clash-domain` 或 `clash-classic` 远程规则，`npm run check` 会验证链接可访问，`npm run stats` 会把对应条目计入 OpenClash 统计。

## 规则来源

- [Loyalsoldier/clash-rules](https://github.com/Loyalsoldier/clash-rules)
- [MetaCubeX/meta-rules-dat](https://github.com/MetaCubeX/meta-rules-dat)
- [blackmatrix7/ios_rule_script](https://github.com/blackmatrix7/ios_rule_script)
- [SagerNet/sing-geosite](https://github.com/SagerNet/sing-geosite)
- [SagerNet/sing-geoip](https://github.com/SagerNet/sing-geoip)
- [app2smile/rules](https://github.com/app2smile/rules)
- [Koolson/Qure](https://github.com/Koolson/Qure)

## 许可证

[MIT](LICENSE)
