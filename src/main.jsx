import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import * as THREE from 'three';

const projects = [
    {
        id: 'insightforge',
        status: 'SHIPPED / LIVE DEMO',
        title: <>InsightForge <span>AI</span></>,
        kicker: 'Personalized Career Report',
        description: 'A focused Next.js application that turns a structured career profile into a useful growth report, with server-side Claude integration and a deliberately dependable local experience.',
        notes: [
            ['Architecture', <>Browser form → <code>POST /api/generate</code> → validation → Anthropic Messages API → formatted report</>],
            ['Decisions', 'Provider key stays server-side; malformed and oversized requests are rejected before the external call.'],
            ['Limitations', 'Rate limiting, persistence, auth, observability, and queues remain the next production hardening layer.'],
        ],
        tags: ['Next.js', 'Claude API', 'Validation'],
        demo: 'https://personalized-ai-report.vercel.app/',
        repo: 'https://github.com/tejaswaroop999/personalized-ai-report',
        featured: true,
    },
    {
        id: 'evaluation',
        status: 'IN DEVELOPMENT',
        title: <>LLM Evaluation<br />Platform</>,
        description: 'A backend MVP for repeatable model and prompt evaluation, with a provider boundary, sequential runs, and inspectable saved results.',
        notes: [
            ['Implemented', 'FastAPI schemas and dataset CRUD, echo and Anthropic providers, sequential runs, strict exact-match scoring, and SQLite run snapshots.'],
            ['Evidence', 'Per-case latency and available token usage, run list/detail APIs, automated tests, CI, and a reproducible synthetic prompt comparison.'],
            ['Limitations', 'Dataset edits remain in memory; runs are synchronous. No auth, rate limiting, dashboard, or semantic-quality evaluator yet.'],
        ],
        tags: ['Python', 'FastAPI', 'SQLite', 'Pytest'],
        repo: 'https://github.com/tejaswaroop999/llm-evaluation-platform',
    },
    {
        id: 'crypto',
        status: 'SHIPPED / LIVE DASHBOARD',
        title: <>Crypto Analytics<br />Dashboard</>,
        kicker: 'Bitcoin market signals, at a glance',
        description: 'A React dashboard that fetches current Bitcoin market information and organizes it into metric cards and time-series visualizations.',
        notes: [
            ['Dashboard', 'Current price, 24-hour high/low and change, market cap, volume, supply, all-time high, and sentiment data when available.'],
            ['Data flow', 'CoinGecko API responses feed reusable React components and ApexCharts visualizations.'],
            ['Stack', 'React 18, JavaScript, CoinGecko API, ApexCharts, and React ApexCharts.'],
        ],
        tags: ['React', 'CoinGecko API', 'ApexCharts'],
        demo: 'https://cryptoanalytic.netlify.app/',
        repo: 'https://github.com/tejaswaroop999/Cryptocurrency-Analytics-Dashboard',
        preview: 'crypto',
    },
    {
        id: 'shoematch',
        status: 'SHIPPED / RULE-BASED MVP',
        title: 'ShoeMatch',
        kicker: 'Your closet, considered',
        description: 'A Next.js app that helps people choose shoes they already own, using explainable, metadata-driven matching instead of pretending the MVP has image AI.',
        notes: [
            ['Implemented', 'Local shoe closet with add/edit/delete, filters, outfit preview, color and occasion selection, best-match alternatives, and local match history.'],
            ['Approach', 'Rule-based reasons with local feedback and bounded personalization; analytics is an abstraction for a future provider.'],
            ['Limitations', 'Photos and data stay in browser storage. No automatic outfit-photo analysis, cloud accounts, live products, or affiliate links.'],
        ],
        tags: ['Next.js', 'TypeScript', 'Tailwind', 'localStorage'],
        demo: 'https://shoe-match-psi.vercel.app/',
        repo: 'https://github.com/tejaswaroop999/ShoeMatch',
    },
    {
        id: 'built-byteja',
        status: 'LIVE STOREFRONT',
        title: 'Built Byteja',
        kicker: 'Engineering field guides & career resources',
        description: 'A lightweight storefront for practical resources, led by a production AI agent checklist and supported by focused software-engineering career guides.',
        notes: [
            ['Featured', 'The Production AI Agent Checklist covers architecture, tools, retries, queues, memory, observability, evaluations, and security boundaries.'],
            ['Delivery', 'Product pages route to the Built Byteja Gumroad storefront; the public repository is a single-page HTML implementation.'],
            ['Scope', 'A product storefront and content project, distinct from the AI applications and evaluation tooling elsewhere in this portfolio.'],
        ],
        tags: ['HTML', 'CSS', 'Vercel', 'Gumroad'],
        demo: 'https://built-byteja-store.vercel.app/',
        repo: 'https://github.com/tejaswaroop999/built-byteja-store',
        preview: 'store',
    },
    {
        id: 'resume-analyzer',
        status: 'ML / NLP',
        title: <>AI-Powered<br />Resume Analyzer</>,
        description: 'An NLP application that compares resumes with job descriptions and returns targeted improvement suggestions, connecting practical backend processing with ML experimentation.',
        notes: [
            ['Built with', 'Python, Flask, TensorFlow, and NLP workflows for extracting and comparing resume and role information.'],
            ['Focus', 'Make job-search feedback more specific, actionable, and grounded in the source documents.'],
        ],
        tags: ['Python', 'Flask', 'TensorFlow'],
    },
];

