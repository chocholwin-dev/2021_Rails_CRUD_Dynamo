import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Status from "../components/statuses/StatusesHome";
import WritingPolicyTemplate from "../components/writingPolicyTemplate/WritingPolicyTemplateHome"

export default (
	<Router>
		<Switch>
			<Route path="/" exact component={Status} />
			<Route path="/writing_policy_template/index" exact component={WritingPolicyTemplate} />
		</Switch>
	</Router>
);
