import React from "react";
import Logo from "../assets/images/logo.svg";
import Search from "../assets/images/search.svg";
import Store from "../assets/images/store.svg";

const Navbar = () => {
	const navItems = [
		{
			name: "Store",
			path: "#",
		},
		{
			name: "Mac",
			path: "#",
		},
		{
			name: "iPad",
			path: "#",
		},
		{
			name: "iPhone",
			path: "#",
		},
		{
			name: "Watch",
			path: "#",
		},
		{
			name: "AirPods",
			path: "#",
		},
		{
			name: "TV & Home",
			path: "#",
		},
		{
			name: "Entertainment",
			path: "#",
		},
		{
			name: "Accessories",
			path: "#",
		},
		{
			name: "Support",
			path: "#",
		},
	];
	return (
		<nav className="nav-wrapper">
			<div className="nav-content">
				<ul className="list-styled">
					<li>
						<img src={Logo} alt="Apple" />
					</li>
					{navItems.map((item, index) => {
						return (
							<li key={index}>
								<a href={item.path} className="link-styled">
									{item.name}
								</a>
							</li>
						);
					})}
					<li>
						<img src={Search} alt="Search" />
					</li>
					<li>
						<img src={Store} alt="Store" />
					</li>
				</ul>
			</div>
		</nav>
	);
};

export default Navbar;