const experience = [
    { date: 'Aug 2025 - Present', role: 'AI Training Data Engineer', company: 'Turing', location: 'Remote', detail: 'Designed algorithmic tasks and validation data for LLM reasoning, code-generation quality, robustness, and failure modes. Generated and validated 200K+ test cases across correctness, edge cases, and adversarial scenarios.' },
    { date: 'Aug 2024 - Present', role: 'Founder & AI Product Engineer', company: 'Infrona', location: 'Remote', detail: 'Built AI applications, automation systems, dashboards, chatbots, resume-analysis tools, and lead-generation products. Owned architecture across frontend, backend APIs, data, AI integration, infrastructure, and deployment.' },
    { date: 'Aug 2025 - Present', role: 'Co-Founder & Lead Developer', company: 'FourHead Socials', location: 'Remote', detail: 'Architected a full-stack clinic platform with appointment booking, admin dashboards, automated WhatsApp/SMS notifications, database design, hosting, domains, and production infrastructure.' },
    { date: 'Mar 2026 - Present', role: 'E-Commerce & Digital Growth Manager', company: 'Confidential D2C Wellness Brand', location: 'Hyderabad', detail: 'Built and launched a separate production AI astrology/numerology report product using Claude, React, and Next.js. Supported the wider business outcome of INR 28L+ gross sales and 700%+ growth in orders and returning customers.' },
    { date: 'Feb 2025 - Aug 2025', role: 'Software Engineer', company: 'CamelQ Software Solutions', detail: 'Designed scalable REST APIs and low-latency backend workflows, contributing to improvements that reduced feature rollout time by approximately 20%.' },
    { date: 'Jan 2024 - Jan 2025', role: 'Full Stack Developer', company: 'Schemax Export Tech Craft', detail: 'Developed React/NestJS applications and REST API integrations, improving frontend responsiveness and backend service delivery.' },
    { date: 'Jun 2024 - Dec 2024', role: 'Artificial Intelligence Developer', company: 'Internship Studio', location: 'Remote', detail: 'Built Python/Flask backend services and TensorFlow-based ML pipelines for AI and data-processing workflows.' },
];

const contributions = [
    { number: '01 / MERGED', organization: 'AgenTrust / Weight Custody Manifest', description: 'Handled missing and malformed CLI input files with concise errors and regression tests.', link: 'https://github.com/agentrust-io/weight-custody-manifest/pull/174', pull: 'PR #174' },
    { number: '02 / MERGED', organization: 'Turnback', description: 'Escaped gitignore metacharacters in workspace exclusions and tested wildcard/special-character paths.', link: 'https://github.com/MFaizR77/turnback/pull/30', pull: 'PR #30' },
];

