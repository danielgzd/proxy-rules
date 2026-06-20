# Clash 规则

## 规则来源

- 基础分流：[Loyalsoldier/clash-rules](https://github.com/Loyalsoldier/clash-rules)
- AI 分流：[MetaCubeX/meta-rules-dat](https://github.com/MetaCubeX/meta-rules-dat)
- 服务分流：[blackmatrix7/ios_rule_script](https://github.com/blackmatrix7/ios_rule_script/tree/master/rule/Clash)
- OpenClash 补丁：[Aethersailor/Custom_OpenClash_Rules](https://github.com/Aethersailor/Custom_OpenClash_Rules)

规则每天自动更新，本地脚本不再维护大量域名。

策略组图标使用 [Koolson/Qure](https://github.com/Koolson/Qure) 彩色图标集。

脚本会完全替换机场原有的 `rules`、`rule-providers` 和 `proxy-groups`，仅保留机场提供的原始节点。

所有节点选择组会过滤超时、订阅、收藏、剩余流量、到期时间、套餐公告、官网、客服、倍率等非节点条目。

## 使用

### Clash Verge Rev

1. 在订阅页面右键机场订阅。
2. 选择“编辑扩展脚本”。
3. 粘贴 `ClashVergeRev.js` 全部内容并保存。
4. 更新订阅，使用“规则”模式。

### OpenClash

将 `OpenClashFineRouting.ini` 的 Raw 地址填入 OpenClash 的订阅转换/自定义模板，或复制内容到本地自定义模板。

Raw 地址：

```text
https://raw.githubusercontent.com/danielgzd/proxy-rules/main/Clash/OpenClashFineRouting.ini
```

这份模板参考了精细分流思路：私网和国内流量优先直连，进入内核后的流量按 AI、流媒体、社交、交易所、开发服务、云与软件等应用类型分流，再用 GFW、非标端口和最终兜底多层接住遗漏。

## Clash Verge Rev 策略组

- `AI`：ChatGPT、Gemini、Grok、Claude、Copilot、Perplexity 等海外 AI。
- `节点选择`：普通国外网站。
- `流媒体`：Blackmatrix7 的 `GlobalMedia`，覆盖常用国际流媒体。
- `开发服务`：Blackmatrix7 的 `GitHub` 规则；其他开发网站走普通节点选择。
- `自动选择`：自动选择低延迟节点。
- `美国节点`、`新加坡节点`、`日本节点`：按地区筛选并测速。
- `全部节点`：手动选择其他节点。

国内 AI 使用 `ai-cn` 成品规则集并走 `DIRECT`。海外 AI 使用 `ai` 成品规则集并走 `AI`。

基础分流包含广告拦截、私网直连、国内直连、国外代理和 Telegram。服务分类只额外保留流媒体与 GitHub，不继续拆分社交、游戏或单个平台。

## OpenClash 精细分流策略组

- `AI`：海外 AI；国内 AI 使用 `category-ai-cn` 直连。
- `Telegram`、`流媒体`、`社交媒体`、`交易所`、`开发服务`、`云与软件`：按应用类型选择出口，不直接绑定单个节点。
- `Adobe`：默认可一键 `REJECT`，也可改为直连或代理。
- `非标端口`：单独接 OpenClash 端口规则，默认遵循最终兜底。
- `节点选择`、`自动选择`、`香港节点`、`台湾节点`、`日本节点`、`新加坡节点`、`美国节点`、`冷门节点`、`全部节点`：节点池和兜底出口。
