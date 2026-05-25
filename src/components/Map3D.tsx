import { useRef, useEffect, useState, useCallback } from 'react'
import { Viewer, type CesiumComponentRef } from 'resium'
import {
  Ion,
  Cartesian3,
  Cartesian2,
  Color,
  Math as CesiumMath,
  SceneMode,
  GeoJsonDataSource,
  LabelStyle,
  UrlTemplateImageryProvider,
  SingleTileImageryProvider,
  PolylineDashMaterialProperty,
  type Viewer as CesiumViewer,
} from 'cesium'

import { CESIUM_ION_TOKEN } from '../data/cesiumToken'
import { TDT_KEY } from '../data/tiandituKey'
import { DYNASTY_PROVINCES } from '../data/provinceMap'
import { useMapStore } from '../store/useMapStore'

if (CESIUM_ION_TOKEN) Ion.defaultAccessToken = CESIUM_ION_TOKEN

// ── 省份边界辅助 ──
let nameMap: Record<number, string> = {}
let centerMap: Record<number, [number, number]> = {}

async function loadProvinceRings() {
  const r = await fetch('/data/china_provinces.json')
  const geo = await r.json()
  const rings: Record<number, number[][][]> = {}
  for (const f of geo.features) {
    const code = f.properties.adcode
    nameMap[code] = f.properties.name
    if (f.properties.center) centerMap[code] = f.properties.center
    const coords = f.geometry.coordinates
    const rs: number[][][] = []
    if (Array.isArray(coords[0][0][0])) { for (const poly of coords) for (const ring of poly) rs.push(ring) }
    else { for (const ring of coords) rs.push(ring) }
    rings[code] = rs
  }
  return rings
}

// ── 底图 ──
function addExtraLayers(v: CesiumViewer) {
  if (TDT_KEY) {
    try {
      v.imageryLayers.addImageryProvider(
        new UrlTemplateImageryProvider({
          url: 'http://t0.tianditu.gov.cn/ter_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ter&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=' + TDT_KEY,
          minimumLevel: 1, maximumLevel: 18,
        }),
      )
      v.imageryLayers.addImageryProvider(
        new UrlTemplateImageryProvider({
          url: 'http://t0.tianditu.gov.cn/cta_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cta&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=' + TDT_KEY,
          minimumLevel: 1, maximumLevel: 18,
        }),
      )
      return
    } catch { /* ignore */ }
  }
  const img = new Image()
  img.onload = () => v.imageryLayers.addImageryProvider(new SingleTileImageryProvider({ url: '/map/china-physical.png' }))
  img.onerror = () => { /* keep Bing */ }
  img.src = '/map/china-physical.png'
}

function toClosed(ring: number[][], h = 300) {
  const pts = ring.map(([l, t]) => Cartesian3.fromDegrees(l, t, h))
  pts.push(pts[0])
  return pts
}

export default function Map3D() {
  const [viewer, setViewer] = useState<CesiumViewer | null>(null)
  const onReady = useCallback(
    (ref: CesiumComponentRef<CesiumViewer> | null) => {
      if (ref?.cesiumElement && !viewer) setViewer(ref.cesiumElement)
    },
    [viewer],
  )

  const [ready, setReady] = useState(false)
  const [provRings, setProvRings] = useState<Record<number, number[][][]> | null>(null)

  const active = useMapStore((s) => s.activeDynasties)
  const sceneMode = useMapStore((s) => s.sceneMode)
  const setLoading = useMapStore((s) => s.setLoading)

  const dsRef = useRef<GeoJsonDataSource | null>(null)
  const done = useRef(false)

  // ── 初始化 ──
  useEffect(() => {
    if (!viewer || done.current) return
    done.current = true

    const h = (el: Element | undefined | null) => (el as HTMLElement | null)?.style
    if (viewer.timeline?.container) h(viewer.timeline.container)!.display = 'none'
    if (viewer.animation?.container) h(viewer.animation.container)!.display = 'none'
    if (viewer.fullscreenButton?.container) h(viewer.fullscreenButton.container)!.display = 'none'
    if (viewer.homeButton?.container) h(viewer.homeButton.container)!.display = 'none'
    if (viewer.navigationHelpButton?.container) h(viewer.navigationHelpButton.container)!.display = 'none'
    if (viewer.geocoder?.container) h(viewer.geocoder.container)!.display = 'none'

    addExtraLayers(viewer)
    viewer.scene.screenSpaceCameraController.minimumZoomDistance = 500000
    viewer.scene.screenSpaceCameraController.maximumZoomDistance = 20000000

    loadProvinceRings().then(setProvRings)

    const ds = new GeoJsonDataSource('dynasty')
    viewer.dataSources.add(ds)
    dsRef.current = ds

    viewer.camera.setView({
      destination: Cartesian3.fromDegrees(108, 35, 10_000_000),
      orientation: { heading: CesiumMath.toRadians(0), pitch: CesiumMath.toRadians(-40), roll: 0 },
    })

    setReady(true)
    setLoading(false)
  }, [viewer, setLoading])

  // ── 2D/3D ──
  useEffect(() => {
    if (!viewer || !ready) return
    viewer.scene.mode = sceneMode === '2d' ? SceneMode.SCENE2D : SceneMode.SCENE3D
    if (sceneMode === '2d') viewer.camera.setView({ destination: Cartesian3.fromDegrees(108, 35, 15_000_000) })
  }, [sceneMode, viewer, ready])

  // ── 王朝切换 → 渲染省界 ──
  useEffect(() => {
    if (!ready || !dsRef.current) return
    const ds = dsRef.current
    ds.entities.removeAll()
    if (active.length === 0) return

    const dynasty = active[0]
    const baseColor = Color.fromCssColorString(dynasty.color)
    const codes = DYNASTY_PROVINCES[dynasty.id]
    if (!codes || !provRings) return

    for (const code of codes) {
      const rings = provRings[code]
      if (!rings) continue
      for (const ring of rings) {
        ds.entities!.add({
          polyline: {
            positions: toClosed(ring), width: 2,
            material: new PolylineDashMaterialProperty({ color: baseColor.withAlpha(0.7), dashLength: 18 }),
          },
        })
      }
    }

    // 朝代名称（各省中心取平均）
    let sl = 0, sa = 0, cn = 0
    for (const code of codes) {
      const c = centerMap[code]
      if (c) { sl += c[0]; sa += c[1]; cn++ }
    }
    if (cn > 0) {
      ds.entities!.add({
        position: Cartesian3.fromDegrees(sl / cn, sa / cn + 2, 1000),
        label: {
          text: dynasty.name, font: 'bold 38px "Microsoft YaHei", sans-serif',
          style: LabelStyle.FILL_AND_OUTLINE, fillColor: Color.WHITE, outlineColor: Color.BLACK, outlineWidth: 5,
          showBackground: true, backgroundColor: baseColor.withAlpha(0.85), backgroundPadding: new Cartesian2(16, 10),
        },
      })
    }
  }, [active, ready, provRings])

  return (
    <div className="w-full h-full relative">
      <Viewer
        ref={onReady}
        full animation={false} timeline={false} homeButton={false}
        sceneModePicker={false} baseLayerPicker={false} navigationHelpButton={false}
        geocoder={false} infoBox={false} selectionIndicator={false}
      />
    </div>
  )
}
