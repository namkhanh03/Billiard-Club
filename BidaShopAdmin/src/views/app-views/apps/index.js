import React, { lazy, Suspense } from "react";
import { Redirect, Switch } from 'react-router-dom';
import Loading from 'components/shared-components/Loading';
import PrivateRoute from "utils/PrivateRoute";

const Apps = ({ match }) => (
  <Suspense fallback={<Loading cover="content" />}>
    <Switch>
      <PrivateRoute path={`${match.url}/chat`} component={lazy(() => import(`./chat`))} allowedRoles={["STAFF", "MANAGER", "ADMIN"]} />
      <PrivateRoute path={`${match.url}/category`} component={lazy(() => import(`./category`))} allowedRoles={["MANAGER", "ADMIN"]} />
      <PrivateRoute path={`${match.url}/facility`} component={lazy(() => import(`./facility`))} allowedRoles={["MANAGER", "ADMIN"]} />
      <PrivateRoute path={`${match.url}/table`} component={lazy(() => import(`./table`))} allowedRoles={["MANAGER", "ADMIN"]} />
      <PrivateRoute path={`${match.url}/drinkFood`} component={lazy(() => import(`./drinkFood`))} allowedRoles={["MANAGER", "ADMIN"]} />
      <PrivateRoute path={`${match.url}/post`} component={lazy(() => import(`./post`))} allowedRoles={["MANAGER", "ADMIN"]} />
      <PrivateRoute path={`${match.url}/finance`} component={lazy(() => import(`./finance`))} allowedRoles={["MANAGER", "ADMIN"]} />
      <PrivateRoute path={`${match.url}/booking`} component={lazy(() => import(`./booking`))} allowedRoles={["STAFF","ADMIN","MANAGER"]} />
      <PrivateRoute path={`${match.url}/invoice`} component={lazy(() => import(`./invoice`))} allowedRoles={["STAFF","ADMIN","MANAGER"]} />
      <PrivateRoute path={`${match.url}/user`} component={lazy(() => import(`./user`))} allowedRoles={["ADMIN"]} />
      <PrivateRoute path={`${match.url}/customer`} component={lazy(() => import(`./customer`))} allowedRoles={["ADMIN"]} />
      <PrivateRoute path={`${match.url}/pricing`} component={lazy(() => import(`./pricing`))} allowedRoles={["ADMIN"]} />
      {/* <PrivateRoute path={`${match.url}/order`} component={lazy(() => import(`./invoice`))} allowedRoles={["STAFF", "MANAGER", "ADMIN"]} /> */}

      {/* Nếu không có route phù hợp, chuyển hướng về mặc định */}
      <Redirect from={`${match.url}`} to={`${match.url}/default`} />
    </Switch>
  </Suspense>
);

export default Apps;
