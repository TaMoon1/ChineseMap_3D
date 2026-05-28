import { useEffect, useRef, useState, useCallback } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { Viewer, type CesiumComponentRef } from 'resium'
import {
  Ion,
  Cartesian3,
  Cartesian2,
  Color,
  PolygonHierarchy,
  Math as CesiumMath,
  SceneMode,
  GeoJsonDataSource,
  CustomDataSource,
  LabelStyle,
  UrlTemplateImageryProvider,
  SingleTileImageryProvider,
  PolylineDashMaterialProperty,
  PolylineArrowMaterialProperty,
  HorizontalOrigin,
  VerticalOrigin,
  type Viewer as CesiumViewer,
} from 'cesium'

import { battlePresetMap } from '../data/battlePresets'
import { historicalRegionMap } from '../data/historicalRegions'
import { CESIUM_ION_TOKEN } from '../data/cesiumToken'
import { TDT_KEY } from '../data/tiandituKey'
import { DYNASTY_PROVINCES } from '../data/provinceMap'
import { getPhaseColorForArrow } from '../utils/battleStyles'
import {
  useMapStore,
  type DrawingAnnotation,
  type DrawingPoint,
  type DrawingTool,
} from '../store/useMapStore'

if (CESIUM_ION_TOKEN) Ion.defaultAccessToken = CESIUM_ION_TOKEN

const centerMap: Record<number, [number, number]> = {}

async function loadProvinceRings() {
  const response = await fetch('/data/china_provinces.json')
  const geo = await response.json()
  const rings: Record<number, number[][][]> = {}

  for (const feature of geo.features) {
    const code = feature.properties.adcode
    if (feature.properties.center) centerMap[code] = feature.properties.center

    const coords = feature.geometry.coordinates
    const provinceRings: number[][][] = []

    if (Array.isArray(coords[0][0][0])) {
      for (const polygon of coords) {
        for (const ring of polygon) provinceRings.push(ring)
      }
    } else {
      for (const ring of coords) provinceRings.push(ring)
    }

    rings[code] = provinceRings
  }

  return rings
}

function addExtraLayers(viewer: CesiumViewer) {
  if (TDT_KEY) {
    try {
      viewer.imageryLayers.addImageryProvider(
        new UrlTemplateImageryProvider({
          url: `http://t0.tianditu.gov.cn/ter_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ter&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${TDT_KEY}`,
          minimumLevel: 1,
          maximumLevel: 18,
        }),
      )
      viewer.imageryLayers.addImageryProvider(
        new UrlTemplateImageryProvider({
          url: `http://t0.tianditu.gov.cn/cta_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cta&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${TDT_KEY}`,
          minimumLevel: 1,
          maximumLevel: 18,
        }),
      )
      return
    } catch {
      // Ignore provider failures and keep the fallback imagery.
    }
  }

  const image = new Image()
  image.onload = () =>
    viewer.imageryLayers.addImageryProvider(
      new SingleTileImageryProvider({ url: '/map/china-physical.png' }),
    )
  image.onerror = () => {
    // Keep the default layer when no local raster asset exists.
  }
  image.src = '/map/china-physical.png'
}

function toClosed(ring: number[][], height = 300) {
  const points = ring.map(([lng, lat]) => Cartesian3.fromDegrees(lng, lat, height))
  points.push(points[0])
  return points
}

function toPath(path: [number, number, number?][]) {
  return path.map(([lng, lat, height = 1200]) => Cartesian3.fromDegrees(lng, lat, height))
}

