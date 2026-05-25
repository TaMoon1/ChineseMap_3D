# 第一阶段：多朝代 3D 地图 — 需求文档

> **项目**: 中国古代3D历史地图  
> **阶段**: 第一阶段 — 基础 3D 地图 + 多朝代切换  
> **目标目录**: `D:\ChineseMap_3D`

---

## 1. 阶段目标

实现一个可运行的 Web 页面，展示中国区域的 3D 地形地图，提供 6 个核心朝代（秦、汉、唐、宋、明、清）的疆域切换功能。

## 2. 功能清单

### 2.1 3D 地形
- 3D 地球视图，聚焦中国区域
- 显示真实地形起伏（山脉、高原、盆地）
- 支持标准相机操作：旋转（左键拖拽）、缩放（滚轮）、平移（右键拖拽）、倾斜（中键）
- 显示主要河流（黄河、长江、淮河、珠江）作为 3D 线图层

### 2.2 朝代切换
- 底部或侧边提供 6 个朝代按钮：秦、汉、唐、宋、明、清
- 点击按钮 → 对应朝代的疆域多边形（半透明彩色填充）在地图上显示/切换
- 切换时有简单的淡入/过渡效果
- 当前朝代的名称和年份范围显示在信息面板

### 2.3 界面
- 顶部搜索栏（占位，暂不实现搜索功能）
- 侧边信息面板（显示当前朝代、年份、首都等信息）
- 底部朝代切换按钮

### 2.4 数据
- 6 个朝代的疆域边界（GeoJSON 格式）
- 6 个朝代的都城/重要城市坐标
- 中国主要河流线（GeoJSON）

## 3. 技术栈

| 层次 | 技术 | 版本 |
|:--|:--|:--|
| 3D 引擎 | CesiumJS | 最新 |
| 框架 | React + TypeScript | v18+ |
| 构建工具 | Vite | v5+ |
| 状态管理 | Zustand | 最新 |
| UI | Tailwind CSS | 最新 |
| Cesium React 绑定 | resium | 最新 |

## 4. 项目结构

```
D:\ChineseMap_3D\
├── docs\                   # 需求文档
│   └── PRD-中国古代3D历史地图.md
│   └── phase1-多朝代3D地图.md
├── public\                 # 静态资源
├── src\
│   ├── components\         # React 组件
│   │   ├── Map3D.tsx       # Cesium 3D 地图容器
│   │   ├── TimeSlider.tsx  # 朝代切换按钮组
│   │   ├── InfoPanel.tsx   # 信息面板
│   │   └── SearchBar.tsx   # 搜索栏
│   ├── data\               # 地图数据
│   │   ├── dynasties.ts    # 朝代元数据
│   │   ├── boundaries\     # 疆域 GeoJSON
│   │   └── rivers.json     # 河流数据
│   ├── store\              # 状态管理
│   │   └── useMapStore.ts  # Zustand store
│   ├── App.tsx             # 主应用
│   ├── App.css
│   ├── main.tsx            # 入口
│   └── index.css
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 5. 数据需求

### 5.1 历代疆域数据来源

| 数据 | 来源 | 说明 |
|:--|:--|:--|
| 历代疆域 GeoJSON | Harvard CHGIS / 自建 | v1 先使用自建简化多边形（关键控制点），CHGIS 后续替换 |
| 都城坐标 | 手动整理 | 6 个朝代的都城经纬度 |
| 中国河流 | Natural Earth Data | 使用 simplified 版本 |

### 5.2 朝代元数据结构

```typescript
interface Dynasty {
  id: string;           // 'qin' | 'han' | 'tang' | 'song' | 'ming' | 'qing'
  name: string;         // '秦'
  period: string;       // '前221–前206'
  capital: string;      // '咸阳'
  capitalCoords: [number, number];  // [108.7, 34.3]
  color: string;        // 疆域填充色
  boundaryFile: string; // 对应 GeoJSON 文件名
}
```

## 6. 验收标准

- [x] 页面加载后显示 3D 中国地形
- [x] 点击朝代按钮，地图上显示对应疆域
- [x] 切换朝代时旧的疆域清除、新的疆域显示
- [x] 信息面板随朝代切换更新
- [x] 相机可自由旋转/缩放/平移
- [x] 主要河流可见

## 7. 后续阶段

| 阶段 | 内容 |
|:--|:--|
| 阶段二 | 搜索定位 + 古今地名映射 |
| 阶段三 | 箭头绘制工具 |
| 阶段四 | 四季变化 |
| 阶段五 | 更多朝代 + 时间轴滑块 |
