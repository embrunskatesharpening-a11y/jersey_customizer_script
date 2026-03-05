#target illustrator

/**
 * JERSEY NAME & NUMBER GENERATOR
 * NXT1 Sports — Adobe Illustrator ExtendScript (.jsx)
 *
 * Phase 4: Full pipeline with settings dialog
 *
 * Tracking guidelines (tested):
 *   3-layer: 70  |  2-layer: 50  |  1-layer: 0
 *
 * Convention: 90pt = 1 inch
 */

// ────────────────────────────────────────────────────────
//  DEFAULT SETTINGS (dialog overrides these per session)
// ────────────────────────────────────────────────────────
var CFG = {
    ppi:            90,
    numberHeight:   10,
    nameRatio:      0.20,
    gapInches:      1,
    padInches:      0.5,
    nudgeX:         -0.5,               // Final X offset (inches), applied after centering
    nudgeY:         0,                  // Final Y offset (inches), positive = down
    fontName:       "Redwing-Medium",
    bgColor:        {c:0, m:65, y:99, k:2},  // Artboard background (orange default)
    jerseyBack:     null,                     // File path to back jersey template (PNG/JPG/SVG/AI/EPS)
    jerseyFront:    null,                     // File path to front jersey template
    jerseyRatio:    0.30,                     // Number height as fraction of jersey height
    jerseyView:     "both",                   // "both", "back", "front"
    textVerticalPct: 0.40,                    // Text center Y as fraction from jersey top
    guideBack:      null,                     // .ai guide file path for back jersey zones
    guideFront:     null,                     // .ai guide file path for front jersey zones
    templateOpacity: 100,                     // Template layer opacity (%) in proof mode

    teamName:       "",                          // Default team name for the batch (CSV per-player overrides)

    logo: {
        file:       null,           // File path to logo (PNG, AI, EPS, PDF)
        placement:  "below",        // "below" (below number), "above" (above name), "custom"
        widthInches: 8,             // Logo width in inches, height scales proportionally
        gapInches:  1.25,           // Gap between logo and nearest text element
        offsetX:    0,              // Custom X offset from center (inches)
        offsetY:    0,              // Custom Y offset from center (inches)
        folder:     null            // Optional folder path for team-specific logos
    },

    frontLogo: {
        file:       null,           // File path to front logo (PNG, AI, EPS, PDF)
        widthInches: 10,            // Logo width in inches
        verticalPct: 0.42,          // Y position as % from top of jersey
        offsetX:    0,              // X offset from jersey center (inches)
        offsetY:    0               // Y offset from calculated position (inches)
    },

    outputMode:     "proof",                  // "production" or "proof"
    proofWidth:     17,                       // proof artboard width (inches)
    proofHeight:    11,                       // proof artboard height (inches)
    proofMargin:    0.05,                     // margin inside proof artboard (fraction)

    number: {
        layers:     3,
        fillColor:  {c:0,   m:0,  y:0,   k:0},    // White
        innerColor: {c:0,   m:28, y:89,  k:0},    // Gold #FFB81C
        outerColor: {c:94,  m:55, y:0,   k:74},   // Navy #041E42
        innerPct:   0.0467,
        outerPct:   0.0933,
        tracking:   70
    },

    name: {
        layers:     3,
        fillColor:  {c:0,   m:0,  y:0,   k:0},    // White
        innerColor: {c:0,   m:28, y:89,  k:0},    // Gold #FFB81C
        outerColor: {c:94,  m:55, y:0,   k:74},   // Navy #041E42
        innerPct:   0.0467,
        outerPct:   0.0933,
        tracking:   70
    }
};

// ────────────────────────────────────────────────────────
//  PRESETS  (duplicate a block and edit to add a team)
// ────────────────────────────────────────────────────────
// Color mapping: fill = primary, inner stroke = secondary, outer stroke = tertiary
var PRESETS = [
    {
        name: "— Custom —",   // placeholder, selecting this does nothing
        numberHeight: 10,  nameRatio: 0.20,  gapInches: 1,  padInches: 0.5,
        fontName: "Redwing-Medium",  bgColor: {c:0, m:0, y:0, k:0},
        number: {
            layers: 3,  tracking: 70,
            fillColor:  {c:0, m:0, y:0, k:0},
            innerColor: {c:0, m:0, y:0, k:0},
            outerColor: {c:0, m:0, y:0, k:0},
            innerPct: 0.0467,  outerPct: 0.0933
        },
        name_style: {
            layers: 3,  tracking: 70,
            fillColor:  {c:0, m:0, y:0, k:0},
            innerColor: {c:0, m:0, y:0, k:0},
            outerColor: {c:0, m:0, y:0, k:0},
            innerPct: 0.0467,  outerPct: 0.0933
        }
    },
    {   // #041E42 / #FCB514 / #ffffff
        name: "Embrun Panthers",
        numberHeight: 10,  nameRatio: 0.25,  gapInches: 0.25,  padInches: 0.5,
        fontName: "Redwing-Medium",  bgColor: {c:0, m:0, y:0, k:0},
        number: {
            layers: 3,  tracking: 70,
            fillColor:  {c:94,  m:55, y:0,  k:74},   // Navy #041E42
            innerColor: {c:0,   m:28, y:92, k:1},    // Gold #FCB514
            outerColor: {c:0,   m:0,  y:0,  k:0},    // White #ffffff
            innerPct: 0.0467,  outerPct: 0.0933
        },
        name_style: {
            layers: 3,  tracking: 70,
            fillColor:  {c:94,  m:55, y:0,  k:74},
            innerColor: {c:0,   m:28, y:92, k:1},
            outerColor: {c:0,   m:0,  y:0,  k:0},
            innerPct: 0.0467,  outerPct: 0.0933
        }
    },
    {   // #020000 / #cb122d / #ffffff
        name: "Casselman Vikings",
        numberHeight: 10,  nameRatio: 0.25,  gapInches: 0.25,  padInches: 0.5,
        fontName: "Redwing-Medium",  bgColor: {c:0, m:0, y:0, k:0},
        number: {
            layers: 3,  tracking: 70,
            fillColor:  {c:0,   m:0,  y:0,  k:100},  // Black #020000
            innerColor: {c:0,   m:91, y:78, k:20},   // Red #cb122d
            outerColor: {c:0,   m:0,  y:0,  k:0},    // White #ffffff
            innerPct: 0.0467,  outerPct: 0.0933
        },
        name_style: {
            layers: 3,  tracking: 70,
            fillColor:  {c:0,   m:0,  y:0,  k:100},
            innerColor: {c:0,   m:91, y:78, k:20},
            outerColor: {c:0,   m:0,  y:0,  k:0},
            innerPct: 0.0467,  outerPct: 0.0933
        }
    },
    {   // #020000 / #FCB514 / #ffffff
        name: "Icedogs",
        numberHeight: 10,  nameRatio: 0.25,  gapInches: 0.25,  padInches: 0.5,
        fontName: "Redwing-Medium",  bgColor: {c:0, m:0, y:0, k:0},
        number: {
            layers: 3,  tracking: 70,
            fillColor:  {c:0,   m:0,  y:0,  k:100},  // Black #020000
            innerColor: {c:0,   m:28, y:92, k:1},    // Gold #FCB514
            outerColor: {c:0,   m:0,  y:0,  k:0},    // White #ffffff
            innerPct: 0.0467,  outerPct: 0.0933
        },
        name_style: {
            layers: 3,  tracking: 70,
            fillColor:  {c:0,   m:0,  y:0,  k:100},
            innerColor: {c:0,   m:28, y:92, k:1},
            outerColor: {c:0,   m:0,  y:0,  k:0},
            innerPct: 0.0467,  outerPct: 0.0933
        }
    },
    {   // #041E42 / #FCB514 / #ffffff
        name: "Russell Coyotes House",
        numberHeight: 10,  nameRatio: 0.25,  gapInches: 0.25,  padInches: 0.5,
        fontName: "Redwing-Medium",  bgColor: {c:0, m:0, y:0, k:0},
        number: {
            layers: 3,  tracking: 70,
            fillColor:  {c:94,  m:55, y:0,  k:74},   // Navy #041E42
            innerColor: {c:0,   m:28, y:92, k:1},    // Gold #FCB514
            outerColor: {c:0,   m:0,  y:0,  k:0},    // White #ffffff
            innerPct: 0.0467,  outerPct: 0.0933
        },
        name_style: {
            layers: 3,  tracking: 70,
            fillColor:  {c:94,  m:55, y:0,  k:74},
            innerColor: {c:0,   m:28, y:92, k:1},
            outerColor: {c:0,   m:0,  y:0,  k:0},
            innerPct: 0.0467,  outerPct: 0.0933
        }
    },
    {   // #041E42 / #FCB514 / #ffffff
        name: "Russell Coyotes Competitive",
        numberHeight: 10,  nameRatio: 0.25,  gapInches: 0.25,  padInches: 0.5,
        fontName: "Redwing-Medium",  bgColor: {c:0, m:0, y:0, k:0},
        number: {
            layers: 3,  tracking: 70,
            fillColor:  {c:94,  m:55, y:0,  k:74},   // Navy #041E42
            innerColor: {c:0,   m:28, y:92, k:1},    // Gold #FCB514
            outerColor: {c:0,   m:0,  y:0,  k:0},    // White #ffffff
            innerPct: 0.0467,  outerPct: 0.0933
        },
        name_style: {
            layers: 3,  tracking: 70,
            fillColor:  {c:94,  m:55, y:0,  k:74},
            innerColor: {c:0,   m:28, y:92, k:1},
            outerColor: {c:0,   m:0,  y:0,  k:0},
            innerPct: 0.0467,  outerPct: 0.0933
        }
    },
    {   // #ffffff / #6F263D / #236192
        name: "Russell Warriors",
        numberHeight: 10,  nameRatio: 0.25,  gapInches: 0.25,  padInches: 0.5,
        fontName: "Redwing-Medium",  bgColor: {c:0, m:66, y:45, k:56},  // Maroon jersey
        number: {
            layers: 3,  tracking: 70,
            fillColor:  {c:0,   m:0,  y:0,  k:0},    // White #ffffff
            innerColor: {c:0,   m:66, y:45, k:56},   // Maroon #6F263D
            outerColor: {c:76,  m:34, y:0,  k:43},   // Blue #236192
            innerPct: 0.0467,  outerPct: 0.0933
        },
        name_style: {
            layers: 3,  tracking: 70,
            fillColor:  {c:0,   m:0,  y:0,  k:0},
            innerColor: {c:0,   m:66, y:45, k:56},
            outerColor: {c:76,  m:34, y:0,  k:43},
            innerPct: 0.0467,  outerPct: 0.0933
        }
    },
    {   // #ffffff / #A6192E / #154734
        name: "EO Wild",
        numberHeight: 10,  nameRatio: 0.25,  gapInches: 0.25,  padInches: 0.5,
        fontName: "Redwing-Medium",  bgColor: {c:70, m:0, y:27, k:72},  // Green jersey
        number: {
            layers: 3,  tracking: 70,
            fillColor:  {c:0,   m:0,  y:0,  k:0},    // White #ffffff
            innerColor: {c:0,   m:85, y:72, k:35},   // Red #A6192E
            outerColor: {c:70,  m:0,  y:27, k:72},   // Green #154734
            innerPct: 0.0467,  outerPct: 0.0933
        },
        name_style: {
            layers: 3,  tracking: 70,
            fillColor:  {c:0,   m:0,  y:0,  k:0},
            innerColor: {c:0,   m:85, y:72, k:35},
            outerColor: {c:70,  m:0,  y:27, k:72},
            innerPct: 0.0467,  outerPct: 0.0933
        }
    },
    {   // #ffffff / #b0b5b9 / #020000
        name: "EO Stars",
        numberHeight: 10,  nameRatio: 0.25,  gapInches: 0.25,  padInches: 0.5,
        fontName: "Redwing-Medium",  bgColor: {c:0, m:0, y:0, k:100},  // Black jersey
        number: {
            layers: 3,  tracking: 70,
            fillColor:  {c:0,   m:0,  y:0,  k:0},    // White #ffffff
            innerColor: {c:5,   m:2,  y:0,  k:27},   // Silver #b0b5b9
            outerColor: {c:0,   m:0,  y:0,  k:100},  // Black #020000
            innerPct: 0.0467,  outerPct: 0.0933
        },
        name_style: {
            layers: 3,  tracking: 70,
            fillColor:  {c:0,   m:0,  y:0,  k:0},
            innerColor: {c:5,   m:2,  y:0,  k:27},
            outerColor: {c:0,   m:0,  y:0,  k:100},
            innerPct: 0.0467,  outerPct: 0.0933
        }
    },
    {   // #ffffff / #020000 / #ed2024
        name: "ND Demons",
        numberHeight: 10,  nameRatio: 0.25,  gapInches: 0.25,  padInches: 0.5,
        fontName: "Redwing-Medium",  bgColor: {c:0, m:87, y:85, k:7},  // Red jersey
        number: {
            layers: 3,  tracking: 70,
            fillColor:  {c:0,   m:0,  y:0,  k:0},    // White #ffffff
            innerColor: {c:0,   m:0,  y:0,  k:100},  // Black #020000
            outerColor: {c:0,   m:87, y:85, k:7},    // Red #ed2024
            innerPct: 0.0467,  outerPct: 0.0933
        },
        name_style: {
            layers: 3,  tracking: 70,
            fillColor:  {c:0,   m:0,  y:0,  k:0},
            innerColor: {c:0,   m:0,  y:0,  k:100},
            outerColor: {c:0,   m:87, y:85, k:7},
            innerPct: 0.0467,  outerPct: 0.0933
        }
    }
    // ── ADD MORE PRESETS HERE ──
    // Copy a block above, paste it before this comment,
    // change the name and values. Colors are CMYK 0-100.
    // innerPct/outerPct are decimals (4.67% = 0.0467).
    // nameRatio is a decimal (25% = 0.25).
];

// Derived (recomputed after dialog)
var numPts, namePts, gapPts, padPts;
function recompute() {
    numPts  = CFG.numberHeight * CFG.ppi;
    namePts = numPts * CFG.nameRatio;
    gapPts  = CFG.gapInches * 72;    // positional distance, not text
    padPts  = CFG.padInches * 72;    // positional distance, not text
}
recompute();


// ────────────────────────────────────────────────────────
//  UTILITIES
// ────────────────────────────────────────────────────────
function cmyk(o) {
    var c = new CMYKColor();
    c.cyan = o.c;  c.magenta = o.m;  c.yellow = o.y;  c.black = o.k;
    return c;
}

function trim(s) { return s.replace(/^\s+|\s+$/g, ""); }

// ── Color Conversion (approximate, no ICC profiles) ──
function cmykToRgb(c, m, y, k) {
    var r = Math.round(255 * (1 - c / 100) * (1 - k / 100));
    var g = Math.round(255 * (1 - m / 100) * (1 - k / 100));
    var b = Math.round(255 * (1 - y / 100) * (1 - k / 100));
    return {r: Math.max(0, r), g: Math.max(0, g), b: Math.max(0, b)};
}

function rgbToHex(r, g, b) {
    var rr = r.toString(16); if (rr.length < 2) rr = "0" + rr;
    var gg = g.toString(16); if (gg.length < 2) gg = "0" + gg;
    var bb = b.toString(16); if (bb.length < 2) bb = "0" + bb;
    return "#" + rr.toUpperCase() + gg.toUpperCase() + bb.toUpperCase();
}

function cmykToHex(c, m, y, k) {
    var rgb = cmykToRgb(c, m, y, k);
    return rgbToHex(rgb.r, rgb.g, rgb.b);
}