function useReducedMotion() {
    const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    useEffect(() => {
        const media = window.matchMedia('(prefers-reduced-motion: reduce)');
        const update = () => setReduced(media.matches);
        media.addEventListener('change', update);
        return () => media.removeEventListener('change', update);
    }, []);
    return reduced;
}

function NetworkFallback() {
    return <div className="network-fallback" aria-hidden="true"><i /><i /><i /><i /><span /></div>;
}

function NetworkScene({ reducedMotion }) {
    const containerRef = useRef(null);
    const [webglUnavailable, setWebglUnavailable] = useState(false);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return undefined;

        let renderer;
        try {
            renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
        } catch {
            setWebglUnavailable(true);
            return undefined;
        }

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(38, 1, .1, 40);
        camera.position.set(0, 0, 6.2);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
        renderer.setClearColor(0x000000, 0);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.domElement.className = 'network-canvas';
        renderer.domElement.setAttribute('aria-hidden', 'true');
        container.appendChild(renderer.domElement);

        const sculpture = new THREE.Group();
        scene.add(sculpture);

        const core = new THREE.Mesh(
            new THREE.IcosahedronGeometry(.72, 2),
            new THREE.MeshBasicMaterial({ color: 0x17395a, wireframe: true, transparent: true, opacity: .8 }),
        );
        sculpture.add(core);

        const innerCore = new THREE.Mesh(
            new THREE.IcosahedronGeometry(.37, 1),
            new THREE.MeshBasicMaterial({ color: 0x4c9dff, wireframe: true, transparent: true, opacity: .4 }),
        );
        sculpture.add(innerCore);

        const nodeData = [
            { position: [-1.55, .85, .12], color: 0xc8e687, radius: .075 },
            { position: [1.45, .95, -.28], color: 0x4c9dff, radius: .09 },
            { position: [1.67, -.7, .24], color: 0x8cc5ff, radius: .065 },
            { position: [-1.38, -.95, -.2], color: 0xc8e687, radius: .08 },
            { position: [-.15, 1.55, .38], color: 0x8cc5ff, radius: .05 },
            { position: [.28, -1.5, -.3], color: 0x4c9dff, radius: .06 },
            { position: [-1.85, -.02, .32], color: 0x4c9dff, radius: .045 },
            { position: [1.95, .12, -.4], color: 0xc8e687, radius: .045 },
        ];
        const points = nodeData.map((node) => new THREE.Vector3(...node.position));
        const linePositions = [];
        points.forEach((point, index) => {
            linePositions.push(0, 0, 0, point.x, point.y, point.z);
            if (index < points.length - 1) {
                const next = points[(index + 1) % points.length];
                linePositions.push(point.x, point.y, point.z, next.x, next.y, next.z);
            }
        });
        const linesGeometry = new THREE.BufferGeometry();
        linesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
        const lines = new THREE.LineSegments(linesGeometry, new THREE.LineBasicMaterial({ color: 0x4c9dff, transparent: true, opacity: .28 }));
        sculpture.add(lines);

        const nodes = nodeData.map((node) => {
            const mesh = new THREE.Mesh(
                new THREE.SphereGeometry(node.radius, 18, 18),
                new THREE.MeshBasicMaterial({ color: node.color }),
            );
            mesh.position.set(...node.position);
            sculpture.add(mesh);
            return mesh;
        });

        const orbitA = new THREE.Mesh(
            new THREE.TorusGeometry(1.78, .006, 8, 120),
            new THREE.MeshBasicMaterial({ color: 0x4c9dff, transparent: true, opacity: .22 }),
        );
        orbitA.rotation.set(.72, .24, .18);
        sculpture.add(orbitA);
        const orbitB = new THREE.Mesh(
            new THREE.TorusGeometry(2.05, .004, 8, 120),
            new THREE.MeshBasicMaterial({ color: 0xc8e687, transparent: true, opacity: .17 }),
        );
        orbitB.rotation.set(-.9, -.3, .1);
        sculpture.add(orbitB);

        const starPositions = new Float32Array(300 * 3);
        for (let index = 0; index < starPositions.length; index += 3) {
            starPositions[index] = (Math.random() - .5) * 7;
            starPositions[index + 1] = (Math.random() - .5) * 5;
            starPositions[index + 2] = (Math.random() - .5) * 3 - 1;
        }
        const starGeometry = new THREE.BufferGeometry();
        starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        const stars = new THREE.Points(starGeometry, new THREE.PointsMaterial({ color: 0x8cc5ff, size: .012, transparent: true, opacity: .54 }));
        scene.add(stars);

        const pointer = new THREE.Vector2();
        const targetRotation = new THREE.Vector2();
        let frame = 0;
        let visible = true;
        let elapsed = 0;
        const onPointerMove = (event) => {
            const bounds = container.getBoundingClientRect();
            pointer.x = ((event.clientX - bounds.left) / bounds.width - .5) * 2;
            pointer.y = ((event.clientY - bounds.top) / bounds.height - .5) * 2;
            targetRotation.set(pointer.y * .18, pointer.x * .28);
        };
        const onPointerLeave = () => targetRotation.set(0, 0);
        const resize = () => {
            const { width, height } = container.getBoundingClientRect();
            if (!width || !height) return;
            camera.aspect = width / height;
            camera.position.z = width < 600 ? 7.2 : 6.2;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height, false);
            renderer.render(scene, camera);
        };
        const resizeAfterLayout = () => {
            resize();
            requestAnimationFrame(resize);
        };
        const visibilityObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
        visibilityObserver.observe(container);
        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(container);
        window.addEventListener('resize', resizeAfterLayout);
        container.addEventListener('pointermove', onPointerMove);
        container.addEventListener('pointerleave', onPointerLeave);

        const animate = () => {
            frame = requestAnimationFrame(animate);
            if (!visible) return;
            elapsed += .008;
            sculpture.rotation.x += (targetRotation.x + Math.sin(elapsed * .48) * .035 - sculpture.rotation.x) * .025;
            sculpture.rotation.y += (targetRotation.y + elapsed * .12 - sculpture.rotation.y) * .025;
            core.rotation.y -= .0018;
            innerCore.rotation.x += .0025;
            nodes.forEach((node, index) => {
                const pulse = 1 + Math.sin(elapsed * 1.8 + index * .8) * .12;
                node.scale.setScalar(pulse);
            });
            stars.rotation.y = Math.sin(elapsed * .18) * .035;
            renderer.render(scene, camera);
        };
        resize();
        if (!reducedMotion) animate();

        return () => {
            cancelAnimationFrame(frame);
            visibilityObserver.disconnect();
            resizeObserver.disconnect();
            window.removeEventListener('resize', resizeAfterLayout);
            container.removeEventListener('pointermove', onPointerMove);
            container.removeEventListener('pointerleave', onPointerLeave);
            scene.traverse((object) => {
                object.geometry?.dispose();
                if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose());
                else object.material?.dispose();
            });
            renderer.dispose();
            renderer.domElement.remove();
        };
    }, [reducedMotion]);

    return <div className={`network-wrap ${webglUnavailable ? 'network-wrap-fallback' : ''}`} ref={containerRef} role="img" aria-label="Three-dimensional interactive network showing inputs, models, tools, and evaluation">
        {webglUnavailable && <NetworkFallback />}
        <div className="network-label network-label-top">/ SYSTEM MAP <span>inputs → models → tools → evals</span></div>
        <div className="network-live"><span className="network-live-dot" /> 3D / WEBGL</div>
        <div className="network-legend"><span className="legend-dot" /> drag your pointer to explore the system map</div>
        <div className="network-tag network-tag-input">INPUTS</div>
        <div className="network-tag network-tag-model">MODELS</div>
        <div className="network-tag network-tag-tools">TOOLS</div>
        <div className="network-tag network-tag-eval">EVALUATION</div>
    </div>;
}

