import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';

import { Navbar } from './app/Navbar';
import CalculatorMA from './features/CalculatorMA/CalculatorMA';
import MaTable from './features/movingAverage/MaTable';
import WmaTable from './features/weightedMovingAverage/WmaTable';
import BbTable from './features/bollingerBands/BbTable';
import HighsTable from './features/highsAverage/HighsTable';
import LowsTable from './features/lowsAverage/LowsTable';
import SupportTable from './features/supportAverage/SupportTable';
import ResistanceTable from './features/resistanceAverage/ResistanceTable';
import BuyPoints from './features/buyPoints/BuyPoints';
import SellPoints from './features/sellPoints/SellPoints';
import TradingPortfolio from './features/tradingPortfolio/TradingPortfolio';
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
							<Route
								exact
								path="/movingAverages"
								render={() => (
									<>
										<MaTable />
										<WmaTable />
									</>
								)}
							/>
							<Route exact path="/bollingerBands" render={() => <BbTable />} />

							<Route
								exact
								path="/highsAndLows"
								render={() => (
									<>
										<HighsTable />
										<LowsTable />
									</>
								)}
							/>
							<Route
								exact
								path="/supportAndResistance"
								render={() => (
									<>
										<SupportTable />
										<ResistanceTable />
									</>
								)}
							/>
							<Route
								exact
								path="/buyAndSellPoints"
								render={() => (
									<>
										<BuyPoints />
										<SellPoints />
									</>
								)}
							/>
							<Route
								exact
								path="/tradingPortfolio"
								render={() => (
									<>
										<TradingPortfolio />
									</>
								)}
							/>
							<Redirect to="/" />
						</Switch>
					</section>
				</Container>
			</Router>
		);
	}
}

export default App;