function hexToRgb(hex) {
    var s = hex.replace(/^#/, "");
    if (s.length === 3)
        s = s.charAt(0) + s.charAt(0) + s.charAt(1) + s.charAt(1) + s.charAt(2) + s.charAt(2);
    var num = parseInt(s, 16);
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function rgbToCmyk(r, g, b) {
    if (r === 0 && g === 0 && b === 0) return {c: 0, m: 0, y: 0, k: 100};
    var c1 = 1 - (r / 255);
    var m1 = 1 - (g / 255);
    var y1 = 1 - (b / 255);
    var k1 = Math.min(c1, m1, y1);
    return {
        c: Math.round((c1 - k1) / (1 - k1) * 100),
        m: Math.round((m1 - k1) / (1 - k1) * 100),
        y: Math.round((y1 - k1) / (1 - k1) * 100),
        k: Math.round(k1 * 100)
    };
}

function hexToCmyk(hex) {
    var rgb = hexToRgb(hex);
    return rgbToCmyk(rgb.r, rgb.g, rgb.b);
}

function stylePaths(item, fillObj, strokeObj, sw) {
    var t = item.typename;
    if (t === "GroupItem") {
        for (var i = 0; i < item.pageItems.length; i++)
            stylePaths(item.pageItems[i], fillObj, strokeObj, sw);
    } else if (t === "CompoundPathItem") {
        for (var j = 0; j < item.pathItems.length; j++)
            stylePaths(item.pathItems[j], fillObj, strokeObj, sw);
    } else if (t === "PathItem") {
        item.filled = !!fillObj;
        if (fillObj) item.fillColor = cmyk(fillObj);
        item.stroked = !!(strokeObj && sw > 0);
        if (item.stroked) {
            item.strokeWidth = sw;
            item.strokeColor = cmyk(strokeObj);
            item.strokeJoin  = StrokeJoin.MITERENDJOIN;
            item.strokeMiterLimit = 4;
        }
    }
}


// ── Capital baseline helper ──
// Returns the Y coordinate of the capital baseline (bottom of caps,
// ignoring descenders) within a corrected text group.
function getCapBaseline(layer, text, fontSize, groupVB) {
    // Temp "H" outline — no descenders, bottom = cap baseline
    var t1 = layer.textFrames.add();
    t1.contents = "H";
    t1.position = [0, 0];
    var a1 = t1.textRange.characterAttributes;
    try { a1.textFont = app.textFonts.getByName(CFG.fontName); } catch (e) {}
    a1.size = fontSize;
    var capOut = t1.createOutline();
    var capH = capOut.visibleBounds[1] - capOut.visibleBounds[3];
    capOut.remove();

    // Temp outline of actual text to get raw total height
    var t2 = layer.textFrames.add();
    t2.contents = text;
    t2.position = [0, 0];
    var a2 = t2.textRange.characterAttributes;
    try { a2.textFont = app.textFonts.getByName(CFG.fontName); } catch (e) {}
    a2.size = fontSize;
    var txtOut = t2.createOutline();
    var rawH = txtOut.visibleBounds[1] - txtOut.visibleBounds[3];
    txtOut.remove();

    var groupH = groupVB[1] - groupVB[3];
    if (rawH > capH && rawH > 0) {
        var descentRatio = (rawH - capH) / rawH;
        return groupVB[3] + descentRatio * groupH;
    }
    return groupVB[3];
}


// ────────────────────────────────────────────────────────
//  CORE: Stroked outlined text (1, 2, or 3 layers)
// ────────────────────────────────────────────────────────
function makeStrokedText(layer, text, fontSize, style, posX, posY) {
    var iw = Math.round(fontSize * style.innerPct);
    var ow = Math.round(fontSize * style.outerPct);

    var tf = layer.textFrames.add();
    tf.contents = text;
    tf.position = [posX, posY];

    var attrs = tf.textRange.characterAttributes;
    try { attrs.textFont = app.textFonts.getByName(CFG.fontName); }
    catch (e) { alert("Font '" + CFG.fontName + "' not found.\nUsing default."); }
    attrs.size = fontSize;
    if (style.tracking) attrs.tracking = style.tracking;

    var fillLayer = tf.createOutline();

    // Measure actual glyph height and compute correction factor
    var fillVB = fillLayer.visibleBounds;
    var actualH = fillVB[1] - fillVB[3];
    var correctionScale = (actualH > 0) ? (fontSize / actualH) : 1;

    var innerLayer = null, outerLayer = null;

    if (style.layers >= 3) {
        outerLayer = fillLayer.duplicate();
        stylePaths(outerLayer, null, style.outerColor, ow);
    }
    if (style.layers >= 2) {
        innerLayer = fillLayer.duplicate();
        stylePaths(innerLayer, null, style.innerColor, iw);
    }
    stylePaths(fillLayer, style.fillColor, null, 0);

    var g = layer.groupItems.add();
    fillLayer.move(g, ElementPlacement.PLACEATEND);
    if (innerLayer) innerLayer.move(g, ElementPlacement.PLACEATEND);
    if (outerLayer) outerLayer.move(g, ElementPlacement.PLACEATEND);

    // Apply font metrics correction so rendered height matches requested fontSize
    if (Math.abs(correctionScale - 1) > 0.001) {
        var sPct = correctionScale * 100;
        g.resize(sPct, sPct, true, true, true, true, sPct);
    }

    return g;
}


// ────────────────────────────────────────────────────────
//  GUIDE-ZONE HELPERS
//  Read colored rectangles from an .ai guide file to
//  determine placement zones for number, name, and logo.
//  Red = Number, Blue = Name, Green = Logo
// ────────────────────────────────────────────────────────

/**
 * Classify a PathItem's fill color into a zone role.
 * Returns "number" (red), "name" (blue), "logo" (green), or null.
 */
function classifyZoneColor(item) {
    if (!item.filled) return null;
    var fc = item.fillColor;
    var r, g, b;

    if (fc.typename === "CMYKColor") {
        // CMYK → approximate RGB
        var c = fc.cyan   / 100;
        var m = fc.magenta / 100;
        var y = fc.yellow  / 100;
        var k = fc.black   / 100;
        r = 255 * (1 - c) * (1 - k);
        g = 255 * (1 - m) * (1 - k);
        b = 255 * (1 - y) * (1 - k);
    } else if (fc.typename === "RGBColor") {
        r = fc.red;
        g = fc.green;
        b = fc.blue;
    } else if (fc.typename === "SpotColor") {
        // Resolve spot color to its internal CMYK or RGB
        var sc = fc.spot.color;
        if (sc.typename === "CMYKColor") {
            var c2 = sc.cyan   / 100;
            var m2 = sc.magenta / 100;
            var y2 = sc.yellow  / 100;
            var k2 = sc.black   / 100;
            r = 255 * (1 - c2) * (1 - k2);
            g = 255 * (1 - m2) * (1 - k2);
            b = 255 * (1 - y2) * (1 - k2);
        } else if (sc.typename === "RGBColor") {
            r = sc.red; g = sc.green; b = sc.blue;
        } else {
            return null;
        }
    } else {
        return null;
    }

    var THRESH = 150;
    var MARGIN = 80;

    if (r > THRESH && (r - g) > MARGIN && (r - b) > MARGIN) return "number";
    if (b > THRESH && (b - r) > MARGIN && (b - g) > MARGIN) return "name";
    if (g > THRESH && (g - r) > MARGIN && (g - b) > MARGIN) return "logo";

    return null;
}

/**
 * Open an .ai guide file, read zone rectangles, and return
 * fractional positions and sizes:
 *   { number: {cx,cy,w,h}, name: {cx,cy,w,h}, logo: [{cx,cy,w,h}, ...] }
 * Each zone may be null if not found (logo is an array — multiple allowed).
 * All values are 0-1 fractions relative to the guide's first artboard.
 */
function readGuideZones(guidePath) {
    var zones = { number: null, name: null, logo: [] };
    var f = new File(guidePath);
    if (!f.exists) return zones;

    // Open silently (without showing)
    var guideDoc = app.open(f);

    try {
        var ab = guideDoc.artboards[0].artboardRect;  // [left, top, right, bottom]
        var abW = ab[2] - ab[0];
        var abH = ab[1] - ab[3];  // top - bottom (positive)

        if (abW <= 0 || abH <= 0) {
            guideDoc.close(SaveOptions.DONOTSAVECHANGES);
            return zones;
        }

        for (var i = 0; i < guideDoc.pathItems.length; i++) {
            var pi = guideDoc.pathItems[i];
            var role = classifyZoneColor(pi);
            if (!role) continue;

            var vb = pi.visibleBounds;  // [left, top, right, bottom]
            var cx = ((vb[0] + vb[2]) / 2 - ab[0]) / abW;
            var cy = (ab[1] - (vb[1] + vb[3]) / 2) / abH;
            var zw = (vb[2] - vb[0]) / abW;
            var zh = (vb[1] - vb[3]) / abH;

            // Clamp center to 0-1 range
            cx = Math.max(0, Math.min(1, cx));
            cy = Math.max(0, Math.min(1, cy));

            var zone = { cx: cx, cy: cy, w: zw, h: zh };

            if (role === "logo") {
                zones.logo.push(zone);          // multiple green zones allowed
            } else {
                zones[role] = zone;             // one red, one blue
            }
        }

        // Sort logo zones top-to-bottom so placement order is predictable
        zones.logo.sort(function(a, b) { return a.cy - b.cy; });

    } catch (e) {
        // Silently fail — fall back to percentage positioning
    }

    guideDoc.close(SaveOptions.DONOTSAVECHANGES);
    return zones;
}

/**
 * Scale an item to fit within a zone, then center it at the zone position.
 * jerseyBounds = visibleBounds array [left, top, right, bottom]
 * zone = { cx, cy, w, h }  — all 0-1 fractions of jersey dimensions
 *
 * The item is scaled uniformly (proportionally) so it fits within
 * the zone rectangle.  Then its center is placed at the zone center.
 */
function applyZonePosition(item, jerseyBounds, zone) {
    var jLeft = jerseyBounds[0];
    var jTop  = jerseyBounds[1];
    var jW    = jerseyBounds[2] - jerseyBounds[0];
    var jH    = jerseyBounds[1] - jerseyBounds[3];

    // Zone bounds in points
    var zoneW = zone.w * jW;
    var zoneH = zone.h * jH;

    // Scale item to fit within zone (uniform / proportional)
    if (zoneW > 0 && zoneH > 0) {
        var ib = item.visibleBounds;
        var itemW = ib[2] - ib[0];
        var itemH = ib[1] - ib[3];

        if (itemW > 0 && itemH > 0) {
            var scaleRatio = Math.min(zoneW / itemW, zoneH / itemH);
            if (Math.abs(scaleRatio - 1) > 0.005) {  // skip if already correct size
                var sPct = scaleRatio * 100;
                item.resize(sPct, sPct, true, true, true, true, sPct);
            }
        }
    }

    // Center at zone position
    var targetX = jLeft + zone.cx * jW;
    var targetY = jTop  - zone.cy * jH;

    var ib2 = item.visibleBounds;  // re-read after scale
    var itemCX = (ib2[0] + ib2[2]) / 2;
    var itemCY = (ib2[1] + ib2[3]) / 2;

    item.translate(targetX - itemCX, targetY - itemCY);
}


// ────────────────────────────────────────────────────────
//  BUILD UNITS: Back (jersey + name/number) and Front (plain jersey)
// ────────────────────────────────────────────────────────

// Build back unit: jersey SVG with name+number text on top
function buildBackUnit(doc, layer, baseX, baseY, name, number, targetH, logoPath) {
    var zones = CFG._backZones || null;

    // Create text groups
    var numGroup = makeStrokedText(layer, number, numPts, CFG.number, baseX, baseY);
    var nameGroup = null;
    if (name && name !== "") {
        nameGroup = makeStrokedText(layer, name, namePts, CFG.name, baseX, baseY);

        // Relative gap positioning only when NOT using guide zones
        if (!zones) {
            var nv = numGroup.visibleBounds;
            var av = nameGroup.visibleBounds;
            var capBaseline = getCapBaseline(layer, name, namePts, av);
            nameGroup.translate(
                (nv[0] + nv[2]) / 2 - (av[0] + av[2]) / 2,
                (nv[1] + gapPts) - capBaseline
            );
        }
    }

    // Group text (used for legacy positioning and final unit)
    var textGroup = layer.groupItems.add();
    numGroup.move(textGroup, ElementPlacement.PLACEATEND);
    if (nameGroup) nameGroup.move(textGroup, ElementPlacement.PLACEATEND);

    // Import back jersey template (PNG/JPG/SVG/AI/EPS)
    var jersey = importJerseyTemplate(layer, CFG.jerseyBack, targetH);
    if (!jersey) {
        // Logo placement (no jersey)
        addLogoToGroup(layer, logoPath, numGroup, nameGroup, textGroup);
        if (CFG.nudgeX !== 0 || CFG.nudgeY !== 0)
            textGroup.translate(CFG.nudgeX * 72, -CFG.nudgeY * 72);
        return {group: textGroup, textGroup: textGroup};
    }

    var jb = jersey.visibleBounds;

    // ── ZONE-BASED POSITIONING (guide file) ──
    if (zones) {
        // Position each element independently at its zone center
        if (zones.number) {
            applyZonePosition(numGroup, jb, zones.number);
        }
        if (nameGroup && zones.name) {
            applyZonePosition(nameGroup, jb, zones.name);
        } else if (nameGroup && zones.number) {
            // No name zone — place name above number using gap
            var numVB = numGroup.visibleBounds;
            var nameVB = nameGroup.visibleBounds;
            var capBL = getCapBaseline(layer, name, namePts, nameVB);
            nameGroup.translate(
                (numVB[0] + numVB[2]) / 2 - (nameVB[0] + nameVB[2]) / 2,
                (numVB[1] + gapPts) - capBL
            );
        }

        // Logo via zone(s) or fallback
        if (zones.logo.length > 0 && logoPath) {
            // First green zone gets the team logo
            var logoW = CFG.logo.widthInches * CFG.ppi;
            var logoItem = importLogoFile(layer, logoPath, logoW);
            if (logoItem) {
                applyZonePosition(logoItem, jb, zones.logo[0]);
                logoItem.move(textGroup, ElementPlacement.PLACEATEND);
            }
            // Future: additional green zones could accept sponsor logos
        } else {
            addLogoToGroup(layer, logoPath, numGroup, nameGroup, textGroup);
        }

    // ── LEGACY POSITIONING (percentage-based) ──
    } else {
        var jerseyCX = (jb[0] + jb[2]) / 2;
        var jerseyH  = jb[1] - jb[3];

        var tb = textGroup.visibleBounds;
        var textCX = (tb[0] + tb[2]) / 2;
        var textCY = (tb[1] + tb[3]) / 2;
        var targetX = jerseyCX;
        var targetY = jb[1] - jerseyH * CFG.textVerticalPct;

        textGroup.translate(targetX - textCX, targetY - textCY);

        // Logo placement (jersey mode)
        addLogoToGroup(layer, logoPath, numGroup, nameGroup, textGroup);
    }

    // Nudge offset (applied after all positioning)
    if (CFG.nudgeX !== 0 || CFG.nudgeY !== 0)
        textGroup.translate(CFG.nudgeX * 72, -CFG.nudgeY * 72);

    // Combine into unit group
    var unit = layer.groupItems.add();
    textGroup.move(unit, ElementPlacement.PLACEATBEGINNING);  // text in front
    jersey.move(unit, ElementPlacement.PLACEATEND);            // jersey behind
    return {group: unit, textGroup: textGroup};
}

// Build front unit: jersey template + optional front logo (proof only)
function buildFrontUnit(layer, targetH, frontLogoPath) {
    var zones = CFG._frontZones || null;
    var jersey = importJerseyTemplate(layer, CFG.jerseyFront, targetH);
    if (!jersey) return null;

    // Front logo placement (tagged as template — hidden in production mode)
    var frontLogo = null;
    if (frontLogoPath) {
        var logoW = CFG.frontLogo.widthInches * CFG.ppi;
        frontLogo = importLogoFile(layer, frontLogoPath, logoW);
        if (frontLogo) {
            var jb = jersey.visibleBounds;

            // ── Zone-based front logo positioning ──
            if (zones && zones.logo.length > 0) {
                applyZonePosition(frontLogo, jb, zones.logo[0]);
            // ── Legacy percentage-based positioning ──
            } else {
                var jCX = (jb[0] + jb[2]) / 2;
                var jH = jb[1] - jb[3];
                var targetY = jb[1] - jH * CFG.frontLogo.verticalPct;
                var lv = frontLogo.visibleBounds;
                var lCX = (lv[0] + lv[2]) / 2;
                var lCY = (lv[1] + lv[3]) / 2;
                frontLogo.translate(
                    jCX + CFG.frontLogo.offsetX * 72 - lCX,
                    targetY - CFG.frontLogo.offsetY * 72 - lCY
                );
            }
            // Tag as template so moveTemplatesToLayer sends it to Template layer
            frontLogo.name = "__jersey_template__";
        }
    }

    var unit = layer.groupItems.add();
    if (frontLogo) frontLogo.move(unit, ElementPlacement.PLACEATBEGINNING);
    jersey.move(unit, ElementPlacement.PLACEATEND);
    return unit;
}

// Arrange front and back units side by side
function assembleUnits(masterGroup, frontUnit, backUnit, view) {
    var SIDE_GAP = 40;  // pt gap between front and back

    if (view === "both" && frontUnit && backUnit) {
        frontUnit.move(masterGroup, ElementPlacement.PLACEATEND);
        backUnit.move(masterGroup, ElementPlacement.PLACEATEND);

        // Align tops
        var fb = frontUnit.visibleBounds;
        var bb = backUnit.visibleBounds;
        var topY = Math.max(fb[1], bb[1]);
        frontUnit.translate(0, topY - fb[1]);
        backUnit.translate(0, topY - bb[1]);

        // Place back to the right of front with gap
        fb = frontUnit.visibleBounds;  // re-read after translate
        bb = backUnit.visibleBounds;
        backUnit.translate((fb[2] + SIDE_GAP) - bb[0], 0);

    } else if (frontUnit && (view === "front" || (view === "both" && !backUnit))) {
        frontUnit.move(masterGroup, ElementPlacement.PLACEATEND);
    } else if (backUnit) {
        backUnit.move(masterGroup, ElementPlacement.PLACEATEND);
    }
}


// ────────────────────────────────────────────────────────
//  PLAYER: Generate one player's artboard content
//  Layer separation: printLayer = text, templateLayer = jersey.
//  Templates are built on printLayer first (so grouping/positioning
//  works), then moved via tag to templateLayer.
// ────────────────────────────────────────────────────────
function generatePlayer(doc, printLayer, templateLayer, abIndex, player) {
    var name   = player.name;
    var number = player.number;
    var pSize  = player.size  || "";
    var pModel = player.model || "";
    var pTeam  = player.team  || CFG.teamName || "";

    // Resolve logo path for this player (team-specific or global)
    var playerLogoPath = resolveLogoPath(pTeam);

    // Load guide zones once per run (cached on CFG)
    if (CFG.guideBack && !CFG._backZones)
        CFG._backZones = readGuideZones(CFG.guideBack);
    if (CFG.guideFront && !CFG._frontZones)
        CFG._frontZones = readGuideZones(CFG.guideFront);

    var abRect = doc.artboards[abIndex].artboardRect;
    var baseX = abRect[0] + 200;
    var baseY = abRect[1] - 200;

    var hasJersey = (CFG.jerseyBack || CFG.jerseyFront);
    var targetH = numPts / CFG.jerseyRatio;

    // Artboard label text (includes size if present)
    var labelText = (name ? name + " " : "") + number;
    if (pSize !== "") labelText += " - " + pSize;

    // ══════════════════════════════════════════
    //  JERSEY TEMPLATE MODE
    // ══════════════════════════════════════════
    if (hasJersey) {
        var masterGroup = printLayer.groupItems.add();
        var backUnit = null;
        var backTextGroup = null;
        var frontUnit = null;

        // Build BACK unit (jersey + name + number)
        if (CFG.jerseyView !== "front" && CFG.jerseyBack) {
            var backResult = buildBackUnit(doc, printLayer, baseX, baseY, name, number, targetH, playerLogoPath);
            backUnit = backResult.group;
            backTextGroup = backResult.textGroup;
        }

        // Build FRONT unit (jersey template + front logo for proof)
        if (CFG.jerseyView !== "back" && CFG.jerseyFront) {
            var playerFrontLogo = resolveFrontLogoPath(pTeam);
            frontUnit = buildFrontUnit(printLayer, targetH, playerFrontLogo);
        }

        // Assemble into master group + position side by side
        assembleUnits(masterGroup, frontUnit, backUnit, CFG.jerseyView);

        // Center or scale to fit artboard (never resize artboard)
        if (CFG.outputMode === "proof") {
            scaleToFitArtboard(doc, abIndex, masterGroup);
        } else {
            centerGroupInArtboard(doc, abIndex, masterGroup);
        }

        // Move tagged jersey templates from masterGroup → templateLayer
        moveTemplatesToLayer(masterGroup, templateLayer);

        doc.artboards[abIndex].name = labelText;

        return masterGroup;
    }

    // ══════════════════════════════════════════
    //  DEFAULT MODE (no jersey template)
    // ══════════════════════════════════════════
    var numGroup = makeStrokedText(printLayer, number, numPts, CFG.number, baseX, baseY);
    var nameGroup = null;
    if (name && name !== "") {
        nameGroup = makeStrokedText(printLayer, name, namePts, CFG.name, baseX, baseY);
        var nv2 = numGroup.visibleBounds;
        var av2 = nameGroup.visibleBounds;
        var capBaseline2 = getCapBaseline(printLayer, name, namePts, av2);
        nameGroup.translate(
            (nv2[0] + nv2[2]) / 2 - (av2[0] + av2[2]) / 2,
            (nv2[1] + gapPts) - capBaseline2
        );
    }

    // Separate text-only group (for nudge + marks)
    var textOnlyGroup = printLayer.groupItems.add();
    numGroup.move(textOnlyGroup, ElementPlacement.PLACEATEND);
    if (nameGroup) nameGroup.move(textOnlyGroup, ElementPlacement.PLACEATEND);

    // Logo placement (default mode)
    addLogoToGroup(printLayer, playerLogoPath, numGroup, nameGroup, textOnlyGroup);

    // Center text BEFORE adding bgRect.
    // bgRect fills the full artboard; including it in the group used for
    // scaling/centering would make group bounds == artboard bounds, which
    // defeats both operations.  Instead: scale/center text first, then
    // add a full-artboard bgRect behind it.
    if (CFG.outputMode === "proof") {
        // Proof: scale text to fit usable area, then place artboard-filling bg behind it.
        scaleToFitArtboard(doc, abIndex, textOnlyGroup);
        // Background stays full-artboard — created AFTER text is positioned
        var bgRect = printLayer.pathItems.rectangle(
            abRect[1], abRect[0],
            abRect[2] - abRect[0], abRect[1] - abRect[3]
        );
        bgRect.fillColor = cmyk(CFG.bgColor);
        bgRect.filled = true;
        bgRect.stroked = false;
        // Group with text in front, background behind
        var g = printLayer.groupItems.add();
        textOnlyGroup.move(g, ElementPlacement.PLACEATBEGINNING); // text on top
        bgRect.move(g, ElementPlacement.PLACEATEND);              // bg behind
    } else {
        // Production: center text first, then place bgRect behind
        centerGroupInArtboard(doc, abIndex, textOnlyGroup);
        var bgRect = printLayer.pathItems.rectangle(
            abRect[1], abRect[0],
            abRect[2] - abRect[0], abRect[1] - abRect[3]
        );
        bgRect.fillColor = cmyk(CFG.bgColor);
        bgRect.filled = true;
        bgRect.stroked = false;
        var g = printLayer.groupItems.add();
        textOnlyGroup.move(g, ElementPlacement.PLACEATEND);
        bgRect.move(g, ElementPlacement.PLACEATEND);
    }

    // Nudge offset (after all centering)
    if (CFG.nudgeX !== 0 || CFG.nudgeY !== 0)
        textOnlyGroup.translate(CFG.nudgeX * 72, -CFG.nudgeY * 72);

    doc.artboards[abIndex].name = labelText;

    return g;
}


// ────────────────────────────────────────────────────────
//  Artboard helpers
// ────────────────────────────────────────────────────────

// Reposition and resize all artboards into a grid layout.
// Used by re-generate mode when settings change artboard dimensions.
function resizeArtboardGrid(doc, newW, newH, cols, spacing) {
    var n = doc.artboards.length;
    for (var i = 0; i < n; i++) {
        var col = i % cols;
        var row = Math.floor(i / cols);
        var left = col * (newW + spacing);
        var top  = -(row * (newH + spacing));
        doc.artboards[i].artboardRect = [left, top, left + newW, top - newH];
    }
}

// Center a group within an existing artboard (no artboard resize)
function centerGroupInArtboard(doc, abIndex, group) {
    var abRect = doc.artboards[abIndex].artboardRect;
    var abCX = (abRect[0] + abRect[2]) / 2;
    var abCY = (abRect[1] + abRect[3]) / 2;
    var vb = group.visibleBounds;
    var grpCX = (vb[0] + vb[2]) / 2;
    var grpCY = (vb[1] + vb[3]) / 2;
    group.translate(abCX - grpCX, abCY - grpCY);
}

// Scale group to fit within existing artboard (proof mode)
// Preserves grid position — NEVER modifies artboard rect
function scaleToFitArtboard(doc, abIndex, group) {
    var abRect = doc.artboards[abIndex].artboardRect;
    var abW = abRect[2] - abRect[0];
    var abH = abRect[1] - abRect[3];
    var margin = CFG.proofMargin;
    var usableW = abW * (1 - 2 * margin);
    var usableH = abH * (1 - 2 * margin);

    var vb = group.visibleBounds;
    var groupW = vb[2] - vb[0];
    var groupH = vb[1] - vb[3];

    var sf = Math.min(usableW / groupW, usableH / groupH);
    if (sf > 1) sf = 1;   // don't upscale
    var sfPct = sf * 100;

    group.resize(sfPct, sfPct, true, true, true, true, sfPct);
    centerGroupInArtboard(doc, abIndex, group);
}

// ────────────────────────────────────────────────────────
//  Template helpers (PNG/JPG/SVG/AI/EPS)
// ────────────────────────────────────────────────────────

// Detect whether a file is a raster image by extension
function isRasterFile(filePath) {
    var ext = String(filePath).replace(/^.*\./, "").toLowerCase();
    return (ext === "png" || ext === "jpg" || ext === "jpeg");
}

// Import a jersey template (raster or vector), scale to target height, return item (or null)
// Tags the imported item as "__jersey_template__" for later layer separation.
function importJerseyTemplate(layer, templatePath, targetHeight) {
    if (!templatePath) return null;  // guard: no template configured
    var templateFile = new File(templatePath);
    if (!templateFile.exists) return null;

    var item = null;

    if (isRasterFile(templatePath)) {
        // ── Raster (PNG / JPG / JPEG): place as linked image ──
        try {
            var placed = layer.placedItems.add();
            placed.file = templateFile;
            item = placed;
        } catch (e) {
            return null;
        }
    } else {
        // ── Vector (SVG / AI / EPS): existing logic ──
        // Method 1: createFromFile (fast)
        try {
            item = layer.groupItems.createFromFile(templateFile);
        } catch (e1) {
            // Method 2: open as temp doc, duplicate artwork
            try {
                var origDoc = app.activeDocument;
                var tmpDoc = app.open(templateFile);
                var tempG = tmpDoc.layers[0].groupItems.add();
                for (var si = tmpDoc.pageItems.length - 1; si >= 0; si--) {
                    if (tmpDoc.pageItems[si] !== tempG)
                        tmpDoc.pageItems[si].move(tempG, ElementPlacement.PLACEATEND);
                }
                item = tempG.duplicate(layer, ElementPlacement.PLACEATBEGINNING);
                tmpDoc.close(SaveOptions.DONOTSAVECHANGES);
                app.activeDocument = origDoc;
            } catch (e2) {
                return null;
            }
        }
    }
    if (!item) return null;

    // Tag for layer separation (moveTemplatesToLayer)
    item.name = "__jersey_template__";

    // Scale to target height
    var vb = item.visibleBounds;
    var nativeH = vb[1] - vb[3];
    if (nativeH > 0) {
        var sf = (targetHeight / nativeH) * 100;
        item.resize(sf, sf);
    }
    return item;
}

// Read SVG viewBox without importing (for pre-calculation).
// Scans up to 100 lines so it works even when the <svg> tag is not
// at the very top of the file (e.g. after XML declarations or DOCTYPE).
function readSVGViewBox(svgPath) {
    if (!svgPath) return null;
    var f = new File(svgPath);
    if (!f.exists) return null;
    f.open("r");
    var head = "";
    for (var li = 0; li < 100 && !f.eof; li++) head += f.readln();
    f.close();
    var m = head.match(/viewBox\s*=\s*"([^"]+)"/);
    if (!m) return null;
    var parts = m[1].split(/[\s,]+/);
    if (parts.length < 4) return null;
    return { w: parseFloat(parts[2]), h: parseFloat(parts[3]) };
}

// Read raster image dimensions by temporarily placing in a scratch doc
function readImageDimensions(imgPath) {
    var f = new File(imgPath);
    if (!f.exists) return null;
    var tempDoc = app.documents.add(DocumentColorSpace.CMYK, 2000, 2000);
    try {
        var placed = tempDoc.layers[0].placedItems.add();
        placed.file = f;
        var vb = placed.visibleBounds;
        var w = vb[2] - vb[0];
        var h = vb[1] - vb[3];
        tempDoc.close(SaveOptions.DONOTSAVECHANGES);
        return { w: w, h: h };
    } catch (e) {
        try { tempDoc.close(SaveOptions.DONOTSAVECHANGES); } catch (e2) {}
        return null;
    }
}

// Unified dimension reader — dispatches to SVG or raster method
function readTemplateDimensions(templatePath) {
    var f = new File(templatePath);
    if (!f.exists) return null;
    if (isRasterFile(templatePath)) return readImageDimensions(templatePath);
    return readSVGViewBox(templatePath);
}

// Walk a group tree and move any tagged jersey templates to the target layer
function moveTemplatesToLayer(item, targetLayer) {
    if (item.name === "__jersey_template__") {
        item.move(targetLayer, ElementPlacement.PLACEATBEGINNING);
        return;
    }
    if (item.typename === "GroupItem") {
        for (var i = item.pageItems.length - 1; i >= 0; i--) {
            moveTemplatesToLayer(item.pageItems[i], targetLayer);
        }
    }
}


// ────────────────────────────────────────────────────────
//  LOGO HELPERS
// ────────────────────────────────────────────────────────

// Import a logo file (PNG/AI/EPS/PDF), scale to target width, return item (or null)
// Does NOT tag as __jersey_template__ — logos stay on Print layer.
function importLogoFile(layer, logoPath, targetWidthPts) {
    if (!logoPath) return null;
    var logoFile = new File(logoPath);
    if (!logoFile.exists) return null;

    var item = null;

    if (isRasterFile(logoPath)) {
        // Raster (PNG / JPG): place as linked image
        try {
            var placed = layer.placedItems.add();
            placed.file = logoFile;
            item = placed;
        } catch (e) { return null; }
    } else {
        // Vector (AI / EPS / PDF / SVG): createFromFile with fallback
        try {
            item = layer.groupItems.createFromFile(logoFile);
        } catch (e1) {
            try {
                var origDoc = app.activeDocument;
                var tmpDoc = app.open(logoFile);
                var tempG = tmpDoc.layers[0].groupItems.add();
                for (var si = tmpDoc.pageItems.length - 1; si >= 0; si--) {
                    if (tmpDoc.pageItems[si] !== tempG)
                        tmpDoc.pageItems[si].move(tempG, ElementPlacement.PLACEATEND);
                }
                item = tempG.duplicate(layer, ElementPlacement.PLACEATBEGINNING);
                tmpDoc.close(SaveOptions.DONOTSAVECHANGES);
                app.activeDocument = origDoc;
            } catch (e2) { return null; }
        }
    }
    if (!item) return null;

    // Scale to target width (maintain aspect ratio)
    var vb = item.visibleBounds;
    var nativeW = vb[2] - vb[0];
    if (nativeW > 0) {
        var sf = (targetWidthPts / nativeW) * 100;
        item.resize(sf, sf);
    }
    return item;
}

// Resolve which logo file to use for a given player/team.
// Checks team-specific logo folder first, then falls back to global logo.
function resolveLogoPath(playerTeam) {
    // 1. Team-specific logo from logo folder
    if (CFG.logo.folder && playerTeam && playerTeam !== "") {
        var logoFolder = new Folder(CFG.logo.folder);
        if (logoFolder.exists) {
            var teamLower = playerTeam.toLowerCase().replace(/\s+/g, "_");
            var exts = [".png", ".ai", ".eps", ".pdf"];
            // Try direct name match with each extension
            for (var ei = 0; ei < exts.length; ei++) {
                var tryFile = new File(logoFolder.fullName + "/" + playerTeam + exts[ei]);
                if (tryFile.exists) return tryFile.fullName;
                tryFile = new File(logoFolder.fullName + "/" + teamLower + exts[ei]);
                if (tryFile.exists) return tryFile.fullName;
            }
            // Case-insensitive scan of folder contents
            var files = logoFolder.getFiles();
            for (var fi = 0; fi < files.length; fi++) {
                if (files[fi] instanceof File) {
                    var fname = files[fi].name.toLowerCase();
                    var fbase = fname.replace(/\.[^.]+$/, "");
                    if (fbase === teamLower) return files[fi].fullName;
                }
            }
        }
    }
    // 2. Fall back to global logo
    return CFG.logo.file || null;
}

// Resolve front logo file for a given player/team.
// Checks logo folder for {teamName}_front.{ext}, falls back to global front logo.
function resolveFrontLogoPath(playerTeam) {
    if (CFG.logo.folder && playerTeam && playerTeam !== "") {
        var logoFolder = new Folder(CFG.logo.folder);
        if (logoFolder.exists) {
            var teamLower = playerTeam.toLowerCase().replace(/\s+/g, "_");
            var exts = [".png", ".ai", ".eps", ".pdf"];
            for (var ei = 0; ei < exts.length; ei++) {
                var tryFile = new File(logoFolder.fullName + "/" + playerTeam + "_front" + exts[ei]);
                if (tryFile.exists) return tryFile.fullName;
                tryFile = new File(logoFolder.fullName + "/" + teamLower + "_front" + exts[ei]);
                if (tryFile.exists) return tryFile.fullName;
            }
            // Case-insensitive scan
            var files = logoFolder.getFiles();
            for (var fi = 0; fi < files.length; fi++) {
                if (files[fi] instanceof File) {
                    var fname = files[fi].name.toLowerCase();
                    var fbase = fname.replace(/\.[^.]+$/, "");
                    if (fbase === teamLower + "_front") return files[fi].fullName;
                }
            }
        }
    }
    return CFG.frontLogo.file || null;
}

// Position a logo item relative to text elements based on CFG.logo.placement
function positionLogo(logoItem, numGroup, nameGroup, textGroup) {
    var placement = CFG.logo.placement;
    var gapPts = CFG.logo.gapInches * 72;
    var logoVB = logoItem.visibleBounds;
    var logoCX = (logoVB[0] + logoVB[2]) / 2;

    if (placement === "below") {
        // Center horizontally with number, top edge at numberBottom - gap
        var numVB = numGroup.visibleBounds;
        var numCX = (numVB[0] + numVB[2]) / 2;
        logoItem.translate(numCX - logoCX, (numVB[3] - gapPts) - logoVB[1]);

    } else if (placement === "above") {
        // Center horizontally with name (or number if no name)
        // Bottom edge at refTop + gap
        var refG = nameGroup || numGroup;
        var refVB = refG.visibleBounds;
        var refCX = (refVB[0] + refVB[2]) / 2;
        logoItem.translate(refCX - logoCX, (refVB[1] + gapPts) - logoVB[3]);

    } else {
        // Custom: center of textGroup + offsets
        var tgVB = textGroup.visibleBounds;
        var tgCX = (tgVB[0] + tgVB[2]) / 2;
        var tgCY = (tgVB[1] + tgVB[3]) / 2;
        var logoMidY = (logoVB[1] + logoVB[3]) / 2;
        logoItem.translate(
            tgCX + CFG.logo.offsetX * 72 - logoCX,
            tgCY - CFG.logo.offsetY * 72 - logoMidY
        );
    }
}

// Import, position, and add a logo to a text group
function addLogoToGroup(layer, logoPath, numGroup, nameGroup, textGroup) {
    if (!logoPath) return;
    var logoW = CFG.logo.widthInches * CFG.ppi;
    var logoItem = importLogoFile(layer, logoPath, logoW);
    if (!logoItem) return;
    positionLogo(logoItem, numGroup, nameGroup, textGroup);
    logoItem.move(textGroup, ElementPlacement.PLACEATEND);
}


// ────────────────────────────────────────────────────────
//  CSV PARSER  (header-aware: Name,Number,Size,Model,TeamName)
// ────────────────────────────────────────────────────────

/**
 * Quote-safe CSV line parser (RFC 4180 + common extensions).
 * Handles: commas inside quoted fields ("SMITH, JR"),
 *          doubled-quote escapes inside quoted fields ("O""CONNOR"),
 *          optional whitespace (spaces/tabs) around unquoted values, and
 *          empty fields (including a trailing comma producing a final empty field).
 * Returns an array of field strings (leading/trailing whitespace trimmed
 * for unquoted fields; inner content preserved as-is for quoted fields).
 */
function parseCSVLine(line) {
    var fields = [];
    var i = 0;
    var len = line.length;

    if (len === 0) return fields;

    while (true) {
        // Skip optional leading whitespace (space or tab) before each field
        while (i < len && (line.charAt(i) === ' ' || line.charAt(i) === '\t')) i++;

        if (i < len && line.charAt(i) === '"') {
            // ── Quoted field ──
            i++; // skip opening quote
            var field = "";
            while (i < len) {
                var ch = line.charAt(i);
                if (ch === '"') {
                    if (i + 1 < len && line.charAt(i + 1) === '"') {
                        // Doubled quote is an escaped literal quote
                        field += '"';
                        i += 2;
                    } else {
                        i++; // skip closing quote
                        break;
                    }
                } else {
                    field += ch;
                    i++;
                }
            }
            fields.push(field);
            // Skip optional trailing whitespace (space or tab) after closing quote
            while (i < len && (line.charAt(i) === ' ' || line.charAt(i) === '\t')) i++;
        } else {
            // ── Unquoted field: read until comma or end of line ──
            var start = i;
            while (i < len && line.charAt(i) !== ',') i++;
            fields.push(trim(line.substring(start, i)));
        }

        // Consume comma separator; if none, we're done
        if (i < len && line.charAt(i) === ',') {
            i++;
            if (i === len) {
                // Trailing comma → append empty last field and stop
                fields.push("");
                break;
            }
            // Continue to next field
        } else {
            break; // end of line (no more commas)
        }
    }
    return fields;
}

function parseCSV(file) {
    var players = [];
    file.open("r");
    var lineNum = 0;
    var colMap = null;  // null = positional fallback; object = header-mapped

    while (!file.eof) {
        var line = file.readln();
        lineNum++;
        line = trim(line);
        if (line === "") continue;
        var cols = parseCSVLine(line);
        if (cols.length < 2) continue;

        // Note: quoted fields are already stripped of enclosing quotes by parseCSVLine.

        // First row: detect headers
        if (lineNum === 1) {
            var lower0 = cols[0].toLowerCase();
            var lower1 = cols[1].toLowerCase();
            if (lower0 === "name" || lower1 === "number" || lower1 === "#") {
                // Build column map from headers (case-insensitive)
                colMap = {};
                for (var hi = 0; hi < cols.length; hi++) {
                    var h = cols[hi].toLowerCase().replace(/[\s_-]/g, "");
                    if (h === "name")                          colMap.name   = hi;
                    else if (h === "number" || h === "#")      colMap.number = hi;
                    else if (h === "size")                     colMap.size   = hi;
                    else if (h === "model")                    colMap.model  = hi;
                    else if (h === "teamname" || h === "team") colMap.team   = hi;
                }
                continue;  // skip header row
            }
        }

        var nameVal, numVal, sizeVal, modelVal, teamVal;

        if (colMap) {
            // Header-mapped columns
            nameVal  = (colMap.name   != null && colMap.name   < cols.length) ? cols[colMap.name]   : "";
            numVal   = (colMap.number != null && colMap.number < cols.length) ? cols[colMap.number]  : "";
            sizeVal  = (colMap.size   != null && colMap.size   < cols.length) ? cols[colMap.size]    : "";
            modelVal = (colMap.model  != null && colMap.model  < cols.length) ? cols[colMap.model]   : "";
            teamVal  = (colMap.team   != null && colMap.team   < cols.length) ? cols[colMap.team]    : "";
        } else {
            // Positional fallback: col0=Name, col1=Number, col2=Size, col3=Model, col4=TeamName
            nameVal  = cols[0];
            numVal   = cols[1];
            sizeVal  = (cols.length > 2) ? cols[2] : "";
            modelVal = (cols.length > 3) ? cols[3] : "";
            teamVal  = (cols.length > 4) ? cols[4] : "";
        }

        if (nameVal !== "" && numVal !== "")
            players.push({
                name:   nameVal.toUpperCase(),
                number: numVal,
                size:   sizeVal,
                model:  modelVal,
                team:   teamVal
            });
    }
    file.close();
    return players;
}


// ────────────────────────────────────────────────────────
//  PRESET CSV PARSER
// ────────────────────────────────────────────────────────
// Reads NHL_Jersey_Number_Colors.csv and returns an array
// of preset objects matching the PRESETS structure.
// CSV columns: Team,Variant,Layers,Fill_Hex,Fill_Name,
//   Inner_Hex,Inner_Name,Outer_Hex,Outer_Name,Notes
function parsePresetsCSV(file) {
    var presets = [];
    var TRACK_MAP = [0, 50, 70]; // tracking by layer count: 1→0, 2→50, 3→70
    var ZERO_CMYK = {c:0, m:0, y:0, k:0};

    file.open("r");
    var lineNum = 0;
    while (!file.eof) {
        var line = file.readln();
        lineNum++;
        line = trim(line);
        if (line === "") continue;

        // Skip header row
        if (lineNum === 1 && /^Team/i.test(line)) continue;

        // Use quote-safe parser so team names like "Seattle, WA" parse correctly
        var cols = parseCSVLine(line);
        if (cols.length < 4) continue;

        var team    = cols[0];
        var variant = cols[1];
        var layers  = parseInt(cols[2]) || 2;
        var fillHex = cols[3];
        // cols[4] = Fill_Name (skip)
        var innerHex = (cols.length > 5) ? cols[5] : "";
        // cols[6] = Inner_Name (skip)
        var outerHex = (cols.length > 7) ? cols[7] : "";
        // cols[8] = Outer_Name (skip)
        var bgHex    = (cols.length > 9) ? cols[9] : "";
        // cols[10] = Notes (skip)

        if (team === "" || fillHex === "") continue;

        // Convert hex colors to CMYK
        var fillCMYK  = hexToCmyk(fillHex);
        var innerCMYK = (innerHex !== "" && layers >= 2) ? hexToCmyk(innerHex) : ZERO_CMYK;
        var outerCMYK = (outerHex !== "" && layers >= 3) ? hexToCmyk(outerHex) : ZERO_CMYK;
        var tracking  = TRACK_MAP[Math.min(layers, 3) - 1];

        var bgCMYK = (bgHex !== "" && /^#?[0-9A-Fa-f]{3,6}$/.test(bgHex)) ? hexToCmyk(bgHex) : ZERO_CMYK;

        var presetName = team + (variant ? " " + variant : "");
        var style = {
            layers:     layers,
            tracking:   tracking,
            fillColor:  fillCMYK,
            innerColor: innerCMYK,
            outerColor: outerCMYK,
            innerPct:   0.0467,
            outerPct:   0.0933
        };

        presets.push({
            name:         presetName,
            numberHeight: CFG.numberHeight,
            nameRatio:    CFG.nameRatio,
            gapInches:    CFG.gapInches,
            padInches:    CFG.padInches,
            fontName:     CFG.fontName,
            bgColor:      bgCMYK,
            number:       style,
            name_style: {
                layers:     style.layers,
                tracking:   style.tracking,
                fillColor:  {c: style.fillColor.c, m: style.fillColor.m, y: style.fillColor.y, k: style.fillColor.k},
                innerColor: {c: style.innerColor.c, m: style.innerColor.m, y: style.innerColor.y, k: style.innerColor.k},
                outerColor: {c: style.outerColor.c, m: style.outerColor.m, y: style.outerColor.y, k: style.outerColor.k},
                innerPct:   style.innerPct,
                outerPct:   style.outerPct
            }
        });
    }
    file.close();
    return presets;
}


// ────────────────────────────────────────────────────────
//  AUTO-LOAD NHL PRESETS CSV (if present in script folder)
// ────────────────────────────────────────────────────────
var NHL_CSV_NAME = "NHL_Jersey_Number_Colors.csv";

function findPresetsCSV() {
    // Method 1: Same folder as script ($.fileName)
    try {
        var sf = new File($.fileName);
        if (sf.exists) {
            var f1 = new File(sf.parent + "/" + NHL_CSV_NAME);
            if (f1.exists) return f1;
        }
    } catch (e) {}

    // Method 2: Use #includepath / current folder
    try {
        var f2 = new File(NHL_CSV_NAME);
        if (f2.exists) return f2;
    } catch (e) {}

    // Method 3: Desktop subfolder (hardcoded fallback)
    try {
        var f3 = new File(Folder.desktop + "/Jesey number generator/" + NHL_CSV_NAME);
        if (f3.exists) return f3;
    } catch (e) {}

    return null;
}

(function loadExternalPresets() {
    var csvFile = findPresetsCSV();
    if (!csvFile) return; // CSV not found — use hardcoded presets only

    try {
        // Add separator before NHL entries
        PRESETS.push({
            name: "\u2500\u2500 NHL Teams \u2500\u2500",
            numberHeight: 10, nameRatio: 0.25, gapInches: 0.25, padInches: 0.5,
            fontName: "Redwing-Medium",  bgColor: {c:0, m:0, y:0, k:0},
            number:     { layers:3, tracking:70, fillColor:{c:0,m:0,y:0,k:0}, innerColor:{c:0,m:0,y:0,k:0}, outerColor:{c:0,m:0,y:0,k:0}, innerPct:0.0467, outerPct:0.0933 },
            name_style: { layers:3, tracking:70, fillColor:{c:0,m:0,y:0,k:0}, innerColor:{c:0,m:0,y:0,k:0}, outerColor:{c:0,m:0,y:0,k:0}, innerPct:0.0467, outerPct:0.0933 }
        });
        var nhlPresets = parsePresetsCSV(csvFile);
        for (var np = 0; np < nhlPresets.length; np++)
            PRESETS.push(nhlPresets[np]);
    } catch (e) {
        alert("NHL presets CSV found but failed to parse:\n" + e.message);
    }
})();


// ════════════════════════════════════════════════════════
//  UI CONSTANTS & VALIDATION HELPERS
// ════════════════════════════════════════════════════════
var UI = {
    NUM_W:      55,     // width for numeric input fields (inches, %, etc.)
    TEXT_W:     160,    // width for text input fields (font name, team, etc.)
    HEX_W:     70,     // width for hex color fields
    CMYK_W:    38,     // width for individual C/M/Y/K fields
    LABEL_W:   90,     // width for row labels (left column)
    LABEL_SM:  50,     // width for small inline labels
    PATH_W:    200,    // width for file path display labels
    DROP_W:    200,    // width for dropdown lists
    TAB_W:     580,    // tabbed panel width (fixed)
    TAB_H:     390,    // tabbed panel height (fixed)
    DLG_W:     620,    // dialog width (fixed)
    SEP_H:     2,      // separator line height
    VGAP:      4,      // vertical gap between sections
    ERR_CLR:   [1.0, 0.85, 0.85],  // light red for invalid fields
    OK_CLR:    [1.0, 1.0, 1.0]     // white for valid fields
};

// Add a visual separator line to a container
function addSeparator(parent) {
    var sep = parent.add("panel", undefined, "");
    sep.alignment = ["fill", "center"];
    sep.preferredSize = [-1, UI.SEP_H];
    return sep;
}

// Validate a numeric field: sets background color, returns true if valid
function validateNumericField(field, min, max, allowEmpty) {
    var val = trim(field.text);
    if (allowEmpty && val === "") {
        field.graphics.backgroundColor = field.graphics.newBrush(
            field.graphics.BrushType.SOLID_COLOR, UI.OK_CLR);
        return true;
    }
    var n = parseFloat(val);
    var valid = !isNaN(n) && (min === undefined || n >= min) && (max === undefined || n <= max);
    try {
        field.graphics.backgroundColor = field.graphics.newBrush(
            field.graphics.BrushType.SOLID_COLOR, valid ? UI.OK_CLR : UI.ERR_CLR);
    } catch (e) {} // Some ScriptUI versions don't support backgroundColor
    return valid;
}

// Wire up numeric validation on a field (onChange + onChanging)
function wireValidation(field, min, max, allowEmpty) {
    var handler = function() { validateNumericField(field, min, max, allowEmpty); };
    field.onChange = handler;
    field.onChanging = handler;
    return handler;   // return so caller can chain additional onChange logic
}

// ════════════════════════════════════════════════════════
//  DIALOG HELPERS
// ════════════════════════════════════════════════════════

// Add a color row: Hex + CMYK with bidirectional sync
function addColorBlock(parent, label, color) {
    var g = parent.add("group");
    g.orientation = "row";
    g.alignment = ["fill", "center"];
    g.alignChildren = ["left", "center"];
    var lbl = g.add("statictext", undefined, label);
    lbl.preferredSize = [UI.LABEL_W, -1];
    g.add("statictext", undefined, "Hex:");
    var hexField = g.add("edittext", undefined, cmykToHex(color.c, color.m, color.y, color.k));
    hexField.preferredSize = [UI.HEX_W, -1];
    hexField.helpTip = "Hex color value (e.g. #FF0000). Syncs with CMYK fields.";
    g.add("statictext", undefined, "C");
    var cField = g.add("edittext", undefined, color.c.toString());
    cField.preferredSize = [UI.CMYK_W, -1];
    cField.helpTip = "Cyan (0\u2013100)";
    g.add("statictext", undefined, "M");
    var mField = g.add("edittext", undefined, color.m.toString());
    mField.preferredSize = [UI.CMYK_W, -1];
    mField.helpTip = "Magenta (0\u2013100)";
    g.add("statictext", undefined, "Y");
    var yField = g.add("edittext", undefined, color.y.toString());
    yField.preferredSize = [UI.CMYK_W, -1];
    yField.helpTip = "Yellow (0\u2013100)";
    g.add("statictext", undefined, "K");
    var kField = g.add("edittext", undefined, color.k.toString());
    kField.preferredSize = [UI.CMYK_W, -1];
    kField.helpTip = "Black (0\u2013100)";

    var result = {
        grp: g, hex: hexField,
        c: cField, m: mField, y: yField, k: kField,
        _syncing: false
    };

    // Hex → CMYK
    hexField.onChange = function() {
        if (result._syncing) return;
        var val = trim(hexField.text);
        if (/^#?[0-9A-Fa-f]{6}$/.test(val)) {
            result._syncing = true;
            var conv = hexToCmyk(val);
            cField.text = conv.c.toString();
            mField.text = conv.m.toString();
            yField.text = conv.y.toString();
            kField.text = conv.k.toString();
            result._syncing = false;
        }
    };

    // CMYK → Hex
    var cmykHandler = function() {
        if (result._syncing) return;
        result._syncing = true;
        var cc = parseFloat(cField.text) || 0;
        var mm = parseFloat(mField.text) || 0;
        var yy = parseFloat(yField.text) || 0;
        var kk = parseFloat(kField.text) || 0;
        hexField.text = cmykToHex(cc, mm, yy, kk);
        result._syncing = false;
    };
    cField.onChange = cmykHandler;
    mField.onChange = cmykHandler;
    yField.onChange = cmykHandler;
    kField.onChange = cmykHandler;

    return result;
}

// Read CMYK values from a row's fields
function readCMYK(row) {
    return {
        c: parseFloat(row.c.text) || 0,
        m: parseFloat(row.m.text) || 0,
        y: parseFloat(row.y.text) || 0,
        k: parseFloat(row.k.text) || 0
    };
}

// Build a style tab (Number or Name) — returns field references
function addStyleTab(tab, style) {
    tab.orientation = "column";
    tab.alignChildren = ["fill", "top"];
    tab.margins = [10, 15, 10, 5];
    tab.spacing = 8;

    // ── Layers + Tracking row ──
    var topGrp = tab.add("group");
    topGrp.orientation = "row";
    topGrp.alignChildren = ["left", "center"];
    var layerLbl = topGrp.add("statictext", undefined, "Layers:");
    layerLbl.preferredSize = [UI.LABEL_W, -1];
    var layerDrop = topGrp.add("dropdownlist", undefined,
        ["1 - Fill only", "2 - Fill + Inner", "3 - Fill + Inner + Outer"]);
    layerDrop.selection = style.layers - 1;
    layerDrop.preferredSize = [UI.DROP_W, -1];
    layerDrop.helpTip = "Number of color layers: 1 = fill only, 2 = fill + inner stroke, 3 = fill + inner + outer stroke";
    topGrp.add("statictext", undefined, "  Tracking:");
    var trackField = topGrp.add("edittext", undefined, style.tracking.toString());
    trackField.preferredSize = [UI.NUM_W, -1];
    trackField.helpTip = "Character spacing (em/1000). Typical: 0 (1-layer), 50 (2-layer), 70 (3-layer)";

    addSeparator(tab);

    // ── Fill color (always visible) ──
    var fillPanel = tab.add("panel", undefined, "Fill");
    fillPanel.alignChildren = ["fill", "center"];
    fillPanel.margins = [10, 15, 10, 8];
    var fillRow = addColorBlock(fillPanel, "Fill color:", style.fillColor);

    // ── Inner stroke panel ──
    var innerPanel = tab.add("panel", undefined, "Inner Stroke");
    innerPanel.alignChildren = ["fill", "center"];
    innerPanel.margins = [10, 15, 10, 8];
    var innerColorRow = addColorBlock(innerPanel, "Color:", style.innerColor);
    var ipg = innerPanel.add("group");
    ipg.orientation = "row";
    ipg.alignChildren = ["left", "center"];
    var ipgLbl = ipg.add("statictext", undefined, "Width (% of height):");
    ipgLbl.preferredSize = [UI.LABEL_W + 40, -1];
    var innerPctField = ipg.add("edittext", undefined, (style.innerPct * 100).toFixed(2));
    innerPctField.preferredSize = [UI.NUM_W, -1];
    innerPctField.helpTip = "Inner stroke width as a percentage of text height (e.g. 4.67 = 4.67%)";
    var innerPctPreview = ipg.add("statictext", undefined, "");
    innerPctPreview.characters = 14;
    innerPanel.enabled = style.layers >= 2;

    // ── Outer stroke panel ──
    var outerPanel = tab.add("panel", undefined, "Outer Stroke");
    outerPanel.alignChildren = ["fill", "center"];
    outerPanel.margins = [10, 15, 10, 8];
    var outerColorRow = addColorBlock(outerPanel, "Color:", style.outerColor);
    var opg = outerPanel.add("group");
    opg.orientation = "row";
    opg.alignChildren = ["left", "center"];
    var opgLbl = opg.add("statictext", undefined, "Width (% of height):");
    opgLbl.preferredSize = [UI.LABEL_W + 40, -1];
    var outerPctField = opg.add("edittext", undefined, (style.outerPct * 100).toFixed(2));
    outerPctField.preferredSize = [UI.NUM_W, -1];
    outerPctField.helpTip = "Outer stroke width as a percentage of text height (e.g. 9.33 = 9.33%)";
    var outerPctPreview = opg.add("statictext", undefined, "");
    outerPctPreview.characters = 14;
    outerPanel.enabled = style.layers >= 3;

    // ── Auto-update on layer change ──
    var TRACK_DEFAULTS = [0, 50, 70];
    layerDrop.onChange = function() {
        var idx = layerDrop.selection.index;
        trackField.text = TRACK_DEFAULTS[idx].toString();
        innerPanel.enabled = idx >= 1;
        outerPanel.enabled = idx >= 2;
    };

    return {
        layerDrop: layerDrop, trackField: trackField,
        fillRow: fillRow,
        innerColorRow: innerColorRow, innerPctField: innerPctField,
        innerPctPreview: innerPctPreview,
        outerColorRow: outerColorRow, outerPctField: outerPctField,
        outerPctPreview: outerPctPreview
    };
}

// Read style fields back into a style object
function readStyle(fields, fallback) {
    return {
        layers:     fields.layerDrop.selection.index + 1,
        tracking:   parseInt(fields.trackField.text) || 0,
        fillColor:  readCMYK(fields.fillRow),
        innerColor: readCMYK(fields.innerColorRow),
        outerColor: readCMYK(fields.outerColorRow),
        innerPct:   (parseFloat(fields.innerPctField.text) || 4.67) / 100,
        outerPct:   (parseFloat(fields.outerPctField.text) || 9.33) / 100
    };
}


// ════════════════════════════════════════════════════════
//  SETTINGS DIALOG
// ════════════════════════════════════════════════════════
function showSettingsDialog() {
    var dlg = new Window("dialog", "Jersey Generator \u2014 Settings");
    dlg.orientation = "column";
    dlg.alignChildren = ["fill", "top"];
    dlg.preferredSize = [UI.DLG_W, -1];

    // ── PRESET DROPDOWN ──
    var presetGrp = dlg.add("group");
    presetGrp.orientation = "row";
    presetGrp.alignment = ["fill", "center"];
    presetGrp.alignChildren = ["left", "center"];
    var presetLbl = presetGrp.add("statictext", undefined, "Preset:");
    presetLbl.preferredSize = [UI.LABEL_W, -1];
    var presetNames = [];
    for (var pi = 0; pi < PRESETS.length; pi++) presetNames.push(PRESETS[pi].name);
    var presetDrop = presetGrp.add("dropdownlist", undefined, presetNames);
    presetDrop.selection = 0;
    presetDrop.alignment = ["fill", "center"];
    presetDrop.helpTip = "Select a team preset to auto-fill all color and sizing fields";

    var tp = dlg.add("tabbedpanel");
    tp.preferredSize = [UI.TAB_W, UI.TAB_H];

    // ── LAYOUT TAB ──
    var t1 = tp.add("tab", undefined, "Layout");
    t1.orientation = "column";
    t1.alignChildren = ["fill", "top"];
    t1.margins = [10, 15, 10, 5];
    t1.spacing = 6;

    // ── Output Mode ──
    var modePanel = t1.add("panel", undefined, "Output Mode");
    modePanel.alignChildren = ["fill", "center"];
    modePanel.margins = [10, 15, 10, 8];

    var modeGrp = modePanel.add("group");
    modeGrp.orientation = "row";
    modeGrp.alignChildren = ["left", "center"];
    var modeLbl = modeGrp.add("statictext", undefined, "Mode:");
    modeLbl.preferredSize = [UI.LABEL_W, -1];
    var modeDrop = modeGrp.add("dropdownlist", undefined,
        ["Production \u2014 Full size for cutting", "Proof \u2014 Scaled to fit page"]);
    modeDrop.selection = (CFG.outputMode === "proof") ? 1 : 0;
    modeDrop.alignment = ["fill", "center"];
    modeDrop.helpTip = "Production: full-size artboards for vinyl cutting. Proof: scaled to fit a print page.";

    var proofGrp = modePanel.add("group");
    proofGrp.orientation = "row";
    proofGrp.alignChildren = ["left", "center"];
    var pageLbl = proofGrp.add("statictext", undefined, "Page preset:");
    pageLbl.preferredSize = [UI.LABEL_W, -1];
    var PAGE_PRESETS = [
        {name: "Tabloid Landscape", w: 17,   h: 11},
        {name: "Tabloid Portrait",  w: 11,   h: 17},
        {name: "Letter Landscape",  w: 11,   h: 8.5},
        {name: "Letter Portrait",   w: 8.5,  h: 11},
        {name: "Custom",            w: 0,    h: 0}
    ];
    var presetPageNames = [];
    for (var pp = 0; pp < PAGE_PRESETS.length; pp++) presetPageNames.push(PAGE_PRESETS[pp].name);
    var pageDrop = proofGrp.add("dropdownlist", undefined, presetPageNames);
    pageDrop.selection = 0;
    pageDrop.preferredSize = [UI.DROP_W, -1];
    pageDrop.helpTip = "Standard page sizes for proof artboards";

    var dimGrp = modePanel.add("group");
    dimGrp.orientation = "row";
    dimGrp.alignChildren = ["left", "center"];
    var dimWLbl = dimGrp.add("statictext", undefined, "W (in):");
    dimWLbl.preferredSize = [UI.LABEL_SM, -1];
    var proofWField = dimGrp.add("edittext", undefined, CFG.proofWidth.toString());
    proofWField.preferredSize = [UI.NUM_W, -1];
    proofWField.helpTip = "Proof artboard width in inches";
    dimGrp.add("statictext", undefined, "H (in):");
    var proofHField = dimGrp.add("edittext", undefined, CFG.proofHeight.toString());
    proofHField.preferredSize = [UI.NUM_W, -1];
    proofHField.helpTip = "Proof artboard height in inches";
    dimGrp.add("statictext", undefined, "Margin (%):");
    var proofMarginField = dimGrp.add("edittext", undefined, (CFG.proofMargin * 100).toString());
    proofMarginField.preferredSize = [UI.NUM_W, -1];
    proofMarginField.helpTip = "Safety margin inside proof artboard (% of artboard size)";

    // Page preset → auto-fill dimensions
    pageDrop.onChange = function() {
        var idx = pageDrop.selection.index;
        if (idx < PAGE_PRESETS.length - 1) {
            proofWField.text = PAGE_PRESETS[idx].w.toString();
            proofHField.text = PAGE_PRESETS[idx].h.toString();
        }
    };

    // Enable/disable proof fields based on mode
    var proofFieldsEnabled = (CFG.outputMode === "proof");
    proofGrp.enabled = proofFieldsEnabled;
    dimGrp.enabled = proofFieldsEnabled;

    modeDrop.onChange = function() {
        var isProof = modeDrop.selection.index === 1;
        proofGrp.enabled = isProof;
        dimGrp.enabled = isProof;
    };

    var szPanel = t1.add("panel", undefined, "Sizing");
    szPanel.alignChildren = ["fill", "center"];
    szPanel.margins = [10, 15, 10, 8];

    var r1 = szPanel.add("group");
    r1.orientation = "row";
    r1.alignChildren = ["left", "center"];
    r1.add("statictext", undefined, "Num height (in):");
    var numHField = r1.add("edittext", undefined, CFG.numberHeight.toString());
    numHField.preferredSize = [UI.NUM_W, -1];
    numHField.helpTip = "Height of jersey numbers in inches (e.g. 10 = 10 inches tall)";
    r1.add("statictext", undefined, "Name ratio (%):");
    var ratioField = r1.add("edittext", undefined, (CFG.nameRatio * 100).toString());
    ratioField.preferredSize = [UI.NUM_W, -1];
    ratioField.helpTip = "Name text height as a percentage of number height (e.g. 25 = name is 25% of number height)";
    var ratioPreview = r1.add("statictext", undefined, "");
    ratioPreview.characters = 18;

    var r2 = szPanel.add("group");
    r2.orientation = "row";
    r2.alignChildren = ["left", "center"];
    r2.add("statictext", undefined, "Gap (in):");
    var gapField = r2.add("edittext", undefined, CFG.gapInches.toString());
    gapField.preferredSize = [UI.NUM_W, -1];
    gapField.helpTip = "Vertical gap between name and number in inches";
    r2.add("statictext", undefined, "Pad (in):");
    var padField = r2.add("edittext", undefined, CFG.padInches.toString());
    padField.preferredSize = [UI.NUM_W, -1];
    padField.helpTip = "Padding around text within the artboard in inches";
    r2.add("statictext", undefined, "Nudge X:");
    var nudgeXField = r2.add("edittext", undefined, CFG.nudgeX.toString());
    nudgeXField.preferredSize = [UI.NUM_W, -1];
    nudgeXField.helpTip = "Final horizontal offset in inches (applied after centering). Negative = left.";
    r2.add("statictext", undefined, "Y:");
    var nudgeYField = r2.add("edittext", undefined, CFG.nudgeY.toString());
    nudgeYField.preferredSize = [UI.NUM_W, -1];
    nudgeYField.helpTip = "Final vertical offset in inches (applied after centering). Positive = down.";

    var bgRow = addColorBlock(szPanel, "BG color:", CFG.bgColor);

    // ── Jersey Template ──
    var jerseyBackPath = CFG.jerseyBack || "";
    var jerseyFrontPath = CFG.jerseyFront || "";

    var jerseyPanel = t1.add("panel", undefined, "Jersey Template");
    jerseyPanel.alignChildren = ["fill", "center"];
    jerseyPanel.margins = [10, 15, 10, 8];

    var jfGrp = jerseyPanel.add("group");
    jfGrp.orientation = "row";
    jfGrp.alignChildren = ["left", "center"];
    var jfLbl = jfGrp.add("statictext", undefined, "Front Template:");
    jfLbl.preferredSize = [UI.LABEL_W, -1];
    var jerseyFrontLabel = jfGrp.add("statictext", undefined,
        jerseyFrontPath ? new File(jerseyFrontPath).name : "(none)");
    jerseyFrontLabel.preferredSize = [UI.PATH_W, -1];
    jerseyFrontLabel.helpTip = "Selected front jersey template file";
    var jfBrowse = jfGrp.add("button", undefined, "Browse\u2026");
    jfBrowse.helpTip = "Choose a front jersey template image (PNG/JPG/SVG/AI/EPS/PDF)";
    var jfClear  = jfGrp.add("button", undefined, "Clear");
    jfClear.helpTip = "Remove front jersey template";
    jfBrowse.onClick = function() {
        var templateFilter = (File.fs === "Macintosh")
            ? function(f) { return f instanceof Folder || /\.(png|jpe?g|svg|ai|eps|pdf)$/i.test(f.name); }
            : "Template files:*.png;*.jpg;*.jpeg;*.svg;*.ai;*.eps;*.pdf";
        var f = File.openDialog("Select Front Jersey Template", templateFilter);
        if (f) { jerseyFrontPath = f.fullName; jerseyFrontLabel.text = f.name; }
    };
    jfClear.onClick = function() { jerseyFrontPath = ""; jerseyFrontLabel.text = "(none)"; };

    var jbGrp = jerseyPanel.add("group");
    jbGrp.orientation = "row";
    jbGrp.alignChildren = ["left", "center"];
    var jbLbl = jbGrp.add("statictext", undefined, "Back Template:");
    jbLbl.preferredSize = [UI.LABEL_W, -1];
    var jerseyBackLabel = jbGrp.add("statictext", undefined,
        jerseyBackPath ? new File(jerseyBackPath).name : "(none)");
    jerseyBackLabel.preferredSize = [UI.PATH_W, -1];
    jerseyBackLabel.helpTip = "Selected back jersey template file";
    var jbBrowse = jbGrp.add("button", undefined, "Browse\u2026");
    jbBrowse.helpTip = "Choose a back jersey template image (PNG/JPG/SVG/AI/EPS/PDF)";
    var jbClear  = jbGrp.add("button", undefined, "Clear");
    jbClear.helpTip = "Remove back jersey template";
    jbBrowse.onClick = function() {
        var templateFilter = (File.fs === "Macintosh")
            ? function(f) { return f instanceof Folder || /\.(png|jpe?g|svg|ai|eps|pdf)$/i.test(f.name); }
            : "Template files:*.png;*.jpg;*.jpeg;*.svg;*.ai;*.eps;*.pdf";
        var f = File.openDialog("Select Back Jersey Template", templateFilter);
        if (f) { jerseyBackPath = f.fullName; jerseyBackLabel.text = f.name; }
    };
    jbClear.onClick = function() { jerseyBackPath = ""; jerseyBackLabel.text = "(none)"; };

    var jrGrp = jerseyPanel.add("group");
    jrGrp.orientation = "row";
    jrGrp.alignChildren = ["left", "center"];
    jrGrp.add("statictext", undefined, "Ratio (%):");
    var jerseyRatioField = jrGrp.add("edittext", undefined,
        (CFG.jerseyRatio * 100).toString());
    jerseyRatioField.preferredSize = [UI.NUM_W, -1];
    jerseyRatioField.helpTip = "Number height as a percentage of jersey height (e.g. 30 = number is 30% of jersey)";
    jrGrp.add("statictext", undefined, "Vert pos (%):");
    var vertPctField = jrGrp.add("edittext", undefined,
        (CFG.textVerticalPct * 100).toString());
    vertPctField.preferredSize = [UI.NUM_W, -1];
    vertPctField.helpTip = "Text center Y position as percentage from top of jersey (e.g. 40 = 40% down)";
    jrGrp.add("statictext", undefined, "Opacity (%):");
    var templateOpacityField = jrGrp.add("edittext", undefined,
        CFG.templateOpacity.toString());
    templateOpacityField.preferredSize = [UI.NUM_W, -1];
    templateOpacityField.helpTip = "Template layer opacity in proof mode (0\u2013100%)";

    var jvGrp = jerseyPanel.add("group");
    jvGrp.orientation = "row";
    jvGrp.alignChildren = ["left", "center"];
    var jvLbl = jvGrp.add("statictext", undefined, "View:");
    jvLbl.preferredSize = [UI.LABEL_W, -1];
    var jerseyViewDrop = jvGrp.add("dropdownlist", undefined,
        ["Back Only", "Front Only", "Front + Back (Side by Side)"]);
    var viewMap = {"back": 0, "front": 1, "both": 2};
    jerseyViewDrop.selection = viewMap[CFG.jerseyView] || 0;
    jerseyViewDrop.preferredSize = [UI.DROP_W, -1];
    jerseyViewDrop.helpTip = "Which jersey views to generate: back only, front only, or both side by side";

    // ── Guide Files (zone-based placement) ──
    var guideBackPath  = CFG.guideBack  || "";
    var guideFrontPath = CFG.guideFront || "";

    var gbGrp = jerseyPanel.add("group");
    gbGrp.orientation = "row";
    gbGrp.alignChildren = ["left", "center"];
    var gbLbl = gbGrp.add("statictext", undefined, "Back Guide:");
    gbLbl.preferredSize = [UI.LABEL_W, -1];
    var guideBackLabel = gbGrp.add("statictext", undefined,
        guideBackPath ? new File(guideBackPath).name : "(none)");
    guideBackLabel.preferredSize = [UI.PATH_W, -1];
    guideBackLabel.helpTip = "AI file with colored zone rectangles for back jersey placement";
    var gbBrowse = gbGrp.add("button", undefined, "Browse\u2026");
    gbBrowse.helpTip = "Choose an Illustrator (.ai) guide file for back jersey zones";
    var gbClear  = gbGrp.add("button", undefined, "Clear");
    gbClear.helpTip = "Remove back guide file";
    gbBrowse.onClick = function() {
        var aiFilter = (File.fs === "Macintosh")
            ? function(f) { return f instanceof Folder || /\.ai$/i.test(f.name); }
            : "Illustrator files:*.ai";
        var f = File.openDialog("Select Back Guide File", aiFilter);
        if (f) { guideBackPath = f.fullName; guideBackLabel.text = f.name; }
    };
    gbClear.onClick = function() { guideBackPath = ""; guideBackLabel.text = "(none)"; };

    var gfGrp = jerseyPanel.add("group");
    gfGrp.orientation = "row";
    gfGrp.alignChildren = ["left", "center"];
    var gfLbl = gfGrp.add("statictext", undefined, "Front Guide:");
    gfLbl.preferredSize = [UI.LABEL_W, -1];
    var guideFrontLabel = gfGrp.add("statictext", undefined,
        guideFrontPath ? new File(guideFrontPath).name : "(none)");
    guideFrontLabel.preferredSize = [UI.PATH_W, -1];
    guideFrontLabel.helpTip = "AI file with colored zone rectangles for front jersey placement";
    var gfBrowse = gfGrp.add("button", undefined, "Browse\u2026");
    gfBrowse.helpTip = "Choose an Illustrator (.ai) guide file for front jersey zones";
    var gfClear  = gfGrp.add("button", undefined, "Clear");
    gfClear.helpTip = "Remove front guide file";
    gfBrowse.onClick = function() {
        var aiFilter = (File.fs === "Macintosh")
            ? function(f) { return f instanceof Folder || /\.ai$/i.test(f.name); }
            : "Illustrator files:*.ai";
        var f = File.openDialog("Select Front Guide File", aiFilter);
        if (f) { guideFrontPath = f.fullName; guideFrontLabel.text = f.name; }
    };
    gfClear.onClick = function() { guideFrontPath = ""; guideFrontLabel.text = "(none)"; };

    var guideHintGrp = jerseyPanel.add("group");
    guideHintGrp.alignment = ["fill", "center"];
    var guideHintTxt = guideHintGrp.add("statictext", undefined,
        "Guide zones:  Red = Number    Blue = Name    Green = Logo");
    guideHintTxt.graphics.font = ScriptUI.newFont(guideHintTxt.graphics.font.name, "ITALIC", guideHintTxt.graphics.font.size);

    // ── Team Logo ──
    var logoFilePath = CFG.logo.file || "";
    var frontLogoFilePath = CFG.frontLogo.file || "";
    var logoFolderPath = CFG.logo.folder || "";

    var logoPanel = t1.add("panel", undefined, "Team Logo");
    logoPanel.alignChildren = ["fill", "center"];
    logoPanel.margins = [10, 15, 10, 8];

    var lgFileGrp = logoPanel.add("group");
    lgFileGrp.orientation = "row";
    lgFileGrp.alignChildren = ["left", "center"];
    var lgFileLbl = lgFileGrp.add("statictext", undefined, "Back Logo:");
    lgFileLbl.preferredSize = [UI.LABEL_W, -1];
    var logoFileLabel = lgFileGrp.add("statictext", undefined,
        logoFilePath ? new File(logoFilePath).name : "(none)");
    logoFileLabel.preferredSize = [UI.PATH_W, -1];
    logoFileLabel.helpTip = "Selected back logo file";
    var lgBrowse = lgFileGrp.add("button", undefined, "Browse\u2026");
    lgBrowse.helpTip = "Choose a logo file (PNG/AI/EPS/PDF) for the back of the jersey";
    var lgClear  = lgFileGrp.add("button", undefined, "Clear");
    lgClear.helpTip = "Remove back logo";
    lgBrowse.onClick = function() {
        var logoFilter = (File.fs === "Macintosh")
            ? function(f) { return f instanceof Folder || /\.(png|ai|eps|pdf)$/i.test(f.name); }
            : "Logo files:*.png;*.ai;*.eps;*.pdf";
        var f = File.openDialog("Select Team Logo", logoFilter);
        if (f) { logoFilePath = f.fullName; logoFileLabel.text = f.name; }
    };
    lgClear.onClick = function() { logoFilePath = ""; logoFileLabel.text = "(none)"; };

    var lgPlaceGrp = logoPanel.add("group");
    lgPlaceGrp.orientation = "row";
    lgPlaceGrp.alignChildren = ["left", "center"];
    var lgPlaceLbl = lgPlaceGrp.add("statictext", undefined, "Placement:");
    lgPlaceLbl.preferredSize = [UI.LABEL_W, -1];
    var logoPlaceDrop = lgPlaceGrp.add("dropdownlist", undefined,
        ["Below Number", "Above Name", "Custom Position"]);
    var placeMap = {"below": 0, "above": 1, "custom": 2};
    logoPlaceDrop.selection = placeMap[CFG.logo.placement] || 0;
    logoPlaceDrop.helpTip = "Where to position the logo relative to the name/number text";
    lgPlaceGrp.add("statictext", undefined, "W (in):");
    var logoWidthField = lgPlaceGrp.add("edittext", undefined, CFG.logo.widthInches.toString());
    logoWidthField.preferredSize = [UI.NUM_W, -1];
    logoWidthField.helpTip = "Logo width in inches (height scales proportionally)";
    lgPlaceGrp.add("statictext", undefined, "Gap:");
    var logoGapField = lgPlaceGrp.add("edittext", undefined, CFG.logo.gapInches.toString());
    logoGapField.preferredSize = [UI.NUM_W, -1];
    logoGapField.helpTip = "Gap between logo and nearest text element in inches";

    var lgOffGrp = logoPanel.add("group");
    lgOffGrp.orientation = "row";
    lgOffGrp.alignChildren = ["left", "center"];
    var lgOffLbl = lgOffGrp.add("statictext", undefined, "Offset X (in):");
    lgOffLbl.preferredSize = [UI.LABEL_W, -1];
    var logoOffXField = lgOffGrp.add("edittext", undefined, CFG.logo.offsetX.toString());
    logoOffXField.preferredSize = [UI.NUM_W, -1];
    logoOffXField.helpTip = "Custom X offset from center in inches (only for Custom placement)";
    lgOffGrp.add("statictext", undefined, "Offset Y (in):");
    var logoOffYField = lgOffGrp.add("edittext", undefined, CFG.logo.offsetY.toString());
    logoOffYField.preferredSize = [UI.NUM_W, -1];
    logoOffYField.helpTip = "Custom Y offset from center in inches (only for Custom placement)";
    lgOffGrp.enabled = (CFG.logo.placement === "custom");

    logoPlaceDrop.onChange = function() {
        lgOffGrp.enabled = (logoPlaceDrop.selection.index === 2);
    };

    addSeparator(logoPanel);

    var lgFrontFileGrp = logoPanel.add("group");
    lgFrontFileGrp.orientation = "row";
    lgFrontFileGrp.alignChildren = ["left", "center"];
    var lgFrontLbl = lgFrontFileGrp.add("statictext", undefined, "Front Logo:");
    lgFrontLbl.preferredSize = [UI.LABEL_W, -1];
    var frontLogoFileLabel = lgFrontFileGrp.add("statictext", undefined,
        frontLogoFilePath ? new File(frontLogoFilePath).name : "(none)");
    frontLogoFileLabel.preferredSize = [UI.PATH_W, -1];
    frontLogoFileLabel.helpTip = "Selected front logo file";
    var lgFrontBrowse = lgFrontFileGrp.add("button", undefined, "Browse\u2026");
    lgFrontBrowse.helpTip = "Choose a logo file for the front of the jersey";
    var lgFrontClear  = lgFrontFileGrp.add("button", undefined, "Clear");
    lgFrontClear.helpTip = "Remove front logo";
    lgFrontBrowse.onClick = function() {
        var logoFilter = (File.fs === "Macintosh")
            ? function(f) { return f instanceof Folder || /\.(png|ai|eps|pdf)$/i.test(f.name); }
            : "Logo files:*.png;*.ai;*.eps;*.pdf";
        var f = File.openDialog("Select Front Logo", logoFilter);
        if (f) { frontLogoFilePath = f.fullName; frontLogoFileLabel.text = f.name; }
    };
    lgFrontClear.onClick = function() { frontLogoFilePath = ""; frontLogoFileLabel.text = "(none)"; };

    var lgFrontSizeGrp = logoPanel.add("group");
    lgFrontSizeGrp.orientation = "row";
    lgFrontSizeGrp.alignChildren = ["left", "center"];
    lgFrontSizeGrp.add("statictext", undefined, "Front W (in):");
    var frontLogoWidthField = lgFrontSizeGrp.add("edittext", undefined, CFG.frontLogo.widthInches.toString());
    frontLogoWidthField.preferredSize = [UI.NUM_W, -1];
    frontLogoWidthField.helpTip = "Front logo width in inches";
    lgFrontSizeGrp.add("statictext", undefined, "Vert (%):");
    var frontLogoVertField = lgFrontSizeGrp.add("edittext", undefined, (CFG.frontLogo.verticalPct * 100).toString());
    frontLogoVertField.preferredSize = [UI.NUM_W, -1];
    frontLogoVertField.helpTip = "Front logo Y position as percentage from top of jersey";
    lgFrontSizeGrp.add("statictext", undefined, "Off X:");
    var frontLogoOffXField = lgFrontSizeGrp.add("edittext", undefined, CFG.frontLogo.offsetX.toString());
    frontLogoOffXField.preferredSize = [UI.NUM_W, -1];
    frontLogoOffXField.helpTip = "Front logo horizontal offset from jersey center in inches";
    lgFrontSizeGrp.add("statictext", undefined, "Y:");
    var frontLogoOffYField = lgFrontSizeGrp.add("edittext", undefined, CFG.frontLogo.offsetY.toString());
    frontLogoOffYField.preferredSize = [UI.NUM_W, -1];
    frontLogoOffYField.helpTip = "Front logo vertical offset from calculated position in inches";

    addSeparator(logoPanel);

    var lgFolderGrp = logoPanel.add("group");
    lgFolderGrp.orientation = "row";
    lgFolderGrp.alignChildren = ["left", "center"];
    var lgFolderLbl = lgFolderGrp.add("statictext", undefined, "Logo Folder:");
    lgFolderLbl.preferredSize = [UI.LABEL_W, -1];
    var logoFolderLabel = lgFolderGrp.add("statictext", undefined,
        logoFolderPath ? new Folder(logoFolderPath).name : "(none)");
    logoFolderLabel.preferredSize = [UI.PATH_W, -1];
    logoFolderLabel.helpTip = "Folder containing team-specific logos (matched by team name)";
    var lgFBrowse = lgFolderGrp.add("button", undefined, "Browse\u2026");
    lgFBrowse.helpTip = "Choose a folder containing team-specific logo files";
    var lgFClear  = lgFolderGrp.add("button", undefined, "Clear");
    lgFClear.helpTip = "Remove logo folder";
    lgFBrowse.onClick = function() {
        var f = Folder.selectDialog("Select Logo Library Folder");
        if (f) { logoFolderPath = f.fullName; logoFolderLabel.text = f.name; }
    };
    lgFClear.onClick = function() { logoFolderPath = ""; logoFolderLabel.text = "(none)"; };

    var fontJobPanel = t1.add("panel", undefined, "Font / Job Info");
    fontJobPanel.alignChildren = ["fill", "center"];
    fontJobPanel.margins = [10, 15, 10, 8];
    var fjGrp = fontJobPanel.add("group");
    fjGrp.orientation = "row";
    fjGrp.alignChildren = ["left", "center"];
    var fontLbl = fjGrp.add("statictext", undefined, "Font:");
    fontLbl.preferredSize = [UI.LABEL_SM, -1];
    var fontField = fjGrp.add("edittext", undefined, CFG.fontName);
    fontField.preferredSize = [UI.TEXT_W, -1];
    fontField.helpTip = "PostScript font name (e.g. Redwing-Medium). Must be installed on this machine.";
    fjGrp.add("statictext", undefined, "Team:");
    var teamNameField = fjGrp.add("edittext", undefined, CFG.teamName);
    teamNameField.preferredSize = [UI.TEXT_W, -1];
    teamNameField.helpTip = "Default team name for the batch. Per-player team name from CSV overrides this.";

    // ── NUMBER TAB ──
    var t2 = tp.add("tab", undefined, "Number");
    var numFields = addStyleTab(t2, CFG.number);

    // ── NAME TAB ──
    var t3 = tp.add("tab", undefined, "Name");
    var nameFields = addStyleTab(t3, CFG.name);

    // Activate first tab by default to stabilize dialog sizing
    tp.selection = t1;

    // ── HELPER: fill a style tab's fields from a style object ──
    function fillStyleFields(fields, s) {
        fields.layerDrop.selection = s.layers - 1;
        fields.trackField.text = s.tracking.toString();
        // Fill color
        fields.fillRow.c.text = s.fillColor.c.toString();
        fields.fillRow.m.text = s.fillColor.m.toString();
        fields.fillRow.y.text = s.fillColor.y.toString();
        fields.fillRow.k.text = s.fillColor.k.toString();
        fields.fillRow.hex.text = cmykToHex(s.fillColor.c, s.fillColor.m, s.fillColor.y, s.fillColor.k);
        // Inner
        fields.innerColorRow.c.text = s.innerColor.c.toString();
        fields.innerColorRow.m.text = s.innerColor.m.toString();
        fields.innerColorRow.y.text = s.innerColor.y.toString();
        fields.innerColorRow.k.text = s.innerColor.k.toString();
        fields.innerColorRow.hex.text = cmykToHex(s.innerColor.c, s.innerColor.m, s.innerColor.y, s.innerColor.k);
        fields.innerPctField.text = (s.innerPct * 100).toFixed(2);
        // Outer
        fields.outerColorRow.c.text = s.outerColor.c.toString();
        fields.outerColorRow.m.text = s.outerColor.m.toString();
        fields.outerColorRow.y.text = s.outerColor.y.toString();
        fields.outerColorRow.k.text = s.outerColor.k.toString();
        fields.outerColorRow.hex.text = cmykToHex(s.outerColor.c, s.outerColor.m, s.outerColor.y, s.outerColor.k);
        fields.outerPctField.text = (s.outerPct * 100).toFixed(2);
    }

    // ── PRESET CHANGE HANDLER ──
    presetDrop.onChange = function() {
        var idx = presetDrop.selection.index;
        if (idx === 0) return;  // "— Custom —" does nothing
        var p = PRESETS[idx];
        // Skip separator rows (e.g. "── NHL Teams ──")
        if (p.name.charAt(0) === "\u2500") return;
        // Layout fields
        numHField.text  = p.numberHeight.toString();
        ratioField.text = (p.nameRatio * 100).toString();
        gapField.text   = p.gapInches.toString();
        padField.text   = p.padInches.toString();
        fontField.text  = p.fontName;
        // Background color
        if (p.bgColor) {
            bgRow.c.text = p.bgColor.c.toString();
            bgRow.m.text = p.bgColor.m.toString();
            bgRow.y.text = p.bgColor.y.toString();
            bgRow.k.text = p.bgColor.k.toString();
            bgRow.hex.text = cmykToHex(p.bgColor.c, p.bgColor.m, p.bgColor.y, p.bgColor.k);
        }
        // Number + Name style fields
        fillStyleFields(numFields, p.number);
        fillStyleFields(nameFields, p.name_style);
        updateAllPreviews();
    };

    // ── LIVE PREVIEW UPDATES ──
    function updateAllPreviews() {
        var numH = parseFloat(numHField.text) || 10;
        var ppi = CFG.ppi;
        var ratio = (parseFloat(ratioField.text) || 20) / 100;

        // Name ratio preview
        var namePtsCalc = numH * ppi * ratio;
        var nameInCalc = namePtsCalc / ppi;
        ratioPreview.text = "= " + namePtsCalc.toFixed(1) + "pt (" + nameInCalc.toFixed(2) + " in)";

        // Number stroke previews
        var numPtsCalc = numH * ppi;
        var numInnerPct = (parseFloat(numFields.innerPctField.text) || 0) / 100;
        var numOuterPct = (parseFloat(numFields.outerPctField.text) || 0) / 100;
        numFields.innerPctPreview.text = "= " + (numPtsCalc * numInnerPct).toFixed(1) + "pt";
        numFields.outerPctPreview.text = "= " + (numPtsCalc * numOuterPct).toFixed(1) + "pt";

        // Name stroke previews
        var nameInnerPct = (parseFloat(nameFields.innerPctField.text) || 0) / 100;
        var nameOuterPct = (parseFloat(nameFields.outerPctField.text) || 0) / 100;
        nameFields.innerPctPreview.text = "= " + (namePtsCalc * nameInnerPct).toFixed(1) + "pt";
        nameFields.outerPctPreview.text = "= " + (namePtsCalc * nameOuterPct).toFixed(1) + "pt";
    }

    // Set initial preview values
    updateAllPreviews();

    // ── INPUT VALIDATION ──
    // Wire validation on key numeric fields (highlight invalid entries)
    // These must come AFTER preview wiring so we can compose both handlers.
    wireValidation(gapField, 0, 20);
    wireValidation(padField, 0, 20);
    wireValidation(proofWField, 1, 100);
    wireValidation(proofHField, 1, 100);
    wireValidation(proofMarginField, 0, 50);
    wireValidation(jerseyRatioField, 1, 100);
    wireValidation(vertPctField, 0, 100);
    wireValidation(templateOpacityField, 0, 100);

    // Fields that also drive live previews: compose validation + preview
    numHField.onChange = function() {
        validateNumericField(numHField, 0.1, 100);
        updateAllPreviews();
    };
    ratioField.onChange = function() {
        validateNumericField(ratioField, 1, 100);
        updateAllPreviews();
    };
    numFields.innerPctField.onChange = function() {
        validateNumericField(numFields.innerPctField, 0, 100);
        updateAllPreviews();
    };
    numFields.outerPctField.onChange = function() {
        validateNumericField(numFields.outerPctField, 0, 100);
        updateAllPreviews();
    };
    nameFields.innerPctField.onChange = function() {
        validateNumericField(nameFields.innerPctField, 0, 100);
        updateAllPreviews();
    };
    nameFields.outerPctField.onChange = function() {
        validateNumericField(nameFields.outerPctField, 0, 100);
        updateAllPreviews();
    };

    addSeparator(dlg);

    // ── BUTTONS ──
    var bg = dlg.add("group");
    bg.alignment = ["right", "center"];
    bg.add("button", undefined, "OK",     { name: "ok"     });
    bg.add("button", undefined, "Cancel", { name: "cancel" });

    // Show and read
    if (dlg.show() !== 1) return false;

    // Apply to CFG
    CFG.numberHeight = parseFloat(numHField.text)  || CFG.numberHeight;
    CFG.nameRatio    = (parseFloat(ratioField.text) || 20) / 100;
    CFG.gapInches    = parseFloat(gapField.text)   || CFG.gapInches;
    CFG.padInches    = parseFloat(padField.text)    || CFG.padInches;
    CFG.fontName     = fontField.text               || CFG.fontName;
    CFG.bgColor      = readCMYK(bgRow);
    CFG.jerseyBack   = jerseyBackPath !== "" ? jerseyBackPath : null;
    CFG.jerseyFront  = jerseyFrontPath !== "" ? jerseyFrontPath : null;
    CFG.guideBack    = guideBackPath  !== "" ? guideBackPath  : null;
    CFG.guideFront   = guideFrontPath !== "" ? guideFrontPath : null;
    CFG.jerseyRatio  = (parseFloat(jerseyRatioField.text) || 30) / 100;
    CFG.textVerticalPct = (parseFloat(vertPctField.text) || 40) / 100;
    CFG.templateOpacity = Math.max(0, Math.min(100, parseFloat(templateOpacityField.text) || 100));
    var viewOptions = ["back", "front", "both"];
    CFG.jerseyView   = viewOptions[jerseyViewDrop.selection.index];
    CFG.outputMode   = modeDrop.selection.index === 0 ? "production" : "proof";
    CFG.proofWidth   = parseFloat(proofWField.text)  || 17;
    CFG.proofHeight  = parseFloat(proofHField.text)  || 11;
    CFG.proofMargin  = (parseFloat(proofMarginField.text) || 5) / 100;
    CFG.nudgeX       = parseFloat(nudgeXField.text)  || 0;
    CFG.nudgeY       = parseFloat(nudgeYField.text)  || 0;
    CFG.teamName     = trim(teamNameField.text);
    // Logo settings
    CFG.logo.file       = logoFilePath !== "" ? logoFilePath : null;
    var placeOptions = ["below", "above", "custom"];
    CFG.logo.placement  = placeOptions[logoPlaceDrop.selection.index];
    CFG.logo.widthInches = parseFloat(logoWidthField.text) || 2;
    CFG.logo.gapInches  = parseFloat(logoGapField.text) || 0.5;
    CFG.logo.offsetX    = parseFloat(logoOffXField.text) || 0;
    CFG.logo.offsetY    = parseFloat(logoOffYField.text) || 0;
    CFG.logo.folder     = logoFolderPath !== "" ? logoFolderPath : null;
    // Front logo settings
    CFG.frontLogo.file       = frontLogoFilePath !== "" ? frontLogoFilePath : null;
    CFG.frontLogo.widthInches = parseFloat(frontLogoWidthField.text) || 3;
    CFG.frontLogo.verticalPct = (parseFloat(frontLogoVertField.text) || 35) / 100;
    CFG.frontLogo.offsetX    = parseFloat(frontLogoOffXField.text) || 0;
    CFG.frontLogo.offsetY    = parseFloat(frontLogoOffYField.text) || 0;
    CFG.number       = readStyle(numFields, CFG.number);
    CFG.name         = readStyle(nameFields, CFG.name);

    recompute();
    return true;
}


// ────────────────────────────────────────────────────────
//  DIALOG: CSV vs Single Entry
// ────────────────────────────────────────────────────────
function showModeDialog() {
    var dlg = new Window("dialog", "Jersey Generator \u2014 Input Mode");
    dlg.orientation = "column";
    dlg.alignChildren = ["fill", "top"];
    dlg.margins = [20, 20, 20, 15];

    var lbl = dlg.add("statictext", undefined, "How would you like to enter player data?");
    lbl.alignment = ["center", "top"];

    addSeparator(dlg);

    var bg = dlg.add("group");
    bg.alignment = ["center", "center"];
    bg.spacing = 15;
    var csvBtn    = bg.add("button", undefined, "Load CSV File");
    csvBtn.helpTip = "Import player names and numbers from a CSV file (Name, Number, Size, Model, TeamName)";
    csvBtn.preferredSize = [140, 30];
    var singleBtn = bg.add("button", undefined, "Single Entry");
    singleBtn.helpTip = "Manually enter one player's name and number";
    singleBtn.preferredSize = [140, 30];
    var cancelBtn = bg.add("button", undefined, "Cancel");
    cancelBtn.preferredSize = [100, 30];

    // "Re-use last CSV" button if a previous CSV path is stored and file still exists
    var lastCsvBtn = null;
    if ($.global.__jerseyGenLastCSV) {
        var lastCsvFile = new File($.global.__jerseyGenLastCSV);
        if (lastCsvFile.exists) {
            addSeparator(dlg);
            var reuseGrp = dlg.add("group");
            reuseGrp.alignment = ["center", "center"];
            lastCsvBtn = reuseGrp.add("button", undefined, "Re-use last CSV: " + lastCsvFile.name);
            lastCsvBtn.helpTip = "Re-run with the same roster file:\n" + lastCsvFile.fullName;
            lastCsvBtn.preferredSize = [320, 30];
        }
    }

    var result = "cancel";
    csvBtn.onClick    = function() { result = "csv";    dlg.close(); };
    singleBtn.onClick = function() { result = "single"; dlg.close(); };
    cancelBtn.onClick = function() { dlg.close(); };
    if (lastCsvBtn) {
        lastCsvBtn.onClick = function() { result = "lastcsv"; dlg.close(); };
    }
    dlg.show();
    return result;
}


// ────────────────────────────────────────────────────────
//  DIALOG: Single Player Entry
// ────────────────────────────────────────────────────────
function showSingleEntryDialog() {
    var dlg = new Window("dialog", "Enter Player Info");
    dlg.orientation = "column";
    dlg.alignChildren = ["fill", "top"];
    dlg.margins = [20, 20, 20, 15];
    var ENTRY_LABEL_W = 80;

    var nr = dlg.add("group");
    nr.orientation = "row";
    nr.alignChildren = ["left", "center"];
    var nrLbl = nr.add("statictext", undefined, "Name:");
    nrLbl.preferredSize = [ENTRY_LABEL_W, -1];
    var nf = nr.add("edittext", undefined, "MUELLER");
    nf.preferredSize = [UI.TEXT_W, -1];
    nf.helpTip = "Player last name (will be converted to uppercase)";

    var numr = dlg.add("group");
    numr.orientation = "row";
    numr.alignChildren = ["left", "center"];
    var numrLbl = numr.add("statictext", undefined, "Number:");
    numrLbl.preferredSize = [ENTRY_LABEL_W, -1];
    var numf = numr.add("edittext", undefined, "22");
    numf.preferredSize = [UI.NUM_W, -1];
    numf.helpTip = "Jersey number (e.g. 22, 7, 99)";

    var SIZES = ["", "YXS", "YS", "YM", "YL", "YXL", "AS", "AM", "AL", "AXL", "A2XL", "A3XL"];
    var szr = dlg.add("group");
    szr.orientation = "row";
    szr.alignChildren = ["left", "center"];
    var szrLbl = szr.add("statictext", undefined, "Size:");
    szrLbl.preferredSize = [ENTRY_LABEL_W, -1];
    var sizeDrop = szr.add("dropdownlist", undefined, SIZES);
    sizeDrop.selection = 0;
    sizeDrop.preferredSize = [UI.NUM_W + 30, -1];
    sizeDrop.helpTip = "Jersey size (optional). Appears in artboard label.";

    var modr = dlg.add("group");
    modr.orientation = "row";
    modr.alignChildren = ["left", "center"];
    var modrLbl = modr.add("statictext", undefined, "Model:");
    modrLbl.preferredSize = [ENTRY_LABEL_W, -1];
    var modf = modr.add("edittext", undefined, "");
    modf.preferredSize = [UI.TEXT_W, -1];
    modf.helpTip = "Jersey model/style name (optional)";

    var tmr = dlg.add("group");
    tmr.orientation = "row";
    tmr.alignChildren = ["left", "center"];
    var tmrLbl = tmr.add("statictext", undefined, "Team Name:");
    tmrLbl.preferredSize = [ENTRY_LABEL_W, -1];
    var tmf = tmr.add("edittext", undefined, CFG.teamName || "");
    tmf.preferredSize = [UI.TEXT_W, -1];
    tmf.helpTip = "Team name (used for team-specific logo lookup)";

    addSeparator(dlg);

    var bg = dlg.add("group");
    bg.alignment = ["right", "center"];
    bg.add("button", undefined, "OK",     { name: "ok"     });
    bg.add("button", undefined, "Cancel", { name: "cancel" });

    if (dlg.show() === 1)
        return {
            name:   nf.text.toUpperCase(),
            number: numf.text,
            size:   sizeDrop.selection ? sizeDrop.selection.text : "",
            model:  modf.text,
            team:   tmf.text
        };
    return null;
}


// ────────────────────────────────────────────────────────
//  SESSION PERSISTENCE ($.global survives within Illustrator session)
// ────────────────────────────────────────────────────────

// Deep-copy all own properties from src into dst (recursive for nested objects)
function shallowCopyInto(src, dst) {
    for (var k in src) {
        if (!src.hasOwnProperty(k)) continue;
        var v = src[k];
        if (v === null || v === undefined || typeof v !== "object") {
            dst[k] = v;
        } else {
            if (typeof dst[k] !== "object" || dst[k] === null) dst[k] = {};
            shallowCopyInto(v, dst[k]);
        }
    }
}

// Restore CFG from last session run (if available)
function restoreLastCFG() {
    try {
        if ($.global.__jerseyGenLastCFG) {
            shallowCopyInto($.global.__jerseyGenLastCFG, CFG);
            recompute();
        }
    } catch (e) {
        // Ignore restore errors \u2014 start with defaults
    }
}

// Save current CFG to session for next run
function saveLastCFG() {
    $.global.__jerseyGenLastCFG = CFG;
    // Also store template/logo paths explicitly
    $.global.__jerseyGenLastJerseyBack  = CFG.jerseyBack;
    $.global.__jerseyGenLastJerseyFront = CFG.jerseyFront;
    $.global.__jerseyGenLastLogoFile    = CFG.logo ? CFG.logo.file : null;
}


// ────────────────────────────────────────────────────────
//  DIALOG: Document Mode (New vs Re-generate)
// ────────────────────────────────────────────────────────
function showDocModeDialog() {
    var dlg = new Window("dialog", "Jersey Generator \u2014 Document Mode");
    dlg.orientation = "column";
    dlg.alignChildren = ["fill", "top"];
    dlg.margins = [20, 20, 20, 15];

    var lbl = dlg.add("statictext", undefined, "An existing document is open. What would you like to do?");
    lbl.alignment = ["center", "top"];

    addSeparator(dlg);

    var bg = dlg.add("group");
    bg.alignment = ["center", "center"];
    bg.spacing = 15;
    var newBtn = bg.add("button", undefined, "NEW Document");
    newBtn.helpTip = "Create a brand new document (current document remains open)";
    newBtn.preferredSize = [180, 30];
    var regenBtn = bg.add("button", undefined, "Re-generate CURRENT");
    regenBtn.helpTip = "Clear all artwork from the current document and re-generate (keeps artboards)";
    regenBtn.preferredSize = [180, 30];
    var cancelBtn = bg.add("button", undefined, "Cancel");
    cancelBtn.preferredSize = [100, 30];

    var result = "cancel";
    newBtn.onClick    = function() { result = "new";        dlg.close(); };
    regenBtn.onClick  = function() { result = "regenerate"; dlg.close(); };
    cancelBtn.onClick = function() { dlg.close(); };
    dlg.show();
    return result;
}


// ────────────────────────────────────────────────────────
//  Re-generate: Clear document contents (keep artboards)
// ────────────────────────────────────────────────────────
function clearDocumentForRegenerate(doc) {
    // 1. Unlock all layers so items can be removed
    for (var li = 0; li < doc.layers.length; li++) {
        doc.layers[li].locked = false;
        doc.layers[li].visible = true;
    }

    // 2. Delete all page items from the document
    for (var i = doc.pageItems.length - 1; i >= 0; i--) {
        try { doc.pageItems[i].remove(); } catch (e) {}
    }

    // 3. Remove script-created layers (keep at least one layer)
    var scriptLayers = ["Template", "Print", "Info", "Marks"];
    for (var li2 = doc.layers.length - 1; li2 >= 0; li2--) {
        if (doc.layers.length <= 1) break;
        var lname = doc.layers[li2].name;
        for (var ni = 0; ni < scriptLayers.length; ni++) {
            if (lname === scriptLayers[ni]) {
                doc.layers[li2].remove();
                break;
            }
        }
    }
}


// ────────────────────────────────────────────────────────
//  MAIN
// ────────────────────────────────────────────────────────
function main() {
    // 0. Clear zone caches (force re-read if guide files changed)
    CFG._backZones  = null;
    CFG._frontZones = null;

    // 0b. Restore last-used settings from session (pre-populates dialog fields)
    restoreLastCFG();

    // 1. Check for existing open document
    var docMode = "new";
    if (app.documents.length > 0) {
        docMode = showDocModeDialog();
        if (docMode === "cancel") return;
    }

    // 2. Settings dialog (pre-populated from last session)
    if (!showSettingsDialog()) return;

    // 3. Save settings to session for next run
    saveLastCFG();

    // 4. Input mode
    var mode = showModeDialog();
    if (mode === "cancel") return;

    var players = [];
    if (mode === "csv" || mode === "lastcsv") {
        var csvFile;
        if (mode === "lastcsv") {
            csvFile = new File($.global.__jerseyGenLastCSV);
            if (!csvFile.exists) {
                alert("Last CSV file no longer exists:\n" + $.global.__jerseyGenLastCSV);
                return;
            }
        } else {
            csvFile = File.openDialog("Select CSV file", "CSV:*.csv");
        }
        if (!csvFile) return;
        players = parseCSV(csvFile);
        if (players.length === 0) {
            alert("No valid rows found.\nExpected format: Name,Number[,Size,Model,TeamName]");
            return;
        }
        // Store CSV path for "Re-use last CSV" button on next run
        $.global.__jerseyGenLastCSV = csvFile.fullName;
    } else {
        var entry = showSingleEntryDialog();
        if (!entry) return;
        players = [entry];
    }

    // 5. Calculate artboard dimensions (shared by new-doc and re-generate)
    var initW = 2000, initH = 1800, initCols = 5;

    if (CFG.outputMode === "proof") {
        initW = Math.ceil(CFG.proofWidth  * 72);
        initH = Math.ceil(CFG.proofHeight * 72);
        initCols = Math.max(1, Math.floor(8000 / (initW + 20)));
        if (initCols > 8) initCols = 8;

    } else {
        var backVB  = CFG.jerseyBack  ? readTemplateDimensions(CFG.jerseyBack)  : null;
        var frontVB = CFG.jerseyFront ? readTemplateDimensions(CFG.jerseyFront) : null;
        var refVB   = backVB || frontVB;

        if (refVB) {
            var scaleFactor = (numPts / CFG.jerseyRatio) / refVB.h;
            var singleW = Math.ceil(refVB.w * scaleFactor);
            var singleH = Math.ceil(refVB.h * scaleFactor);

            if (CFG.jerseyView === "both" && backVB && frontVB) {
                var fScaleW = Math.ceil(frontVB.w * ((numPts / CFG.jerseyRatio) / frontVB.h));
                var bScaleW = Math.ceil(backVB.w  * ((numPts / CFG.jerseyRatio) / backVB.h));
                initW = fScaleW + bScaleW + 40 + padPts * 2 + 50;
                initH = singleH + padPts * 2 + 50;
            } else {
                initW = singleW + padPts * 2 + 50;
                initH = singleH + padPts * 2 + 50;
            }
        }

        initCols = Math.max(1, Math.floor(8000 / (initW + 20)));
        if (CFG.jerseyView === "both") {
            if (initCols > 3) initCols = 3;
        } else {
            if (initCols > 5) initCols = 5;
        }
    }

    // 6. Create or prepare document
    var doc, printLayer, templateLayer;

    if (docMode === "regenerate") {
        // ── Re-generate into existing document ──
        doc = app.activeDocument;

        // Validate: player count must match artboard count
        if (players.length !== doc.artboards.length) {
            alert("Player count (" + players.length + ") does not match "
                + "artboard count (" + doc.artboards.length + ").\n\n"
                + "Cannot re-generate. The CSV/entry must have exactly "
                + doc.artboards.length + " player(s) to match the existing artboards.\n\n"
                + "Aborting.");
            return;
        }

        // Clear all artwork and script layers (artboards stay intact)
        clearDocumentForRegenerate(doc);

        // Resize artboards to match new settings (handles mode/size changes)
        resizeArtboardGrid(doc, initW, initH, initCols, 20);

        // Recreate layer structure
        printLayer = doc.layers[0];
        printLayer.name = "Print";
        templateLayer = doc.layers.add();
        templateLayer.name = "Template";
        templateLayer.move(printLayer, ElementPlacement.PLACEAFTER);

    } else {
        // ── New document ──
        doc = app.documents.add(
            DocumentColorSpace.CMYK, initW, initH,
            players.length,
            DocumentArtboardLayout.GridByRow, 20, initCols
        );

        printLayer = doc.layers[0];
        printLayer.name = "Print";
        templateLayer = doc.layers.add();
        templateLayer.name = "Template";
        templateLayer.move(printLayer, ElementPlacement.PLACEAFTER);
    }

    // 7. Generate with status bar
    var statusWin = new Window("palette", "Generating\u2026");
    statusWin.orientation = "column";
    statusWin.alignChildren = ["fill", "top"];
    statusWin.preferredSize = [360, -1];
    statusWin.margins = [15, 15, 15, 15];

    var statusLabel = statusWin.add("statictext", undefined, "Preparing\u2026");
    statusLabel.alignment = ["fill", "center"];
    var statusBar = statusWin.add("progressbar", undefined, 0, players.length);
    statusBar.preferredSize = [330, 14];
    var statusDetail = statusWin.add("statictext", undefined, "0 / " + players.length + " players");
    statusDetail.alignment = ["center", "center"];
    statusWin.show();

    var errors = [];
    for (var i = 0; i < players.length; i++) {
        // Update status bar
        statusLabel.text = "Generating: " + (players[i].name || "") + " " + players[i].number;
        statusDetail.text = (i + 1) + " / " + players.length + " players";
        statusBar.value = i;
        statusWin.update();

        try {
            generatePlayer(doc, printLayer, templateLayer, i, players[i]);
        } catch (e) {
            errors.push(players[i].name + " " + players[i].number + ": " + e.message);
        }
    }

    statusBar.value = players.length;
    statusLabel.text = "Complete!";
    statusDetail.text = players.length + " / " + players.length + " players";
    statusWin.update();
    statusWin.close();

    // 8. Post-generation layer setup
    if (CFG.outputMode === "production") {
        // Production: hide template layer (jersey not in output)
        templateLayer.visible = false;
    } else {
        // Proof: template visible with configurable opacity
        templateLayer.visible = true;
        templateLayer.opacity = CFG.templateOpacity;
    }
    // Lock template layer so it can't be accidentally edited
    templateLayer.locked = true;

    // 9. Report
    if (errors.length > 0)
        alert("Done with " + errors.length + " error(s):\n\n" + errors.join("\n"));
    else
        alert("Done! " + players.length + " player(s) generated.");
}

main();
