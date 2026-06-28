"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  type Simulation,
} from "d3-force";
import type { NodeType } from "@/lib/content/concept-registry";
import type { RelationType } from "@/types/content";
import {
  NODE_TYPE_COLOR,
  NODE_TYPE_LABEL,
  NODE_TYPE_ORDER,
  RELATION_LABEL,
  type GraphData,
  type GraphNode,
} from "@/lib/content/graph";

type SimNode = GraphNode & {
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
  r: number;
};
type SimLink = { source: SimNode | string; target: SimNode | string; relation: RelationType; soft?: boolean };
type Transform = { x: number; y: number; k: number };

function relationStyle(rel: RelationType): { color: string; width: number; dash: number[] } {
  switch (rel) {
    case "prerequisite":
      return { color: "#C8A85A", width: 1.6, dash: [] };
    case "part-of":
      return { color: "#D8C58A", width: 1.4, dash: [] };
    case "source-of":
      return { color: "#9B6B3D", width: 1.4, dash: [] };
    case "influenced-by":
      return { color: "#D8C58A", width: 1.2, dash: [5, 4] };
    case "contrasts-with":
      return { color: "#B46A5A", width: 1.2, dash: [5, 4] };
    case "used-in":
      return { color: "#6F8FAF", width: 1.2, dash: [2, 4] };
    default:
      return { color: "#E7DDCC", width: 1, dash: [] };
  }
}

const radiusOf = (n: GraphNode) => 4 + Math.sqrt(n.degree) * 2.4 + (n.isHub ? 3 : 0);

