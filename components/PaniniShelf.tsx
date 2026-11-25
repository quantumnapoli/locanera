"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";

import { PANINI } from "@/lib/panini";

const SPACING = 1.52;
const SHELF_TOP = 0.0;
const CARD_WIDTH = 1.06;
const CARD_DEPTH = 0.17;

const MONO = '700 34px "Barlow Condensed", "Barlow", system-ui, sans-serif';
const DISPLAY = '900 96px "Frank Ruhl Libre", Georgia, serif';

type Rig = {
  group: THREE.Group;
  card: THREE.Mesh;
  panino: THREE.Mesh;
  shadow: THREE.Mesh;
  height: number;
  /** stato smorzato: sollevamento in hover, spinta in avanti in selezione */
  lift: number;
  push: number;
  fade: number;
  bob: number;
};

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") || canvas.getContext("webgl"))
    );
  } catch {
    return false;
  }
}

function makeCardTexture(index: number) {
  const item = PANINI[index];
  const w = 512;
  const h = Math.round((512 * item.height) / CARD_WIDTH);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = item.card;
  ctx.fillRect(0, 0, w, h);

  const sheen = ctx.createLinearGradient(0, 0, w, h);
  sheen.addColorStop(0, "rgba(255,255,255,0.16)");
  sheen.addColorStop(0.45, "rgba(255,255,255,0.02)");
  sheen.addColorStop(1, "rgba(0,0,0,0.24)");
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, w, h);

  // filetto interno, come una serigrafia a caldo
  ctx.strokeStyle = item.foil;
  ctx.globalAlpha = 0.5;
  ctx.lineWidth = 3;
  ctx.strokeRect(30, 30, w - 60, h - 60);
  ctx.globalAlpha = 0.22;
  ctx.strokeRect(44, 44, w - 88, h - 88);

  // motivo a timbro: sta dietro al panino, fa da fondale
  ctx.globalAlpha = 0.42;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(w / 2, h * 0.27, w * 0.27, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 0.2;
  ctx.beginPath();
  ctx.arc(w / 2, h * 0.27, w * 0.34, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Piede della scheda, costruito dal basso verso l'alto: prima il nome,
  // poi sopra di esso la riga e l'etichetta del volume. In questo ordine
  // l'etichetta non puo finire sotto una seconda riga del nome.
  ctx.fillStyle = "#fdf3e4";
  ctx.textAlign = "left";
  const words = item.name.toUpperCase().split(" ");
  const lines: string[] = [];
  let line = "";
  ctx.font = DISPLAY;
  words.forEach((word) => {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > w - 110 && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  });
  if (line) lines.push(line);

  const footerY = h - 40;
  const nameBottom = footerY - 34;
  // il panino copre i due terzi alti della scheda: nome ed etichetta devono
  // stare tutti sotto questa soglia, altrimenti finiscono nascosti dietro
  const safeTop = h * 0.68;
  const roomForName = nameBottom - safeTop - 46;
  let size = Math.max(26, Math.min(84, Math.floor(roomForName / (lines.length * 0.94))));
  while (
    lines.some((entry) => {
      ctx.font = DISPLAY.replace("96px", `${size}px`);
      return ctx.measureText(entry).width > w - 110;
    }) &&
    size > 26
  ) {
    size -= 3;
  }
  ctx.font = DISPLAY.replace("96px", `${size}px`);
  const lineHeight = size * 0.94;
  const nameTop = nameBottom - (lines.length - 1) * lineHeight - size * 0.78;
  lines.forEach((entry, i) => {
    ctx.fillText(entry, 56, nameBottom - (lines.length - 1 - i) * lineHeight);
  });

  // etichetta del volume, ancorata sopra il nome
  const labelY = nameTop - 20;
  ctx.fillStyle = item.foil;
  ctx.font = MONO.replace("34px", "24px");
  ctx.fillText(`N° ${item.volume}  ·  € ${item.price.toFixed(2).replace(".", ",")}`, 56, labelY);

  // riga di separazione sopra l'etichetta
  ctx.strokeStyle = item.foil;
  ctx.globalAlpha = 0.4;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(56, labelY - 30);
  ctx.lineTo(w - 56, labelY - 30);
  ctx.stroke();
  ctx.globalAlpha = 1;

  ctx.fillStyle = item.foil;
  ctx.font = MONO.replace("34px", "22px");
  ctx.globalAlpha = 0.85;
  ctx.fillText("L'OCA NERA", 56, footerY);
  ctx.textAlign = "right";
  ctx.fillText(item.tag.toUpperCase(), w - 56, footerY);
  ctx.globalAlpha = 1;

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function makeWoodTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);
  ctx.fillStyle = "#2a1a13";
  ctx.fillRect(0, 0, 1024, 256);
  for (let i = 0; i < 260; i += 1) {
    const y = Math.random() * 256;
    ctx.strokeStyle = `rgba(${120 + Math.random() * 70}, ${74 + Math.random() * 46}, ${
      46 + Math.random() * 30
    }, ${0.05 + Math.random() * 0.12})`;
    ctx.lineWidth = 0.6 + Math.random() * 2.6;
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= 1024; x += 64) {
      ctx.lineTo(x, y + Math.sin((x + i * 40) * 0.006) * 4);
    }
    ctx.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

function makeShadowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);
  const gradient = ctx.createRadialGradient(128, 128, 4, 128, 128, 126);
  gradient.addColorStop(0, "rgba(0,0,0,0.62)");
  gradient.addColorStop(0.55, "rgba(0,0,0,0.24)");
  gradient.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(canvas);
}

