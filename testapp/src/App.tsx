import React, { FunctionComponent, useState, useEffect, useRef } from 'react';
import logo from './logo.svg';
import * as Babylon from 'babylonjs';
import './App.css';
import { Camera } from 'babylonjs';

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

function App() {
  const [camera1, setCamera1] = useState<Babylon.Camera>();
  const [camera2, setCamera2] = useState<Babylon.Camera>();

  useEffect(() => {
    const engine = new Babylon.Engine(document.createElement("canvas"), true);

    const scene1 = new Babylon.Scene(engine);
    const light1 = new Babylon.HemisphericLight("light1", new Babylon.Vector3(0, 1, 0), scene1);
    light1.intensity = 0.7;
    var shape1 = Babylon.MeshBuilder.CreateBox("Box1", {size: 2}, scene1);
    shape1.position.y = 0.5;
    const mat1 = new Babylon.PBRMetallicRoughnessMaterial("mat1", scene1);
    mat1.metallic = 1;
    mat1.roughness = 0.5;
    mat1.baseColor = Babylon.Color3.Blue();
    shape1.material = mat1;
    scene1.createDefaultEnvironment();

    const scene2 = new Babylon.Scene(engine);
    const light2 = new Babylon.HemisphericLight("light2", new Babylon.Vector3(0, 1, 0), scene2);
    light2.intensity = 0.7;
    var shape2 = Babylon.MeshBuilder.CreateBox("Shape2", {size: 2}, scene2);
    shape2.position.y = 0.5;
    const mat2 = new Babylon.PBRMetallicRoughnessMaterial("mat2", scene2);
    mat2.metallic = 1;
    mat2.roughness = 0.5;
    mat2.baseColor = Babylon.Color3.Red();
    shape2.material = mat2;
    scene2.createDefaultEnvironment();

    const camera1 = new Babylon.ArcRotateCamera("Camera1", 0, 0.8, 5, Babylon.Vector3.Zero(), scene1);
    camera1.lowerRadiusLimit = 4;
    camera1.upperRadiusLimit = 20;
    setCamera1(camera1);

    const camera2 = new Babylon.ArcRotateCamera("Camera2", 0.8, 0, 10, Babylon.Vector3.Zero(), scene2);
    camera2.lowerRadiusLimit = 4;
    camera2.upperRadiusLimit = 20;
    setCamera2(camera2);

    engine.runRenderLoop(() => {
      if (engine.activeView?.camera !== null) {
        engine.activeView?.camera?.getScene().render();
      }
    });

    return () => {
      engine.dispose();
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <BabylonView camera={camera1} />
        <BabylonView camera={camera2} />
      </header>
    </div>
  );
}

export default App;
