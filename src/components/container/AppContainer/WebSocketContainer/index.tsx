import { io } from 'socket.io-client';
import { useGameLog, useGameState } from '~/data';
// import { loadScreenCap } from '~/components/main/Screen';

const WebSocketContainer = () => {
  const [gameLog, setGameLog] = useGameLog();
  const [, setGameState] = useGameState();

  var socket = io();

  socket.on('connect', function() {
    fetch('/getState')
      .then((res) => res.json())
      .then((res) => {
        setGameState(res);
      });
  });

  socket.on('onStateUpdate', function(data:any) {
    setGameState(data);
  });

  socket.on('onLogUpdate', function(log:any) {
    setGameLog([[log.time, log.data], ...(gameLog || [])]);
  });

  // socket.on(
  //   'onFrameUpdate',
  //   function(data){
    // const img = new Image();

    // img.src = "data:image/png;base64," + data
    // img.onload = () => {
    //   canvas.width = img.width;
    //   canvas.height = img.height;

    //   if (ctx) {
    //     ctx.drawImage(img, 0, 0);
    //   }

    //   img.remove();
    // };
  //   }
  // )

  return null;
};

export default WebSocketContainer;
