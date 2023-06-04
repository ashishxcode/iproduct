import React from "react";
import Navbar from "./components/Navbar";
import Jumbotron from "./components/Jumbotron";
import SoundFeature from "./components/SoundFeature";
const App = () => {
	return (
		<div id="App">
			<Navbar />
			<Jumbotron />
			<SoundFeature />
		</div>
	);
};

export default App;
