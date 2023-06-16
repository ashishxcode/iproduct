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
	const [isMobile, setIsMobile] = useState(false);

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
	const memorizedScrollAnimation = useCallback(
		(position, target, isMobile, onUpdate) => {
			if (position && target && onUpdate) {
				scrollAnimation({
					position,
					target,
					isMobile,
					onUpdate,
				});
			}
		},
		[]
	);

	const setupViewer = useCallback(async () => {
		// Initialize the viewer
		const viewer = new ViewerApp({
			canvas: canvasRef.current,
		});

		// Set the viewer to the state
		setViewer(viewer);

		const isMobileOrTablet = mobileAndTabletCheck();

		setIsMobile(isMobileOrTablet);

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

		if (isMobileOrTablet) {
			position.set(-16.7, 1.17, 11.7);
			target.set(0, 1.37, 0);
			props.contentRef.current.className = 'mobile-or-tablet';
		}

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

		memorizedScrollAnimation(position, target, isMobile, onUpdate);
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
			x: !isMobile ? 1.56 : 9.36,
			y: !isMobile ? 5.0 : 10.95,
			z: !isMobile ? 0.011 : 0.09,
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
			x: !isMobile ? -0.55 : -1.62,
			y: !isMobile ? 0.32 : 0.02,
			z: !isMobile ? 0.0 : -0.06,
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
