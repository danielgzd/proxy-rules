# Proxy Rules

[![Validate](https://github.com/danielgzd/proxy-rules/actions/workflows/validate.yml/badge.svg)](https://github.com/danielgzd/proxy-rules/actions/workflows/validate.yml)
[![Update Stats](https://github.com/danielgzd/proxy-rules/actions/workflows/update-stats.yml/badge.svg)](https://github.com/danielgzd/proxy-rules/actions/workflows/update-stats.yml)
[![GitHub stars](https://img.shields.io/github/stars/danielgzd/proxy-rules?style=flat)](https://github.com/danielgzd/proxy-rules/stargazers)
[![License](https://img.shields.io/github/license/danielgzd/proxy-rules)](LICENSE)

个人代理工具规则与配置集合，按客户端分类维护。

当前包含 Clash Verge Rev，后续可继续增加 Loon、Shadowrocket 等工具。

## Clash

- 海外 AI 统一使用 `AI` 策略组。
- 国内 AI 直接连接。
- 支持流媒体、GitHub 和基础国内外分流。
- 自动筛选美国、新加坡、日本节点。
- 过滤流量、到期、订阅、收藏、超时等非节点条目。
- 完全替换机场自带规则和策略组，仅保留原始节点。
- 使用成熟的远程规则集，每日自动更新。

- [`Clash/ClashVergeRev.js`](Clash/ClashVergeRev.js)：Clash Verge Rev 扩展脚本。
- [`Clash/README.md`](Clash/README.md)：安装方法和策略组说明。

## 数据统计

以下数据由 [`scripts/stats.mjs`](scripts/stats.mjs) 每日自动生成。

<!-- STATS:START -->
| 策略组 | 路由规则 | 远程规则集 | 收录规则 | 过滤关键词 |
| ---: | ---: | ---: | ---: | ---: |
| 9 | 13 | 12 | 312,878 | 58 |

<details>
<summary>查看各规则集统计</summary>

| 规则集 | 类型 | 条目数 |
| --- | --- | ---: |
| `applications` | classical | 96 |
| `private` | domain | 130 |
| `reject` | domain | 166,285 |
| `direct` | domain | 112,653 |
| `proxy` | domain | 26,729 |
| `lancidr` | ipcidr | 18 |
| `cncidr` | ipcidr | 5,711 |
| `telegramcidr` | ipcidr | 12 |
| `ai-cn` | domain | 102 |
| `ai` | domain | 158 |
| `global-media` | classical | 953 |
| `github` | classical | 31 |

统计更新时间：2026-06-18 08:21:22 UTC
</details>
<!-- STATS:END -->

## 自动化

- `npm run check`：验证脚本结构、策略引用、图标及远程规则链接。
- `npm run stats`：统计远程规则条目并更新 README 和 `stats.json`。
- GitHub Actions 会在提交时校验，并每天自动刷新统计数据。

## 规则来源

- [Loyalsoldier/clash-rules](https://github.com/Loyalsoldier/clash-rules)
- [MetaCubeX/meta-rules-dat](https://github.com/MetaCubeX/meta-rules-dat)
- [blackmatrix7/ios_rule_script](https://github.com/blackmatrix7/ios_rule_script)
- [Koolson/Qure](https://github.com/Koolson/Qure)

## 许可证

[MIT](LICENSE)