function CryptoPreview() {
    return <div className="crypto-preview" aria-label="Crypto dashboard interface preview; live market values are shown on the demo">
        <div className="crypto-preview-head"><span><i /> BTC / USD</span><b>DASHBOARD PREVIEW</b><small>LIVE VALUES ON DEMO ↗</small></div>
        <div className="crypto-preview-layout">
            <div className="crypto-metrics"><div><span>CURRENT PRICE</span><b>—</b></div><div><span>24H CHANGE</span><b>—</b></div><div><span>MARKET CAP</span><b>—</b></div><div><span>VOLUME</span><b>—</b></div></div>
            <div className="crypto-chart-panel"><div className="crypto-chart-label"><span>MARKET TREND</span><b>1D　1W　1M</b></div><div className="crypto-chart">{Array.from({ length: 12 }, (_, index) => <span key={index} />)}</div><div className="crypto-chart-axis"><span>NOV</span><span>APR</span><span>OCT</span></div></div>
        </div>
    </div>;
}

function StorePreview() {
    return <div className="store-preview" aria-label="Visual preview of the Built Byteja storefront">
        <div className="store-preview-bar"><span className="store-preview-mark">b.</span><b>BUILT_BYTEJA</b><span>FIELD GUIDES FOR ENGINEERS</span><i>MENU +</i></div>
        <div className="store-preview-main"><div className="store-preview-copy"><span>START HERE / FEATURED GUIDE</span><strong>Ship AI agents<br />with fewer surprises.</strong><p>A field guide for real agent failures.</p><div className="store-preview-action">EXPLORE THE AI CHECKLIST <b>↗</b></div></div><div className="store-preview-cover"><span>50 CHECKS BEFORE YOU SHIP</span><b>THE PRODUCTION<br />AI AGENT<br />CHECKLIST</b><small>BUILT_BYTEJA / FIELD GUIDE 01</small></div></div>
        <div className="store-preview-foot"><span>ARCHITECTURE</span><span>TOOL SAFETY</span><span>FAILURE HANDLING</span><span>EVALS</span><span>SECURITY</span></div>
    </div>;
}

