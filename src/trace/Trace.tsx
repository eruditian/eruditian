import React, { useEffect, useRef } from 'react';
import { SFC32 } from '@thi.ng/random';
import { Bounds, Point } from './useTraceState';

type Rand = SFC32;

const DEV_SEED = [0x1ee77ee1, 0x7ee11ee7, 0xe1ee7e57, 0x75e7ee1e];

const pickPoint = (rand: Rand, bounds: Bounds): Point => {
  return {
    x: 0,
    y: 0,
  };
};

const Trace: React.FC = () => {
  const bg_ref = useRef<HTMLDivElement>(null);
  const container_ref = useRef<HTMLDivElement>(null);
  const mouse_ref = useRef<HTMLDivElement>(null);
  const target_ref = useRef<HTMLDivElement>(null);
  const rand = useRef<Rand>(new SFC32(DEV_SEED));

  useEffect(() => {
    const ref = bg_ref.current;
    let bbox: DOMRect | undefined = undefined;
    let mouse_bbox: DOMRect | undefined = undefined;
    if (container_ref.current) {
      bbox = container_ref.current.getBoundingClientRect();
    }
    if (mouse_ref) {
      mouse_bbox = mouse_ref.current?.getBoundingClientRect();
    }

    const moveListener = (e: TouchEvent) => {
      if (!bbox || !mouse_bbox || e.touches.length < 1) {
        return;
      }
      const target_radius = mouse_bbox.width / 2;
      const touch = e.touches[0];

      const left = Math.min(
        Math.max(touch.clientX - bbox.left, 0 + target_radius),
        bbox.width - target_radius,
      );
      const top = Math.min(
        Math.max(touch.clientY - bbox.top, 0 + target_radius),
        bbox.height - target_radius,
      );
      if (mouse_ref.current) {
        mouse_ref.current.style.left = left + 'px';
        mouse_ref.current.style.top = top + 'px';
      }
      e.preventDefault();
      e.stopPropagation();
    };

    const startListener = (e: TouchEvent) => {
      console.log('listener start', e);
      e.stopPropagation();
      e.preventDefault();
    };

    const endListener = (e: TouchEvent) => {
      console.log('listener end', e);
      e.stopPropagation();
      e.preventDefault();
    };

    if (ref) {
      ref.addEventListener('touchstart', startListener, { passive: false });
      ref.addEventListener('touchmove', moveListener, { passive: false });
      ref.addEventListener('touchend', endListener, { passive: false });
    }
    return () => {
      if (ref) {
        ref.removeEventListener('touchstart', startListener);
        ref.removeEventListener('touchmove', moveListener);
        ref.removeEventListener('touchend', endListener);
      }
    };
  }, []);

  return (
    <div
      ref={bg_ref}
      className="flex h-full flex-col gap-2 pb-10"
      onAuxClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onKeyDown={() => {
        if (!target_ref.current) {
          return;
        }
      }}
    >
      <p className="text-accent-foreground/50 mb-4 pl-2 text-2xl font-bold">
        Trace
      </p>
      <div
        className="border-primary relative mx-8 mb-10 grow rounded border"
        ref={container_ref}
      >
        <div
          className="absolute top-0 left-0 size-10 -translate-1/2 rounded-full bg-green-300"
          ref={mouse_ref}
        />
        <div
          className="absolute top-0 left-0 size-20 -translate-1/2 rounded-full bg-blue-300"
          ref={target_ref}
        />
      </div>
    </div>
  );
};

export default Trace;