export default function PaniniShelf() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const apiRef = useRef<{
    select: (index: number) => void;
    setDetail: (open: boolean) => void;
  } | null>(null);

  const [ready, setReady] = useState(false);
  const [fallback, setFallback] = useState(false);
  const [selected, setSelected] = useState(0);
  const [detail, setDetail] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const [pointerPos, setPointerPos] = useState({ x: 0, y: 0 });

  const item = PANINI[selected];

  const select = useCallback((index: number) => {
    const next = ((index % PANINI.length) + PANINI.length) % PANINI.length;
    setSelected(next);
    apiRef.current?.select(next);
  }, []);

  const openDetail = useCallback(() => {
    setDetail(true);
    apiRef.current?.setDetail(true);
  }, []);

  const closeDetail = useCallback(() => {
    setDetail(false);
    apiRef.current?.setDetail(false);
  }, []);

  useEffect(() => {
    const mount = mountRef.current;
    const canvas = canvasRef.current;
    if (!mount || !canvas) return;

    if (!supportsWebGL()) {
      setFallback(true);
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.06;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x120b12, 7, 16);

    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 60);
    const cameraPos = new THREE.Vector3(0, 0.95, 4.05);
    const cameraTarget = new THREE.Vector3(0, 0.76, 0);
    camera.position.copy(cameraPos);

    // --- ambiente ---------------------------------------------------------
    const wall = new THREE.Mesh(
      new THREE.PlaneGeometry(46, 22),
      new THREE.MeshBasicMaterial({ color: 0x160d16 })
    );
    wall.position.set(0, 4, -6.4);
    scene.add(wall);

    const woodTexture = makeWoodTexture();
    woodTexture.repeat.set(6, 1);
    const board = new THREE.Mesh(
      new THREE.BoxGeometry(40, 0.34, 2.4),
      new THREE.MeshStandardMaterial({ map: woodTexture, roughness: 0.82, metalness: 0.04 })
    );
    board.position.set(0, SHELF_TOP - 0.17, 0);
    board.receiveShadow = true;
    scene.add(board);

    const lip = new THREE.Mesh(
      new THREE.BoxGeometry(40, 0.06, 0.06),
      new THREE.MeshStandardMaterial({ color: 0xc9a227, roughness: 0.38, metalness: 0.7 })
    );
    lip.position.set(0, SHELF_TOP - 0.02, 1.19);
    scene.add(lip);

    const hemi = new THREE.HemisphereLight(0xffe7a8, 0x0f0f0f, 0.85);
    scene.add(hemi);

    const key = new THREE.DirectionalLight(0xffe3c0, 2.5);
    key.position.set(2.6, 5.2, 4.2);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 20;
    key.shadow.camera.left = -8;
    key.shadow.camera.right = 8;
    key.shadow.camera.top = 6;
    key.shadow.camera.bottom = -3;
    key.shadow.bias = -0.0016;
    scene.add(key);

    const rim = new THREE.DirectionalLight(0xff7d1a, 1.5);
    rim.position.set(-4.4, 2.4, -2.6);
    scene.add(rim);

    const fill = new THREE.PointLight(0x4f7dff, 5, 16, 2);
    fill.position.set(-2.4, 1.8, 3.2);
    scene.add(fill);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // --- rigs -------------------------------------------------------------
    const shelf = new THREE.Group();
    scene.add(shelf);

    const shadowTexture = makeShadowTexture();
    const loader = new THREE.TextureLoader();
    const rigs: Rig[] = [];
    let pending = PANINI.length;

    PANINI.forEach((panino, index) => {
      const group = new THREE.Group();
      group.position.x = index * SPACING;
      shelf.add(group);

      const cardTexture = makeCardTexture(index);
      const side = new THREE.MeshStandardMaterial({
        color: new THREE.Color(panino.card).multiplyScalar(0.82),
        roughness: 0.72,
        metalness: 0.05,
        transparent: true
      });
      const face = new THREE.MeshStandardMaterial({
        map: cardTexture,
        roughness: 0.64,
        metalness: 0.06,
        transparent: true
      });
      const card = new THREE.Mesh(
        new THREE.BoxGeometry(CARD_WIDTH, panino.height, CARD_DEPTH),
        [side, side, side, side, face, side]
      );
      card.position.y = panino.height / 2;
      card.castShadow = true;
      card.receiveShadow = true;
      card.userData.index = index;
      group.add(card);

      // segnaposto 1x1: serve perche il materiale nasca gia con `map` definita,
      // altrimenti sostituirla dopo lascia il piano bianco
      const placeholder = document.createElement("canvas");
      placeholder.width = 1;
      placeholder.height = 1;
      const paninoMaterial = new THREE.MeshBasicMaterial({
        map: new THREE.CanvasTexture(placeholder),
        transparent: true,
        alphaTest: 0.04,
        depthWrite: false,
        toneMapped: false
      });
      const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), paninoMaterial);
      plane.position.set(0, panino.height * 0.69, CARD_DEPTH / 2 + 0.34);
      plane.userData.index = index;
      plane.userData.baseWidth = 1;
      plane.userData.baseHeight = 1;
      plane.visible = false;
      group.add(plane);

      loader
        .loadAsync(panino.image)
        .then((texture) => {
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
          paninoMaterial.map?.dispose();
          paninoMaterial.map = texture;
          paninoMaterial.needsUpdate = true;

          const aspect = texture.image.width / texture.image.height;
          // panino scontornato: più grande della foto, sborda dalla scheda
          const height = Math.min(panino.height * 0.56, 1.22 / aspect);
          plane.userData.baseWidth = height * aspect;
          plane.userData.baseHeight = height;
          plane.scale.set(height * aspect, height, 1);
          plane.visible = true;
        })
        .catch(() => {
          // se una foto non arriva la scheda resta comunque leggibile
        })
        .finally(() => {
          pending -= 1;
          if (pending <= 0) setReady(true);
        });

      const shadow = new THREE.Mesh(
        new THREE.PlaneGeometry(CARD_WIDTH * 2.1, 1.5),
        new THREE.MeshBasicMaterial({
          map: shadowTexture,
          transparent: true,
          opacity: 0.85,
          depthWrite: false
        })
      );
      shadow.rotation.x = -Math.PI / 2;
      shadow.position.set(0, SHELF_TOP + 0.012, 0.22);
      group.add(shadow);

      rigs.push({
        group,
        card,
        panino: plane,
        shadow,
        height: panino.height,
        lift: 0,
        push: 0,
        fade: 1,
        bob: index * 1.7
      });
    });

    // --- stato ------------------------------------------------------------
    const state = {
      selected: 0,
      hovered: -1,
      detail: false,
      shelfX: 0,
      shelfXTarget: 0,
      parallax: 0,
      parallaxTarget: 0,
      dragging: false,
      dragStartX: 0,
      dragStartShelf: 0,
      dragMoved: 0
    };

    const setSelectedInternal = (index: number) => {
      state.selected = index;
      state.shelfXTarget = -index * SPACING;
    };

    apiRef.current = {
      select: setSelectedInternal,
      setDetail: (open: boolean) => {
        state.detail = open;
      }
    };

    // --- puntatore --------------------------------------------------------
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let pointerInside = false;

    const pickIndex = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const targets = rigs.flatMap((rig) => [rig.card, rig.panino]);
      const hit = raycaster.intersectObjects(targets, false)[0];
      return hit ? (hit.object.userData.index as number) : -1;
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      state.parallaxTarget = ((event.clientX - rect.left) / rect.width - 0.5) * 2;

      if (state.dragging) {
        state.dragMoved = Math.max(state.dragMoved, Math.abs(event.clientX - state.dragStartX));
        const delta = ((event.clientX - state.dragStartX) / rect.width) * 7.4;
        state.shelfXTarget = state.dragStartShelf + delta;
        return;
      }
      if (state.detail) return;

      const index = pickIndex(event);
      state.hovered = index;
      setHovered(index >= 0 ? index : null);
      setPointerPos({ x: event.clientX - rect.left, y: event.clientY - rect.top });
      canvas.style.cursor = index >= 0 ? "pointer" : "grab";
    };

    const onPointerDown = (event: PointerEvent) => {
      if (state.detail) return;
      state.dragging = true;
      state.dragMoved = 0;
      state.dragStartX = event.clientX;
      state.dragStartShelf = state.shelfXTarget;
      canvas.setPointerCapture(event.pointerId);
      canvas.style.cursor = "grabbing";
    };

    const onPointerUp = (event: PointerEvent) => {
      if (!state.dragging) return;
      state.dragging = false;
      if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
      canvas.style.cursor = "grab";

      if (state.dragMoved < 6) {
        const index = pickIndex(event);
        if (index >= 0) {
          if (index === state.selected) {
            setDetail(true);
            state.detail = true;
          } else {
            setSelected(index);
            setSelectedInternal(index);
          }
        }
        return;
      }
      // snap allo slot piu vicino dopo il trascinamento
      const index = Math.round(-state.shelfXTarget / SPACING);
      const clamped = Math.max(0, Math.min(PANINI.length - 1, index));
      setSelected(clamped);
      setSelectedInternal(clamped);
    };

    const onPointerEnter = () => {
      pointerInside = true;
    };
    const onPointerLeave = () => {
      pointerInside = false;
      state.hovered = -1;
      state.parallaxTarget = 0;
      setHovered(null);
    };

    // scorrimento orizzontale (trackpad): non intercettiamo mai quello verticale,
    // cosi la pagina continua a scorrere normalmente
    const onWheel = (event: WheelEvent) => {
      if (state.detail) return;
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      event.preventDefault();
      const next = Math.max(
        0,
        Math.min(PANINI.length - 1, state.selected + (event.deltaX > 0 ? 1 : -1))
      );
      if (next !== state.selected) {
        setSelected(next);
        setSelectedInternal(next);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (!pointerInside && !state.detail) return;
      if (event.key === "Escape" && state.detail) {
        setDetail(false);
        state.detail = false;
        return;
      }
      if (state.detail) return;
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        const next = Math.max(
          0,
          Math.min(PANINI.length - 1, state.selected + (event.key === "ArrowRight" ? 1 : -1))
        );
        setSelected(next);
        setSelectedInternal(next);
      }
    };

    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointerenter", onPointerEnter);
    canvas.addEventListener("pointerleave", onPointerLeave);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);

    // --- resize -----------------------------------------------------------
    const resize = () => {
      const { clientWidth, clientHeight } = mount;
      if (!clientWidth || !clientHeight) return;
      renderer.setSize(clientWidth, clientHeight, false);
      camera.aspect = clientWidth / clientHeight;
      // su schermi stretti allarghiamo il campo, altrimenti le schede escono
      camera.fov = clientWidth < 760 ? 46 : clientWidth < 1100 ? 39 : 34;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(mount);
    resize();

    // --- loop -------------------------------------------------------------
    const clock = new THREE.Clock();
    let frame = 0;
    let visible = true;
    const visibility = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { rootMargin: "200px" }
    );
    visibility.observe(mount);

    const damp = THREE.MathUtils.damp;

    const tick = () => {
      frame = requestAnimationFrame(tick);
      const delta = Math.min(clock.getDelta(), 0.05);
      const time = clock.elapsedTime;
      if (!visible) return;

      state.shelfX = damp(state.shelfX, state.shelfXTarget, 6, delta);
      state.parallax = damp(state.parallax, state.parallaxTarget, 4, delta);
      shelf.position.x = state.shelfX;

      rigs.forEach((rig, index) => {
        const isSelected = index === state.selected;
        const isHovered = index === state.hovered;
        const isDetail = state.detail && isSelected;

        const liftTarget = isDetail ? 0.24 : isSelected ? 0.15 : isHovered ? 0.09 : 0;
        const pushTarget = isDetail ? 0.5 : isSelected ? 0.4 : isHovered ? 0.16 : 0;
        const fadeTarget = state.detail ? (isSelected ? 1 : 0.06) : 1;

        rig.lift = damp(rig.lift, liftTarget, 6, delta);
        rig.push = damp(rig.push, pushTarget, 6, delta);
        rig.fade = damp(rig.fade, fadeTarget, 7, delta);

        rig.group.position.y = rig.lift;
        rig.group.position.z = rig.push;

        // in dettaglio la scheda si sposta a sinistra per lasciare il pannello
        const detailShift = state.detail && isSelected ? -1.15 : 0;
        rig.group.position.x = damp(
          rig.group.position.x,
          index * SPACING + detailShift,
          6,
          delta
        );

        const tilt = isDetail ? -0.22 : isSelected ? -0.07 : 0;
        rig.card.rotation.x = damp(rig.card.rotation.x, tilt, 6, delta);
        rig.card.rotation.y = damp(
          rig.card.rotation.y,
          isDetail ? 0.24 : state.parallax * 0.07,
          5,
          delta
        );

        // il panino galleggia sopra la scheda
        const bobAmount = reduceMotion ? 0 : isDetail ? 0.075 : isSelected ? 0.045 : 0.022;
        const bobSpeed = isDetail ? 0.9 : 1.25;
        rig.panino.position.y =
          rig.height * (isDetail ? 0.72 : 0.69) +
          Math.sin(time * bobSpeed + rig.bob) * bobAmount;
        rig.panino.position.z = damp(
          rig.panino.position.z,
          CARD_DEPTH / 2 + (isDetail ? 0.46 : isSelected ? 0.44 : 0.34),
          6,
          delta
        );
        rig.panino.rotation.z = reduceMotion
          ? 0
          : Math.sin(time * 0.6 + rig.bob) * (isDetail ? 0.035 : 0.016);

        const paninoScale = isDetail ? 1.06 : isSelected ? 1.06 : 1;
        const current = (rig.panino.userData.scale as number) ?? 1;
        const next = damp(current, paninoScale, 6, delta);
        rig.panino.userData.scale = next;
        const baseWidth = (rig.panino.userData.baseWidth as number) ?? 1;
        const baseHeight = (rig.panino.userData.baseHeight as number) ?? 1;
        rig.panino.scale.set(baseWidth * next, baseHeight * next, 1);

        const materials = Array.isArray(rig.card.material)
          ? rig.card.material
          : [rig.card.material];
        materials.forEach((material) => {
          (material as THREE.Material).opacity = rig.fade;
        });
        (rig.panino.material as THREE.Material).opacity = rig.fade;
        // l'ombra resta appoggiata al ripiano mentre la scheda si solleva,
        // e si allarga sfumando come un contatto reale
        rig.shadow.position.y = SHELF_TOP + 0.012 - rig.group.position.y;
        rig.shadow.scale.set(1 + rig.lift * 0.85, 1 + rig.lift * 0.85, 1);
        (rig.shadow.material as THREE.Material).opacity =
          0.85 * rig.fade * (1 - Math.min(rig.lift * 0.9, 0.45));
      });

      // la camera si avvicina in modalita dettaglio
      const targetCam = state.detail
        ? new THREE.Vector3(-0.62, 1.0, 4.3)
        : new THREE.Vector3(state.parallax * 0.26, 0.95, 4.05);
      cameraPos.x = damp(cameraPos.x, targetCam.x, 4, delta);
      cameraPos.y = damp(cameraPos.y, targetCam.y, 4, delta);
      cameraPos.z = damp(cameraPos.z, targetCam.z, 4, delta);
      camera.position.copy(cameraPos);

      const focus = state.detail ? 0.86 : 0.76;
      cameraTarget.x = damp(cameraTarget.x, state.detail ? -0.6 : 0, 4, delta);
      cameraTarget.y = damp(cameraTarget.y, focus, 4, delta);
      camera.lookAt(cameraTarget);

      renderer.render(scene, camera);
    };
    tick();

    // fallback di sicurezza: se una texture non arriva, sblocchiamo comunque la UI
    const readyTimeout = window.setTimeout(() => setReady(true), 4000);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(readyTimeout);
      observer.disconnect();
      visibility.disconnect();
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointerenter", onPointerEnter);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      apiRef.current = null;
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const material = mesh.material;
        if (Array.isArray(material)) material.forEach((entry) => entry.dispose());
        else if (material) material.dispose();
      });
      renderer.dispose();
    };
  }, []);

  return (
    <section
      id="scaffale"
      className="relative flex min-h-screen min-h-[100dvh] scroll-mt-0 flex-col overflow-hidden bg-brand-black text-white"
    >
      <div className="absolute inset-0 grain opacity-[0.09]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,rgba(254,218,20,0.14),transparent_46%),radial-gradient(circle_at_12%_88%,rgba(15,59,46,0.35),transparent_40%)]" />

      <div className="section-shell relative pt-[max(6rem,calc(var(--site-header-offset)+0.5rem))]">
        <header className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-b border-white/10 pb-4">
          <h2 className="text-[clamp(1.6rem,3vw,2.6rem)] leading-none text-white">
            I nostri <span className="text-brand-gold">panini gourmet.</span>
          </h2>
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">
            trascina · frecce · clic per aprire
          </p>
        </header>
      </div>

      <div
        ref={mountRef}
        className="relative mt-4 min-h-0 w-full flex-1"
        aria-hidden={fallback}
      >
        <canvas
          ref={canvasRef}
          className={`block h-full w-full touch-pan-y transition-opacity duration-700 ${
            ready && !fallback ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* etichetta che segue il puntatore */}
        {hovered !== null && !detail && (
          <div
            className="pointer-events-none absolute z-20 -translate-y-1/2 translate-x-4 rounded-full border border-white/16 bg-black/62 px-4 py-2 backdrop-blur-md"
            style={{ left: pointerPos.x, top: pointerPos.y }}
          >
            <p className="text-[9px] uppercase tracking-[0.28em] text-white/50">
              N° {PANINI[hovered].volume}
            </p>
            <p className="text-sm font-black uppercase leading-none text-white">
              {PANINI[hovered].name}
            </p>
          </div>
        )}

        {!ready && !fallback && (
          <div className="absolute inset-0 grid place-items-center">
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-9 animate-pulse rounded-sm border border-white/40" />
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/45">
                Sto apparecchiando lo scaffale
              </p>
            </div>
          </div>
        )}

        {/* controlli minimi, sovrapposti alla scena */}
        <div
          className={`pointer-events-none absolute inset-x-0 bottom-5 z-20 flex justify-center transition-all duration-500 ${
            detail ? "translate-y-4 opacity-0" : "opacity-100"
          }`}
        >
          <div className="pointer-events-auto flex items-center gap-4 rounded-full border border-white/12 bg-black/45 py-2 pl-2 pr-4 backdrop-blur-xl">
            <button
              type="button"
              onClick={() => select(selected - 1)}
              aria-label="Panino precedente"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/14 text-white/75 transition hover:border-white hover:text-white"
            >
              <span aria-hidden="true">←</span>
            </button>

            <div className="min-w-[11rem] text-center">
              <p className="text-[9px] uppercase tracking-[0.3em] tabular-nums text-white/40">
                {String(selected + 1).padStart(2, "0")} / {String(PANINI.length).padStart(2, "0")}
              </p>
              <p className="truncate text-sm font-black uppercase leading-tight text-white">
                {item.name}
              </p>
            </div>

            <button
              type="button"
              onClick={() => select(selected + 1)}
              aria-label="Panino successivo"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/14 text-white/75 transition hover:border-white hover:text-white"
            >
              <span aria-hidden="true">→</span>
            </button>

            <span className="h-6 w-px bg-white/12" />

            <button
              type="button"
              onClick={openDetail}
              className="rounded-full bg-white px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-black transition hover:bg-brand-gold"
            >
              Apri la scheda
            </button>
          </div>
        </div>

        {/* pannello di dettaglio */}
        <aside
          role="dialog"
          aria-modal="false"
          aria-hidden={!detail}
          className={`absolute right-[clamp(1rem,5vw,5rem)] top-1/2 z-30 w-[min(30rem,86vw)] -translate-y-1/2 rounded-[2rem] border border-white/12 bg-black/62 p-7 backdrop-blur-2xl transition-all duration-500 md:p-9 ${
            detail
              ? "pointer-events-auto translate-x-0 opacity-100"
              : "pointer-events-none translate-x-6 opacity-0"
          }`}
        >
          <button
            type="button"
            onClick={closeDetail}
            aria-label="Chiudi la scheda"
            className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full border border-white/16 text-white/70 transition hover:border-white hover:text-white"
          >
            <span aria-hidden="true">✕</span>
          </button>

          <p className="font-label text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-gold">
            N° {item.volume} · {item.tag}
          </p>
          <h3 className="mt-4 text-[clamp(2rem,4vw,3.2rem)] leading-[0.95] text-white">
            {item.name}
          </h3>
          <p className="mt-5 text-base leading-relaxed text-white/62">{item.deck}</p>

          <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-white/12 pt-6">
            {Object.entries(item.meta).map(([label, value]) => (
              <div key={label}>
                <dt className="text-[9px] uppercase tracking-[0.28em] text-white/40">{label}</dt>
                <dd className="mt-2 text-sm text-white/82">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 flex flex-wrap gap-2 border-t border-white/12 pt-6">
            {item.ingredients.map((ingredient) => (
              <span
                key={ingredient}
                className="rounded-full border border-white/12 bg-white/6 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-white/70"
              >
                {ingredient}
              </span>
            ))}
          </div>
        </aside>
      </div>

      {/* catalogo statico: resta leggibile senza WebGL */}
      {fallback && (
        <div className="section-shell relative py-10">
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {PANINI.map((entry) => (
              <article
                key={entry.slug}
                className="rounded-[1.8rem] border border-white/10 p-6"
                style={{ background: entry.card }}
              >
                <div className="relative mx-auto aspect-square w-full max-w-[16rem]">
                  <Image
                    src={entry.image}
                    alt={entry.name}
                    fill
                    sizes="(min-width: 1280px) 22vw, (min-width: 640px) 44vw, 88vw"
                    className="object-contain drop-shadow-[0_24px_24px_rgba(0,0,0,0.5)]"
                  />
                </div>
                <p className="mt-4 text-[10px] uppercase tracking-[0.28em]" style={{ color: entry.foil }}>
                  N° {entry.volume} · € {entry.price.toFixed(2).replace(".", ",")}
                </p>
                <h3 className="mt-2 text-2xl leading-none text-white">{entry.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/64">{entry.note}</p>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