function ProjectCard({ project, index }) {
    const classes = ['project-card', 'tilt-card', 'reveal'];
    if (project.featured) classes.push('project-featured');
    if (project.id === 'built-byteja') classes.push('project-store');
    if (project.id === 'resume-analyzer') classes.push('project-muted');
    return <article className={classes.join(' ')}>
        <div className="project-index">{String(index + 1).padStart(2, '0')} <span>{project.status}</span></div>
        {project.preview === 'crypto' && <CryptoPreview />}
        {project.preview === 'store' && <StorePreview />}
        <div className="project-body">
            <div className="project-title-row"><h3>{project.title}</h3>{project.demo && <a href={project.demo} target="_blank" rel="noreferrer" aria-label={`Open ${typeof project.title === 'string' ? project.title : 'project'} demo`}>↗</a>}</div>
            {project.kicker && <p className="project-kicker">{project.kicker}</p>}
            <p className="project-description">{project.description}</p>
            <div className="project-notes">{project.notes.map(([label, text]) => <div key={label}><b>{label}</b><span>{text}</span></div>)}</div>
            <div className="project-footer"><div className="tag-list">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                <div className="project-links">
                    {project.demo && <a className="text-link" href={project.demo} target="_blank" rel="noreferrer">{project.id === 'built-byteja' ? 'Live site' : 'Live demo'} <span>↗</span></a>}
                    {project.repo && <a className="text-link" href={project.repo} target="_blank" rel="noreferrer">Repository <span>↗</span></a>}
                </div>
            </div>
        </div>
    </article>;
}

