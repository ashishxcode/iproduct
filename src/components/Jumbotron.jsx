import React from "react";
import IPhone from "../assets/images/iphone-14.jpg";
import HoldingIPhone from "../assets/images/iphone-hand.png";
const Jumbotron = () => {
	return (
		<div className="jumbotron-section wrapper">
			<h2 className="title">New</h2>
			<img src={IPhone} alt="IPhone 14 Pro" className="logo" />
			<p className="text">Pro. Beyond.</p>
			<span className="description">
				From $799 or $33.29/mo. for 24 mo. before trade‑in <sup>2</sup>
			</span>
			<ul className="links">
				<li>
					<button className="button">Buy</button>
				</li>
				<li>
					<a className="link" href="#">
						Learn more
					</a>
				</li>
			</ul>
			<img src={HoldingIPhone} alt="Holding IPhone" className="iphone-img" />
		</div>
	);
};

export default Jumbotron;