export function ConstellationGraph({ data }: { data: GraphData }) {
  const router = useRouter();
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const nodesRef = useRef<SimNode[]>([]);
  const linksRef = useRef<SimLink[]>([]);
  const adjRef = useRef<Map<string, Set<string>>>(new Map());
  const simRef = useRef<Simulation<SimNode, undefined> | null>(null);
  const transformRef = useRef<Transform>({ x: 0, y: 0, k: 1 });
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 });
  const hiddenRef = useRef<Set<NodeType>>(new Set());
  const hoverRef = useRef<string | null>(null);
  const drawRef = useRef<() => void>(() => {});

  const [hoverId, setHoverId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hidden, setHidden] = useState<Set<NodeType>>(new Set());
  const [query, setQuery] = useState("");

  // ---------- draw ----------
  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const { w, h, dpr } = sizeRef.current;
    const t = transformRef.current;
    const hov = hoverRef.current;
    const neigh = hov ? adjRef.current.get(hov) : null;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    // ambient glow กลางจอ
    const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.5);
    g.addColorStop(0, "rgba(212,175,55,0.05)");
    g.addColorStop(1, "rgba(8,11,22,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    ctx.translate(t.x, t.y);
    ctx.scale(t.k, t.k);

    const visible = (id: string) => {
      const n = nodesRef.current.find((d) => d.id === id);
      return n ? !hiddenRef.current.has(n.nodeType) : false;
    };

    // edges
    for (const l of linksRef.current) {
      const s = l.source as SimNode;
      const tg = l.target as SimNode;
      if (!visible(s.id) || !visible(tg.id)) continue;
      const touchesHover = hov && (s.id === hov || tg.id === hov);
      const st = relationStyle(l.relation);
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(tg.x, tg.y);
      ctx.strokeStyle = st.color;
      ctx.globalAlpha = hov ? (touchesHover ? 0.9 : 0.06) : l.soft ? 0.12 : 0.24;
      ctx.lineWidth = (touchesHover ? st.width + 0.6 : st.width) / t.k;
      ctx.setLineDash((l.soft ? [2, 4] : st.dash).map((d) => d / t.k));
      ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;

    // nodes
    for (const n of nodesRef.current) {
      if (hiddenRef.current.has(n.nodeType)) continue;
      const dim = hov && n.id !== hov && !(neigh && neigh.has(n.id));
      ctx.globalAlpha = dim ? 0.25 : 1;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = NODE_TYPE_COLOR[n.nodeType];
      ctx.fill();
      if (!n.hasPage) {
        ctx.globalAlpha = dim ? 0.18 : 0.55;
        ctx.lineWidth = 1 / t.k;
        ctx.strokeStyle = "#0B0E19";
        ctx.stroke();
      }
      if (n.isHub) {
        ctx.globalAlpha = dim ? 0.3 : 1;
        ctx.lineWidth = 2 / t.k;
        ctx.strokeStyle = "#D4AF37";
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + 2.5 / t.k, 0, Math.PI * 2);
        ctx.stroke();
      }
      // label
      if (t.k > 0.75 || n.isHub || n.id === hov) {
        ctx.globalAlpha = dim ? 0.4 : 1;
        ctx.fillStyle = "#E7DDCC";
        ctx.font = `${12 / t.k}px "Noto Serif Thai", "Noto Serif", serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText(n.thaiTitle || n.label, n.x, n.y + n.r + 3 / t.k);
      }
    }
    ctx.globalAlpha = 1;
  };
  useEffect(() => {
    drawRef.current = draw;
  });

  // ---------- setup once ----------
  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const nodes: SimNode[] = data.nodes.map((n) => ({ ...n, x: 0, y: 0, r: radiusOf(n) }));
    const byId = new Map(nodes.map((n) => [n.id, n]));
    const links: SimLink[] = data.edges.map((e) => ({
      source: e.source,
      target: e.target,
      relation: e.relation,
      soft: e.soft,
    }));
    const adj = new Map<string, Set<string>>();
    for (const e of data.edges) {
      if (!adj.has(e.source)) adj.set(e.source, new Set());
      if (!adj.has(e.target)) adj.set(e.target, new Set());
      adj.get(e.source)!.add(e.target);
      adj.get(e.target)!.add(e.source);
    }
    nodesRef.current = nodes;
    linksRef.current = links;
    adjRef.current = adj;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      sizeRef.current = { w, h, dpr };
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      if (transformRef.current.x === 0 && transformRef.current.y === 0) {
        transformRef.current = { x: w / 2, y: h / 2, k: 1 };
      }
      drawRef.current();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const sim = forceSimulation<SimNode>(nodes)
      .force(
        "link",
        forceLink<SimNode, SimLink>(links)
          .id((d) => d.id)
          .distance((l) => (l.soft ? 95 : 70))
          .strength((l) => (l.soft ? 0.05 : 0.18)),
      )
      .force("charge", forceManyBody<SimNode>().strength(-190))
      .force("center", forceCenter(0, 0))
      .force("collide", forceCollide<SimNode>().radius((d) => d.r + 5));
    simRef.current = sim;

    if (reduce) {
      sim.stop();
      for (let i = 0; i < 320; i++) sim.tick();
      drawRef.current();
    } else {
      sim.on("tick", () => drawRef.current());
    }

    return () => {
      ro.disconnect();
      sim.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- helpers ----------
  const toWorld = (clientX: number, clientY: number) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const t = transformRef.current;
    return { x: (clientX - rect.left - t.x) / t.k, y: (clientY - rect.top - t.y) / t.k };
  };
  const hitTest = (clientX: number, clientY: number): SimNode | null => {
    const p = toWorld(clientX, clientY);
    let best: SimNode | null = null;
    let bestD = Infinity;
    for (const n of nodesRef.current) {
      if (hiddenRef.current.has(n.nodeType)) continue;
      const d = Math.hypot(n.x - p.x, n.y - p.y);
      if (d <= n.r + 4 / transformRef.current.k && d < bestD) {
        best = n;
        bestD = d;
      }
    }
    return best;
  };

  const panRef = useRef({ active: false, moved: false, lx: 0, ly: 0, downNode: null as SimNode | null });

  const onPointerDown = (e: React.PointerEvent) => {
    canvasRef.current?.setPointerCapture(e.pointerId);
    panRef.current = {
      active: true,
      moved: false,
      lx: e.clientX,
      ly: e.clientY,
      downNode: hitTest(e.clientX, e.clientY),
    };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const pan = panRef.current;
    if (pan.active && e.buttons !== 0) {
      const dx = e.clientX - pan.lx;
      const dy = e.clientY - pan.ly;
      if (Math.hypot(dx, dy) > 3) pan.moved = true;
      transformRef.current = {
        ...transformRef.current,
        x: transformRef.current.x + dx,
        y: transformRef.current.y + dy,
      };
      pan.lx = e.clientX;
      pan.ly = e.clientY;
      drawRef.current();
      return;
    }
    const hit = hitTest(e.clientX, e.clientY);
    const id = hit?.id ?? null;
    if (id !== hoverRef.current) {
      hoverRef.current = id;
      setHoverId(id);
      if (canvasRef.current) canvasRef.current.style.cursor = id ? "pointer" : "grab";
      drawRef.current();
    }
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const pan = panRef.current;
    canvasRef.current?.releasePointerCapture(e.pointerId);
    if (!pan.moved && pan.downNode) {
      setSelectedId(pan.downNode.id);
      router.push(`/concepts/${pan.downNode.id}`);
    }
    panRef.current = { ...pan, active: false };
  };
  const onWheel = (e: React.WheelEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const t = transformRef.current;
    const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
    const k = Math.max(0.25, Math.min(4, t.k * factor));
    transformRef.current = {
      k,
      x: cx - ((cx - t.x) / t.k) * k,
      y: cy - ((cy - t.y) / t.k) * k,
    };
    drawRef.current();
  };

  const zoomBy = (factor: number) => {
    const { w, h } = sizeRef.current;
    const t = transformRef.current;
    const k = Math.max(0.25, Math.min(4, t.k * factor));
    transformRef.current = { k, x: w / 2 - ((w / 2 - t.x) / t.k) * k, y: h / 2 - ((h / 2 - t.y) / t.k) * k };
    drawRef.current();
  };
  const resetView = () => {
    const { w, h } = sizeRef.current;
    transformRef.current = { x: w / 2, y: h / 2, k: 1 };
    drawRef.current();
  };

  const toggleType = (nt: NodeType) => {
    const next = new Set(hidden);
    if (next.has(nt)) next.delete(nt);
    else next.add(nt);
    setHidden(next);
    hiddenRef.current = next;
    drawRef.current();
  };

  const runSearch = (q: string) => {
    const term = q.trim().toLowerCase();
    if (!term) return;
    const found = nodesRef.current.find(
      (n) =>
        n.id.toLowerCase() === term ||
        n.label.toLowerCase().includes(term) ||
        (n.thaiTitle ?? "").toLowerCase().includes(term),
    );
    if (!found) return;
    const { w, h } = sizeRef.current;
    const k = Math.max(transformRef.current.k, 1.4);
    transformRef.current = { k, x: w / 2 - found.x * k, y: h / 2 - found.y * k };
    hoverRef.current = found.id;
    setHoverId(found.id);
    setSelectedId(found.id);
    drawRef.current();
  };

  // ---------- detail panel data ----------
  const panelNode = (hoverId ?? selectedId)
    ? data.nodes.find((n) => n.id === (hoverId ?? selectedId)) ?? null
    : null;
  const panelNeighbors = panelNode
    ? data.edges
        .filter((e) => e.source === panelNode.id || e.target === panelNode.id)
        .map((e) => {
          const otherId = e.source === panelNode.id ? e.target : e.source;
          const other = data.nodes.find((n) => n.id === otherId);
          return { id: otherId, label: other?.thaiTitle || other?.label || otherId, relation: e.relation };
        })
        .slice(0, 8)
    : [];

  return (
    <div
      ref={wrapRef}
      className="relative h-[78vh] min-h-[520px] w-full overflow-hidden rounded-md border border-slate-boundary/40 bg-deep-navy"
    >
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="กราฟแผนที่ความสัมพันธ์ของแนวคิด — ใช้รายการด้านล่างหากต้องการเข้าถึงแบบลำดับ"
        className="block h-full w-full touch-none [cursor:grab] active:[cursor:grabbing]"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onWheel={onWheel}
      />

      {/* Toolbar: search + filter chips (legend in one) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex flex-wrap items-start justify-between gap-3 p-4">
        <form
          className="pointer-events-auto flex items-center gap-2 rounded-md border border-white/10 bg-surface-container/80 px-3 py-2 backdrop-blur"
          onSubmit={(e) => {
            e.preventDefault();
            runSearch(query);
          }}
        >
          <span className="material-symbols-outlined text-[18px] text-burnished-gold">search</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหา node..."
            aria-label="ค้นหา node ในกราฟ"
            className="w-40 bg-transparent text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none"
          />
        </form>

        <div className="pointer-events-auto flex flex-wrap justify-end gap-2">
          {NODE_TYPE_ORDER.map((nt) => {
            const off = hidden.has(nt);
            return (
              <button
                key={nt}
                type="button"
                onClick={() => toggleType(nt)}
                aria-pressed={!off}
                className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] transition-colors ${
                  off
                    ? "border-white/10 text-on-surface-variant/40"
                    : "border-white/15 text-on-surface-variant"
                }`}
              >
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: NODE_TYPE_COLOR[nt], opacity: off ? 0.3 : 1 }}
                />
                {NODE_TYPE_LABEL[nt]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-1.5">
        <button
          type="button"
          onClick={() => zoomBy(1.25)}
          aria-label="ซูมเข้า"
          className="flex h-9 w-9 items-center justify-center rounded-md border border-white/15 bg-surface-container/80 text-on-surface-variant backdrop-blur transition-colors hover:border-burnished-gold/50 hover:text-burnished-gold"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
        </button>
        <button
          type="button"
          onClick={() => zoomBy(1 / 1.25)}
          aria-label="ซูมออก"
          className="flex h-9 w-9 items-center justify-center rounded-md border border-white/15 bg-surface-container/80 text-on-surface-variant backdrop-blur transition-colors hover:border-burnished-gold/50 hover:text-burnished-gold"
        >
          <span className="material-symbols-outlined text-[18px]">remove</span>
        </button>
        <button
          type="button"
          onClick={() => resetView()}
          aria-label="รีเซ็ตมุมมอง"
          className="flex h-9 w-9 items-center justify-center rounded-md border border-white/15 bg-surface-container/80 text-on-surface-variant backdrop-blur transition-colors hover:border-burnished-gold/50 hover:text-burnished-gold"
        >
          <span className="material-symbols-outlined text-[18px]">restart_alt</span>
        </button>
      </div>

      {/* Detail panel */}
      {panelNode ? (
        <div className="pointer-events-auto absolute bottom-4 left-4 max-w-xs rounded-md border border-antique-gold/30 bg-surface-container/90 p-4 backdrop-blur">
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-3 w-3 rounded-full"
              style={{ backgroundColor: NODE_TYPE_COLOR[panelNode.nodeType] }}
            />
            <span className="font-serif text-lg text-ivory">{panelNode.thaiTitle || panelNode.label}</span>
          </div>
          <p className="mt-1 text-xs text-on-surface-variant/70">
            {[NODE_TYPE_LABEL[panelNode.nodeType], panelNode.framework].filter(Boolean).join(" · ")}
          </p>
          {panelNode.description ? (
            <p className="mt-2 text-sm leading-relaxed text-soft-ivory">{panelNode.description}</p>
          ) : null}
          {panelNeighbors.length > 0 ? (
            <p className="mt-2 text-xs leading-relaxed text-on-surface-variant/70">
              เชื่อมกับ:{" "}
              {panelNeighbors.map((n, i) => (
                <span key={`${n.id}-${i}`}>
                  {i > 0 ? " · " : ""}
                  {n.label} <span className="text-antique-gold/70">({RELATION_LABEL[n.relation]})</span>
                </span>
              ))}
            </p>
          ) : null}
          <Link
            href={`/concepts/${panelNode.id}`}
            className="mt-3 inline-flex items-center gap-1 text-sm text-burnished-gold hover:underline"
          >
            เปิดหน้าเต็ม
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>
      ) : (
        <p className="pointer-events-none absolute bottom-5 left-4 text-xs text-on-surface-variant/40">
          ชี้ที่ node เพื่อดูรายละเอียด · คลิกเพื่อเปิดหน้าเต็ม · ลากเพื่อเลื่อน · เลื่อนล้อเพื่อซูม
        </p>
      )}
    </div>
  );
}