function App() {
    const reducedMotion = useReducedMotion();
    const [activeSection, setActiveSection] = useState('');

    useEffect(() => {
        const updatePageChrome = () => {
            const scrollable = document.documentElement.scrollHeight - window.innerHeight;
            const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
            const bar = document.querySelector('#scroll-progress-bar');
            if (bar) bar.style.width = `${Math.min(progress, 100)}%`;
            const sections = ['work', 'experience', 'contact'];
            const current = [...sections].reverse().find((section) => document.querySelector(`#${section}`)?.getBoundingClientRect().top <= 160) || '';
            setActiveSection(current);
        };
        const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        }), { threshold: .12 });
        document.querySelectorAll('.reveal').forEach((element, index) => {
            element.style.transitionDelay = `${Math.min(index * 45, 360)}ms`;
            observer.observe(element);
        });
        const cards = document.querySelectorAll('.tilt-card');
        const onMove = (event) => {
            const card = event.currentTarget;
            const bounds = card.getBoundingClientRect();
            const rotateX = ((event.clientY - bounds.top) / bounds.height - .5) * -2.2;
            const rotateY = ((event.clientX - bounds.left) / bounds.width - .5) * 2.2;
            card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        };
        const onLeave = (event) => { event.currentTarget.style.transform = ''; };
        if (!reducedMotion && window.matchMedia('(hover: hover)').matches) {
            cards.forEach((card) => {
                card.addEventListener('pointermove', onMove);
                card.addEventListener('pointerleave', onLeave);
            });
        }
        window.addEventListener('scroll', updatePageChrome, { passive: true });
        window.addEventListener('resize', updatePageChrome);
        updatePageChrome();
        return () => {
            observer.disconnect();
            window.removeEventListener('scroll', updatePageChrome);
            window.removeEventListener('resize', updatePageChrome);
            cards.forEach((card) => {
                card.removeEventListener('pointermove', onMove);
                card.removeEventListener('pointerleave', onLeave);
            });
        };
    }, [reducedMotion]);

    return <>
        <div className="noise" aria-hidden="true" />
        <div className="scroll-progress" aria-hidden="true"><span id="scroll-progress-bar" /></div>
        <header className="site-header">
            <a className="wordmark" href="#top" aria-label="Teja Swaroop Korupolu home"><span className="wordmark-mark">TSK</span><span className="wordmark-name">Teja Swaroop Korupolu</span></a>
            <nav className="nav-links" aria-label="Primary navigation">
                <a className={activeSection === 'work' ? 'is-active' : ''} href="#work">Work</a>
                <a className={activeSection === 'experience' ? 'is-active' : ''} href="#experience">Experience</a>
                <a className={activeSection === 'contact' ? 'is-active' : ''} href="#contact">Contact</a>
            </nav>
            <a className="header-status" href="mailto:tejaswaroop123456@gmail.com"><span /> Available for thoughtful builds</a>
        </header>
        <main id="top">
            <section className="hero page-shell reveal">
                <div className="hero-copy">
                    <p className="eyebrow"><span className="eyebrow-line" /> Applied AI Engineer / Hyderabad, India</p>
                    <h1>I build AI products <em>and the systems behind them.</em></h1>
                    <p className="hero-description">Applied AI Engineer working across LLM applications, model evaluation, backend systems, and full-stack product development.</p>
                    <div className="hero-actions"><a className="button button-primary" href="#work">Explore projects <span>→</span></a><a className="button button-ghost" href="./assets/Teja-Swaroop-Korupolu-Resume.pdf" download>Download resume <span className="download-glyph">↓</span></a></div>
                    <div className="hero-meta"><span>Currently at Turing</span><span className="meta-separator">/</span><span>Building at Infrona</span></div>
                </div>
                <NetworkScene reducedMotion={reducedMotion} />
            </section>
            <section className="signal-strip page-shell reveal" aria-label="Focus areas">
                <div><span className="strip-index">01</span><strong>Production LLMs</strong><small>from prompt to product</small></div>
                <div><span className="strip-index">02</span><strong>Evaluation systems</strong><small>reliable by design</small></div>
                <div><span className="strip-index">03</span><strong>Full-stack delivery</strong><small>APIs to interface</small></div>
            </section>
            <section className="work-section page-shell" id="work">
                <div className="section-heading reveal"><p className="eyebrow"><span className="eyebrow-line" /> Selected work</p><h2>Proof over promises.</h2><p>Small, focused systems that make the engineering choices legible.</p></div>
                <div className="project-grid">{projects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}</div>
                <section className="contributions reveal" aria-labelledby="contributions-title">
                    <div className="contributions-heading"><p className="eyebrow"><span className="eyebrow-line" /> Open-source contributions</p><h3 id="contributions-title">Small fixes. Better edges.</h3></div>
                    <div className="contribution-list">{contributions.map((item) => <a className="contribution-item" href={item.link} target="_blank" rel="noreferrer" key={item.pull}><span className="contribution-number">{item.number}</span><span className="contribution-copy"><strong>{item.organization}</strong><small>{item.description}</small></span><span className="contribution-link">{item.pull} ↗</span></a>)}</div>
                </section>
            </section>
            <section className="experience-section page-shell" id="experience">
                <div className="section-heading reveal"><p className="eyebrow"><span className="eyebrow-line" /> Experience</p><h2>Many surfaces.<br /><em>One throughline.</em></h2><p>Engineering work across model evaluation, product systems, APIs, and growth-aware delivery. Dates overlap because the work did.</p></div>
                <div className="experience-list">{experience.map((item) => <div className={`experience-row reveal ${item.date.startsWith('Jun') || item.date.startsWith('Jan') || item.date.startsWith('Feb') ? 'experience-compact' : ''}`} key={`${item.company}-${item.role}`}><div className="experience-date">{item.date}</div><div className="experience-role"><h3>{item.role}</h3><p>{item.company}{item.location && <span> / {item.location}</span>}</p></div><div className="experience-detail">{item.detail}</div></div>)}</div>
            </section>
            <section className="toolkit-section page-shell reveal"><div className="toolkit-intro"><p className="eyebrow"><span className="eyebrow-line" /> Working toolkit</p><h2>Close to the model.<br /><em>Closer to the user.</em></h2></div><div className="toolkit-list"><div><b>AI / LLM</b><span>LangChain, LangGraph, Claude API, prompt engineering, agentic workflows, NLP, TensorFlow, PyTorch</span></div><div><b>Build</b><span>Python, TypeScript, JavaScript, React, Next.js, Node.js, NestJS, Flask, REST APIs</span></div><div><b>Ship</b><span>MongoDB, Supabase, Docker, GitHub Actions, Vercel, Netlify</span></div></div></section>
            <section className="contact-section page-shell" id="contact"><div className="contact-panel reveal"><div><p className="eyebrow"><span className="eyebrow-line" /> Contact</p><h2>Have a hard problem<br /><em>worth building?</em></h2></div><div className="contact-copy"><p>I like work where the model is only one part of the system. Tell me what needs to become more useful, reliable, or real.</p><a className="button button-primary" href="mailto:tejaswaroop123456@gmail.com">Start a conversation <span>→</span></a><div className="contact-links"><a href="mailto:tejaswaroop123456@gmail.com">Email</a><a href="https://github.com/tejaswaroop999" target="_blank" rel="noreferrer">GitHub</a><a href="https://www.linkedin.com/in/tejaswaroop999/" target="_blank" rel="noreferrer">LinkedIn</a></div></div></div></section>
        </main>
        <footer className="site-footer page-shell"><span>TSK / Applied AI Engineer</span><span>Built with intention in Hyderabad, India</span><span>© 2026</span></footer>
    </>;
}

createRoot(document.getElementById('root')).render(<App />);