import { useState, useEffect, useRef } from "react";
import { ArrowRight, Link, Gauge, MousePointerClick } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/* RadialOrbitalTimeline (port 21st.dev) — przemalowany na stal Klarow:
   węzły = moduły oferty, relatedIds = powiązania między modułami,
   energy = gotowość wzorca (% pracy pokrytej biblioteką).
   Hover na węźle = box z podglądem narzędzia (zrzut ekranu); klik = karta
   szczegółów z linkiem do podstrony modułu. */

export interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
  slug?: string;
  image?: string;
}

export interface OrbitalUi {
  statusLabels: Record<TimelineItem["status"], string>;
  readiness: string;
  related: string;
  fullDesc: string;
  hoverHint: string;
}

const UI_PL: OrbitalUi = {
  statusLabels: { completed: "DOSTĘPNY", "in-progress": "FALA 2", pending: "ROADMAPA" },
  readiness: "Gotowość wzorca",
  related: "Powiązane moduły",
  fullDesc: "Pełny opis modułu",
  hoverHint: "kliknij węzeł, aby zobaczyć szczegóły",
};

interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
  ui?: OrbitalUi;
}

export default function RadialOrbitalTimeline({
  timelineData,
  ui = UI_PL,
}: RadialOrbitalTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>(
    {}
  );
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [centerOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  };

  const toggleItem = (id: number) => {
    setExpandedItems((prev) => {
      const newState = { ...prev };
      Object.keys(newState).forEach((key) => {
        if (parseInt(key) !== id) {
          newState[parseInt(key)] = false;
        }
      });

      newState[id] = !prev[id];

      if (!prev[id]) {
        setActiveNodeId(id);
        setAutoRotate(false);

        const relatedItems = getRelatedItems(id);
        const newPulseEffect: Record<number, boolean> = {};
        relatedItems.forEach((relId) => {
          newPulseEffect[relId] = true;
        });
        setPulseEffect(newPulseEffect);

        centerViewOnNode(id);
      } else {
        setActiveNodeId(null);
        setAutoRotate(true);
        setPulseEffect({});
      }

      return newState;
    });
  };

  useEffect(() => {
    let rotationTimer: ReturnType<typeof setInterval> | undefined;

    if (autoRotate && hoveredId === null) {
      rotationTimer = setInterval(() => {
        setRotationAngle((prev) => {
          const newAngle = (prev + 0.3) % 360;
          return Number(newAngle.toFixed(3));
        });
      }, 50);
    }

    return () => {
      if (rotationTimer) {
        clearInterval(rotationTimer);
      }
    };
  }, [autoRotate, hoveredId]);

  const centerViewOnNode = (nodeId: number) => {
    if (!nodeRefs.current[nodeId]) return;

    const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
    const totalNodes = timelineData.length;
    const targetAngle = (nodeIndex / totalNodes) * 360;

    setRotationAngle(270 - targetAngle);
  };

  const calculateNodePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radius = 200;
    const radian = (angle * Math.PI) / 180;

    const x = radius * Math.cos(radian) + centerOffset.x;
    const y = radius * Math.sin(radian) + centerOffset.y;

    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = Math.max(
      0.4,
      Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2))
    );

    return { x, y, angle, zIndex, opacity };
  };

  const getRelatedItems = (itemId: number): number[] => {
    const currentItem = timelineData.find((item) => item.id === itemId);
    return currentItem ? currentItem.relatedIds : [];
  };

  const isRelatedToActive = (itemId: number): boolean => {
    if (!activeNodeId) return false;
    const relatedItems = getRelatedItems(activeNodeId);
    return relatedItems.includes(itemId);
  };

  const getStatusStyles = (status: TimelineItem["status"]): string => {
    switch (status) {
      case "completed":
        return "text-[#171717] bg-[#a8b4c2] border-[#8895a6]";
      case "in-progress":
        return "text-[#d9e0e8] bg-[#42526e]/70 border-[#8895a6]/70";
      case "pending":
        return "text-white/70 bg-black/40 border-white/30";
      default:
        return "text-white/70 bg-black/40 border-white/30";
    }
  };

  return (
    <div
      className="w-full h-[640px] md:h-[720px] flex flex-col items-center justify-center overflow-hidden"
      ref={containerRef}
      onClick={handleContainerClick}
    >
      <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
        <div
          className="absolute w-full h-full flex items-center justify-center"
          ref={orbitRef}
          style={{
            perspective: "1000px",
            transform: `translate(${centerOffset.x}px, ${centerOffset.y}px)`,
          }}
        >
          {/* hub — polerowana stal */}
          <div className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-[#d7dee7] via-[#a8b4c2] to-[#69788c] animate-pulse flex items-center justify-center z-10">
            <div className="absolute w-20 h-20 rounded-full border border-[#a8b4c2]/25 animate-ping opacity-70"></div>
            <div
              className="absolute w-24 h-24 rounded-full border border-[#a8b4c2]/15 animate-ping opacity-50"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div className="w-8 h-8 rounded-full bg-[#f4f5f7]/85 backdrop-blur-md"></div>
          </div>

          {/* orbita — wyraźniejsza (średnica = 2×radius węzłów) */}
          <div className="absolute w-[400px] h-[400px] rounded-full border border-[#a8b4c2]/30"></div>
          <div className="absolute w-[440px] h-[440px] rounded-full border border-[#a8b4c2]/10 border-dashed"></div>

          {timelineData.map((item, index) => {
            const position = calculateNodePosition(index, timelineData.length);
            const isExpanded = expandedItems[item.id];
            const isRelated = isRelatedToActive(item.id);
            const isPulsing = pulseEffect[item.id];
            const Icon = item.icon;

            const nodeStyle = {
              transform: `translate(${position.x}px, ${position.y}px)`,
              zIndex: isExpanded ? 200 : position.zIndex,
              opacity: isExpanded ? 1 : position.opacity,
            };

            return (
              <div
                key={item.id}
                ref={(el) => {
                  nodeRefs.current[item.id] = el;
                }}
                className="absolute transition-all duration-700 cursor-pointer"
                style={nodeStyle}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleItem(item.id);
                }}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId((h) => (h === item.id ? null : h))}
              >
                <div
                  className={`absolute rounded-full -inset-1 ${
                    isPulsing ? "animate-pulse duration-1000" : ""
                  }`}
                  style={{
                    background: `radial-gradient(circle, rgba(168,180,194,0.22) 0%, rgba(168,180,194,0) 70%)`,
                    width: `${item.energy * 0.5 + 40}px`,
                    height: `${item.energy * 0.5 + 40}px`,
                    left: `-${(item.energy * 0.5 + 40 - 40) / 2}px`,
                    top: `-${(item.energy * 0.5 + 40 - 40) / 2}px`,
                  }}
                ></div>

                <div
                  className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${
                    isExpanded
                      ? "bg-[#e2e8ef] text-[#171717]"
                      : isRelated
                      ? "bg-[#a8b4c2]/60 text-[#171717]"
                      : "bg-[#1c1c1c] text-[#d9e0e8]"
                  }
                  border-2
                  ${
                    isExpanded
                      ? "border-[#d7dee7] shadow-lg shadow-[#a8b4c2]/30"
                      : isRelated
                      ? "border-[#a8b4c2] animate-pulse"
                      : "border-[#a8b4c2]/60"
                  }
                  transition-all duration-300 transform
                  ${isExpanded ? "scale-150" : ""}
                `}
                >
                  <Icon size={16} />
                </div>

                <div
                  className={`
                  absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap
                  text-xs font-semibold tracking-wider
                  transition-all duration-300
                  ${isExpanded ? "text-white scale-125" : "text-[#d4d4d8]"}
                `}
                >
                  {item.title}
                </div>

                {isExpanded && (
                  <Card className="absolute top-20 left-1/2 -translate-x-1/2 w-72 bg-[#171717]/95 backdrop-blur-lg border-[#a8b4c2]/30 shadow-xl shadow-black/40 overflow-visible">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3 bg-[#a8b4c2]/50"></div>
                    {item.image && (
                      <img
                        src={item.image}
                        alt={`Podgląd narzędzia: ${item.title}`}
                        className="w-full rounded-t-lg border-b border-[#a8b4c2]/20"
                      />
                    )}
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <Badge
                          className={`px-2 text-xs ${getStatusStyles(
                            item.status
                          )}`}
                        >
                          {ui.statusLabels[item.status]}
                        </Badge>
                        <span className="text-xs font-mono text-white/50">
                          {item.date}
                        </span>
                      </div>
                      <CardTitle className="text-sm mt-2 text-white">
                        {item.title}
                      </CardTitle>
                      <p className="text-[10px] uppercase tracking-wider text-[#8895a6] font-bold">
                        {item.category}
                      </p>
                    </CardHeader>
                    <CardContent className="text-xs text-[#d4d4d8]">
                      <p>{item.content}</p>

                      <div className="mt-4 pt-3 border-t border-white/10">
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="flex items-center">
                            <Gauge size={10} className="mr-1" />
                            {ui.readiness}
                          </span>
                          <span className="font-mono">{item.energy}%</span>
                        </div>
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#69788c] to-[#d7dee7]"
                            style={{ width: `${item.energy}%` }}
                          ></div>
                        </div>
                      </div>

                      {item.relatedIds.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-white/10">
                          <div className="flex items-center mb-2">
                            <Link size={10} className="text-white/70 mr-1" />
                            <h4 className="text-xs uppercase tracking-wider font-medium text-white/70">
                              {ui.related}
                            </h4>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {item.relatedIds.map((relatedId) => {
                              const relatedItem = timelineData.find(
                                (i) => i.id === relatedId
                              );
                              return (
                                <Button
                                  key={relatedId}
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center h-6 px-2 py-0 text-xs rounded-none border-[#a8b4c2]/20 bg-transparent hover:bg-[#a8b4c2]/10 text-white/80 hover:text-white transition-all"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleItem(relatedId);
                                  }}
                                >
                                  {relatedItem?.title}
                                  <ArrowRight
                                    size={8}
                                    className="ml-1 text-white/60"
                                  />
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {item.slug && (
                        <RouterLink
                          to={`/moduly/${item.slug}`}
                          className="mt-4 flex items-center justify-center gap-1 rounded-md border border-[#a8b4c2]/30 py-1.5 text-xs font-bold text-[#d9e0e8] hover:bg-[#a8b4c2]/10 hover:text-white transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {ui.fullDesc} <ArrowRight size={11} />
                        </RouterLink>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            );
          })}
        </div>

        {/* hover-box: podgląd narzędzia dla najechanego węzła (dokowany w rogu) */}
        {(() => {
          const hovered = timelineData.find(
            (i) => i.id === hoveredId && !expandedItems[i.id]
          );
          if (!hovered || !hovered.image) return null;
          return (
            <div className="hidden lg:block absolute top-6 right-2 w-64 z-[300] pointer-events-none">
              <div className="rounded-xl border border-[#a8b4c2]/35 bg-[#171717]/95 backdrop-blur-md shadow-xl shadow-black/50 overflow-hidden">
                <img
                  src={hovered.image}
                  alt={`Podgląd narzędzia: ${hovered.title}`}
                  className="w-full block"
                />
                <div className="px-3 py-2.5 border-t border-[#a8b4c2]/20">
                  <p className="text-xs font-bold text-white">{hovered.title}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-[10.5px] text-[#8895a6]">
                    <MousePointerClick size={11} /> {ui.hoverHint}
                  </p>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
