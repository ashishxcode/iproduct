import React from "react";
import Navbar from "./components/Navbar";
import Jumbotron from "./components/Jumbotron";
import SoundFeature from "./components/SoundFeature";
import DisplaySection from "./components/DisplaySection";
import WebGIViewer from "./components/WebGIViewer";
const App = () => {
	return (
		<div id="App">
			<Navbar />
			<Jumbotron />
			<SoundFeature />
			<DisplaySection />
			<WebGIViewer />
		</div>
	);
};

export default App;
