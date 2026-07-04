# Loa Viva — Web oficial (edición PRO)

Landing de marca nivel campaña internacional para **Loa Viva**, agua funcional efervescente.
Fotografía de campaña de alto impacto (botellas fotorrealistas, equipo racing, atletas),
scrollytelling con GSAP, marketplace con carrito y simulaciones completas de testimonios y aliados.

## 🔗 En vivo

👉 `https://loaviva.github.io/loa-viva/`

## Qué incluye

- **Preloader** de marca + entrada coreografiada del hero.
- **Hero cinematográfico**: corredora nocturna full-bleed + botella fotorrealista flotante.
- **Manifiesto scrollytelling**: el texto se enciende palabra por palabra al hacer scroll.
- **Loa Viva Racing**: monoplaza nocturno, piloto (Thiago Vargas) y atleta BMX (Maya Quispe) — *equipo conceptual demo*.
- **Sabores** con switcher y fotografía real del trío por sabor.
- **Tienda/marketplace** con fotos reales, ratings, packs y **carrito lateral** (checkout demo).
- **Testimonios** de consumidores (carrusel) y **aliados comerciales** (sección distinta) — *simulados, marcados como demo*.
- **Distribución B2B** con formulario (demo) + CTA final + footer legal.

## Stack

HTML/CSS/JS vanilla + **GSAP 3 + ScrollTrigger** (CDN, con fallback si no carga).
Sin build: se sirve tal cual (GitHub Pages / cualquier estático).

```powershell
# preview local
powershell -ExecutionPolicy Bypass -File serve.ps1 -Port 4321
```

## Assets

`assets/*.jpg` — fotografía de campaña optimizada a JPEG. Branding "LOA VIVA" renderizado en
las imágenes. Reemplazar por fotografía real de producto cuando exista packaging físico.

## ⚠️ Simulaciones (reemplazar por datos reales)

Testimonios, aliados, equipo racing, precios, ratings, contacto/WhatsApp y redes son
**simulaciones de demostración**, marcadas como tales en la propia página.

---
Versiones anteriores: [`loa-viva-v1`](https://github.com/loaviva/loa-viva-v1) (diseño previo) ·
[`loa-viva-v2`](https://github.com/loaviva/loa-viva-v2) (Next.js).
