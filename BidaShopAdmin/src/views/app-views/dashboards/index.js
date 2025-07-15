import React, { lazy, Suspense } from "react";
import { Redirect, Route, Switch } from 'react-router-dom';
import Loading from 'components/shared-components/Loading';
import PrivateRoute from "utils/PrivateRoute";

const Dashboards = ({ match }) => {
  return(
  <Suspense fallback={<Loading cover="content"/>}>
    <Switch>
      <PrivateRoute path={`${match.url}/default`} component={lazy(() => import(`./default`))} allowedRoles={["MANAGER", "ADMIN"]}/>
      <Redirect from={`${match.url}`} to={`${match.url}/default`} />
    </Switch>
  </Suspense>
)};

export default Dashboards;