"""
Genera el tráiler cinematográfico de «La Isla del Tesoro» (MP4 1280x720, ~60 s).

  python3 scripts/trailer/build_trailer.py <carpeta_videos_originales> <carpeta_fuentes> <salida.mp4>

- Tarjetas de texto: Pillow (Cinzel + Cormorant Garamond, dorado con brillo).
- Banda sonora: sintetizada con numpy (drone, "braams", golpes, pulsos, acorde final).
- Montaje, etalonaje, letterbox 2.39:1 y grano: ffmpeg.
"""
import os
import subprocess
import sys
import wave

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

SRC, FONTS, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
ROOT = os.path.dirname(os.path.abspath(__file__))
COVER = os.path.join(ROOT, "..", "..", "public", "media", "cover-flat.jpg")
WORK = "/tmp/trailer/work"
os.makedirs(WORK, exist_ok=True)

W, H, FPS = 1280, 720, 30
BAND = 536  # 2.39:1
GOLD_TOP, GOLD_BOT = (247, 226, 160), (196, 146, 62)

F_TITLE = os.path.join(FONTS, "f2.ttf")   # Cinzel ExtraBold
F_CAPS = os.path.join(FONTS, "f1.ttf")    # Cinzel Medium
F_ITAL = os.path.join(FONTS, "f3.ttf")    # Cormorant Garamond Italic
F_SANS = os.path.join(FONTS, "f4.ttf")    # Inter

CLIPS = {
    "olas": "18abac24-cd69ebb7-bc74-43d5-ae1d-84d6773c4fa5.mp4",
    "naufragio": "038d6613-f0b4074b-9332-45f2-bd18-180821135aa6.mp4",
    "barco": "949c3168-a18e2eee-5a1b-4ece-ac25-3db22769bb0b.mp4",
    "delfines": "9772c259-8cdef649-7591-4cd1-bdd9-6099e00bdf21.mp4",
    "atardecer": "ecfc5bfd-f6a3cc83-d595-47ff-9fbb-6979020c810b.mp4",
}


def run(cmd):
    subprocess.run(cmd, check=True)


# ---------------------------------------------------------------- tipografía
def text_layer(lines, size=(W, H), y_center=None):
    """lines: [(texto, fuente, tamaño, tracking, estilo)] estilo = gold | cream | dim"""
    img = Image.new("RGBA", size, (0, 0, 0, 0))
    mask_gold = Image.new("L", size, 0)
    mask_cream = Image.new("L", size, 0)
    blocks = []
    for text, font_path, px, tracking, style in lines:
        font = ImageFont.truetype(font_path, px)
        widths = [font.getlength(c) for c in text]
        total = sum(widths) + tracking * (len(text) - 1)
        asc, desc = font.getmetrics()
        blocks.append((text, font, widths, total, asc + desc, tracking, style))
    gap = 18
    total_h = sum(b[4] for b in blocks) + gap * (len(blocks) - 1)
    y = (y_center if y_center is not None else size[1] / 2) - total_h / 2
    for text, font, widths, total, lh, tracking, style in blocks:
        x = (size[0] - total) / 2
        target = mask_gold if style == "gold" else mask_cream
        d = ImageDraw.Draw(target)
        fill = 255 if style != "dim" else 150
        for c, cw in zip(text, widths):
            d.text((x, y), c, font=font, fill=fill)
            x += cw + tracking
        y += lh + gap

    grad = Image.new("RGBA", size)
    gd = ImageDraw.Draw(grad)
    for yy in range(size[1]):
        k = yy / size[1]
        k = (k * 3) % 1  # bandas repetidas = brillo metálico por línea
        col = tuple(int(GOLD_TOP[i] + (GOLD_BOT[i] - GOLD_TOP[i]) * k) for i in range(3))
        gd.line([(0, yy), (size[0], yy)], fill=col + (255,))

    # sombra + brillo
    both = Image.new("L", size, 0)
    both.paste(255, mask=mask_gold)
    both.paste(255, mask=mask_cream)
    shadow = Image.new("RGBA", size, (0, 0, 0, 255))
    shadow.putalpha(both.filter(ImageFilter.GaussianBlur(10)).point(lambda v: int(v * 0.8)))
    glow = Image.new("RGBA", size, (230, 170, 80, 255))
    glow.putalpha(mask_gold.filter(ImageFilter.GaussianBlur(14)).point(lambda v: int(v * 0.55)))
    img = Image.alpha_composite(img, shadow)
    img = Image.alpha_composite(img, glow)
    gold = grad.copy()
    gold.putalpha(mask_gold)
    cream = Image.new("RGBA", size, (245, 236, 220, 255))
    cream.putalpha(mask_cream)
    img = Image.alpha_composite(img, gold)
    img = Image.alpha_composite(img, cream)
    return img


