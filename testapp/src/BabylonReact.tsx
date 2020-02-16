import React, { FunctionComponent, useState, useEffect, useRef } from 'react';
import * as Babylon from 'babylonjs';

type BabylonViewProps = {
  camera?: Babylon.Camera,
  width?: number,
  height?: number,
}

export const BabylonView: FunctionComponent<BabylonViewProps> = (props: BabylonViewProps & React.CanvasHTMLAttributes<HTMLCanvasElement>) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && props.camera) {
      const canvas = canvasRef.current;
      const camera = props.camera;
      const scene = camera.getScene();
      const engine = scene.getEngine();

      const inputElement = engine.inputElement;
      scene.detachControl();
      engine.inputElement = canvas;
      scene.attachControl();
      engine.inputElement = inputElement;

      camera.attachControl(canvas);

      engine.registerView(canvas, camera);

      return () => {
        camera.detachControl(canvas);
        engine.unRegisterView(canvas);
      }
    }
    return () => {};
  }, [canvasRef, props.camera]);

  // 'rest' can contain additional properties that you can flow through to canvas: (id, className, etc.)
  const { width, height, ...rest } = props;
  const opts: React.CanvasHTMLAttributes<HTMLCanvasElement> = rest;

  if (width !== undefined) {
    opts.width = width;
  }

  if (height !== undefined) {
    opts.height = height;
  }

  return (<canvas {...opts} ref={canvasRef} />);
}

export function useBabylonEngine(): Babylon.Engine | undefined {
  const [engine, setEngine] = useState<Babylon.Engine>();

  useEffect(() => {
    const engine = new Babylon.Engine(document.createElement("canvas"), true);
    setEngine(engine);

    engine.runRenderLoop(() => {
      if (engine.activeView?.camera !== null) {
        engine.activeView?.camera?.getScene().render();
      }
    });

    return () => {
      engine.dispose();
    };
  }, []);

  return engine;
}