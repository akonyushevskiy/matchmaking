import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';

import App from './components/App';
//import FriendListApp from './containers/FriendListApp/FriendListApp';
import MatchList from './containers/MatchList/MatchList';
import Match from './containers/Match/Match';
import Export from './containers/Export/Export';
import NotFoundView from './views/NotFoundView';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={MatchList} />
    <Route path="match/:match_id" component={Match} />
    <Route path="export/:match_id" component={Export} />
    <Route path="404" component={NotFoundView} />
    <Redirect from="*" to="404" />
  </Route>
);
