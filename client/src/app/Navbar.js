import React, { useEffect } from 'react';
import { Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import './Navbar.css';

export const Navbar = () => {
	useEffect(() => {
		let navDom = document.querySelector('.nav-section');
		navDom.firstChild.classList.add('active');
		navDom.childNodes.forEach((el) => {
			el.addEventListener('click', (ev) => {
				let navList = Array.from(navDom.childNodes);
				let prevActive = navList.filter((n) => n.classList[0] === 'active');
				prevActive[0].classList.remove('active');
				ev.currentTarget.classList.add('active');
			});
		});
	}, []);

	return (
		<aside className="side-navbar">
			<Nav defaultActiveKey="/" className="flex-row nav-section">
				<Link to="/">Dashboard</Link>
				<Link to="/movingAverage">Moving Average</Link>
				<Link to="/weightedMovingAverage">Weighted Moving Average</Link>
				<Link to="/bollingerBands">Bollinger Bands</Link>
			</Nav>
		</aside>
	);
};
