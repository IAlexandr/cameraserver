import React from 'react';
import {Route} from 'react-router';
import Main from './components/Main';
import Monitor from './components/Monitor';
import CameraTypes from './components/CameraTypes';
import CameraType from './components/CameraTypes/CameraType';

export default function () {
  return (
    <Route component={Main}>
      <Route path="/" component={Monitor} />
      <Route path="/camera-types" component={CameraTypes}>
        <Route path="/camera-types/:cameraTypeId" component={CameraType} />
      </Route>
    </Route>
  );
}
