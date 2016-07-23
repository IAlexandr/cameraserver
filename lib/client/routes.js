import React from 'react';
import {Route} from 'react-router';
import Main from './components/Main';
import Monitor from './components/Monitor';
import CameraTypes from './components/CameraTypes';
import CameraType from './components/CameraTypes/CameraType';
import Cameras from './components/Cameras';
import Camera from './components/Cameras/Camera';

export default function () {
  return (
    <Route component={Main}>
      <Route path="/" component={Monitor} />
      <Route path="/camera-types" component={CameraTypes}>
        <Route path="/camera-types/:cameraTypeId" component={CameraType} />
      </Route>
      <Route path="/cameras" component={Cameras}>
        <Route path="/cameras/:cameraId" component={Camera} />
      </Route>
    </Route>
  );
}
