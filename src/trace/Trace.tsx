import React, { useEffect, useRef } from 'react';
import { boundsFromRect } from './trace_helpers';
import { pickPoint, prng, Rand, stepTowards, Vec } from '~/emath';

const DEV_SEED = [0x1ee77ee1, 0x7ee11ee7, 0xe1ee7e57, 0x75e7ee1e];

let p: Vec = { x: 0, y: 0 };
let following: boolean = false;
let chase: HTMLDivElement | undefined;
let chase_pos: Vec | undefined = undefined;
let con: DOMRect | undefined;
let last_frame: number = 0;

const follow = (delta: number) => {
  if (!chase || !con || !chase_pos) {
    return;
  }
  const step = stepTowards(chase_pos, p, 100, delta);
  // console.log('rect, o', o, step);
  chase.style.left = step.x + 'px';
  chase.style.top = step.y + 'px';
  chase_pos = step;
};

const followRAF = (t: number) => {
  if (last_frame === 0) {
    last_frame = t;
    requestAnimationFrame(followRAF);
    return;
  }
  if (following) {
    follow((t - last_frame) / 1000);
    requestAnimationFrame(followRAF);
    last_frame = t;
    return;
  }
  last_frame = 0;
};

const Trace: React.FC = () => {
  const bg_ref = useRef<HTMLDivElement>(null);
  const container_ref = useRef<HTMLDivElement>(null);
  const mouse_ref = useRef<HTMLDivElement>(null);
  const target_ref = useRef<HTMLDivElement>(null);
  const chase_ref = useRef<HTMLDivElement>(null);
  const rand = useRef<Rand>(new prng(DEV_SEED));

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
        if (!chase_ref.current || !container_ref.current) {
          following = false;
          return;
        }
        chase = chase_ref.current;
        con = container_ref.current.getBoundingClientRect();
        if (!following) {
          following = true;
          const rect = chase.getBoundingClientRect();
          chase_pos = { x: rect.x - con.x, y: rect.y - con.y };
          requestAnimationFrame(followRAF);
        } else {
          following = false;
        }
        // const rect = chase_ref.current.getBoundingClientRect();
        // const con_rect = container_ref.current.getBoundingClientRect();
        // const o: Vec = { x: rect.x - con_rect.x, y: rect.y - con_rect.y };
        // const step = stepTowards(o, p, 30, 1);
        // console.log('rect, o', o, step);
        // chase_ref.current.style.left = step.x + 'px';
        // chase_ref.current.style.top = step.y + 'px';
      }}
      onClick={() => {
        if (!target_ref.current || !container_ref.current) {
          return;
        }
        const bounds = boundsFromRect(
          container_ref.current.getBoundingClientRect(),
          true,
          20,
        );

        p = pickPoint(rand.current, bounds);
        target_ref.current.style.left = p.x + 'px';
        target_ref.current.style.top = p.y + 'px';
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
        <div className="absolute top-0 left-0 size-0" ref={target_ref}>
          <div className="absolute top-0 left-0 size-10 -translate-1/2 animate-pulse rounded-full bg-blue-300"></div>
          <div className="absolute top-0 left-0 size-[2px] bg-red-600"></div>
        </div>
        <div className="absolute top-0 left-0 size-0" ref={chase_ref}>
          <div className="absolute top-0 left-0 size-10 -translate-1/2 animate-pulse rounded-full bg-pink-300"></div>
          <div className="absolute top-0 left-0 size-[2px] bg-red-600"></div>
        </div>
      </div>
    </div>
  );
};

export default Trace;
