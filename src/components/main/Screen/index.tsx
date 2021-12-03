import React, { ReactElement, useEffect, useRef } from 'react';

import { Refresh } from '@mui/icons-material';
import { Card, CardHeader, Divider, IconButton, Tooltip } from '@mui/material';

const Component = (): ReactElement => {
  const ref = useRef<HTMLCanvasElement | null>(null);

  const loadScreenCap = () => {
    if (ref && ref.current) {
      const canvas = ref.current;
      const ctx = canvas.getContext('2d');

      fetch(`/getScreenShot`)
        .then((res) => res.blob())
        .then((blob) => {
          const img = new Image();

          img.src = URL.createObjectURL(blob);
          img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;

            if (ctx) {
              ctx.drawImage(img, 0, 0);
            }

            img.remove();
          };
        });
    }
  };

  const touchScreen = (() => {
    const delay = 1000;

    return (x: number, y: number) => {
      if (ref && ref.current) {
        const canvas = ref.current;
        const ctx = canvas.getContext('2d');

        if (canvas.style.cursor !== 'not-allowed') {
          fetch(`/touchScreen?x=${x}&y=${y}`)
            .then(() => {
              canvas.style.cursor = 'not-allowed';

              if (ctx) {
                ctx.globalCompositeOperation = 'destination-out';
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.beginPath();
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fill();
                ctx.globalCompositeOperation = 'source-over';
              }
            })
            .then(() => new Promise((resolve) => setTimeout(resolve, delay)))
            .then(() => {
              canvas.style.cursor = 'auto';
            })
            .then(loadScreenCap);
        }
      }
    };
  })();

  const swipeScreen = (() => {
    const delay = 1000;

    return (x1: number, y1: number, x2: number, y2: number) => {
      if (ref && ref.current) {
        const canvas = ref.current;
        const ctx = canvas.getContext('2d');

        if (canvas.style.cursor !== 'not-allowed') {
          fetch(`/swipeScreen?x1=${x1}&y1=${y1}&x2=${x2}&y2=${y2}`)
            .then(() => {
              canvas.style.cursor = 'not-allowed';

              if (ctx) {
                ctx.globalCompositeOperation = 'destination-out';
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.beginPath();
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fill();
                ctx.globalCompositeOperation = 'source-over';
              }
            })
            .then(() => new Promise((resolve) => setTimeout(resolve, delay)))
            .then(() => {
              canvas.style.cursor = 'auto';
            })
            .then(loadScreenCap);
        }
      }
    };
  })();

  useEffect(() => {
    if (ref && ref.current) {
      const canvas = ref.current;

      const Mouse = {
        x: 0,
        y: 0,
        mousedown: (e: MouseEvent) => {
          Mouse.x = e.clientX;
          Mouse.y = e.clientY;
        },
        mouseup: (e: MouseEvent) => {
          if (Mouse.x && Mouse.y) {
            if (
              Math.abs(e.clientX - Mouse.x) > 10 ||
              Math.abs(e.clientY - Mouse.y) > 10
            ) {
              const rect = canvas.getBoundingClientRect();
              const x1 = Mouse.x - rect.left;
              const y1 = Mouse.y - rect.top;
              const x2 = e.clientX - rect.left;
              const y2 = e.clientY - rect.top;

              swipeScreen(x1, y1, x2, y2);
            } else {
              const rect = canvas.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;

              touchScreen(x, y);
            }
          }

          Mouse.x = 0;
          Mouse.y = 0;
        },
      };

      canvas.addEventListener('mousedown', Mouse.mousedown);
      canvas.addEventListener('mouseup', Mouse.mouseup);
      canvas.addEventListener('mouseleave', Mouse.mouseup);

      loadScreenCap();
    }
  }, [ref]);

  return (
    <Card>
      <CardHeader
        action={
          <Tooltip title="刷新">
            <IconButton onClick={loadScreenCap}>
              <Refresh />
            </IconButton>
          </Tooltip>
        }
        title="截图"
      />
      <Divider />
      <canvas ref={ref} />
    </Card>
  );
};

export default Component;
