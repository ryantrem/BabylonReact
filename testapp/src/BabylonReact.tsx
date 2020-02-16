import React, { FunctionComponent, useState, useEffect, useRef } from 'react';
import * as Babylon from 'babylonjs';

type BabylonViewProps = {
  camera?: Babylon.Camera,
  width?: number | string,
  height?: number | string,
}

export const EngineView: FunctionComponent<BabylonViewProps> = (props: BabylonViewProps) => {
  const divRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (divRef.current && canvasRef.current && props.camera) {
      const div = divRef.current;
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

      const onBeforeRender = () => {
        canvas.width = div.offsetWidth;
        canvas.height = div.offsetHeight;
      };

      const beforeRenderObserver = scene.onBeforeRenderObservable.add(onBeforeRender);

      return () => {
        scene.onBeforeRenderObservable.remove(beforeRenderObserver);
        camera.detachControl(canvas);
        engine.unRegisterView(canvas);
      }
    }
    return () => {};
  }, [divRef, canvasRef, props.camera]);

  return (
    <>
      <div ref={divRef} style={{width: props.width, height: props.height}}>
        <canvas ref={canvasRef} />
      </div>
    </>
  );
}

export function useEngine(): Babylon.Engine | undefined {
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