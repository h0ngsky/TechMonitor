"use client";

import { useEffect, useMemo, useRef } from "react";
import createGlobe, { type Arc, type Marker } from "cobe";
import type { GlobeSignal } from "@/lib/geo";

export function WorldGlobe({
  signals,
  focusHubId,
  className,
}: {
  signals: GlobeSignal[];
  focusHubId?: string | null;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phiRef = useRef(0);
  const focusLngRef = useRef<number | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const arcsRef = useRef<Arc[]>([]);
  const globeRef = useRef<ReturnType<typeof createGlobe> | null>(null);
  const widthRef = useRef(0);

  const markers: Marker[] = useMemo(() => {
    const max = Math.max(...signals.map((s) => s.count), 1);
    return signals.map((signal) => ({
      location: [...signal.hub.location] as [number, number],
      size:
        signal.hubId === focusHubId
          ? 0.12
          : 0.045 + (signal.count / max) * 0.07,
      color:
        signal.hubId === focusHubId
          ? ([0.95, 1, 0.45] as [number, number, number])
          : undefined,
    }));
  }, [signals, focusHubId]);

  const arcs: Arc[] = useMemo(() => {
    if (signals.length < 2) return [];
    const hub = focusHubId
      ? signals.find((s) => s.hubId === focusHubId) ?? signals[0]
      : signals[0];
    return signals
      .filter((signal) => signal.hubId !== hub.hubId)
      .slice(0, 4)
      .map((signal) => ({
        from: [...hub.hub.location] as [number, number],
        to: [...signal.hub.location] as [number, number],
        color: [0.83, 1, 0.31] as [number, number, number],
      }));
  }, [signals, focusHubId]);

  useEffect(() => {
    markersRef.current = markers;
    arcsRef.current = arcs;
  }, [markers, arcs]);

  useEffect(() => {
    const focused = signals.find((s) => s.hubId === focusHubId);
    focusLngRef.current = focused ? focused.hub.location[1] : null;
  }, [focusHubId, signals]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onResize = () => {
      if (!canvas.parentElement) return;
      const width = canvas.parentElement.clientWidth;
      widthRef.current = width;
      canvas.width = width * 2;
      canvas.height = width * 2;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${width}px`;
      globeRef.current?.update({
        width: width * 2,
        height: width * 2,
      });
    };

    window.addEventListener("resize", onResize);
    onResize();

    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: widthRef.current * 2,
      height: widthRef.current * 2,
      phi: 0,
      theta: 0.28,
      dark: 1,
      diffuse: 1.15,
      mapSamples: 18000,
      mapBrightness: 5.5,
      baseColor: [0.07, 0.14, 0.1],
      markerColor: [0.83, 1, 0.31],
      glowColor: [0.08, 0.18, 0.12],
      markers: markersRef.current,
      arcs: arcsRef.current,
      arcColor: [0.83, 1, 0.31],
      arcWidth: 0.55,
      arcHeight: 0.35,
      markerElevation: 0.02,
    });
    globeRef.current = globe;
    canvas.style.opacity = "1";

    let frame = 0;
    const tick = () => {
      if (focusLngRef.current != null) {
        const target = ((270 - focusLngRef.current) * Math.PI) / 180;
        phiRef.current += (target - phiRef.current) * 0.045;
      } else if (!reduced) {
        phiRef.current += 0.0024;
      }
      globe.update({
        phi: phiRef.current,
        markers: markersRef.current,
        arcs: arcsRef.current,
        width: widthRef.current * 2,
        height: widthRef.current * 2,
      });
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", onResize);
      window.cancelAnimationFrame(frame);
      globe.destroy();
      globeRef.current = null;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        width: "100%",
        height: "auto",
        aspectRatio: "1",
        opacity: 0,
        transition: "opacity 1.1s ease",
        contain: "layout paint size",
      }}
      aria-hidden
    />
  );
}
