# Loon 精简分流

## 使用

1. 复制 `Default.lcf` 到 Loon。
2. 替换 `[Proxy]` 中的 `MOCK-HYSTERIA2`，或删除它。
3. 替换 `[Remote Proxy]` 中的 `https://example.com/sub?token=MOCK_...`。
4. 导入后刷新远程规则和订阅。

## 设计

- 海外 AI 统一走 `AI`。
- 国内 AI 先直连，再匹配海外 AI 规则。
- 常用分流只保留 `流媒体`、`开发服务`、`社交媒体`、`云与软件` 和 `节点选择`。
- 节点池过滤流量、到期、官网、订阅、公告、客服等非节点条目。
- 公开模板不包含真实机场订阅、个人节点、MITM 证书或私有脚本任务。
- Loon 主要用于去广告，因此保留了少量公开去广告插件；如遇到 App 异常，再按需关闭对应插件。

## 策略组

- `AI`：OpenAI、Gemini、Claude、Copilot 等海外 AI。
- `节点选择`：普通代理出口。
- `流媒体`：Blackmatrix7 的 GlobalMedia。
- `开发服务`：GitHub 等开发服务。
- `社交媒体`：Telegram、TikTok、Twitter。
- `云与软件`：Google、Microsoft 等软件服务。
- `自动选择`、`兜底后备`：自动择优和故障兜底。
- `香港节点`、`台湾节点`、`日本节点`、`新加坡节点`、`美国节点`、`冷门节点`、`全部节点`：节点池。
