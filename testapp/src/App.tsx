import React, { useState, useEffect } from 'react';
import * as Babylon from 'babylonjs';
import './App.css';
import * as BabylonReact from './BabylonReact'

function App() {
  const [camera1, setCamera1] = useState<Babylon.Camera>();
  const [camera2, setCamera2] = useState<Babylon.Camera>();

  BabylonReact.useEngine((engine: Babylon.Engine) => {
    const scene1 = new Babylon.Scene(engine);
    const light1 = new Babylon.HemisphericLight("light1", new Babylon.Vector3(0, 1, 0), scene1);
    light1.intensity = 0.7;
    const shape1 = Babylon.MeshBuilder.CreateBox("Box1", {size: 2}, scene1);
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
    const shape2 = Babylon.MeshBuilder.CreateBox("Shape2", {size: 2}, scene2);
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
  });

  return (
    <div className="App">
      <BabylonReact.EngineView width={'100%'} height={'50%'} camera={camera1} />
      <BabylonReact.EngineView width={'100%'} height={'50%'} camera={camera2} />
    </div>
  );
}

export default App;
