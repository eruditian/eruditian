import React, { useEffect, useRef } from 'react';

type Vec = {
  x: number;
  y: number;
};

interface DragData {
  origin: Vec;
  delta: Vec;
}

const registerDragListener = (
  el: HTMLDivElement,
  onDragCb: (data: DragData) => void,
  onDragEndCB: () => void,
) => {
  let origin: Vec | undefined = undefined;
  let initialTouchId: number | undefined = undefined;
  let bbox: DOMRect = el.getBoundingClientRect();

  const mouseMoveListener = (ev: MouseEvent) => {
    ev.preventDefault();
    if (!origin) {
      return;
    }
    if (
      bbox.left <= ev.clientX &&
      bbox.right >= ev.clientX &&
      bbox.top <= ev.clientY &&
      bbox.bottom >= ev.clientY
    ) {
      //Mouse inside bbox.
      onDragCb({
        delta: {
          x: origin.x - ev.clientX,
          y: origin.y - ev.clientY,
        },
        origin,
      });
      return;
    }
    console.log('going outside');
    onDragEndCB();
    el.removeEventListener('mousemove', mouseMoveListener);
    origin = undefined;
  };
  const mouseDownListener = (ev: MouseEvent) => {
    ev.preventDefault();
    origin = { x: ev.clientX, y: ev.clientY };
    initialTouchId = undefined;
    bbox = el.getBoundingClientRect();

    el.addEventListener('mousemove', mouseMoveListener);
  };
  el.addEventListener('mousedown', mouseDownListener);
  const mouseLeaveListener = (ev: MouseEvent) => {
    ev.preventDefault();
    if (origin) {
      onDragEndCB();
    }
    el.removeEventListener('mousemove', mouseMoveListener);
    origin = undefined;
  };
  el.addEventListener('mouseleave', mouseLeaveListener);

  const touchStartListener = (ev: TouchEvent) => {
    ev.preventDefault();
    const touch = ev.targetTouches[0];
    origin = { x: touch.clientX, y: touch.clientX };
    initialTouchId = touch.identifier;
    bbox = el.getBoundingClientRect();
  };
  el.addEventListener('touchstart', touchStartListener);
  const abortTouchListener = (ev: TouchEvent) => {
    ev.preventDefault();
    onDragEndCB();
    origin = undefined;
    initialTouchId = undefined;
  };
  el.addEventListener('touchcancel', abortTouchListener);
  const touchMove = (ev: TouchEvent) => {
    ev.preventDefault();
    if (
      ev.targetTouches.length > 0 &&
      ev.targetTouches[0].identifier === initialTouchId &&
      origin
    ) {
      const touch = ev.targetTouches[0];
      onDragCb({
        delta: {
          x: origin.x - touch.clientX,
          y: origin.y - touch.clientY,
        },
        origin,
      });
      return;
    }
    onDragEndCB();
    origin = undefined;
    initialTouchId = undefined;
  };
  el.addEventListener('touchmove', touchMove);

  return () => {
    el.removeEventListener('mousedown', mouseDownListener);
    el.removeEventListener('touchstart', touchStartListener);
    el.removeEventListener('touchcancel', abortTouchListener);
    el.removeEventListener('touchmove', touchMove);
    el.removeEventListener('mousemove', mouseMoveListener);
    el.removeEventListener('mouseleave', mouseLeaveListener);
  };
};

const MathA: React.FC = () => {
  const line_cont_el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (line_cont_el.current) {
      registerDragListener(
        line_cont_el.current,
        (d) => console.log('d', d),
        () => console.log('DragEnd'),
      );
    }
  }, []);

  return (
    <div className="flex h-full flex-col items-stretch justify-center gap-4 bg-emerald-100 p-4">
      <div className="basis-1/3 bg-emerald-200">d</div>
      <div
        className="relative flex basis-1/3 items-center justify-between bg-emerald-300 transition-all duration-500"
        ref={line_cont_el}
      >
        <div className="h-10 w-0.5 bg-black/80 transition-all" />
        <div className="h-10 w-0.5 bg-black/80 transition-all" />
        <div className="h-10 w-0.5 bg-black/80 transition-all" />
        <div className="h-10 w-0.5 bg-black/80 transition-all" />
        <div className="h-10 w-0.5 bg-black/80 transition-all" />
        <div className="absolute flex h-0.5 w-full grow bg-black"></div>
      </div>
      <div className="basis-1/3 bg-emerald-200">d</div>
    </div>
  );
};

export default MathA;
