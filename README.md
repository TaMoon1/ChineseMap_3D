
<p align="center">
  <img src="public/favicon.svg" width="64" height="64" alt="logo"/>
</p>
<h1 align="center">中国古代历史地图</h1>
<p align="center">基于 CesiumJS 的 3D 历史疆域可视化</p>

---

## ✨ 功能

- **🗺️ 3D/2D 地图** — 支持旋转/缩放，默认 2D 平面视图
- **📜 10 个朝代** — 秦 · 汉 · 唐 · 北宋 · 南宋 · 辽 · 金 · 西夏 · 明 · 清
- **📍 省界疆域** — 每个朝代显示对应的中华人民共和国省份虚线边界
- **🏷️ 朝代名称** — 居中大字体标注
- **🎨 彩色区分** — 每个朝代独立颜色，不重复
- **🔍 快速搜索** — 底部分组选择栏（先秦/汉/隋唐/宋辽金夏/明清）
- **📋 信息面板** — 显示都城、时期、简介

## 🖼️ 截图

| 2D 视图 | 3D 视图 |
|:--:|:--:|
| *默认平面，加载快* | *球体旋转* |

## 🚀 快速开始

```bash
# 1. 克隆仓库
git clone https://github.com/你的用户名/ChineseMap_3D.git
cd ChineseMap_3D

# 2. 配置密钥（可选，推荐天地图）
cp src/data/tiandituKey.ts.example src/data/tiandituKey.ts
# 编辑 tiandituKey.ts，填入你的天地图 Key

# 3. 安装依赖
npm install

# 4. 启动开发服务器
npm run dev
```

浏览器打开 `http://localhost:5173` 即可查看。

## 🔑 密钥配置

### 天地图 Key（推荐 ✅）

国内访问极快，带中文地名注记。

```bash
cp src/data/tiandituKey.ts.example src/data/tiandituKey.ts
```

打开 `src/data/tiandituKey.ts`，将 `''` 替换为你的 Key：

```
获取地址 → https://console.tianditu.gov.cn/ → 创建应用（浏览器端）
```

### Cesium Ion Token（可选）

仅在使用默认 Bing Maps 底图时需要，国内速度一般。

```bash
cp src/data/cesiumToken.ts.example src/data/cesiumToken.ts
```

```
获取地址 → https://ion.cesium.com/signup → 复制 Default Token
```

## 🏗️ 构建部署

```bash
npm run build    # 产出在 dist/
npm run preview  # 预览构建产物
```

将 `dist/` 目录部署到任意静态服务器即可。

## 📁 项目结构

```
ChineseMap_3D/
├── public/
│   └── data/
│       ├── china_provinces.json     ← 中国 34 省份边界（阿里云 DataV）
│       ├── chgis_dynasty.json       ← CHGIS 历代政权界线（可选增强）
│       └── chgis_dynasty.rar        ← CHGIS 原始 RAR（需自行解压）
├── src/
│   ├── components/
│   │   ├── Map3D.tsx                ← 核心 Cesium 地图组件
│   │   ├── SearchBar.tsx            ← 朝代搜索/选择栏
│   │   ├── InfoPanel.tsx            ← 朝代信息面板
│   │   ├── TimeSlider.tsx           ← 时间轴滑块
│   │   └── ViewToggle.tsx           ← 2D/3D 切换
│   ├── data/
│   │   ├── dynasties.ts             ← 10 个朝代完整数据
│   │   ├── provinceMap.ts           ← 朝代 ↔ 省份 adcode 映射
│   │   ├── cesiumToken.ts*          ← Cesium Ion Token（已 gitignore）
│   │   └── tiandituKey.ts*          ← 天地图 Key（已 gitignore）
│   └── store/
│       └── useMapStore.ts           ← Zustand 全局状态
└── package.json
```

> `*` 标记的文件已加入 `.gitignore`，不会提交到仓库。

## 🧩 数据说明

### 省界数据（默认）

每个朝代 = 一组现代省份的集合（定义在 `provinceMap.ts`），根据 adcode 从 `china_provinces.json`（阿里云 DataV 数据）中提取边界线，以**彩色虚线**渲染。

### CHGIS 增强（可选）

如需更精确的历史边界，可下载 CHGIS V4 数据集：

```bash
# 1. 安装 QGIS（免费）https://qgis.org/
# 2. 解压 chgis_dynasty.rar
# 3. 用 QGIS 打开 .TAB 文件 → 导出 GeoJSON → 覆盖 chgis_dynasty.json
```

CHGIS 数据来源：复旦大学历史地理研究中心
（http://yugong.fudan.edu.cn/）

## 🛠️ 技术栈

| 层 | 技术 |
|:--|:--|
| 框架 | React 19 + TypeScript + Vite |
| 地图引擎 | CesiumJS 1.141 + Resium |
| 状态管理 | Zustand |
| 样式 | Tailwind CSS |
| 边界数据 | 阿里云 DataV 中国省份 GeoJSON |

## 📜 10 个朝代一览

| 朝代 | 时期 | 颜色 |
|:--|:--|:--|
| 秦 | 221–206 BC | `#8B0000` 深红 |
| 汉 | 202 BC–220 AD | `#1E90FF` 蓝 |
| 唐 | 618–907 | `#E67E22` 橙 |
| 北宋 | 960–1127 | `#32CD32` 绿 |
| 南宋 | 1127–1279 | `#2ECC71` 浅绿 |
| 辽 | 907–1125 | `#C0392B` 红棕 |
| 金 | 1115–1234 | `#1ABC9C` 青 |
| 西夏 | 1038–1227 | `#9B59B6` 紫 |
| 明 | 1368–1644 | `#DC143C` 红 |
| 清 | 1644–1912 | `#9370DB` 紫 |

## 📄 License

MIT
