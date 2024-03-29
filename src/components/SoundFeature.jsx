import React from "react";

const SoundFeature = () => {
	const handleLearnMore = () => {
		const element = document.querySelector(".display-section");

		window.scrollTo({
			top: element?.getBoundingClientRect().bottom + 100,
			left: 0,
			behavior: "smooth",
		});
	};
	return (
		<div className="sound-section wrapper">
			<div className="body">
				<div className="sound-section-content content">
					<h2 className="title">New Sound System</h2>
					<p className="text">Feel the base</p>
					<span className="description">
						From $799 or $33.29/mo. for 24 mo. before trade‑in
					</span>
					<ul className="links">
						<li>
							<button className="button">Buy</button>
						</li>
						<li>
							<a className="link" onClick={handleLearnMore} role="button">
								Learn more
							</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default SoundFeature;
