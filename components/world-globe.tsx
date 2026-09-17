"use client";

import { useEffect, useMemo, useRef } from "react";
import createGlobe, { type Arc, type Marker } from "cobe";
import type { GlobeSignal } from "@/lib/geo";

function normalizeLng(lng: number) {
  let value = lng;
  while (value > 180) value -= 360;
  while (value < -180) value += 360;
  return value;
}

function lngDistance(a: number, b: number) {
  return Math.abs(normalizeLng(a - b));
}

function facingLongitude(phi: number) {
  return normalizeLng(270 - (phi * 180) / Math.PI);
}

function pickFrontHub(signals: GlobeSignal[], phi: number, theta: number) {
  if (!signals.length) return null;
  const facingLng = facingLongitude(phi);
  const facingLat = 90 - (theta * 180) / Math.PI;
  let best: GlobeSignal | null = null;
  let bestScore = Number.POSITIVE_INFINITY;
  for (const signal of signals) {
    const [lat, lng] = signal.hub.location;
    const score = lngDistance(lng, facingLng) + Math.abs(lat - facingLat) * 0.35;
    if (score < bestScore) {
      bestScore = score;
      best = signal;
    }
  }
  return best;
}

export function WorldGlobe({
  signals,
  focusHubId,
  onFocusHub,
  className,
}: {
  signals: GlobeSignal[];
  focusHubId?: string | null;
  onFocusHub?: (hubId: string) => void;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phiRef = useRef(0.4);
  const thetaRef = useRef(0.28);
  const focusLngRef = useRef<number | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const arcsRef = useRef<Arc[]>([]);
  const signalsRef = useRef(signals);
  const globeRef = useRef<ReturnType<typeof createGlobe> | null>(null);
  const widthRef = useRef(0);
  const draggingRef = useRef(false);
  const movedRef = useRef(false);
  const lastPointerRef = useRef<{ x: number; y: number } | null>(null);
  const autoResumeAtRef = useRef(0);
  const onFocusHubRef = useRef(onFocusHub);

  const markers: Marker[] = useMemo(() => {
    const max = Math.max(...signals.map((s) => s.count), 1);
    return signals.map((signal) => ({
      location: [...signal.hub.location] as [number, number],
      size:
        signal.hubId === focusHubId
          ? 0.13
          : 0.05 + (signal.count / max) * 0.08,
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
      .slice(0, 5)
      .map((signal) => ({
        from: [...hub.hub.location] as [number, number],
        to: [...signal.hub.location] as [number, number],
        color: [0.83, 1, 0.31] as [number, number, number],
      }));
  }, [signals, focusHubId]);

  useEffect(() => {
    markersRef.current = markers;
    arcsRef.current = arcs;
    signalsRef.current = signals;
  }, [markers, arcs, signals]);

  useEffect(() => {
    onFocusHubRef.current = onFocusHub;
  }, [onFocusHub]);

  useEffect(() => {
    const focused = signals.find((s) => s.hubId === focusHubId);
    if (!draggingRef.current && focused) {
      focusLngRef.current = focused.hub.location[1];
      autoResumeAtRef.current = Date.now() + 5500;
    }
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

    const emitFrontHub = () => {
      const front = pickFrontHub(signalsRef.current, phiRef.current, thetaRef.current);
      if (front) onFocusHubRef.current?.(front.hubId);
    };

    const onPointerDown = (event: PointerEvent) => {
      draggingRef.current = true;
      movedRef.current = false;
      focusLngRef.current = null;
      autoResumeAtRef.current = Number.POSITIVE_INFINITY;
      lastPointerRef.current = { x: event.clientX, y: event.clientY };
      canvas.setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!draggingRef.current || !lastPointerRef.current) return;
      const dx = event.clientX - lastPointerRef.current.x;
      const dy = event.clientY - lastPointerRef.current.y;
      if (Math.abs(dx) + Math.abs(dy) > 3) movedRef.current = true;
      phiRef.current += dx * 0.005;
      thetaRef.current = Math.max(
        -0.55,
        Math.min(1.1, thetaRef.current + dy * 0.0035),
      );
      lastPointerRef.current = { x: event.clientX, y: event.clientY };
    };

    const onPointerUp = (event: PointerEvent) => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      lastPointerRef.current = null;
      autoResumeAtRef.current = Date.now() + 4500;
      try {
        canvas.releasePointerCapture(event.pointerId);
      } catch {
        // ignore
      }
      emitFrontHub();
    };

    window.addEventListener("resize", onResize);
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);
    onResize();

    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: widthRef.current * 2,
      height: widthRef.current * 2,
      phi: phiRef.current,
      theta: thetaRef.current,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 20000,
      mapBrightness: 5.8,
      baseColor: [0.07, 0.14, 0.1],
      markerColor: [0.83, 1, 0.31],
      glowColor: [0.08, 0.18, 0.12],
      scale: 1.08,
      markers: markersRef.current,
      arcs: arcsRef.current,
      arcColor: [0.83, 1, 0.31],
      arcWidth: 0.6,
      arcHeight: 0.38,
      markerElevation: 0.025,
    });
    globeRef.current = globe;
    canvas.style.opacity = "1";

    let frame = 0;
    const tick = () => {
      const now = Date.now();
      if (
        !draggingRef.current &&
        focusLngRef.current != null &&
        now < autoResumeAtRef.current
      ) {
        const target = ((270 - focusLngRef.current) * Math.PI) / 180;
        phiRef.current += (target - phiRef.current) * 0.06;
      } else if (
        !draggingRef.current &&
        !reduced &&
        now >= autoResumeAtRef.current
      ) {
        focusLngRef.current = null;
        phiRef.current += 0.0022;
      }

      globe.update({
        phi: phiRef.current,
        theta: thetaRef.current,
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
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
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
        cursor: "grab",
        touchAction: "none",
      }}
      aria-label="Interactive globe"
    />
  );
}