def save_layer(name, lines, **kw):
    p = os.path.join(WORK, f"{name}.png")
    text_layer(lines, **kw).save(p)
    return p


def cover_frame(path, with_text):
    """Composición final: portada + resplandor + (opcional) título a la derecha."""
    bg = Image.new("RGBA", (W, H), (6, 9, 14, 255))
    halo = Image.new("L", (W, H), 0)
    hd = ImageDraw.Draw(halo)
    cx = 400 if with_text else W // 2
    hd.ellipse([cx - 360, 60, cx + 360, 660], fill=120)
    halo = halo.filter(ImageFilter.GaussianBlur(120))
    warm = Image.new("RGBA", (W, H), (200, 140, 60, 255))
    warm.putalpha(halo)
    bg = Image.alpha_composite(bg, warm)
    cov = Image.open(COVER).convert("RGBA")
    ch = 560
    cov = cov.resize((int(cov.width * ch / cov.height), ch), Image.LANCZOS)
    sh = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sm = Image.new("L", (W, H), 0)
    ImageDraw.Draw(sm).rectangle([cx - cov.width // 2 + 14, 96, cx + cov.width // 2 + 22, 96 + ch + 18], fill=230)
    sh.putalpha(sm.filter(ImageFilter.GaussianBlur(22)))
    bg = Image.alpha_composite(bg, sh)
    bg.alpha_composite(cov, (cx - cov.width // 2, (H - ch) // 2))
    if with_text:
        t = text_layer(
            [
                ("ROBERT LOUIS STEVENSON", F_CAPS, 20, 6, "cream"),
                ("LA ISLA", F_TITLE, 74, 4, "gold"),
                ("DEL TESORO", F_TITLE, 74, 4, "gold"),
                ("Léelo antes de que otro encuentre el tesoro.", F_ITAL, 30, 0, "cream"),
            ],
            size=(620, H),
        )
        bg.alpha_composite(t, (660, 0))
    bg.convert("RGB").save(path, quality=95)
    return path


# ---------------------------------------------------------------- segmentos
GRADE = "eq=contrast=1.12:saturation=0.9:gamma=0.95,colorbalance=rs=0.04:bs=-0.05:rh=0.06:bh=-0.04,vignette=PI/4.5"
GRAIN = "noise=alls=4:allf=t"
segments = []


def seg_video(name, clip, ss, dur, yc, layer=None, zoom=0.0016, flash=False, fade=True, dim=1.0):
    out = os.path.join(WORK, f"{len(segments):02d}_{name}.mp4")
    frames = int(round(dur * FPS))
    band_crop = f"crop=iw:iw/2.388:0:max(0\\,min(ih-iw/2.388\\,ih*{yc}-iw/2.388/2))"
    v = (
        f"[0:v]fps={FPS},{band_crop},scale=2560:1072,"
        f"zoompan=z='1+{zoom}*on':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=1:s=1280x{BAND}:fps={FPS},"
        f"setsar=1,{GRADE}"
    )
    if dim < 1:
        v += f",eq=brightness={-(1 - dim) * 0.35}:saturation=0.7"
    v += f",pad={W}:{H}:0:{(H - BAND) // 2}:black[v]"
    inputs = ["-ss", str(ss), "-t", str(dur + 0.2), "-i", os.path.join(SRC, CLIPS[clip])]
    fc = v
    last = "[v]"
    if layer:
        inputs += ["-loop", "1", "-t", str(dur), "-i", layer]
        fc += (
            f";[1:v]format=rgba,fade=t=in:st=0.35:d=0.7:alpha=1,"
            f"fade=t=out:st={dur - 0.85}:d=0.6:alpha=1[t];{last}[t]overlay=0:0[o]"
        )
        last = "[o]"
    post = [GRAIN]
    if flash:
        post.append("fade=t=in:st=0:d=0.18:color=white")
    elif fade:
        post.append("fade=t=in:st=0:d=0.4")
    if fade:
        post.append(f"fade=t=out:st={dur - 0.35}:d=0.35")
    fc += f";{last}{','.join(post)},format=yuv420p[out]"
    run(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", fc, "-map", "[out]",
         "-frames:v", str(frames), "-r", str(FPS), "-an", "-c:v", "libx264", "-preset", "medium", "-crf", "17", out])
    segments.append((out, dur))


def seg_card(name, layer, dur, bg="black"):
    out = os.path.join(WORK, f"{len(segments):02d}_{name}.mp4")
    frames = int(round(dur * FPS))
    fc = (
        f"[1:v]format=rgba,fade=t=in:st=0.05:d=0.35:alpha=1,fade=t=out:st={dur - 0.55}:d=0.45:alpha=1[t];"
        f"[0:v][t]overlay=0:0,zoompan=z='1+0.0008*on':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=1:s={W}x{H}:fps={FPS},"
        f"{GRAIN},format=yuv420p[out]"
    )
    run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", f"color=c={bg}:s={W}x{H}:d={dur}:r={FPS}",
         "-loop", "1", "-t", str(dur), "-i", layer, "-filter_complex", fc, "-map", "[out]",
         "-frames:v", str(frames), "-r", str(FPS), "-c:v", "libx264", "-preset", "medium", "-crf", "17", out])
    segments.append((out, dur))


def seg_still(name, image, dur, zoom=0.0007, fade_in=0.8, fade_out=0.6):
    out = os.path.join(WORK, f"{len(segments):02d}_{name}.mp4")
    frames = int(round(dur * FPS))
    fc = (
        f"[0:v]scale=2560:1440,zoompan=z='1+{zoom}*on':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d={frames}:s={W}x{H}:fps={FPS},"
        f"{GRAIN},fade=t=in:st=0:d={fade_in},fade=t=out:st={dur - fade_out}:d={fade_out},format=yuv420p[out]"
    )
    run(["ffmpeg", "-v", "error", "-y", "-i", image, "-filter_complex", fc, "-map", "[out]",
         "-frames:v", str(frames), "-r", str(FPS), "-c:v", "libx264", "-preset", "medium", "-crf", "17", out])
    segments.append((out, dur))


def cap(text, px=50):
    return [(text, F_ITAL, px, 0, "cream")]


def caps(*rows):
    return list(rows)


# ---------------------------------------------------------------- guion
hits = []      # (tiempo, intensidad) golpes graves
whooshes = []  # tiempos de barridos
pulses = []    # latidos del montaje
t = 0.0


def mark_hit(k=1.0):
    hits.append((t, k))
    whooshes.append(t)


L = save_layer
seg_card("intro", L("intro", [("UNA NOVELA DE", F_CAPS, 22, 10, "dim"), ("ROBERT LOUIS STEVENSON", F_CAPS, 40, 8, "gold")]), 3.6)
t += 3.6
seg_video("olas", "olas", 8.0, 5.0, 0.5, L("t_olas", cap("Algunos mapas nunca deberían encontrarse.")))
t += 5.0
mark_hit(0.8)
seg_card("mapa", L("c_mapa", [("UN MAPA.", F_TITLE, 96, 14, "gold")]), 2.0)
t += 2.0
seg_video("barco", "barco", 0.5, 4.6, 0.62, L("t_barco", cap("Un barco llamado La Hispaniola.")), zoom=0.0022)
t += 4.6
mark_hit(0.85)
seg_card("tripulacion", L("c_trip", [("UNA TRIPULACIÓN.", F_TITLE, 84, 12, "gold")]), 2.0)
t += 2.0
seg_video("atardecer", "atardecer", 1.0, 5.0, 0.58, L("t_atar", cap("Y entre ellos, un cocinero de una sola pierna…")))
t += 5.0
mark_hit(0.95)
seg_card("traidor", L("c_traidor", [("UN TRAIDOR.", F_TITLE, 96, 14, "gold")]), 2.0)
t += 2.0
seg_video("naufragio", "naufragio", 0.3, 4.6, 0.66, L("t_nauf", cap("Más allá del mapa, una isla espera.")), zoom=0.0018)
t += 4.6
seg_video("delfines", "delfines", 0.2, 4.0, 0.5, L("t_delf", cap("Y un tesoro por el que todos matarían.")), zoom=0.002)
t += 4.0
# montaje rápido
for i, (clip, ss, yc) in enumerate([("olas", 30, 0.5), ("barco", 5.5, 0.62), ("naufragio", 6.0, 0.6),
                                    ("atardecer", 9.0, 0.5), ("delfines", 3.0, 0.5), ("olas", 50, 0.45)]):
    d = 0.62 - i * 0.04
    pulses.append(t)
    seg_video(f"m{i}", clip, ss, d, yc, zoom=0.006, flash=True, fade=False)
    t += d
mark_hit(1.25)
seg_card("cofre", L("c_cofre", [("QUINCE HOMBRES", F_TITLE, 70, 10, "gold"), ("SOBRE EL COFRE DEL MUERTO", F_CAPS, 40, 8, "gold"),
                                 ("¡Yo-ho-ho, y una botella de ron!", F_ITAL, 34, 0, "cream")]), 3.6)
t += 3.6
seg_card("silencio", L("vacio", [(" ", F_SANS, 10, 0, "dim")]), 0.7)
t += 0.7
mark_hit(1.4)
cover_start = t
seg_still("portada", cover_frame(os.path.join(WORK, "cover.jpg"), with_text=False), 5.5, zoom=0.0009, fade_in=1.4)
t += 5.5
mark_hit(0.9)
seg_card("porque", L("c_porque", [("¿POR QUÉ LEERLO?", F_TITLE, 78, 10, "gold")]), 2.2)
t += 2.2
reasons = [
    ("olas", 20, 0.5, "PORQUE AQUÍ NACIERON LOS PIRATAS", "El mapa con la X, el loro, la pata de palo: todo empezó en este libro."),
    ("barco", 2.5, 0.62, "PORQUE JIM HAWKINS PODRÍAS SER TÚ", "Un chico que se atreve cuando los adultos dudan."),
    ("atardecer", 6.0, 0.55, "PORQUE SILVER TE VA A ENGAÑAR", "El villano más carismático de la literatura. Encantador y temible."),
    ("naufragio", 3.0, 0.62, "PORQUE TRATA SOBRE CRECER", "Elegir quién ser cuando nadie te está mirando."),
]
for i, (clip, ss, yc, head, sub) in enumerate(reasons):
    layer = L(f"r{i}", [(f"0{i + 1}", F_CAPS, 26, 6, "dim"), (head, F_TITLE, 42, 5, "gold"), (sub, F_ITAL, 36, 0, "cream")])
    seg_video(f"razon{i}", clip, ss, 3.4, yc, layer, dim=0.55)
    t += 3.4
mark_hit(1.3)
end_start = t
seg_still("final", cover_frame(os.path.join(WORK, "end.jpg"), with_text=True), 6.5, zoom=0.0005, fade_in=0.5, fade_out=1.6)
t += 6.5
TOTAL = t
print(f"duración total: {TOTAL:.2f}s")

# ---------------------------------------------------------------- audio
SR = 48000
n = int(TOTAL * SR) + SR
time = np.arange(n) / SR
rng = np.random.default_rng(7)
mix = np.zeros((n, 2))


def fast_lowpass(x, k):
    """media móvil repetida = lowpass barato para señales largas"""
    ker = np.ones(k) / k
    for _ in range(3):
        x = np.convolve(x, ker, mode="same")
    return x


# mar: ruido filtrado con oleaje lento
sea = fast_lowpass(rng.standard_normal(n), 60)
sea *= 0.5 + 0.5 * np.sin(2 * np.pi * time / 6.5) ** 2
sea_env = np.clip(1 - np.abs(time - 6) / 14, 0.15, 1)
sea_env[time > cover_start] *= 0.4
mix[:, 0] += sea * 2.2 * sea_env
mix[:, 1] += np.roll(sea, 900) * 2.2 * sea_env

# drone grave que crece hasta el montaje
drone_env = np.clip(time / (cover_start - 1), 0, 1) ** 1.6 * 0.22 + 0.05
drone_env[time > cover_start - 0.8] = 0
drone = sum(np.sin(2 * np.pi * f * time + p) * a for f, a, p in [(55, 1, 0), (82.4, 0.6, 1), (110, 0.35, 2), (164.8, 0.15, 3)])
drone *= 1 + 0.25 * np.sin(2 * np.pi * 0.25 * time)
mix += (drone * drone_env)[:, None]


def add(sig, at, gain=1.0, pan=0.0):
    i = int(at * SR)
    j = min(n, i + len(sig))
    if i >= n:
        return
    mix[i:j, 0] += sig[: j - i] * gain * (1 - pan)
    mix[i:j, 1] += sig[: j - i] * gain * (1 + pan)


def braam(k):
    d = 3.2
    tt = np.arange(int(d * SR)) / SR
    env = np.minimum(tt / 0.02, 1) * np.exp(-tt * 1.1)
    f0 = 41.2
    s = np.zeros_like(tt)
    for h in range(1, 14):
        s += np.sin(2 * np.pi * f0 * h * tt * (1 + 0.003 * h)) / h ** 1.1
    s = np.tanh(s * 1.8)
    sub = np.sin(2 * np.pi * (35 + 60 * np.exp(-tt * 9)) * tt) * np.exp(-tt * 2.2)
    noise = fast_lowpass(rng.standard_normal(len(tt)), 6) * np.exp(-tt * 14) * 3
    return (s * 0.45 + sub * 0.9 + noise * 0.3) * env * k


def whoosh():
    d = 1.1
    tt = np.arange(int(d * SR)) / SR
    env = (tt / d) ** 3
    s = rng.standard_normal(len(tt))
    s = s - fast_lowpass(s, 30)  # highpass
    return s * env * 0.25


def pulse():
    tt = np.arange(int(0.35 * SR)) / SR
    return np.sin(2 * np.pi * (60 + 40 * np.exp(-tt * 30)) * tt) * np.exp(-tt * 12)


for at, k in hits:
    add(whoosh(), at - 1.1, 1.0)
    add(braam(k), at, 0.9)
for at in pulses:
    add(pulse(), at, 0.9)
    add(pulse(), at + 0.16, 0.5)

# acorde final (La menor → Do mayor) tras la portada
def pad(freqs, start, dur, gain):
    tt = np.arange(int(dur * SR)) / SR
    env = np.minimum(tt / 1.5, 1) * np.minimum((dur - tt) / 1.5, 1)
    s = np.zeros_like(tt)
    for f in freqs:
        for det in (-0.6, 0, 0.7):
            s += np.sin(2 * np.pi * (f + det) * tt + rng.uniform(0, 6))
    add(s / (len(freqs) * 3) * env, start, gain)


pad([110, 220, 261.6, 329.6], cover_start, 7.7, 0.35)
pad([130.8, 196, 261.6, 329.6, 392], cover_start + 7.7, 13.6 - 0.2, 0.3)
pad([110, 164.8, 220, 261.6, 329.6, 440], end_start, 6.5, 0.38)

# campanilla/brillo de oro al aparecer la portada
for i, f in enumerate([1318.5, 1567.98, 1975.5, 2637]):
    tt = np.arange(int(2.5 * SR)) / SR
    add(np.sin(2 * np.pi * f * tt) * np.exp(-tt * 2.5) * 0.12, cover_start + 0.6 + i * 0.12, 1.0, pan=(i % 2) * 0.6 - 0.3)

mix = mix[: int(TOTAL * SR)]
fade = int(1.4 * SR)
mix[-fade:] *= np.linspace(1, 0, fade)[:, None]
mix /= np.max(np.abs(mix)) * 1.12
wav_path = os.path.join(WORK, "audio.wav")
with wave.open(wav_path, "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((mix * 32767).astype("<i2").tobytes())

# ---------------------------------------------------------------- montaje final
lst = os.path.join(WORK, "list.txt")
with open(lst, "w") as f:
    for p, _ in segments:
        f.write(f"file '{p}'\n")
run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", lst, "-i", wav_path,
     "-map", "0:v", "-map", "1:a", "-c:v", "libx264", "-preset", "slow", "-b:v", "2600k", "-maxrate", "3500k", "-bufsize", "7000k", "-pix_fmt", "yuv420p",
     "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart", OUT])
print("ok →", OUT)
