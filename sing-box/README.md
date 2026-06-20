# sing-box 精简分流

## 使用

1. 复制 `config.json` 到 sing-box 客户端。
2. 把 `MOCK-HYSTERIA2` 改成自己的节点，或用客户端订阅转换工具生成真实 outbounds 后替换 mock 节点。
3. 保留 `AI`、`流媒体`、`开发服务`、`社交媒体`、`云与软件`、`节点选择` 这些 selector。

## 设计

- 使用 `rule_set` 远程 `.srs`，避免已废弃的 geosite 配置。
- 广告规则走 `block`。
- 国内 AI 先直连。
- 海外 AI 统一走 `AI`。

规则集来自 [SagerNet/sing-geosite](https://github.com/SagerNet/sing-geosite) 和 [SagerNet/sing-geoip](https://github.com/SagerNet/sing-geoip)。
