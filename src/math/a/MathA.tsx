import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { scaleLinear } from 'd3';

type Vec = {
  x: number;
  y: number;
};

interface DragData {
  origin: Vec;
  delta: Vec;
}

interface DragEvent {
  type: 'drag';
  data: DragData;
}
interface DragEndEvent {
  type: 'drag-end';
}
interface ZoomOutEvent {
  type: 'zoom-out';
  delta: number;
}
interface ZoomInEvent {
  type: 'zoom-in';
  delta: number;
}

type GestureListenerEvent =
  | DragEndEvent
  | DragEvent
  | ZoomOutEvent
  | ZoomInEvent;

const registerGestureListener = (
  el: HTMLDivElement,
  onEventCb: (ev: GestureListenerEvent) => void,
) => {
  let origin: Vec | undefined = undefined;
  let initialTouchId: number | undefined = undefined;

  const coverer = document.createElement('div');
  coverer.style.width = '100%';
  coverer.style.height = '100%';
  coverer.style.background = 'rgba(100,0,0,0.2)';
  coverer.style.position = 'absolute';
  coverer.style.top = '0';
  coverer.style.left = '0';

  const mouseMoveListener = (ev: MouseEvent) => {
    ev.preventDefault();
    if (!origin) {
      return;
    }

    onEventCb({
      type: 'drag',
      data: {
        delta: {
          x: origin.x - ev.clientX,
          y: origin.y - ev.clientY,
        },
        origin,
      },
    });
  };
  const mouseUpListener = (ev: MouseEvent) => {
    ev.preventDefault();
    origin = undefined;
    document.body.removeChild(coverer);
    onEventCb({
      type: 'drag-end',
    });
  };

  coverer.addEventListener('mousemove', mouseMoveListener);
  coverer.addEventListener('mouseleave', mouseUpListener);
  coverer.addEventListener('mouseup', mouseUpListener);
  coverer.addEventListener('click', (ev) => ev.preventDefault());
  coverer.addEventListener('mousedown', (ev) => ev.preventDefault());

  const mouseDownListener = (ev: MouseEvent) => {
    ev.preventDefault();
    if (origin) {
      return;
    }
    origin = { x: ev.clientX, y: ev.clientY };
    initialTouchId = undefined;
    document.body.append(coverer);
  };
  el.addEventListener('mousedown', mouseDownListener);

  const wheelListener = (ev: WheelEvent) => {
    ev.preventDefault();

    const delta = Math.abs(ev.deltaY);
    if (delta > 0.5) {
      onEventCb({
        type: ev.deltaY > 0 ? 'zoom-in' : 'zoom-out',
        delta: delta,
      });
    }
  };
  el.addEventListener('wheel', wheelListener);

  ////
  ////
  ////

  const touchStartListener = (ev: TouchEvent) => {
    ev.preventDefault();
    if (origin) {
      return;
    }
    const touch = ev.targetTouches[0];
    origin = { x: touch.clientX, y: touch.clientX };
    initialTouchId = touch.identifier;
  };
  el.addEventListener('touchstart', touchStartListener);
  const abortTouchListener = (ev: TouchEvent) => {
    ev.preventDefault();
    onEventCb({ type: 'drag-end' });
    origin = undefined;
    initialTouchId = undefined;
    coverer.remove();
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
      onEventCb({
        type: 'drag',
        data: {
          delta: {
            x: origin.x - touch.clientX,
            y: origin.y - touch.clientY,
          },
          origin,
        },
      });
      return;
    }
    onEventCb({ type: 'drag-end' });
    origin = undefined;
    initialTouchId = undefined;
    coverer.remove();
  };
  el.addEventListener('touchmove', touchMove);

  return () => {
    el.removeEventListener('mousedown', mouseDownListener);
    el.removeEventListener('wheel', wheelListener);
    el.removeEventListener('touchstart', touchStartListener);
    el.removeEventListener('touchcancel', abortTouchListener);
    el.removeEventListener('touchmove', touchMove);
    coverer.remove();
  };
};

const getPositions = (
  bbox: DOMRect,
  offset: Vec,
  min: number,
  max: number,
  tick_count: number,
): Vec[] => {
  // const center = bbox.left + (bbox.width / 2);
  console.log('bbox.left, bbox.right', bbox.left, bbox.right);
  const values = scaleLinear(
    [min - 1, max + 1],
    [bbox.left, bbox.right],
  ).nice();
  console.log('values.', values.range(), values.domain());
  const ticks = values.ticks(tick_count);
  return ticks.map((v) => {
    const left = offset.x + values(v);
    console.log('left', v, left);
    return { x: left, y: 0 };
  });
};

const MathA: React.FC = () => {
  const line_cont_el = useRef<HTMLDivElement>(null);
  const [scroll, setScroll] = useState<Vec>({ x: 0, y: 0 });
  const [ticks, setTicks] = useState<Vec[]>([]);

  // useEffect(() => {
  //   if (line_cont_el.current) {
  //     return registerGestureListener(line_cont_el.current, (d) =>
  //       console.log('d', d),
  //     );
  //   }
  // }, []);

  const xy = useCallback(
    (x: HTMLDivElement) => {
      if (!x) {
        return;
      }
      // registerGestureListener(x, (d) => {
      //   console.log('d', d);
      // });
      console.log('x', x);
      const ts = getPositions(x.getBoundingClientRect(), scroll, -3, 6, 6);
      console.log('ts', ts);
      setTicks(ts);
      line_cont_el.current = x;
    },
    [scroll],
  );

  return (
    <div className="flex h-full flex-col items-stretch justify-center gap-4 bg-emerald-100 p-4">
      <div className="basis-1/3 bg-emerald-200">d</div>
      <div
        className="relative flex basis-1/3 items-center justify-between bg-emerald-300 transition-all duration-700"
        ref={xy}
        onClick={() =>
          line_cont_el.current &&
          setTicks(
            getPositions(
              line_cont_el.current.getBoundingClientRect(),
              { x: 0, y: 0 },
              -3,
              8,
              6,
            ),
          )
        }
      >
        {ticks.map(({ x }, i) => (
          <div
            key={i}
            style={{ transform: `translateX(${x}px)` }}
            className="absolute h-10 w-0.5 bg-black/80 transition-all"
          />
        ))}
        <div className="absolute flex h-0.5 w-full grow bg-black"></div>
      </div>
      <div className="basis-1/3 bg-emerald-200">d</div>
    </div>
  );
};

export default MathA;
