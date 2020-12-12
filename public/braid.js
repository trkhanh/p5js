$(document).ready(function() {
    
    if (document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Shape", "1.0")) {
        $(".cdo-nojq").hide()
    }
    if (!!document.createElementNS && !!document.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect) {
        $(".cdo-nojq").hide()
    }
    setPatternLinks("marudai");
    $.ajaxSetup({
        timeout: 20000
    });
    colourSource.init();
    colourSource.linkTo(function(a) {
        braid.setColour(a)
    });
    if (state != "") {
        braid.setState(state)
    }
    braid.url = braid_url;
    braid.load();
    colourSource.setColour("#ff0000")
});

function Adjustable(c, e, f, a, g, b) {
    if (e === undefined) {
        var d = c.split(",");
        this.name = d[0];
        this.key = d[1];
        this.minValue = parseInt(d[2]);
        this.increment = parseInt(d[3]);
        this.maxValue = parseInt(d[4]);
        this.currentValue = parseInt(d[5])
    } else {
        this.name = c;
        this.key = e;
        this.minValue = f;
        this.increment = a;
        this.maxValue = g;
        this.currentValue = b
    }
}
var braid = {
    container: "#brCanvas",
    url: "hollow2.php",
    adjustables: new Array(),
    oldAdjustables: null,
    stateAdjustables: new Array(),
    minHeight: 440,
    maxHeight: 600,
    height: 800,
    width: 300,
    border: 10,
    scale: 40,
    stitchSize: 0,
    minX: +Infinity,
    minY: +Infinity,
    maxX: 0,
    maxY: 0,
    rightPos: 0,
    bottPos: 0,
    numThreads: 16,
    maxThreads: 64,
    delay: 1000,
    attempts: 3,
    startPosX: 470,
    startPosY: 200,
    threadColours: new Array(),
    stitches: new Array(),
    paths: new Array(),
    mouseDown: false,
    currColour: "#ff0000",
    currId: "#ff0000",
    lastColour: "white",
    colourNumber: 0,
    colourList: new ColourList(32),
    colours: new Array(),
    groups: new Array(),
    angles: new Array(),
    undo: new Array(),
    redo: new Array(),
    newMove: true,
    kmButtons: new Array(),
    formats: "",
    threadAngle: 15,
    reset: function() {
        this.delay = 1000;
        this.attempts = 3
    },
    setState: function(d) {
        var a = 1, c, b;
        if (d.substr(0, 3) == "001") {
            a = parseInt(d.substr(3, 2), 16);
            d = d.substr(5)
        } else {}
        for (c = 0; c < a; c++) {
            this.stateAdjustables[c] = parseInt(d.substr(2 * c, 2), 16)
        }
        d = d.substr(a * 2);
        this.numThreads = d.length / 6;
        for (c = 0; c < this.numThreads; c++) {
            b = "#" + d.substr(c * 6, 6);
            this.threadColours[c] = b;
            this.colourList.newColour(b);
            this.colourList.colourUsed(b)
        }
    },
    load: function() {
        var c = this, a, b, d = {};
        $("#brCanvas svg").css({
            visibility: "hidden"
        });
        $("#kmDisplay > div").each(function() {
            if ($(this).attr("id") != "kmBraid") {
                $(this).remove()
            }
        });
        if ($("#spinner").length < 1) {
            $("#brCanvas").svg();
            a = $("#brCanvas").svg("get");
            a.configure({
                height: this.height
            });
            $(a.image(250, 200, 32, 32, "/i/ajax-loader.gif", {
                id: "spinner",
                visibility: "visible"
            }))
        } else {
            $("#spinner").css({
                display: "block"
            })
        }
        if (this.adjustables.length > 0) {
            for (b = 0; b < this.adjustables.length; b++) {
                d[this.adjustables[b].key] = this.adjustables[b].currentValue
            }
        } else {
            if (this.stateAdjustables.length > 1) {
                for (b = 0; b < this.stateAdjustables.length; b++) {
                    d["cdo_k" + b] = this.stateAdjustables[b]
                }
            } else {
                if (this.stateAdjustables.length == 1) {
                    d.threads = this.stateAdjustables[0]
                }
            }
        }
        $.ajax({
            type: "get",
            url: this.url,
            data: d,
            success: function(f) {
                var g, e;
                $("#brCanvas svg").empty();
                g = f.split("|"),
                buttonList = "";
                if (g[0].charAt(0) == "A") {
                    c.totalThreads = c.totalThreadsMultiplied;
                    g[0] = g[0].substr(1);
                    c.formats += "A"
                }
                if (g[0].charAt(0) == "B") {
                    buttonList = g[0].substr(1);
                    g.splice(0, 1);
                    c.formats += "B"
                }
                if (g[0].charAt(0) == "C") {
                    c.totalThreads = c.totalThreadsAddedDoubled;
                    g[0] = g[0].substr(1);
                    c.formats += "C"
                }
                if (g[0].charAt(0) == "M") {
                    g[0] = g[0].substr(1);
                    c.formats += "M"
                }
                if (g[0].charAt(0) == "T") {
                    g[0] = g[0].substr(1);
                    c.formats += "T"
                }
                $.each(g, function(h, i) {
                    c.addStitch(h, i)
                });
                c.setPatternButtons(buttonList);
                $("#brCanvas svg").css({
                    visibility: "visible"
                });
                $("#spinner").css({
                    display: "none"
                });
                if (c.formats.indexOf("M") != -1) {
                    e = new Image();
                    e.onload = function() {
                        c.display();
                        a.image(c.border - c.minX * c.scale, c.border - c.minY * c.scale, this.width * c.scale, this.height * c.scale, c.url.slice(0, c.url.length - 3) + "tm.png", {
                            "pointer-events": "none"
                        })
                    }
                    ;
                    e.src = c.url.slice(0, c.url.length - 3) + "tm.png"
                } else {
                    c.display()
                }
            },
            error: function(f, e) {
                if (c.attempts-- == 0) {
                    c.reset();
                    $("#brCanvas svg").css({
                        visibility: "visible"
                    });
                    $("#spinner").css({
                        display: "none"
                    });
                    alert("Couldn't update braid. Please try later");
                    return
                }
                setTimeout(function() {
                    c.load()
                }, c.delay *= 2)
            },
            complete: function() {}
        })
    },
    addStitch: function(a, e) {
        var c, d, f, b;
        if (a == 0) {
            this.init(e);
            return
        }
        d = e.split(";"),
        f = parseInt(d[0]);
        d.shift();
        for (c = 0; c < d.length; c++) {
            b = d[c].split(",");
            d[c] = new Point(parseFloat(b[0]),parseFloat(b[1]));
            if (d[c].x < this.minX) {
                this.minX = d[c].x
            }
            if (d[c].y < this.minY) {
                this.minY = d[c].y
            }
            if (d[c].x > this.maxX) {
                this.maxX = d[c].x
            }
            if (d[c].y > this.maxY) {
                this.maxY = d[c].y
            }
        }
        this.stitches.push(new Stitch(f,d))
    },
    init: function(d) {
        var b, c, e, a;
        b = d.split(";");
        this.minX = +Infinity;
        this.minY = +Infinity;
        this.maxX = 0;
        this.maxY = 0;
        this.numThreads = parseInt(b[0]);
        this.stitchSize = parseInt(b[1]);
        this.adjustables = new Array();
        if (this.formats.indexOf("A") != -1) {
            groupStart = 3;
            a = b[2].split("/");
            for (c = 0; c < a.length; c++) {
                this.adjustables.push(new Adjustable(a[c]))
            }
        } else {
            groupStart = 5;
            this.adjustables.push(new Adjustable("Threads","threads",parseInt(b[2]),parseInt(b[3]),parseInt(b[4]),this.numThreads))
        }
        this.groups = new Array();
        this.angles = new Array();
        this.stitches = new Array();
        for (c = groupStart; c < b.length; c++) {
            e = b[c].split(",");
            this.groups[c - groupStart] = parseInt(e[0]);
            this.angles[c - groupStart] = parseInt(e[1])
        }
        this.setColours()
    },
    setColours: function() {
        var e, c, f = "", h = "", b = -1, g = -1, a, d;
        if (this.oldAdjustables != null) {
            for (e = 0; e < this.adjustables.length; e++) {
                f += this.oldAdjustables[e] + ",";
                h += this.adjustables[e].currentValue + ","
            }
            f = f.slice(0, -1);
            h = h.slice(0, -1);
            if (colourMaps != null && this.newMove == true) {
                for (e = 0; e < colourMaps.length; e++) {
                    if (colourMaps[e].adjustableMap.from == f && colourMaps[e].adjustableMap.to == h) {
                        b = e;
                        break
                    }
                    if (colourMaps[e].adjustableMap.to == f && colourMaps[e].adjustableMap.from == h) {
                        g = e;
                        break
                    }
                }
                if (b > -1) {
                    a = jQuery.extend({}, this.threadColours);
                    this.threadColours = [];
                    for (e = 0; e < colourMaps[b].threadMaps.length; e++) {
                        d = colourMaps[b].threadMaps[e].to.split(",");
                        for (c = 0; c < d.length; c++) {
                            this.threadColours[d[c]] = a[colourMaps[b].threadMaps[e].from]
                        }
                    }
                } else {
                    if (g > -1) {
                        a = jQuery.extend({}, this.threadColours);
                        this.threadColours = [];
                        for (e = 0; e < colourMaps[g].threadMaps.length; e++) {
                            d = colourMaps[g].threadMaps[e].to.split(",");
                            this.threadColours[colourMaps[g].threadMaps[e].from] = a[d[0]]
                        }
                    }
                }
            }
            this.newMove = true
        }
        for (e = 0; e < this.numThreads; e++) {
            if (this.threadColours[e] == null) {
                this.threadColours[e] = this.currColour;
                this.colourList.newColour(this.currId);
                this.colourList.colourUsed(this.currId)
            }
        }
    },
    drawStart: function() {
        if (this.formats.indexOf("T") != -1) {
            this.drawTakadai()
        } else {
            this.drawMarudai()
        }
    },
    drawTakadai: function() {
        if (this.groups.length != 4) {
            this.drawMarudai();
            return
        }
        var c = this, b = this.groups.length, f = 14 - (this.totalThreads() / 10) - (b / 10), g = 0, k, e, r, q, d, n, h = this.startPosY - 150, p = this.startPosX - 150 + (f * 9), a = 0, m = 0, o, l = $("#brCanvas").svg("get");
        n = new Array(this.startPosX - 150 + f * 12,this.startPosX - 150 + f * 9,this.startPosX - 150,this.startPosX - 150 + f * 3);
        n = new Array(this.startPosX - 150 + f * 12,this.startPosX - 150 + f * 9,this.startPosX - 150,this.startPosX - 150 + f * 3);
        for (k = 0; k < 4; k++) {
            r = n[k];
            q = h;
            for (e = 0; e < this.groups[k]; e++) {
                d = "path" + g;
                l.circle(r, q, f, {
                    "class": d + " clickable",
                    stroke: "black",
                    strokeWidth: 1
                });
                $("." + d).attr({
                    fill: this.threadColours[g]
                });
                $("." + d, l.root()).on("dragstart", function(i) {
                    i.preventDefault();
                    return false
                });
                $("." + d, l.root()).on("mousedown", {
                    threadNum: g,
                    id: d
                }, function(i) {
                    c.mouseDown = true;
                    c.changeColour(i);
                    c.changeMouse()
                });
                $("." + d, l.root()).on("mouseup", function() {
                    c.mouseDown = false;
                    c.changeMouse()
                });
                if (q > a) {
                    a = q
                }
                q += f * 3;
                g++
            }
        }
        m = a + f * 1.5;
        o = p - 85;
        l.image(o, m, 170, 27, "/i/webaddr.170.png");
        m += 50;
        $(l.text(p - 50, m, "undo", {
            fontSize: 20,
            id: "undo",
            "class": "active"
        })).click(function() {
            c.undoMove()
        });
        $(l.text(p + 10, m, "redo", {
            fontSize: 20,
            id: "redo",
            "class": "active"
        })).click(function() {
            c.redoMove()
        });
        this.checkButtons()
    },
    calcThreadSizeAndAngle: function() {
        var b, d, c, a = 0;
        c = this.calcGroupAngleRatio(0, this.groups.length - 1);
        for (b = 1; b < this.groups.length; b++) {
            c = Math.min(c, this.calcGroupAngleRatio(b - 1, b))
        }
        d = c;
        if (d > this.threadAngle) {
            d = this.threadAngle
        }
        return d
    },
    calcGroupAngleRatio: function(a, e) {
        var d = (this.angles[a] + 360) % 360
          , c = (this.angles[e] + 360) % 360
          , b = (c - d + 360) % 360;
        if (b > 180) {
            b = 360 - b
        }
        return b / ((this.groups[a] + this.groups[e] + 2) / 2)
    },
    drawMarudai: function() {
        var b = this, a = this.groups.length, e = 14 - (this.totalThreads() / 10) - (a / 10), f = 0, g, d, q, p, o, n, c, m = this.startPosX, l = this.startPosY, k = 0, h = $("#brCanvas").svg("get");
        q = this.calcThreadSizeAndAngle();
        e = Math.min(14, (150 * 1.5) * Math.sin((q / 2) * Math.PI / 180));
        for (g = 0; g < a; g++) {
            p = this.angles[g];
            p -= (q * (this.groups[g] - 1)) / 2;
            for (d = 0; d < this.groups[g]; d++) {
                o = m + 150 * Math.sin(p * Math.PI / 180);
                n = l - 150 * Math.cos(p * Math.PI / 180);
                c = "path" + f;
                h.circle(o, n, e, {
                    "class": c + " clickable",
                    stroke: "black",
                    strokeWidth: 1
                });
                $("." + c).attr({
                    fill: this.threadColours[f]
                });
                $("." + c, h.root()).on("dragstart", function(i) {
                    i.preventDefault();
                    return false
                });
                $("." + c, h.root()).on("mousedown", {
                    threadNum: f,
                    id: c
                }, function(i) {
                    b.mouseDown = true;
                    b.changeColour(i);
                    b.changeMouse()
                });
                $("." + c, h.root()).on("mouseup", function() {
                    b.mouseDown = false;
                    b.changeMouse()
                });
                f++;
                p += q
            }
        }
        k = l - this.adjustables.length * 20;
        if (this.formats.indexOf("M") == -1) {
            h.image(m - 85, l + this.adjustables.length * 20, 170, 27, "/i/webaddr.170.png");
            for (g = 0; g < this.adjustables.length; g++) {
                txt = h.text(m - 100, k + (g * 50) - 5, this.adjustables[g].name, {
                    fontSize: 15,
                    "class": "active"
                });
                $(txt).attr({
                    x: m - 20 - txt.getBBox().width
                });
                $(h.text(m - 15, k + (g * 50), "+", {
                    fontSize: 30,
                    id: "incr_" + this.adjustables[g].key,
                    "class": "active"
                })).click({
                    adjustable: this.adjustables[g]
                }, function(i) {
                    b.updateAdjustable(i.data.adjustable, i.data.adjustable.increment)
                });
                $(h.text(m + 45, k + (g * 50), "-", {
                    fontSize: 30,
                    id: "decr_" + this.adjustables[g].key,
                    "class": "active"
                })).click({
                    adjustable: this.adjustables[g]
                }, function(i) {
                    b.updateAdjustable(i.data.adjustable, 0 - i.data.adjustable.increment)
                });
                $("#ofo").clone().insertAfter($("#incr_" + this.adjustables[g].key)).attr({
                    style: "display:block",
                    id: "fo_" + this.adjustables[g].key
                }).attr({
                    x: m - 15,
                    y: k + (g * 50)
                }).find("form").attr({
                    name: this.adjustables[g].key
                })
            }
        } else {
            h.image(m - 85, l - 14, 170, 27, "/i/webaddr.170.png")
        }
        $(h.text(m - 45, l + 225, "undo", {
            fontSize: 20,
            id: "undo",
            "class": "active"
        })).click(function() {
            b.undoMove()
        });
        $(h.text(m + 15, l + 225, "redo", {
            fontSize: 20,
            id: "redo",
            "class": "active"
        })).click(function() {
            b.redoMove()
        });
        this.checkButtons()
    },
    display: function(a) {
        var g = (this.width - 2 * this.border) / (this.maxX - this.minX), e = (this.height - 2 * this.border) / (this.maxY - this.minY), q, n, m, h, p, s, d, b, f, c, l, r;
        this.sendState();
        if (g > e) {
            this.scale = e
        } else {
            this.scale = g
        }
        if (this.scale > 1) {
            this.scale = Math.floor(this.scale)
        }
        q = Math.round(this.scale / 20 + 0.5);
        if (this.formats.indexOf("M") != -1) {
            q = 0
        }
        this.rightPos = this.scale * (this.maxX - this.minX) + 2 * this.border;
        this.bottPos = this.scale * (this.maxY - this.minY) + 2 * this.border;
        $("#brCanvas").svg();
        n = $("#brCanvas").svg("get");
        for (m = 0; m < this.stitches.length; m++) {
            s = this.stitches[m];
            d = (s.coords[0].x - this.minX) * this.scale + this.border;
            b = (s.coords[0].y - this.minY) * this.scale + this.border;
            f = (s.coords[1].x - this.minX) * this.scale + this.border;
            c = (s.coords[1].y - this.minY) * this.scale + this.border;
            r = n.createPath();
            r.move(d, b);
            p = s.coords.length;
            for (h = 1; h < p; h++) {
                var j = (d - f) * (d - f) + (b - c) * (b - c);
                var o = Math.sqrt(17) / 2 * Math.sqrt(j);
                r.arc(o, o, 0, false, true, f, c);
                d = f;
                b = c;
                if (h == p - 1) {
                    f = (s.coords[0].x - this.minX) * this.scale + this.border;
                    c = (s.coords[0].y - this.minY) * this.scale + this.border
                } else {
                    f = (s.coords[h + 1].x - this.minX) * this.scale + this.border;
                    c = (s.coords[h + 1].y - this.minY) * this.scale + this.border
                }
            }
            l = "path" + s.threadNum;
            j = (d - f) * (d - f) + (b - c) * (b - c);
            o = Math.sqrt(17) / 2 * Math.sqrt(j);
            n.path(r.arc(o, o, 0, false, true, f, c), {
                "class": l + " clickable",
                fill: this.threadColours[s.threadNum],
                stroke: "#000000",
                strokeWidth: q
            })
        }
        if (this.bottPos < this.minHeight) {
            this.bottPos = this.minHeight
        }
        n.configure({
            height: this.bottPos
        });
        this.drawStart();
        this.colourList.display()
    },
    calcControlPoint: function(c, b, e, d) {
        var a = {};
        a.x = e + (c - e) / 10;
        a.y = d + (b - d) / 10;
        return a
    },
    addUndo: function() {
        var a = new State(this.adjustables,this.threadColours,this.currColour,this.currId);
        this.undo.push(a);
        if (this.redo.length > 0) {
            this.redo = new Array()
        }
        this.checkButtons()
    },
    changeMouse: function() {
        var b = this, a;
        if (this.mouseDown) {
            for (a = 0; a < this.numThreads; a++) {
                $(".path" + a).on("mouseenter", {
                    threadNum: a
                }, function(c) {
                    b.changeColour(c)
                }).css({
                    cursor: "crosshair"
                })
            }
            $("#brCanvas").on("mouseup mouseleave", function(c) {
                b.mouseDown = false;
                b.changeMouse()
            })
        } else {
            for (a = 0; a < this.numThreads; a++) {
                $(".path" + a).off("mouseenter").css({
                    cursor: "pointer"
                })
            }
            $("#brCanvas").off("mouseup mouseleave")
        }
    },
    changeColour: function(b) {
        var a = b.data.threadNum;
        if ($(".path" + a).attr("fill") != this.currColour) {
            this.addUndo();
            $(".path" + a).attr("fill", this.currColour)
        }
        this.threadColours[a] = this.currColour;
        this.colourList.colourUsed(this.currId);
        this.sendState()
    },
    threadForm: function(b) {
        var a;
        for (a = 0; a < this.adjustables.length; a++) {
            if (this.adjustables[a].key == b.name) {
                this.updateAdjustable(this.adjustables[a], $("#fo_" + this.adjustables[a].key + " input:first").val() - this.adjustables[a].currentValue);
                break
            }
        }
        return false
    },
    setColour: function() {
        var b, c = arguments[0];
        var a = colourSource.colourById(c);
        colour = new RGBColor(a);
        if (colour.ok) {
            b = colour.toHex();
            this.currColour = b;
            this.currId = c;
            $("#color").css({
                backgroundColor: b
            });
            colourSource.showId(c)
        }
    },
    undoMove: function() {
        var a;
        if (this.undo.length > 0) {
            a = this.undo.pop();
            this.redo.push(new State(this.adjustables,this.threadColours,this.currColour,this.currId));
            this.resetState(a)
        }
    },
    redoMove: function() {
        var a;
        if (this.redo.length > 0) {
            a = this.redo.pop();
            this.undo.push(new State(this.adjustables,this.threadColours,this.currColour,this.currId));
            this.resetState(a)
        }
    },
    resetState: function(b) {
        var a;
        for (a = 0; a < b.adjustableValues.length; a++) {
            if (this.adjustables[a].currentValue != b.adjustableValues[a]) {
                this.adjustables[a].currentValue = b.adjustableValues[a];
                this.newMove = false
            }
        }
        if (!this.newMove) {
            this.load()
        }
        this.currColour = b.currColour;
        this.currId = b.currId;
        this.threadColours = jQuery.extend([], b.threadColours);
        for (a = 0; a < this.numThreads; a++) {
            $(".path" + a).attr("fill", this.threadColours[a])
        }
        colourSource.setId(this.currId);
        this.sendState();
        this.checkButtons()
    },
    updateThreads: function(b) {
        var a = this.numThreads;
        a = a + b;
        if (a % 2 != 0) {
            a--
        }
        if (a < this.minThreads) {
            a = this.minThreads
        }
        if (a > this.maxThreads) {
            a = this.maxThreads
        }
        this.checkButtons();
        if (a != this.numThreads) {
            this.addUndo();
            this.numThreads = a;
            this.load()
        }
    },
    updateAdjustable: function(c, e) {
        var b, a, d = c.currentValue;
        d = d + e;
        if ((d - c.minValue) % c.increment != 0) {
            d = d - (d - c.minValue) % c.increment
        }
        if (d < c.minValue) {
            d = c.minValue
        }
        if (d > c.maxValue) {
            d = c.maxValue
        }
        this.oldAdjustables = [];
        for (b = 0; b < this.adjustables.length; b++) {
            this.oldAdjustables.push(this.adjustables[b].currentValue)
        }
        a = c.currentValue;
        c.currentValue = d;
        if (this.totalThreads() > this.maxThreads) {
            alert("Too many threads!");
            d = a
        }
        c.currentValue = a;
        this.checkButtons();
        if (d != c.currentValue) {
            this.addUndo();
            c.currentValue = d;
            this.load()
        }
    },
    getState: function() {
        var d = "001", a = this.adjustables.length, b, c;
        d += this.hexString(a);
        for (b = 0; b < a; b++) {
            d += this.hexString(this.adjustables[b].currentValue)
        }
        if (a == 2) {
            c = this.totalThreads()
        } else {
            c = this.numThreads
        }
        for (b = 0; b < c; b++) {
            d += this.threadColours[b].substr(1)
        }
        return d
    },
    sendState: function() {
        stateChangeHandler(this.getState())
    },
    hexString: function(b) {
        var a = b.toString(16);
        if (a.length < 2) {
            a = "0" + a
        }
        return a
    },
    setPatternButtons: function(d) {
        var g = this, f, c, a, h, e, b;
        kmButtons = new Array();
        $("#jsMarudaiView ul li button").each(function(i) {
            if ($(this).attr("name") == "braid") {
                $(this).addClass("current")
            } else {
                $(this).remove()
            }
        });
        if (!d) {
            return
        }
        f = d.split(","),
        c = $("#jsMarudaiView ul");
        $.each(f, function(i, j) {
            g.kmButtons.push(j);
            a = g.url.substr(0, g.url.length - 4);
            a = a.replace("/js/", "/jssvg/");
            a = a.replace("/mp/", "/mpsvg/");
            a = a.replace("/fba/", "/fbasvg/");
            a = a + "/";
            for (b = 0; b < g.adjustables.length; b++) {
                a += braid.adjustables[b].currentValue + "."
            }
            a += j + ".svg";
            h = (j.charAt(0).toUpperCase() + j.slice(1)).replace("_", " ");
            e = $('<li><button name="' + j + '" type="button" file="' + a + '">' + h + "</button></li>");
            e.appendTo(c).click({
                file: a,
                button: e
            }, function(k) {
                g.patternButtonAction(k)
            })
        })
    },
    braidButtonAction: function(a) {
        $("#jsMarudaiView ul li button").each(function(b) {
            if ($(this).attr("name") == "braid") {
                $(this).addClass("current")
            } else {
                $(this).removeClass("current")
            }
        });
        $("#kmDisplay > div").each(function() {
            if ($(this).attr("id") == "kmBraid") {
                $(this).removeClass("hidden")
            } else {
                $(this).addClass("hidden")
            }
        })
    },
    printButtonAction: function(g) {
        var d = this, b, f, a, h, c;
        this.counter = 0;
        $("#jsMarudaiView ul li button").each(function(e) {
            if ($(this).attr("name") === "braid") {
                return
            }
            b = $("#km" + $(this).attr("name"));
            if (b.length < 1) {
                a = $("#cdokbpn-" + $(this).attr("name"));
                f = $('<div id="km' + $(this).attr("name") + '" class="hidden"></div>');
                h = "";
                for (c = 0; c < d.adjustables.length; c++) {
                    h += d.adjustables[c].currentValue + ","
                }
                h = h.slice(0, -1);
                $(a).children("div").each(function() {
                    if ($(this).attr("omit").indexOf(h) != -1) {
                        $(this).addClass("hidden")
                    }
                    if ($(this).attr("variables") != "" && $(this).attr("variables").indexOf(h) == -1) {
                        $(this).addClass("hidden")
                    }
                });
                $("#kmDisplay").append(f);
                d.counter++;
                f.load($(this).attr("file"), function() {
                    d.addSVG(this, b, f, a);
                    d.counter--;
                    if (d.counter == 0) {
                        window.print()
                    }
                })
            }
        })
    },
    addSVG: function(k, c, o, m) {
        var b, d, j, p, e, h, l, f, n = 0, a = 0;
        for (b = 0; b < this.threadColours.length; b++) {
            $(".path" + b).attr("fill", this.threadColours[b])
        }
        d = $("g g", k);
        for (b = 0; b < d.length; b++) {
            j = $("rect", d[b]);
            e = d[b].getAttribute("transform");
            if (e == null) {
                b++;
                p = d[b];
                if (p != null) {
                    e = p.getAttribute("transform")
                }
            }
            if (e != null) {
                pos = e.substring(10, e.length - 1);
                pos = pos.replace(" ", ",")
            } else {
                pos = "0,0"
            }
            h = pos.split(",");
            l = parseInt(h[0]);
            f = parseInt(h[1]);
            if (j[0] != null) {
                l += parseInt(j[0].getAttribute("width"));
                f += parseInt(j[0].getAttribute("height"))
            }
            if (l > a) {
                a = l
            }
            if (f > n) {
                n = f
            }
        }
        $(o).append(m);
        $("svg", k).attr("height", n + 30).attr("width", 700);
        $("#kmDisplay").attr("height", n + 30).attr("width", 700)
    },
    patternButtonAction: function(h) {
        var d = this, g, b, f, a, j, c;
        $("#jsMarudaiView ul li button").each(function(e) {
            $(this).removeClass("current")
        });
        g = $("button", h.data.button);
        g.addClass("current");
        $("#kmDisplay > div").each(function() {
            $(this).addClass("hidden")
        });
        b = $("#km" + g.attr("name"));
        if (b.length < 1) {
            a = $("#cdokbpn-" + g.attr("name")).removeClass("hidden");
            f = $('<div id="km' + g.attr("name") + '"></div>');
            j = "";
            for (c = 0; c < this.adjustables.length; c++) {
                j += this.adjustables[c].currentValue + ","
            }
            j = j.slice(0, -1);
            $(a).children("div").each(function() {
                if ($(this).attr("omit").indexOf(j) != -1) {
                    $(this).addClass("hidden")
                }
                if ($(this).attr("variables") != "" && $(this).attr("variables").indexOf(j) == -1) {
                    $(this).addClass("hidden")
                }
            });
            $("#kmDisplay").append(f);
            f.load(h.data.file, function() {
                d.addSVG(this, b, f, a)
            })
        } else {
            b.removeClass("hidden")
        }
    },
    checkButtons: function() {
        var a;
        $("#undo").css({
            fill: "black",
            cursor: "pointer"
        });
        $("#redo").css({
            fill: "black",
            cursor: "pointer"
        });
        if (this.undo.length < 1) {
            $("#undo").css({
                fill: "#cccccc",
                cursor: "default"
            })
        }
        if (this.redo.length < 1) {
            $("#redo").css({
                fill: "#cccccc",
                cursor: "default"
            })
        }
        for (a = 0; a < this.adjustables.length; a++) {
            $("#incr_" + this.adjustables[a].key).css({
                fill: "black",
                cursor: "pointer"
            });
            $("#decr_" + this.adjustables[a].key).css({
                fill: "black",
                cursor: "pointer"
            });
            if (this.adjustables[a].currentValue >= this.adjustables[a].maxValue || (this.totalThreads(a, this.adjustables[a].increment) > this.maxThreads)) {
                $("#incr_" + this.adjustables[a].key).css({
                    fill: "#cccccc",
                    cursor: "default"
                })
            }
            if (this.adjustables[a].currentValue <= this.adjustables[a].minValue) {
                $("#decr_" + this.adjustables[a].key).css({
                    fill: "#cccccc",
                    cursor: "default"
                })
            }
            $("#fo_" + this.adjustables[a].key + " input:first").val(this.adjustables[a].currentValue)
        }
    },
    totalThreads: function(a, b) {
        b = typeof b !== "undefined" ? b : 0;
        return this.adjustables[0].currentValue + b
    },
    totalThreadsMultiplied: function(a, d) {
        var b, c = 1;
        a = typeof a !== "undefined" ? a : 0;
        d = typeof d !== "undefined" ? d : 0;
        this.adjustables[a].currentValue += d;
        for (b = 0; b < this.adjustables.length; b++) {
            c *= this.adjustables[b].currentValue
        }
        this.adjustables[a].currentValue -= d;
        return c
    },
    totalThreadsAddedDoubled: function(a, d) {
        var b, c = 0;
        a = typeof a !== "undefined" ? a : 0;
        d = typeof d !== "undefined" ? d : 0;
        this.adjustables[a].currentValue += d;
        for (b = 0; b < this.adjustables.length; b++) {
            c += this.adjustables[b].currentValue
        }
        this.adjustables[a].currentValue -= d;
        return c * 2
    }
};
function State(c, a, b, e) {
    var d;
    this.adjustableValues = [];
    for (d = 0; d < c.length; d++) {
        this.adjustableValues[d] = c[d].currentValue
    }
    this.threadColours = jQuery.extend([], a);
    this.currColour = b;
    this.currId = e
}
function Thread(a) {
    this.color = a
}
function Stitch(a, b) {
    this.threadNum = a;
    this.coords = b
}
function Point(a, b) {
    this.x = a;
    this.y = b
}
;