function toCurvedPath(path: [number, number, number?][]) {
  if (path.length < 3) return toPath(path)

  const samples: [number, number, number][] = []
  const expanded = [path[0], ...path, path[path.length - 1]]

  for (let index = 0; index < expanded.length - 3; index += 1) {
    const p0 = expanded[index]
    const p1 = expanded[index + 1]
    const p2 = expanded[index + 2]
    const p3 = expanded[index + 3]

    const steps = 12
    for (let step = 0; step < steps; step += 1) {
      const t = step / steps
      const t2 = t * t
      const t3 = t2 * t

      const lng =
        0.5 *
        ((2 * p1[0]) +
          (-p0[0] + p2[0]) * t +
          (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 +
          (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3)
      const lat =
        0.5 *
        ((2 * p1[1]) +
          (-p0[1] + p2[1]) * t +
          (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 +
          (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)
      const height =
        0.5 *
        ((2 * (p1[2] ?? 1200)) +
          (-(p0[2] ?? 1200) + (p2[2] ?? 1200)) * t +
          (2 * (p0[2] ?? 1200) - 5 * (p1[2] ?? 1200) + 4 * (p2[2] ?? 1200) - (p3[2] ?? 1200)) * t2 +
          (-(p0[2] ?? 1200) + 3 * (p1[2] ?? 1200) - 3 * (p2[2] ?? 1200) + (p3[2] ?? 1200)) * t3)

      samples.push([lng, lat, height])
    }
  }

  const last = path[path.length - 1]
  samples.push([last[0], last[1], last[2] ?? 1200])
  return toPath(samples)
}

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

function pointDistance(a: DrawingPoint, b: DrawingPoint) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

function buildBrushPoints(points: DrawingPoint[]) {
  return points.map((point) => `${point.x},${point.y}`).join(' ')
}

function getArrowGeometry(start: DrawingPoint, end: DrawingPoint, width: number) {
  const angle = Math.atan2(end.y - start.y, end.x - start.x)
  const headLength = Math.max(18, width * 4)
  const headWidth = Math.max(12, width * 2.6)
  const base = {
    x: end.x - Math.cos(angle) * headLength,
    y: end.y - Math.sin(angle) * headLength,
  }
  const left = {
    x: base.x + Math.sin(angle) * (headWidth / 2),
    y: base.y - Math.cos(angle) * (headWidth / 2),
  }
  const right = {
    x: base.x - Math.sin(angle) * (headWidth / 2),
    y: base.y + Math.cos(angle) * (headWidth / 2),
  }

  return { base, headPoints: `${end.x},${end.y} ${left.x},${left.y} ${right.x},${right.y}` }
}

function renderAnnotation(annotation: DrawingAnnotation) {
  if (annotation.kind === 'brush') {
    return (
      <polyline
        key={annotation.id}
        points={buildBrushPoints(annotation.points)}
        fill="none"
        stroke={annotation.color}
        strokeWidth={annotation.width}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    )
  }

  const { base, headPoints } = getArrowGeometry(annotation.start, annotation.end, annotation.width)

  return (
    <g key={annotation.id}>
      <line
        x1={annotation.start.x}
        y1={annotation.start.y}
        x2={base.x}
        y2={base.y}
        stroke={annotation.color}
        strokeWidth={annotation.width}
        strokeLinecap="round"
      />
      <polygon points={headPoints} fill={annotation.color} />
    </g>
  )
}

export default function Map3D() {
  const viewerRef = useRef<CesiumViewer | null>(null)
  const [viewerMounted, setViewerMounted] = useState(false)
  const [ready, setReady] = useState(false)
  const [provRings, setProvRings] = useState<Record<number, number[][][]> | null>(null)
  const [draftAnnotation, setDraftAnnotation] = useState<DrawingAnnotation | null>(null)

  const active = useMapStore((state) => state.activeDynasties)
  const sceneMode = useMapStore((state) => state.sceneMode)
  const setLoading = useMapStore((state) => state.setLoading)
  const drawingTool = useMapStore((state) => state.drawingTool)
  const strokeColor = useMapStore((state) => state.strokeColor)
  const strokeWidth = useMapStore((state) => state.strokeWidth)
  const annotations = useMapStore((state) => state.annotations)
  const addAnnotation = useMapStore((state) => state.addAnnotation)
  const selectedBattleId = useMapStore((state) => state.selectedBattleId)
  const selectedRegionId = useMapStore((state) => state.selectedRegionId)

  const dataSourceRef = useRef<GeoJsonDataSource | null>(null)
  const battleDataSourceRef = useRef<CustomDataSource | null>(null)
  const regionDataSourceRef = useRef<CustomDataSource | null>(null)
  const initDone = useRef(false)
  const activePointerId = useRef<number | null>(null)

  const onReady = useCallback(
    (ref: CesiumComponentRef<CesiumViewer> | null) => {
      if (ref?.cesiumElement && !viewerRef.current) {
        viewerRef.current = ref.cesiumElement
        setViewerMounted(true)
      }
    },
    [],
  )

  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer || initDone.current) return
    initDone.current = true

    const getStyle = (element: Element | undefined | null) => (element as HTMLElement | null)?.style
    if (viewer.timeline?.container) getStyle(viewer.timeline.container)!.display = 'none'
    if (viewer.animation?.container) getStyle(viewer.animation.container)!.display = 'none'
    if (viewer.fullscreenButton?.container) getStyle(viewer.fullscreenButton.container)!.display = 'none'
    if (viewer.homeButton?.container) getStyle(viewer.homeButton.container)!.display = 'none'
    if (viewer.navigationHelpButton?.container) getStyle(viewer.navigationHelpButton.container)!.display = 'none'
    if (viewer.geocoder?.container) getStyle(viewer.geocoder.container)!.display = 'none'

    addExtraLayers(viewer)
    viewer.scene.screenSpaceCameraController.minimumZoomDistance = 500000
    viewer.scene.screenSpaceCameraController.maximumZoomDistance = 20000000

    loadProvinceRings().then(setProvRings)

    const dataSource = new GeoJsonDataSource('dynasty')
    viewer.dataSources.add(dataSource)
    dataSourceRef.current = dataSource

    const battleDataSource = new CustomDataSource('battles')
    viewer.dataSources.add(battleDataSource)
    battleDataSourceRef.current = battleDataSource

    const regionDataSource = new CustomDataSource('regions')
    viewer.dataSources.add(regionDataSource)
    regionDataSourceRef.current = regionDataSource

    viewer.camera.setView({
      destination: Cartesian3.fromDegrees(108, 35, 10_000_000),
      orientation: {
        heading: CesiumMath.toRadians(0),
        pitch: CesiumMath.toRadians(-40),
        roll: 0,
      },
    })

    setReady(true)
    setLoading(false)
  }, [viewerMounted, setLoading])

  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer || !ready) return

    viewer.scene.mode = sceneMode === '2d' ? SceneMode.SCENE2D : SceneMode.SCENE3D
    if (sceneMode === '2d') {
      viewer.camera.setView({ destination: Cartesian3.fromDegrees(108, 35, 15_000_000) })
    }
  }, [sceneMode, ready, viewerMounted])

  const drawingActive = sceneMode === '3d' && drawingTool !== 'none'

  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer) return

    const controller = viewer.scene.screenSpaceCameraController
    const enabled = !drawingActive

    controller.enableInputs = enabled
    controller.enableRotate = enabled
    controller.enableTilt = enabled
    controller.enableTranslate = enabled
    controller.enableZoom = enabled
    controller.enableLook = enabled

    return () => {
      controller.enableInputs = true
      controller.enableRotate = true
      controller.enableTilt = true
      controller.enableTranslate = true
      controller.enableZoom = true
      controller.enableLook = true
    }
  }, [drawingActive, viewerMounted])

  useEffect(() => {
    if (!ready || !battleDataSourceRef.current) return

    const battleDataSource = battleDataSourceRef.current
    battleDataSource.entities.removeAll()

    if (!selectedBattleId) return

    const battle = battlePresetMap.get(selectedBattleId)
    const viewer = viewerRef.current
    if (!battle || !viewer) return

    for (const [arrowIndex, arrow] of battle.arrows.entries()) {
      const color = Color.fromCssColorString(getPhaseColorForArrow(battle, arrow))
      battleDataSource.entities.add({
        polyline: {
          positions: toCurvedPath(arrow.path),
          width: arrow.width ?? 10,
          material: new PolylineArrowMaterialProperty(color),
          clampToGround: false,
        },
      })

      if (arrow.label && arrow.labelCoords) {
        battleDataSource.entities.add({
          position: Cartesian3.fromDegrees(
            arrow.labelCoords[0],
            arrow.labelCoords[1],
            arrow.labelCoords[2] ?? 2000,
          ),
          label: {
            text: arrow.label,
            font: 'bold 18px "Microsoft YaHei", sans-serif',
            style: LabelStyle.FILL_AND_OUTLINE,
            fillColor: Color.WHITE,
            outlineColor: Color.BLACK,
            outlineWidth: 4,
            showBackground: true,
            backgroundColor: color.withAlpha(0.8),
            backgroundPadding: new Cartesian2(10, 6),
            pixelOffset: new Cartesian2(0, -18 - (arrowIndex % 3) * 12),
            horizontalOrigin: HorizontalOrigin.CENTER,
            verticalOrigin: VerticalOrigin.BOTTOM,
          },
        })
      }
    }

    for (const location of battle.locations) {
      const pointColor =
        location.kind === 'site'
          ? Color.fromCssColorString('#ffd166')
          : location.kind === 'capital'
            ? Color.fromCssColorString('#ffffff')
            : Color.fromCssColorString('#cbd5e1')

      battleDataSource.entities.add({
        position: Cartesian3.fromDegrees(
          location.coords[0],
          location.coords[1],
          location.coords[2] ?? 1200,
        ),
        point: {
          pixelSize: location.kind === 'site' ? 12 : 9,
          color: pointColor,
          outlineColor: Color.BLACK,
          outlineWidth: 2,
        },
        label: {
          text: location.name,
          font: '15px "Microsoft YaHei", sans-serif',
          style: LabelStyle.FILL_AND_OUTLINE,
          fillColor: Color.WHITE,
          outlineColor: Color.BLACK,
          outlineWidth: 3,
          pixelOffset: new Cartesian2(0, -18),
          horizontalOrigin: HorizontalOrigin.CENTER,
          verticalOrigin: VerticalOrigin.BOTTOM,
        },
      })
    }

    viewer.scene.mode = SceneMode.SCENE3D
    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(
        battle.view.center[0],
        battle.view.center[1],
        battle.view.height,
      ),
      orientation: {
        heading: 0,
        pitch: CesiumMath.toRadians(battle.view.pitch ?? -55),
        roll: 0,
      },
      duration: 1.8,
    })
  }, [ready, selectedBattleId])

  useEffect(() => {
    if (!ready || !regionDataSourceRef.current) return

    const regionDataSource = regionDataSourceRef.current
    regionDataSource.entities.removeAll()

    if (!selectedRegionId) return

    const region = historicalRegionMap.get(selectedRegionId)
    const viewer = viewerRef.current
    if (!region || !viewer) return

    const fillColor = Color.fromCssColorString(region.color)
    const positions = region.points.map(([lng, lat]) => Cartesian3.fromDegrees(lng, lat, 800))

    regionDataSource.entities.add({
      polygon: {
        hierarchy: new PolygonHierarchy(positions),
        material: fillColor.withAlpha(0.26),
        outline: true,
        outlineColor: fillColor.withAlpha(0.9),
      },
    })

    regionDataSource.entities.add({
      position: Cartesian3.fromDegrees(region.center[0], region.center[1], 3000),
      label: {
        text: region.name,
        font: 'bold 24px "Microsoft YaHei", sans-serif',
        style: LabelStyle.FILL_AND_OUTLINE,
        fillColor: Color.WHITE,
        outlineColor: Color.BLACK,
        outlineWidth: 4,
        showBackground: true,
        backgroundColor: fillColor.withAlpha(0.82),
        backgroundPadding: new Cartesian2(12, 8),
      },
    })

    viewer.scene.mode = SceneMode.SCENE3D
    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(region.center[0], region.center[1], region.height),
      orientation: {
        heading: 0,
        pitch: CesiumMath.toRadians(-56),
        roll: 0,
      },
      duration: 1.6,
    })
  }, [ready, selectedRegionId])

  useEffect(() => {
    if (!ready || !dataSourceRef.current) return

    const dataSource = dataSourceRef.current
    dataSource.entities.removeAll()
    if (active.length === 0) return

    const dynasty = active[0]
    const baseColor = Color.fromCssColorString(dynasty.color)
    const provinceCodes = DYNASTY_PROVINCES[dynasty.id]
    if (!provinceCodes || !provRings) return

    for (const code of provinceCodes) {
      const rings = provRings[code]
      if (!rings) continue

      for (const ring of rings) {
        dataSource.entities.add({
          polyline: {
            positions: toClosed(ring),
            width: 2,
            material: new PolylineDashMaterialProperty({
              color: baseColor.withAlpha(0.7),
              dashLength: 18,
            }),
          },
        })
      }
    }

    let sumLng = 0
    let sumLat = 0
    let count = 0

    for (const code of provinceCodes) {
      const center = centerMap[code]
      if (!center) continue
      sumLng += center[0]
      sumLat += center[1]
      count += 1
    }

    if (count > 0) {
      dataSource.entities.add({
        position: Cartesian3.fromDegrees(sumLng / count, sumLat / count + 2, 1000),
        label: {
          text: dynasty.name,
          font: 'bold 38px "Microsoft YaHei", sans-serif',
          style: LabelStyle.FILL_AND_OUTLINE,
          fillColor: Color.WHITE,
          outlineColor: Color.BLACK,
          outlineWidth: 5,
          showBackground: true,
          backgroundColor: baseColor.withAlpha(0.85),
          backgroundPadding: new Cartesian2(16, 10),
        },
      })
    }
  }, [active, ready, provRings])

  function getOverlayPoint(event: ReactPointerEvent<SVGSVGElement>): DrawingPoint {
    const rect = event.currentTarget.getBoundingClientRect()
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }
  }

  function startAnnotation(point: DrawingPoint, tool: DrawingTool) {
    if (tool === 'arrow') {
      setDraftAnnotation({
        id: 'draft-arrow',
        kind: 'arrow',
        color: strokeColor,
        width: strokeWidth,
        start: point,
        end: point,
      })
      return
    }

    if (tool === 'brush') {
      setDraftAnnotation({
        id: 'draft-brush',
        kind: 'brush',
        color: strokeColor,
        width: strokeWidth,
        points: [point],
      })
    }
  }

  function finalizeAnnotation(annotation: DrawingAnnotation | null) {
    if (!annotation) return

    if (annotation.kind === 'arrow') {
      if (pointDistance(annotation.start, annotation.end) < 10) return
      addAnnotation({ ...annotation, id: createId() })
      return
    }

    if (annotation.points.length < 2) return
    addAnnotation({ ...annotation, id: createId() })
  }

  function handlePointerDown(event: ReactPointerEvent<SVGSVGElement>) {
    if (!drawingActive || event.button !== 0) return

    event.preventDefault()
    event.stopPropagation()

    activePointerId.current = event.pointerId
    event.currentTarget.setPointerCapture(event.pointerId)
    startAnnotation(getOverlayPoint(event), drawingTool)
  }

  function handlePointerMove(event: ReactPointerEvent<SVGSVGElement>) {
    if (!drawingActive || activePointerId.current !== event.pointerId) return

    event.preventDefault()
    const point = getOverlayPoint(event)

    setDraftAnnotation((current) => {
      if (!current) return current

      if (current.kind === 'arrow') {
        return { ...current, end: point }
      }

      const lastPoint = current.points[current.points.length - 1]
      if (pointDistance(lastPoint, point) < 2) return current

      return { ...current, points: [...current.points, point] }
    })
  }

  function handlePointerEnd(event: ReactPointerEvent<SVGSVGElement>) {
    if (activePointerId.current !== event.pointerId) return

    event.preventDefault()
    const point = getOverlayPoint(event)

    const nextDraft =
      draftAnnotation?.kind === 'arrow'
        ? { ...draftAnnotation, end: point }
        : draftAnnotation?.kind === 'brush'
          ? {
              ...draftAnnotation,
              points:
                pointDistance(draftAnnotation.points[draftAnnotation.points.length - 1], point) < 2
                  ? draftAnnotation.points
                  : [...draftAnnotation.points, point],
            }
          : draftAnnotation

    finalizeAnnotation(nextDraft)
    activePointerId.current = null
    setDraftAnnotation(null)

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  return (
    <div className="relative h-full w-full">
      <Viewer
        ref={onReady}
        full
        animation={false}
        timeline={false}
        homeButton={false}
        sceneModePicker={false}
        baseLayerPicker={false}
        navigationHelpButton={false}
        geocoder={false}
        infoBox={false}
        selectionIndicator={false}
      />
      <svg
        className={`absolute inset-0 h-full w-full ${
          drawingActive ? 'pointer-events-auto cursor-crosshair' : 'pointer-events-none'
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
      >
        {annotations.map(renderAnnotation)}
        {drawingActive && draftAnnotation ? renderAnnotation(draftAnnotation) : null}
      </svg>
    </div>
  )
}
