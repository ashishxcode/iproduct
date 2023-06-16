import React, { useRef } from 'react';
import Navbar from './components/Navbar';
import Jumbotron from './components/Jumbotron';
import SoundFeature from './components/SoundFeature';
import DisplaySection from './components/DisplaySection';
import WebGIViewer from './components/WebGIViewer';
const App = () => {
	const webgiViewerRef = useRef(null);
	const contentRef = useRef(null);

	const handlePreview = () => {
		webgiViewerRef.current.triggerPreview();
	};
	return (
		<div id='App'>
			<div ref={contentRef} id='content'>
				<Navbar />
				<Jumbotron />
				<SoundFeature />
				<DisplaySection handlePreview={handlePreview} />
			</div>
			<WebGIViewer contentRef={contentRef} ref={webgiViewerRef} />
		</div>
	);
};

export default App;
