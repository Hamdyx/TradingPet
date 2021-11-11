import React, { Component } from 'react';
import logo from './logo.svg';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';

import { Navbar } from './app/Navbar';
import CalculatorMA from './features/CalculatorMA/CalculatorMA';
import MaTable from './features/movingAverage/MaTable';
import WmaTable from './features/weightedMovingAverage/WmaTable';
import BbTable from './features/bollingerBands/BbTable';
import './App.css';

class App extends Component {
	render() {
		return (
			<Router>
				<Container fluid className="App">
					<Row>
						<Col className="navbar-col">
							<Navbar />
						</Col>
					</Row>
					<section className="main-content">
						<Switch>
							<Route exact path="/" render={() => <CalculatorMA />} />
							<Route exact path="/movingAverage" render={() => <MaTable />} />
							<Route exact path="/weightedMovingAverage" render={() => <WmaTable />} />
							<Route exact path="/bollingerBands" render={() => <BbTable />} />
							<Redirect to="/" />
						</Switch>
					</section>
				</Container>
			</Router>
		);
	}
}

export default App;
