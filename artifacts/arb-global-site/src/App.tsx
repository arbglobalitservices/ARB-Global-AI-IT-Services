import { type FormEvent, type ReactNode, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Bot,
  BrainCircuit,
  Building2,
  Check,
  ChevronRight,
  CircleDollarSign,
  Cloud,
  CreditCard,
  Database,
  Landmark,
  LockKeyhole,
  LoaderCircle,
  Mail,
  Menu,
  MessageCircle,
  Network,
  Phone,
  ShieldCheck,
  Send,
  Smartphone,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

type Plan = {
  id: string;
  name: string;
  description: string;
  price: number;
  featured?: boolean;
};

const plans: Plan[] = [
  { id: '01', name: 'Starter Lite', description: 'A focused launchpad for a fast, credible web presence.', price: 20000 },
  { id: '02', name: 'Essential Web', description: 'A polished business website built for clarity and conversion.', price: 50000 },
  { id: '03', name: 'Professional Business', description: 'A complete business platform with stronger workflows and growth foundations.', price: 80000 },
  { id: '04', name: 'Enterprise Standard', description: 'A resilient enterprise site with a more capable operating layer.', price: 110000 },
  { id: '05', name: 'Advanced Corporate', description: 'Corporate-grade experience, content architecture, and integrations.', price: 140000 },
  { id: '06', name: 'AI Automated Portal', description: 'AI-assisted workflows, smart replies, and a client-facing portal.', price: 170000 },
  { id: '07', name: 'E-Commerce Engine', description: 'A commerce system engineered for products, payments, and scale.', price: 200000 },
  { id: '08', name: 'SaaS Platform Starter', description: 'The first product-grade SaaS foundation with secure user flows.', price: 230000 },
  { id: '09', name: 'SaaS Platform Pro', description: 'A deeper SaaS build with richer workflows, data, and automation.', price: 260000 },
  { id: '10', name: 'Global Enterprise Hub', description: 'A multi-market hub for global teams, clients, and operations.', price: 290000 },
  { id: '11', name: 'AI Voice & Agent Portal', description: 'Conversational AI, voice agents, and intelligent client journeys.', price: 320000 },
  { id: '12', name: 'Omnichannel AI Suite', description: 'Chat, WhatsApp, voice, support, and knowledge flows in one system.', price: 350000 },
  { id: '13', name: 'Custom FinTech Engine', description: 'Payment, currency, invoicing, and financial workflows built around your business.', price: 380000 },
  { id: '14', name: 'Ultra Enterprise Ecosystem', description: 'A connected enterprise experience across teams, portals, and infrastructure.', price: 410000 },
  { id: '15', name: 'Bespoke Custom AI Empire', description: 'Bespoke source code, custom AI models, dedicated cloud infrastructure, and 1-year SLA support.', price: 600000, featured: true },
];

const servicePillars = [
  {
    number: '01 / 05',
    icon: BrainCircuit,
    title: 'Artificial intelligence & automation',
    description: 'Custom LLM integrations, generative AI, machine learning pipelines, predictive analytics, and AI voice and chatbot ecosystems.',
    accent: 'AI DIVISION',
  },
  {
    number: '02 / 05',
    icon: Cloud,
    title: 'Enterprise web & software engineering',
    description: 'High-performance React and Next.js applications, Node.js services, microservices, APIs, custom ERP, and CRM development.',
    accent: 'IT DIVISION',
  },
  {
    number: '03 / 05',
    icon: LockKeyhole,
    title: 'Cloud & cyber security',
    description: 'AWS and GCP migrations, DevOps automation, CI/CD, zero-trust architecture, penetration testing, and security audits.',
    accent: 'CLOUD / SECURITY',
  },
  {
    number: '04 / 05',
    icon: CircleDollarSign,
    title: 'Global fintech & growth systems',
    description: 'Multi-currency pricing, Cashfree and ACH flows, GST/VAT invoicing, geo-IP personalization, SEO, estimators, and meeting booking.',
    accent: 'GLOBAL COMMERCE',
  },
  {
    number: '05 / 05',
    icon: Network,
    title: 'Enterprise operations & trust',
    description: 'AI proposals and e-sign contracts, client portals, help-desk tickets, affiliate referrals, uptime monitoring, and compliance surfaces.',
    accent: 'OPERATIONS',
  },
];

const domainRates = [
  ['.COM', 'Global commercial standard', '₹1,199 / year', 'WHOIS privacy + DNSSEC'],
  ['.AI', 'Artificial intelligence & tech startups', '₹6,999 / year', 'Premium tech identity + WHOIS shield'],
  ['.IN / .CO.IN', 'India national & regional business', '₹699 / year', 'Local SEO advantage + free DNS management'],
  ['.ORG / .NET', 'Organizations, networks & non-profits', '₹1,299 / year', 'Domain theft protection + email forwarding'],
  ['.IO / .TECH', 'SaaS, developers & high-tech portals', '₹3,499 / year', 'Full DNS control panel + Anycast routing'],
];

const hostingRates = [
  ['Cloud SSD Lite', '2 vCPU · 4GB RAM · 50GB NVMe', '₹4,999 / year', 'Starter websites · Plans 1–3'],
  ['Cloud Business Pro', '4 vCPU · 8GB RAM · 120GB NVMe · daily backups', '₹11,999 / year', 'E-commerce · Plans 4–7'],
  ['Dedicated AI Node', '8 vCPU · 16GB RAM · 250GB NVMe · GPU acceleration', '₹29,999 / year', 'SaaS + AI voice · Plans 8–12'],
  ['Enterprise Cluster', '16 vCPU · 32GB RAM · 1TB NVMe · load balancer + SLA', '₹69,999 / year', 'Fintech + AI empires · Plans 13–15'],
];

const securityRates = [
  ['Enterprise Wildcard SSL', '256-bit encryption for the main domain and unlimited subdomains', '₹2,499 / year'],
  ['Google Workspace / M365 Email', 'Professional custom-domain email', '₹2,880 / user / year'],
  ['Cloudflare Enterprise WAF', 'DDoS protection, edge CDN, and global rate limiting', '₹5,999 / year'],
  ['Automated Offsite Cloud Backup', 'Daily snapshots with a 30-day recovery point', '₹3,500 / year'],
];

const formatINR = (amount: number) =>
  `₹${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(amount)}`;

const formatUSD = (amount: number) =>
  `$${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Math.round(amount / 84))}`;

// Direct Render Backend API URL
const BACKEND_API_BASE = 'https://arb-global-ai-it-services.onrender.com/api';

const apiUrl = (path: string) => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${BACKEND_API_BASE}${cleanPath}`;
};

declare global {
  interface Window {
    Cashfree?: (options: { mode: 'sandbox' | 'production' }) => {
      checkout: (options: { paymentSessionId: string; redirectTarget: '_self' | '_blank' }) => Promise<unknown>;
    };
  }
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function GlobeScene() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef({ x: -1000, y: -1000 });
  const dragRef = useRef({ active: false, lastX: 0, longitude: 0 });
  const rotationAdjustRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    const ctx = context;
    const stars = Array.from({ length: 190 }, (_, index) => ({
      x: ((index * 73) % 997) / 997,
      y: ((index * 137) % 557) / 557,
      size: index % 11 === 0 ? 1.25 : 0.55 + (index % 3) * 0.25,
      alpha: 0.23 + (index % 6) / 15,
    }));
    const dots = [
      { lat: 51, lon: -0.1, color: '#62c8ff', label: 'LON' },
      { lat: 19, lon: 73, color: '#c88cff', label: 'BOM' },
      { lat: 35, lon: 139, color: '#62c8ff', label: 'TYO' },
      { lat: 40, lon: -74, color: '#c88cff', label: 'NYC' },
      { lat: -33, lon: 151, color: '#62c8ff', label: 'SYD' },
      { lat: 1, lon: 103, color: '#62c8ff', label: 'SIN' },
      { lat: 25, lon: 55, color: '#c88cff', label: 'DXB' },
    ];
    const continents = [
      [[72, -140], [60, -128], [50, -124], [38, -117], [26, -105], [18, -96], [28, -83], [42, -76], [54, -82], [65, -95]],
      [[14, -82], [6, -75], [-5, -78], [-18, -70], [-35, -65], [-55, -70], [-46, -52], [-20, -42], [4, -52]],
      [[70, -10], [61, 4], [52, 28], [41, 39], [30, 30], [18, 42], [5, 35], [-10, 17], [-28, 20], [-35, 4], [-15, -10], [5, -2], [32, -14]],
      [[34, 44], [26, 59], [20, 73], [8, 78], [22, 91], [29, 105], [45, 123], [62, 137], [70, 112], [54, 86], [45, 65]],
      [[-12, 113], [-22, 114], [-37, 130], [-31, 149], [-17, 153], [-10, 140]],
    ];
    const routes = [
      [0, 3], [0, 1], [1, 2], [1, 6], [2, 4], [3, 6], [6, 5], [5, 4], [0, 5],
    ];
    let raf = 0;
    let rotation = -0.52;
    let pulse = 0;
    let width = 0;
    let height = 0;
    let ratio = 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, width * ratio);
      canvas.height = Math.max(1, height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    const project = (lat: number, lon: number, centerX: number, centerY: number, radius: number) => {
      const longitude = (lon * Math.PI) / 180 + rotation + rotationAdjustRef.current;
      const latitude = (lat * Math.PI) / 180;
      const x = Math.cos(latitude) * Math.sin(longitude);
      const y = Math.sin(latitude);
      const z = Math.cos(latitude) * Math.cos(longitude);
      return { x: centerX + x * radius, y: centerY - y * radius, z };
    };
    const drawRoute = (a: { lat: number; lon: number }, b: { lat: number; lon: number }, centerX: number, centerY: number, radius: number, routeIndex: number) => {
      ctx.beginPath();
      let visible = false;
      for (let step = 0; step <= 30; step += 1) {
        const t = step / 30;
        const arc = Math.sin(Math.PI * t) * 0.08;
        const point = project(
          a.lat + (b.lat - a.lat) * t + arc * 100,
          a.lon + (b.lon - a.lon) * t,
          centerX,
          centerY,
          radius,
        );
        if (point.z > -0.08) {
          if (!visible) ctx.moveTo(point.x, point.y);
          else ctx.lineTo(point.x, point.y);
          visible = true;
        } else {
          visible = false;
        }
      }
      ctx.strokeStyle = routeIndex % 2 === 0 ? 'rgba(0,242,254,.44)' : 'rgba(255,215,0,.44)';
      ctx.lineWidth = 0.85;
      ctx.stroke();
      const movingT = ((pulse * 0.00016 + routeIndex * 0.117) % 1);
      const moving = project(
        a.lat + (b.lat - a.lat) * movingT + Math.sin(Math.PI * movingT) * 8,
        a.lon + (b.lon - a.lon) * movingT,
        centerX,
        centerY,
        radius,
      );
      if (moving.z > -0.05) {
        ctx.beginPath();
        ctx.fillStyle = routeIndex % 2 === 0 ? '#62c8ff' : '#c88cff';
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 10;
        ctx.arc(moving.x, moving.y, 2.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    };
    const draw = () => {
      if (!width || !height) resize();
      pulse += 16;
      if (!dragRef.current.active) rotation += 0.0011;
      ctx.clearRect(0, 0, width, height);
      const centerX = width * 0.52;
      const centerY = height * 0.49;
      const radius = Math.min(width, height) * (width < 500 ? 0.38 : 0.39);
      const cursor = pointerRef.current;
      stars.forEach((star) => {
        let x = star.x * width;
        let y = star.y * height;
        const distance = Math.hypot(x - cursor.x, y - cursor.y);
        if (distance < 90) {
          x += ((x - cursor.x) / Math.max(distance, 1)) * (90 - distance) * 0.11;
          y += ((y - cursor.y) / Math.max(distance, 1)) * (90 - distance) * 0.11;
        }
        ctx.fillStyle = `rgba(175,224,234,${star.alpha})`;
        ctx.fillRect(x, y, star.size, star.size);
      });
      const glow = ctx.createRadialGradient(centerX - radius * .26, centerY - radius * .29, radius * .05, centerX, centerY, radius * 1.1);
      glow.addColorStop(0, '#104358');
      glow.addColorStop(.48, '#082638');
      glow.addColorStop(.86, '#041523');
      glow.addColorStop(1, 'rgba(1,7,15,0)');
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 3, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.clip();
      for (let line = -60; line <= 60; line += 30) {
        ctx.beginPath();
        for (let step = -90; step <= 90; step += 3) {
          const lat = line + Math.sin((step / 45) + rotation * 1.2) * 2;
          const point = project(lat, step, centerX, centerY, radius);
          if (step === -90) ctx.moveTo(point.x, point.y); else ctx.lineTo(point.x, point.y);
        }
        ctx.strokeStyle = 'rgba(81,183,200,.13)';
        ctx.lineWidth = .55;
        ctx.stroke();
      }
      for (let longitude = -150; longitude <= 180; longitude += 30) {
        ctx.beginPath();
        for (let step = -90; step <= 90; step += 3) {
          const point = project(step, longitude, centerX, centerY, radius);
          if (step === -90) ctx.moveTo(point.x, point.y); else ctx.lineTo(point.x, point.y);
        }
        ctx.strokeStyle = 'rgba(81,183,200,.12)';
        ctx.lineWidth = .55;
        ctx.stroke();
      }
      continents.forEach((continent) => {
        ctx.beginPath();
        continent.forEach(([lat, lon], index) => {
          const point = project(lat, lon, centerX, centerY, radius);
          if (index === 0) ctx.moveTo(point.x, point.y); else ctx.lineTo(point.x, point.y);
        });
        ctx.closePath();
        ctx.fillStyle = 'rgba(24,92,91,.28)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(70,185,176,.21)';
        ctx.lineWidth = .65;
        ctx.stroke();
      });
      routes.forEach(([start, end], index) => drawRoute(dots[start], dots[end], centerX, centerY, radius, index));
      dots.forEach((dot) => {
        const point = project(dot.lat, dot.lon, centerX, centerY, radius);
        if (point.z < -0.08) return;
        ctx.beginPath();
        ctx.fillStyle = dot.color;
        ctx.shadowColor = dot.color;
        ctx.shadowBlur = 13;
        ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.strokeStyle = dot.color === '#c88cff' ? 'rgba(200,140,255,.28)' : 'rgba(98,200,255,.26)';
        ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
        ctx.stroke();
      });
      ctx.restore();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, -.65, Math.PI * .63);
      ctx.strokeStyle = 'rgba(0,242,254,.5)';
      ctx.lineWidth = 1.15;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 7, -.18, Math.PI * .42);
      ctx.strokeStyle = 'rgba(255,215,0,.42)';
      ctx.lineWidth = .7;
      ctx.stroke();
      raf = window.requestAnimationFrame(draw);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    draw();
    return () => {
      window.cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="globe-wrap" data-testid="globe-interactive">
      <canvas
        ref={canvasRef}
        className="globe-canvas"
        aria-label="Interactive global systems map"
        onPointerMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          pointerRef.current = { x: event.clientX - rect.left, y: event.clientY - rect.top };
          if (dragRef.current.active) {
            rotationAdjustRef.current += (event.clientX - dragRef.current.lastX) * 0.005;
            dragRef.current.lastX = event.clientX;
          }
        }}
        onPointerLeave={() => { pointerRef.current = { x: -1000, y: -1000 }; }}
        onPointerDown={(event) => {
          dragRef.current = { active: true, lastX: event.clientX, longitude: 0 };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerUp={(event) => {
          dragRef.current.active = false;
          event.currentTarget.releasePointerCapture(event.pointerId);
        }}
      />
      <div className="globe-readout"><span className="readout-dot" /> GLOBAL NETWORK / LIVE</div>
      <div className="globe-legend">
        <span className="legend-item"><i className="legend-dot" /> AI ROUTES</span>
        <span className="legend-item"><i className="legend-dot gold" /> CLOUD ROUTES</span>
      </div>
    </div>
  );
}

function ThreeGlobeScene() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const dragRef = useRef({ active: false, lastX: 0, lastY: 0 });
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
    camera.position.set(0, 0, 6);

    const probeCanvas = document.createElement('canvas');
    const hasWebGL = Boolean(
      probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl'),
    );
    if (!hasWebGL) {
      setWebglFailed(true);
      return () => undefined;
    }

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglFailed(true);
      return () => undefined;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.className = 'three-globe-canvas';
    renderer.domElement.setAttribute('aria-label', 'Interactive 3D globe with live global routes');
    mount.appendChild(renderer.domElement);

    const globe = new THREE.Group();
    scene.add(globe);

    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin('anonymous');
    const earthTexture = textureLoader.load(
      'https://threejs.org/examples/textures/land_ocean_ice_cloud_2048.jpg',
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
      },
    );

    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(1.48, 64, 48),
      new THREE.MeshPhongMaterial({
        color: 0x3a8ca0,
        emissive: 0x061c2b,
        emissiveIntensity: 0.55,
        map: earthTexture,
        shininess: 14,
      }),
    );
    globe.add(earth);

    const wireframe = new THREE.Mesh(
      new THREE.SphereGeometry(1.495, 32, 24),
      new THREE.MeshBasicMaterial({
        color: 0x55c7d1,
        transparent: true,
        opacity: 0.11,
        wireframe: true,
      }),
    );
    globe.add(wireframe);

    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.56, 48, 32),
      new THREE.MeshBasicMaterial({
        color: 0x00f2fe,
        transparent: true,
        opacity: 0.075,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
      }),
    );
    globe.add(atmosphere);

    const ambientLight = new THREE.AmbientLight(0x789bad, 1.5);
    scene.add(ambientLight);
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(-3, 2, 5);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight(0x00f2fe, 4, 12);
    rimLight.position.set(3, -1, 4);
    scene.add(rimLight);

    const starGroup = new THREE.Group();
    const starGeometry = new THREE.BufferGeometry();
    const baseStars: Array<{ x: number; y: number; z: number; size: number }> = [];
    const starPositions = new Float32Array(260 * 3);
    const starSizes = new Float32Array(260);
    for (let index = 0; index < 260; index += 1) {
      const angle = index * 2.39996;
      const radius = 2.8 + (index % 19) * 0.11;
      const x = Math.cos(angle) * (radius + (index % 7) * 0.08);
      const y = Math.sin(angle * 1.23) * (radius * 0.65);
      const z = -1.9 - (index % 23) * 0.11;
      baseStars.push({ x, y, z, size: 0.55 + (index % 4) * 0.28 });
      starPositions[index * 3] = x;
      starPositions[index * 3 + 1] = y;
      starPositions[index * 3 + 2] = z;
      starSizes[index] = 0.55 + (index % 4) * 0.28;
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));
    starGroup.add(
      new THREE.Points(
        starGeometry,
        new THREE.PointsMaterial({
          color: 0xb2e7ed,
          opacity: 0.62,
          size: 0.028,
          transparent: true,
          sizeAttenuation: true,
        }),
      ),
    );
    scene.add(starGroup);

    const nodes = [
      { lat: 51, lon: -0.1, color: 0x00f2fe },
      { lat: 19, lon: 73, color: 0xffd700 },
      { lat: 35, lon: 139, color: 0x00f2fe },
      { lat: 40, lon: -74, color: 0xffd700 },
      { lat: -33, lon: 151, color: 0x00f2fe },
      { lat: 1, lon: 103, color: 0x00f2fe },
      { lat: 25, lon: 55, color: 0xffd700 },
    ];
    const routes = [
      [0, 3],
      [0, 1],
      [1, 2],
      [1, 6],
      [2, 4],
      [3, 6],
      [6, 5],
      [5, 4],
      [0, 5],
    ] as const;

    const latLonToVector = (lat: number, lon: number, radius = 1.51) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      return new THREE.Vector3(
        -radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta),
      );
    };

    const routeCurve = (start: (typeof nodes)[number], end: (typeof nodes)[number]) => {
      const from = latLonToVector(start.lat, start.lon);
      const to = latLonToVector(end.lat, end.lon);
      const points = Array.from({ length: 33 }, (_, index) => {
        const progress = index / 32;
        return from
          .clone()
          .lerp(to, progress)
          .normalize()
          .multiplyScalar(1.51 + Math.sin(Math.PI * progress) * 0.2);
      });
      return new THREE.CatmullRomCurve3(points);
    };

    const movers: Array<{ mesh: THREE.Mesh; curve: THREE.CatmullRomCurve3; offset: number }> = [];
    routes.forEach(([fromIndex, toIndex], routeIndex) => {
      const color = routeIndex % 2 === 0 ? 0x00f2fe : 0xffd700;
      const curve = routeCurve(nodes[fromIndex], nodes[toIndex]);
      const lineMaterial = new THREE.LineBasicMaterial({
        color,
        opacity: 0.47,
        transparent: true,
      });
      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(curve.getPoints(72)),
        lineMaterial,
      );
      globe.add(line);

      const glowLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(curve.getPoints(72)),
        new THREE.LineBasicMaterial({ color, opacity: 0.1, transparent: true }),
      );
      glowLine.scale.setScalar(1.018);
      globe.add(glowLine);

      const movingDot = new THREE.Mesh(
        new THREE.SphereGeometry(0.035, 12, 8),
        new THREE.MeshBasicMaterial({ color }),
      );
      globe.add(movingDot);
      movers.push({ mesh: movingDot, curve, offset: routeIndex * 0.11 });
    });

    nodes.forEach((node) => {
      const marker = new THREE.Mesh(
        new THREE.SphereGeometry(0.043, 14, 10),
        new THREE.MeshBasicMaterial({ color: node.color }),
      );
      marker.position.copy(latLonToVector(node.lat, node.lon, 1.54));
      globe.add(marker);
      const halo = new THREE.Mesh(
        new THREE.RingGeometry(0.065, 0.075, 24),
        new THREE.MeshBasicMaterial({
          color: node.color,
          opacity: 0.55,
          side: THREE.DoubleSide,
          transparent: true,
        }),
      );
      halo.position.copy(marker.position.clone().normalize().multiplyScalar(1.56));
      halo.lookAt(halo.position.clone().multiplyScalar(2));
      globe.add(halo);
    });

    let animationFrame = 0;
    let elapsed = 0;
    const resize = () => {
      const { clientWidth, clientHeight } = mount;
      if (!clientWidth || !clientHeight) return;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight, false);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(mount);
    resize();

    const animate = () => {
      elapsed += 0.012;
      if (!dragRef.current.active) globe.rotation.y += 0.0018;
      globe.rotation.x += (pointerRef.current.y * 0.03 - globe.rotation.x) * 0.025;
      globe.rotation.z += (-pointerRef.current.x * 0.012 - globe.rotation.z) * 0.02;

      movers.forEach(({ mesh, curve, offset }) => {
        mesh.position.copy(curve.getPoint((elapsed * 0.075 + offset) % 1));
      });

      const positions = starGeometry.getAttribute('position') as THREE.BufferAttribute;
      baseStars.forEach((star, index) => {
        const dx = star.x / 4.2 - pointerRef.current.x;
        const dy = star.y / 3.2 - pointerRef.current.y;
        const distance = Math.max(Math.hypot(dx, dy), 0.001);
        const push = Math.max(0, 0.52 - distance) * 0.44;
        positions.setX(index, star.x + (dx / distance) * push);
        positions.setY(index, star.y + (dy / distance) * push);
      });
      positions.needsUpdate = true;
      starGroup.rotation.z = elapsed * 0.006;
      renderer.render(scene, camera);
      animationFrame = window.requestAnimationFrame(animate);
    };
    animate();

    const canvas = renderer.domElement;
    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerRef.current = {
        x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
        y: -(((event.clientY - rect.top) / rect.height) * 2 - 1),
      };
      if (dragRef.current.active) {
        globe.rotation.y += (event.clientX - dragRef.current.lastX) * 0.006;
        globe.rotation.x += (event.clientY - dragRef.current.lastY) * 0.003;
        dragRef.current.lastX = event.clientX;
        dragRef.current.lastY = event.clientY;
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      dragRef.current = { active: true, lastX: event.clientX, lastY: event.clientY };
      canvas.setPointerCapture(event.pointerId);
    };
    const onPointerUp = (event: PointerEvent) => {
      dragRef.current.active = false;
      if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    };
    const onPointerLeave = () => {
      pointerRef.current = { x: 0, y: 0 };
    };
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointerleave', onPointerLeave);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      observer.disconnect();
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointerleave', onPointerLeave);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Points) {
          object.geometry.dispose();
          const material = object.material;
          if (Array.isArray(material)) material.forEach((item) => item.dispose());
          else material.dispose();
        }
      });
      renderer.dispose();
      earthTexture.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  if (webglFailed) return <GlobeScene />;

  return (
    <div className="globe-wrap" data-testid="globe-interactive">
      <div ref={mountRef} className="three-globe-mount" />
      <div className="globe-readout"><span className="readout-dot" /> GLOBAL NETWORK / LIVE</div>
      <div className="globe-legend">
        <span className="legend-item"><i className="legend-dot" /> AI ROUTES</span>
        <span className="legend-item"><i className="legend-dot gold" /> CLOUD ROUTES</span>
      </div>
    </div>
  );
}

type BankDetails = {
  bankName: string;
  accountName: string;
  routingNumber: string;
  accountNumber: string;
  swiftCode: string;
};

type CustomerDetails = {
  name: string;
  email: string;
  phone: string;
};

function PaymentModal({ plan, onClose }: { plan: Plan; onClose: () => void }) {
  const [customer, setCustomer] = useState<CustomerDetails>({ name: '', email: '', phone: '' });
  const [bankDetails, setBankDetails] = useState<BankDetails | null>(null);
  const [bankError, setBankError] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [paymentState, setPaymentState] = useState<'idle' | 'loading' | 'redirecting'>('idle');

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  useEffect(() => {
    let active = true;
    fetch(apiUrl('/payment/bank-details'))
      .then(async (response) => {
        const data = await response.json() as BankDetails & { message?: string };
        if (!response.ok) throw new Error(data.message || 'Bank transfer details are unavailable.');
        if (active) setBankDetails(data);
      })
      .catch((error: unknown) => {
        if (active) setBankError(error instanceof Error ? error.message : 'Bank transfer details are unavailable.');
      });
    return () => { active = false; };
  }, []);

  const advance = Math.round(plan.price / 2);
  const updateCustomer = (field: keyof CustomerDetails, value: string) => {
    setCustomer((current) => ({ ...current, [field]: value }));
    setPaymentError('');
  };

  const startCashfree = async () => {
    if (!customer.name.trim() || !customer.email.trim() || !customer.phone.trim()) {
      setPaymentError('Please enter your name, email, and phone number before checkout.');
      return;
    }
    setPaymentState('loading');
    setPaymentError('');
    try {
      const response = await fetch(apiUrl('/payment/cashfree/order'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: plan.id,
          customer,
          returnUrl: window.location.href.split('?')[0],
        }),
      });
      const data = await response.json() as { paymentSessionId?: string; message?: string };
      if (!response.ok || !data.paymentSessionId) {
        throw new Error(data.message || 'Unable to start Cashfree checkout.');
      }
      if (!window.Cashfree) {
        throw new Error('Cashfree checkout is still loading. Please wait a moment and retry.');
      }
      setPaymentState('redirecting');
      const checkoutResult = await window.Cashfree({ mode: 'production' }).checkout({
        paymentSessionId: data.paymentSessionId,
        redirectTarget: '_self',
      });
      if (checkoutResult && typeof checkoutResult === 'object' && 'error' in checkoutResult) {
        const error = checkoutResult as { error?: { message?: string } };
        throw new Error(error.error?.message || 'Cashfree checkout was cancelled.');
      }
      setPaymentState('idle');
    } catch (error: unknown) {
      setPaymentState('idle');
      setPaymentError(error instanceof Error ? error.message : 'Unable to start Cashfree checkout.');
    }
  };

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}
      data-testid="payment-modal-backdrop"
    >
      <div className="payment-modal" role="dialog" aria-modal="true" aria-labelledby="payment-title" data-testid="payment-modal">
        <div className="modal-head">
          <div>
            <span className="eyebrow">RESERVE YOUR SLOT</span>
            <h2 id="payment-title">{plan.name}</h2>
          </div>
          <button className="modal-close" aria-label="Close payment modal" data-testid="button-close-payment" onClick={onClose}><X size={17} /></button>
        </div>
        <div className="payment-summary" data-testid="payment-summary">
          <div className="summary-cell"><span>Total project price</span><strong>{formatINR(plan.price)}</strong></div>
          <div className="summary-cell"><span>50% advance today</span><strong className="gold">{formatINR(advance)}</strong></div>
          <div className="summary-cell"><span>Balance after kickoff</span><strong>{formatINR(advance)}</strong></div>
        </div>
        <div className="customer-form">
          <div className="customer-form-heading"><span className="eyebrow">CHECKOUT DETAILS</span><span>Used only to create your secure order.</span></div>
          <div className="customer-fields">
            <label><span>Your name</span><input value={customer.name} onChange={(event) => updateCustomer('name', event.target.value)} placeholder="Abodh Raj Bhar" autoComplete="name" /></label>
            <label><span>Email</span><input type="email" value={customer.email} onChange={(event) => updateCustomer('email', event.target.value)} placeholder="you@company.com" autoComplete="email" /></label>
            <label><span>Phone</span><input type="tel" value={customer.phone} onChange={(event) => updateCustomer('phone', event.target.value)} placeholder="+91 8127968129" autoComplete="tel" /></label>
          </div>
        </div>
        <div className="payment-options">
          <div className="payment-option primary-option">
            <div className="option-title"><CircleDollarSign size={18} /> Cashfree checkout</div>
            <p className="option-description">Secure online checkout. Choose the method that works for your finance team.</p>
            <button className="cashfree-btn" data-testid="button-cashfree-payment" onClick={startCashfree} disabled={paymentState !== 'idle'}>
              {paymentState === 'loading' && <LoaderCircle size={14} className="spin" />}
              {paymentState === 'redirecting' ? 'Opening secure checkout…' : paymentState === 'loading' ? 'Creating secure order…' : `Pay Now Rs ${new Intl.NumberFormat('en-IN').format(advance)} via Cashfree`}
            </button>
            {paymentError && <p className="payment-error" role="alert">{paymentError}</p>}
            <div className="method-labels" aria-label="Available Cashfree methods">
              <span><Smartphone size={11} /> UPI</span>
              <span><Zap size={11} /> GPay</span>
              <span><Smartphone size={11} /> PhonePe</span>
              <span><CreditCard size={11} /> Paytm</span>
              <span><CreditCard size={11} /> Card</span>
              <span><Landmark size={11} /> Netbanking</span>
            </div>
          </div>
          <div className="payment-option">
            <div className="option-title"><Building2 size={18} /> ACH bank transfer</div>
            <p className="option-description">Prefer a direct transfer? Use these secure bank details and share your confirmation.</p>
            {bankDetails ? (
              <div className="bank-details" aria-label="Bank transfer details">
                <div><b>Bank</b> {bankDetails.bankName}</div>
                <div><b>Account name</b> {bankDetails.accountName}</div>
                <div><b>ACH routing number</b> {bankDetails.routingNumber}</div>
                <div><b>Account number</b> {bankDetails.accountNumber}</div>
                <div><b>SWIFT</b> {bankDetails.swiftCode}</div>
                <div><b>Reference</b> {plan.name.toUpperCase().replaceAll(' ', '-')} · {formatINR(advance)}</div>
              </div>
            ) : (
              <div className="bank-details bank-loading">{bankError || 'Loading bank transfer details…'}</div>
            )}
            <a className="whatsapp-btn" href="https://wa.me/918127968129" target="_blank" rel="noreferrer" data-testid="link-transfer-whatsapp">
              <MessageCircle size={15} /> I Transferred - Send on WhatsApp
            </a>
          </div>
        </div>
        <div className="modal-disclaimer"><ShieldCheck size={12} style={{ verticalAlign: 'middle', marginRight: 5 }} /> Your project slot is confirmed after the advance is received and acknowledged by our team.</div>
      </div>
    </div>
  );
}

function Header({ onOpenMenu, menuOpen }: { onOpenMenu: () => void; menuOpen: boolean }) {
  const navigate = (id: string) => scrollToId(id);
  return (
    <header className="topbar">
      <div className="container-x" style={{ display: 'flex', alignItems: 'center', width: 'min(1180px, calc(100% - 40px))' }}>
        <button 
  className="brand-lockup" 
  onClick={() => navigate('top')} 
  aria-label="ARB Global home" 
  data-testid="button-brand-home"
  style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
>
  <img className="brand-mark" src="/brand/arb-global-logo.jpg" alt="ARB Global AI & IT Services" />
  <span style={{ 
    fontWeight: 800, 
    fontSize: '0.98rem', 
    letterSpacing: '-0.02em',
    background: 'linear-gradient(90deg, #FFFFFF 0%, #D8B4FE 45%, #C084FC 75%, #A855F7 100%)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    color: 'transparent',
    display: 'inline-flex', 
    alignItems: 'baseline', 
    whiteSpace: 'nowrap' 
  }}>
    ARB Global AI &amp; IT Services
    <span style={{ 
      color: '#d946ef', 
      WebkitTextFillColor: '#d946ef', 
      fontWeight: 900, 
      fontSize: '1.25rem',
      lineHeight: '1',
      marginLeft: '1px'
    }}>•</span>
  </span>
</button>

        <nav className="nav-links" aria-label="Main navigation">
          <button onClick={() => navigate('capabilities')} data-testid="link-capabilities">Services</button>
          <button onClick={() => navigate('portfolio')} data-testid="link-approach">Portfolio</button>
          <button onClick={() => navigate('plans')} data-testid="link-plans">15 plans</button>
          <button onClick={() => navigate('contact')} data-testid="link-contact">Contact</button>
        </nav>
        <button className="nav-cta" onClick={() => navigate('plans')} data-testid="button-header-cta">Start a conversation <ArrowUpRight size={13} /></button>
        <button className="menu-button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={onOpenMenu} data-testid="button-mobile-menu">{menuOpen ? <X size={18} /> : <Menu size={18} />}</button>
      </div>
    </header>
  );
}

type ChatEntry = { role: 'user' | 'assistant'; content: string };

function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<ChatEntry[]>([
    { role: 'assistant', content: 'Hi — I’m the ARB Global assistant. Ask me about services, plans, pricing, payments, or the best next step for your project.' },
  ]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const sendMessage = async (event: FormEvent) => {
    event.preventDefault();
    const content = draft.trim();
    if (!content || sending) return;
    const history = messages.slice(-10);
    const userEntry: ChatEntry = { role: 'user', content };
    const assistantEntry: ChatEntry = { role: 'assistant', content: '' };
    setDraft('');
    setSending(true);
    setMessages((current) => [...current, userEntry, assistantEntry]);

    try {
      const response = await fetch(apiUrl('/chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
        body: JSON.stringify({ message: content, history }),
      });
      if (!response.ok || !response.body) {
        const data = await response.json().catch(() => ({})) as { message?: string };
        throw new Error(data.message || 'The assistant could not respond.');
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let finished = false;
      while (!finished) {
        const chunk = await reader.read();
        buffer += decoder.decode(chunk.value || new Uint8Array(), { stream: !chunk.done });
        const events = buffer.split('\n\n');
        buffer = events.pop() || '';
        for (const eventBlock of events) {
          const line = eventBlock.split('\n').find((item) => item.startsWith('data: '));
          if (!line) continue;
          const eventData = JSON.parse(line.slice(6)) as { content?: string; error?: string; done?: boolean };
          if (eventData.content) {
            setMessages((current) => {
              const next = [...current];
              const last = next[next.length - 1];
              if (last?.role === 'assistant') next[next.length - 1] = { ...last, content: last.content + eventData.content };
              return next;
            });
          }
          if (eventData.error) {
            setMessages((current) => {
              const next = [...current];
              const last = next[next.length - 1];
              if (last?.role === 'assistant') next[next.length - 1] = { ...last, content: eventData.error || '' };
              return next;
            });
          }
          if (eventData.done) finished = true;
        }
        if (chunk.done) finished = true;
      }
    } catch (error: unknown) {
      setMessages((current) => {
        const next = [...current];
        const last = next[next.length - 1];
        if (last?.role === 'assistant') next[next.length - 1] = {
          ...last,
          content: error instanceof Error ? error.message : 'Please contact ARB Global on WhatsApp for a fast response.',
        };
        return next;
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={`chat-assistant${open ? ' is-open' : ''}`}>
      {open && (
        <section className="chat-panel" aria-label="ARB Global AI assistant">
          <div className="chat-head">
            <div><span className="eyebrow">ARB / AI SUPPORT</span><strong>Ask ARB Global</strong></div>
            <button className="chat-close" onClick={() => setOpen(false)} aria-label="Close assistant"><X size={16} /></button>
          </div>
          <div className="chat-messages" aria-live="polite">
            {messages.map((message, index) => (
              <div className={`chat-bubble ${message.role}`} key={`${message.role}-${index}`}>
                {message.content || (sending && index === messages.length - 1 ? <LoaderCircle size={14} className="spin" /> : '')}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form className="chat-form" onSubmit={sendMessage}>
            <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Ask about plans or services…" aria-label="Message ARB Global assistant" maxLength={2000} />
            <button type="submit" disabled={sending || !draft.trim()} aria-label="Send message"><Send size={15} /></button>
          </form>
        </section>
      )}
      <button className="chat-launcher" onClick={() => setOpen((current) => !current)} aria-label={open ? 'Close ARB Global assistant' : 'Open ARB Global assistant'} data-testid="button-open-chat">
        {open ? <X size={19} /> : <Bot size={19} />}<span>{open ? 'Close' : 'Ask ARB'}</span>
      </button>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="hero-banner" aria-labelledby="hero-banner-heading" data-testid="hero-banner">
      <div className="hero-banner-inner">
        <h2 id="hero-banner-heading">
          ARB Global AI &amp; IT Services.<span className="hero-banner-dot" aria-hidden="true">•</span>
        </h2>
        <p>Abodh Raj Bhar | Global Artificial Intelligence &amp; Information of Technology Services</p>
      </div>
    </section>
  );
}

function Home() {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [paymentNotice, setPaymentNotice] = useState<{ kind: 'success' | 'error'; title: string; text: string; planId?: string } | null>(null);
  const openPlan = (plan: Plan) => {
    setPaymentNotice(null);
    setSelectedPlan(plan);
  };
  const closeModal = () => setSelectedPlan(null);
  const nav = (id: string) => { scrollToId(id); setMenuOpen(false); };

  useEffect(() => {
    const orderId = new URLSearchParams(window.location.search).get('cashfree_order_id');
    if (!orderId) return;
    const planId = orderId.split('_')[1]?.toUpperCase();
    let active = true;
    fetch(apiUrl(`/payment/cashfree/status/${encodeURIComponent(orderId)}`))
      .then(async (response) => {
        const data = await response.json() as { status?: string; message?: string };
        if (!response.ok) throw new Error(data.message || 'Unable to verify payment.');
        if (!active) return;
        if (data.status === 'PAID') {
          setPaymentNotice({ kind: 'success', title: 'Advance received', text: 'Your Cashfree payment was successful. The ARB Global team will contact you with the next steps.', planId });
        } else {
          setPaymentNotice({ kind: 'error', title: 'Payment not completed', text: 'Cashfree did not mark this order as paid. You can retry the advance or use ACH transfer below.', planId });
        }
      })
      .catch(() => {
        if (active) setPaymentNotice({ kind: 'error', title: 'Payment status pending', text: 'We could not verify this order yet. Please retry shortly or contact ARB Global on WhatsApp.', planId });
      })
      .finally(() => {
        window.history.replaceState({}, document.title, window.location.pathname);
      });
    return () => { active = false; };
  }, []);

  return (
    <div className="site-shell" id="top">
      <div className="noise" />
      <Header onOpenMenu={() => setMenuOpen((current) => !current)} menuOpen={menuOpen} />
      {paymentNotice && (
        <div className={`payment-notice ${paymentNotice.kind}`} role="status">
          <div><strong>{paymentNotice.title}</strong><span>{paymentNotice.text}</span></div>
          {paymentNotice.kind === 'error' && paymentNotice.planId && plans.find((plan) => plan.id === paymentNotice.planId) && (
            <button onClick={() => openPlan(plans.find((plan) => plan.id === paymentNotice.planId) as Plan)}>Retry payment</button>
          )}
          <button className="notice-close" onClick={() => setPaymentNotice(null)} aria-label="Dismiss payment status"><X size={15} /></button>
        </div>
      )}
      {menuOpen && (
        <div style={{ position: 'fixed', zIndex: 35, top: 66, left: 0, right: 0, padding: 22, borderBottom: '1px solid rgba(133,167,185,.15)', background: 'rgba(2,6,23,.97)' }}>
          {['capabilities', 'portfolio', 'infrastructure', 'plans', 'contact'].map((item) => (
            <button key={item} onClick={() => nav(item)} style={{ display: 'block', width: '100%', padding: '14px 0', textAlign: 'left', border: 0, borderBottom: '1px solid rgba(133,167,185,.11)', background: 'none', color: '#b4cbd2', font: '11px var(--app-font-mono)', textTransform: 'uppercase', letterSpacing: '.12em' }} data-testid={`mobile-link-${item}`}>{item}</button>
          ))}
        </div>
      )}
      <main>
        <section className="hero grid-fade" aria-labelledby="hero-heading">
          <div className="container-x">
            <div className="hero-copy">
              <span className="eyebrow">GLOBAL AI / ENTERPRISE IT / 01</span>
              <h1 id="hero-heading" className="display"><span className="gradient-text">Scale with</span><br />intelligence.</h1>
              <p className="hero-lede">Next-gen AI solutions and enterprise IT engineering for global business scale — from intelligent websites and SaaS platforms to cloud infrastructure, fintech, and autonomous agents.</p>
              <div className="hero-actions">
                <button className="primary-btn" onClick={() => scrollToId('plans')} data-testid="button-hero-explore">View all 15 plans <ArrowRight size={15} /></button>
                <button className="secondary-btn" onClick={() => scrollToId('capabilities')} data-testid="button-hero-capabilities">Explore services</button>
              </div>
              <div className="hero-proof">
                <div><strong>24/7</strong>AI &amp; support</div>
                <div><strong>6</strong>global languages</div>
                <div><strong>50%</strong>booking advance</div>
              </div>
            </div>
          </div>
          <ThreeGlobeScene />
          <div className="hero-bottomline" />
        </section>

        <HeroSection />

        <section className="section services-section" id="capabilities" aria-labelledby="capabilities-heading">
          <div className="container-x">
            <div className="section-head">
              <div><span className="eyebrow">SERVICES / 02</span><h2 id="capabilities-heading" className="section-title">One partner for<br /><span className="gold-text">the whole system.</span></h2></div>
              <p className="section-note">From AI and custom software to cloud, security, fintech, and growth infrastructure, ARB Global brings the pieces together.</p>
            </div>
            <div className="service-grid">
              {servicePillars.map((service) => {
                const Icon = service.icon;
                return <article className="service-card" key={service.number}><span className="service-number">{service.number}</span><div className="service-icon"><Icon size={21} /></div><span className="service-kicker">{service.accent}</span><h3>{service.title}</h3><p>{service.description}</p></article>;
              })}
            </div>
            <div className="service-ticker"><div className="ticker-panel"><span>OPERATING PRINCIPLE / 001</span><strong>Build once. Connect everything.</strong></div><div className="ticker-panel"><span>GLOBAL DELIVERY / NOW</span><strong style={{ color: '#62c8ff' }}>AI, cloud, fintech, and software in one motion <ArrowUpRight size={16} style={{ verticalAlign: 'middle', marginLeft: 6 }} /></strong></div></div>
          </div>
        </section>

        <section className="section signal-section" id="signal" aria-labelledby="signal-heading">
          <div className="container-x signal-layout">
            <div className="signal-copy"><span className="eyebrow">ENTERPRISE LAYER / 03</span><h2 id="signal-heading">The work behind<br /><span className="gradient-text">the wow.</span></h2><p>ARB Global combines a high-end front end with the operational systems that make a business easier to buy from, work with, and trust.</p><ul className="signal-list"><li><Check size={14} /> AI proposal generator + digital e-sign contracts</li><li><Check size={14} /> Client portal, live milestones, invoices, and help desk</li><li><Check size={14} /> Affiliate referrals with 10–20% commission tracking</li><li><Check size={14} /> Live uptime, SSL, GDPR, and Cloudflare edge protection</li></ul></div>
            <div className="system-panel" aria-label="ARB connected enterprise systems diagram"><div className="system-core"><Activity size={25} /></div><span className="system-label a">AUTONOMOUS AI</span><span className="system-label b">CLIENT PORTAL</span><span className="system-label c">GLOBAL FINTECH</span><div className="system-caption"><span>ARB / ENTERPRISE MAP</span><span>STATUS: 99.9% READY</span></div></div>
          </div>
        </section>

        <section className="section portfolio-section" id="portfolio" aria-labelledby="portfolio-heading">
          <div className="container-x">
            <div className="section-head"><div><span className="eyebrow">PORTFOLIO / 04</span><h2 id="portfolio-heading" className="section-title">Built for the<br /><span className="gold-text">markets ahead.</span></h2></div><p className="section-note">From payment rails to AI voice agents, the portfolio is designed around the real work your customers and teams need to do.</p></div>
            <div className="portfolio-grid">
              <article className="portfolio-card"><span className="portfolio-kicker">FINTECH / GLOBAL COMMERCE</span><h3>Payment experiences without borders.</h3><p>Cashfree for India, ACH and direct wire for global clients, multi-currency pricing, and automated GST/VAT invoice flows.</p><div className="portfolio-tags"><span>Cashfree</span><span>ACH</span><span>Multi-currency</span></div></article>
              <article className="portfolio-card"><span className="portfolio-kicker">AI / AUTONOMOUS AGENTS</span><h3>Systems that answer, qualify, and move.</h3><p>Multi-lingual smart chat, WhatsApp knowledge flows, outbound voice agents, and intelligent lead journeys for always-on conversion.</p><div className="portfolio-tags"><span>Chatbot</span><span>Voice AI</span><span>Hindi / English</span></div></article>
              <article className="portfolio-card"><span className="portfolio-kicker">SAAS / CLIENT PORTALS</span><h3>Products people can see working.</h3><p>Secure dashboards, live project progress, code commits, support tickets, invoices, and product-grade SaaS foundations.</p><div className="portfolio-tags"><span>React</span><span>Next.js</span><span>Node.js</span></div></article>
              <article className="portfolio-card"><span className="portfolio-kicker">CLOUD / TRUST / SEO</span><h3>Infrastructure that earns confidence.</h3><p>Cloud migrations, DevOps, zero-trust security, technical SEO, Cloudflare edge delivery, SSL, backups, and uptime visibility.</p><div className="portfolio-tags"><span>AWS / GCP</span><span>Cloudflare</span><span>99.9% uptime</span></div></article>
            </div>
            <div className="industries-row"><span>INDUSTRIES WE SERVE</span><b>FinTech</b><b>HealthTech</b><b>E-commerce</b><b>Logistics</b><b>Real Estate</b><b>SaaS</b></div>
          </div>
        </section>

        <section className="section infrastructure-section" id="infrastructure" aria-labelledby="infrastructure-heading">
          <div className="container-x">
            <div className="section-head"><div><span className="eyebrow">INFRASTRUCTURE / 05</span><h2 id="infrastructure-heading" className="section-title">Clear pricing for<br /><span className="gradient-text">the foundations.</span></h2></div><p className="section-note">Domain, hosting, email, security, and recovery are priced separately or bundled with Plans 8–15, exactly as outlined in the blueprint.</p></div>
            <div className="rate-grid">
              <div className="rate-card"><div className="rate-card-head"><span>DOMAINS / ANNUAL</span><strong>01</strong></div>{domainRates.map(([name, market, price, feature]) => <div className="rate-row" key={name}><div><b>{name}</b><small>{market}</small></div><strong>{price}</strong><em>{feature}</em></div>)}</div>
              <div className="rate-card"><div className="rate-card-head"><span>CLOUD HOSTING / ANNUAL</span><strong>02</strong></div>{hostingRates.map(([name, specs, price, ideal]) => <div className="rate-row" key={name}><div><b>{name}</b><small>{specs}</small></div><strong>{price}</strong><em>{ideal}</em></div>)}</div>
              <div className="rate-card"><div className="rate-card-head"><span>SECURITY ADD-ONS / ANNUAL</span><strong>03</strong></div>{securityRates.map(([name, specs, price]) => <div className="rate-row" key={name}><div><b>{name}</b><small>{specs}</small></div><strong>{price}</strong></div>)}</div>
            </div>
            <p className="infrastructure-note"><ShieldCheck size={14} /> Plan 15 includes one year of enterprise server hosting and free custom domain registration. Plans 8–15 may bundle hosting and domain costs; confirm the final scope in the proposal.</p>
          </div>
        </section>

        <section className="section plans-section" id="plans" aria-labelledby="plans-heading">
          <div className="container-x">
            <div className="section-head"><div><span className="eyebrow">OFFICIAL 15-TIER MATRIX / 06</span><h2 id="plans-heading" className="section-title">Choose the<br /><span className="gold-text">right altitude.</span></h2></div><p className="section-note">The official ARB Global structure runs from ₹20,000 to ₹6,00,000. A hard 50% advance starts every project; the remaining 50% is due at UAT before final deployment.</p></div>
            <div className="plan-grid">{plans.map((plan) => <article className={`plan-card${plan.featured ? ' featured' : ''}`} key={plan.id} data-testid={`card-plan-${plan.id}`}><span className="plan-code">ARB / {plan.id}</span>{plan.featured && <span className="plan-ribbon">Most selected</span>}<h3>{plan.name}</h3><p>{plan.description}</p><div className="plan-price">{formatINR(plan.price)} <span>approx. {formatUSD(plan.price)}</span></div><button className="plan-cta" onClick={() => openPlan(plan)} data-testid={`button-book-plan-${plan.id}`}>Book with 50% Advance <ChevronRight size={14} /></button></article>)}</div>
            <div className="pricing-foot"><span><ShieldCheck size={13} style={{ verticalAlign: 'middle', marginRight: 6, color: '#62c8ff' }} /> Hosting and domain are billed annually or bundled from Plans 8–15.</span><strong>15 official ways to start.</strong></div>
          </div>
        </section>

        <section className="section trust-section" aria-labelledby="trust-heading">
          <div className="container-x">
            <div className="section-head"><div><span className="eyebrow">THE ARB GLOBAL ECOSYSTEM / 07</span><h2 id="trust-heading" className="section-title">Global by design.<br /><span className="gradient-text">Human by default.</span></h2></div><p className="section-note">Founded by Abodh Raj Bhar, ARB Global AI &amp; IT Services is built to help international teams move from a hard problem to a credible next step.</p></div>
            <div className="logo-rail" aria-label="Client sectors"><span>FINTECH</span><span>HEALTHTECH</span><span>E-COMMERCE</span><span>LOGISTICS</span><span>SAAS</span></div>
            <div className="quote-grid"><div className="quote-card"><span className="quote-mark">“</span><blockquote>Next-gen AI solutions and enterprise IT engineering for global business scale.</blockquote><cite>— ARB GLOBAL AI &amp; IT SERVICES / ABODH RAJ BHAR</cite><div className="social-rail"><a href="https://instagram.com/arb_global_ai_it_services" target="_blank" rel="noreferrer">Instagram</a><a href="https://t.me/arbglobalaiitservices" target="_blank" rel="noreferrer">Telegram</a><a href="https://youtube.com/@arb_global_ai_it_services" target="_blank" rel="noreferrer">YouTube</a><a href="https://facebook.com/share/1HJMdQw8su/" target="_blank" rel="noreferrer">Facebook</a></div></div><div className="response-card"><div><span className="eyebrow">DIRECT SUPPORT</span><strong>24/7</strong><span>global AI + IT support architecture</span></div><p>Message the team on <a href="https://wa.me/918127968129" target="_blank" rel="noreferrer" style={{ color: "#62c8ff", textDecoration: "underline" }}>WhatsApp</a>, <a href="https://t.me/arbglobalaiitservices" target="_blank" rel="noreferrer" style={{ color: "#62c8ff", textDecoration: "underline" }}>Telegram</a>, or email <a href="mailto:arbglobalitservices@gmail.com" style={{ color: "#62c8ff", textDecoration: "underline" }}>arbglobalitservices@gmail.com</a> for a discovery conversation.</p></div></div>
          </div>
        </section>
      </main>
      <footer className="footer" id="contact">
        <div className="container-x">
          <div className="footer-main"><div className="footer-copy"><span className="eyebrow">THE NEXT SIGNAL</span><h2>Ready when<br /><span className="gold-text">you are.</span></h2><p>Bring us the hard problem, the ambitious deadline, or the system you know should work better. ARB Global will map the right plan, stack, and next move.</p></div><div className="footer-contact"><a className="contact-item" href="https://wa.me/918127968129" target="_blank" rel="noreferrer" data-testid="link-footer-whatsapp"><MessageCircle size={16} /> WhatsApp support</a><a className="contact-item" href="tel:+918127968129" data-testid="link-footer-phone"><Phone size={16} /> +91 8127968129</a><a className="contact-item" href="mailto:arbglobalitservices@gmail.com" data-testid="link-footer-email"><Mail size={16} /> arbglobalitservices@gmail.com</a><span className="contact-item"><Sparkles size={16} /> Team will call in 60 sec</span></div></div>
          <div className="footer-bottom"><span>© 2026 ARB GLOBAL AI &amp; IT SERVICES</span><span>AI / CLOUD / AUTONOMOUS SYSTEMS / GLOBAL DELIVERY</span></div>
        </div>
      </footer>
      {selectedPlan && <PaymentModal plan={selectedPlan} onClose={closeModal} />}
      <ChatAssistant />
    </div>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
