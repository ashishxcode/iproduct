import React, {
	useRef,
	forwardRef,
	useState,
	useCallback,
	useImperativeHandle,
	useEffect,
} from 'react';
import {
	ViewerApp,
	AssetManagerPlugin,
	GBufferPlugin,
	ProgressivePlugin,
	TonemapPlugin,
	SSRPlugin,
	SSAOPlugin,
	BloomPlugin,
	GammaCorrectionPlugin,
	mobileAndTabletCheck,
} from 'webgi';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollAnimation } from '../lib/scroll-animation';

gsap.registerPlugin(ScrollTrigger);

const WebGIViewer = forwardRef((props, ref) => {
	const [viewer, setViewer] = useState(null);
	const [target, setTarget] = useState(null);
	const [camera, setCamera] = useState(null);
	const [position, setPosition] = useState(null);
	const [previewMode, setPreviewMode] = useState(false);

	const canvasRef = useRef(null);
	const canvasContainerRef = useRef(null);

	useImperativeHandle(ref, () => ({
		triggerPreview() {
			setPreviewMode(true);
			props.contentRef.current.style.opacity = 0;
			canvasContainerRef.current.style.pointerEvents = 'all';
			gsap.to(position, {
				x: 13.04,
				y: -2.01,
				z: 2.29,
				duration: 2,
				onUpdate: () => {
					viewer.setDirty();
					camera.positionTargetUpdated(true);
				},
			});

			gsap.to(target, {
				x: 0.11,
				y: 0.0,
				z: 0.0,
				duration: 2,
			});

			viewer.scene.activeCamera.setCameraOptions({
				controlsEnabled: true,
			});
		},
	}));
	const memorizedScrollAnimation = useCallback((position, target, onUpdate) => {
		if (position && target && onUpdate) {
			scrollAnimation({
				position,
				target,
				onUpdate,
			});
		}
	}, []);

	const setupViewer = useCallback(async () => {
		// Initialize the viewer
		const viewer = new ViewerApp({
			canvas: canvasRef.current,
		});

		// Set the viewer to the state
		setViewer(viewer);

		// Add some plugins
		const manager = await viewer.addPlugin(AssetManagerPlugin);

		const camera = viewer.scene.activeCamera;
		const position = camera.position;
		const target = camera.target;

		setCamera(camera);
		setPosition(position);
		setTarget(target);

		// Add plugins individually.
		await viewer.addPlugin(GBufferPlugin);
		await viewer.addPlugin(new ProgressivePlugin(32));
		await viewer.addPlugin(new TonemapPlugin(true));
		await viewer.addPlugin(GammaCorrectionPlugin);
		await viewer.addPlugin(SSRPlugin);
		await viewer.addPlugin(SSAOPlugin);
		await viewer.addPlugin(BloomPlugin);

		// This must be called once after all plugins are added.
		viewer.renderer.refreshPipeline();

		await manager.addFromPath('scene-black.glb');

		viewer.getPlugin(TonemapPlugin).config.clipBackground = true;

		viewer.scene.activeCamera.setCameraOptions({
			controlsEnabled: false,
		});

		window.scrollTo(0, 0);

		let needsUpdate = true;
		const onUpdate = () => {
			needsUpdate = true;
			viewer.setDirty();
		};
		viewer.addEventListener('preFrame', () => {
			if (needsUpdate) {
				camera.positionTargetUpdated(true);
				needsUpdate = false;
			}
		});

		memorizedScrollAnimation(position, target, onUpdate);
	}, []);

	useEffect(() => {
		setupViewer();
	}, []);

	const handleExit = useCallback(() => {
		canvasContainerRef.current.style.pointerEvents = 'none';
		props.contentRef.current.style.opacity = 1;
		viewer.scene.activeCamera.setCameraOptions({
			controlsEnabled: false,
		});
		setPreviewMode(false);

		gsap.to(position, {
			x: 1.56,
			y: 5.0,
			z: 0.011,
			scrollTrigger: {
				trigger: '.display-section',
				start: 'top bottom',
				end: 'top top',
				scrub: 2,
				immediateRender: false,
			},
			onUpdate: () => {
				viewer.setDirty();
				camera.positionTargetUpdated(true);
			},
		});
		gsap.to(target, {
			x: -0.55,
			y: 0.32,
			z: 0.0,
			scrollTrigger: {
				trigger: '.display-section',
				start: 'top bottom',
				end: 'top top',
				scrub: 2,
				immediateRender: false,
			},
		});
	}, [viewer, position, target, camera, canvasContainerRef]);

	return (
		<div ref={canvasContainerRef} id='webgi-canvas-container'>
			<canvas id='webgi-canvas' ref={canvasRef}></canvas>
			{previewMode && (
				<button className='button' onClick={handleExit}>
					Exit
				</button>
			)}
		</div>
	);
});

export default WebGIViewer;
