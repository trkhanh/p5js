function normaliseAngle(b) {
    var a = 2 * Math.PI;
    while (b < Math.PI) {
        b += a;
    }
    while (b > Math.PI) {
        b -= a;
    }
    return b;
}

function angleDiff(d, c) {
    return normaliseAngle(d - c);
}

function clone(d) {
    if (d && 'object' == typeof d) {
        if (jQuery.isArray(d)) {
            var b = new Array(d.length);
            for (var c in d) {
                b[c] = clone(d[c]);
            }
            return b;
        } else {
            var e = {};
            for (var b in d) {
                e[b] = clone(d[b]);
            }
            return e;
        }
    } else {
        return d;
    }
}

function merge(d, c) {
    for (var a in d) {
        var b = d[a];
        if (b && 'object' == typeof b) {
            if (!c[a]) {
                if (jQuery.isArray(b)) {
                    c[a] = [];
                } else {
                    c[a] = {};
                }
            }
            merge(b, c[a]);
        } else {
            P
            c[a] = b;
        }
    }
}

function EventCapturer(a) {
    this.callbackSet = null;
    this.doc = $(document);
    this.start = function(d, c) {
        var e = d;
        var f = c ? c : d;
        if (this.callbackSet) {
            this.end();
        }
        this.callbackSet = f;
        if (c) {
            this.doc.bind(a, e, f);
        } else {
            this.doc.bind(a, f);
        }
    };
    this.end = function() {
        this.doc.unbind(a, this.callbackSet);
        this.callbackSet = null;
    };
    this.active = function() {
        return this.callbackSet != null;
    };
}
MouseUpCapture = new EventCapturer('mouseup');
MouseMoveCapture = new EventCapturer('mousemove');
TouchEndCapture = new EventCapturer('touchend');
TouchMoveCapture = new EventCapturer('touchmove');
TouchCancelCapture = new EventCapturer('touchcancel');

function Draggable(b, a) {
    this.jq = b;
    this.handler = a;
    this.lastX = 0;
    this.lastY = 0;
    this.startX = 0;
    this.startY = 0;
    this.mousedown = false;
    this.MOUSE = 0;
    this.TOUCH = 1;
    this.eventType = this.MOUSE;
    this.extractTouch = function(c) {
        c.clientX = this.lastX;
        c.clientY = this.lastY;
        if (c.originalEvent.touches && c.originalEvent.touches[0]) {
            for (var d in c.originalEvent.touches) {
                var e = Number(d);
                if (!isNaN(e) && e != 0) {
                    c.multi = true;
                }
            }
            c.clientX = c.originalEvent.touches[0].clientX;
            c.clientY = c.originalEvent.touches[0].clientY;
        }
    };
    this.handleMouseDown = function(c) {
        this.eventType = this.MOUSE;
        this.mouseDown(c);
    };
    this.handleTouchDown = function(c) {
        this.eventType = this.TOUCH;
        this.extractTouch(c);
        this.mouseDown(c);
    };
    this.mouseDown = function(c) {
        this.lastX = this.startX = c.clientX;
        this.lastY = this.startY = c.clientY;
        this.mousedown = true;
        if (this.eventType == this.MOUSE) {
            c.preventDefault();
        }
        MouseUpCapture.start({
                drag: this,
            },
            function(d) {
                d.data.drag.handleMouseUp(d);
            }
        );
        MouseMoveCapture.start({
                drag: this,
            },
            function(d) {
                d.data.drag.handleMouseMove(d);
            }
        );
        TouchEndCapture.start({
                drag: this,
            },
            function(d) {
                d.data.drag.handleTouchUp(d);
            }
        );
        TouchMoveCapture.start({
                drag: this,
            },
            function(d) {
                d.data.drag.handleTouchMove(d);
            }
        );
        if (this.handler.dragStart && c.clientX) {
            this.handler.dragStart(c);
        }
    };
    this.handleMouseMove = function(c) {
        if (this.eventType == this.MOUSE) {
            this.mouseMove(c);
        }
    };
    this.handleTouchMove = function(c) {
        if (this.eventType == this.TOUCH) {
            this.extractTouch(c);
            this.mouseMove(c);
        }
    };
    this.mouseMove = function(c) {
        if (!this.mousedown && !this.handler.dragOver) {
            return;
        }
        if (c.multi) {
            return;
        }
        c.preventDefault();
        if (!this.lastX || !this.lastY) {
            this.lastX = c.clientX;
            this.lastY = c.clientY;
        }
        if (!this.startX || !this.startY) {
            this.startX = c.clientX;
            this.startY = c.clientY;
        }
        if (c.clientX) {
            if (this.mousedown && this.handler.dragMove) {
                this.handler.dragMove(c);
            } else {
                if (!this.mousedown && this.handler.dragOver) {
                    this.handler.dragOver(c);
                }
            }
        }
        this.lastX = c.clientX;
        this.lastY = c.clientY;
    };
    this.handleMouseUp = function(c) {
        if (this.eventType == this.MOUSE) {
            this.mouseUp(c);
        }
    };
    this.handleTouchUp = function(c) {
        if (this.eventType == this.TOUCH) {
            this.extractTouch(c);
            this.mouseUp(c);
        }
    };
    this.mouseUp = function(c) {
        this.stop();
        if (this.eventType == this.MOUSE) {
            c.preventDefault();
        }
        if (
            c.clientX != undefined &&
            c.clientY != undefined &&
            (this.lastX != c.clientX || this.lastY != c.clientY)
        ) {
            this.lastX = c.clientX;
            this.lastY = c.clientY;
            if (this.handler.dragMove) {
                this.handler.dragMove(c);
            }
        }
        if (this.handler.dragEnd) {
            this.handler.dragEnd(c);
        }
        this.lastX = null;
        this.lastY = null;
    };
    this.jq.mousedown({
            drag: this,
        },
        function(c) {
            c.data.drag.handleMouseDown(c);
        }
    );
    this.jq.on(
        'touchstart', {
            drag: this,
        },
        function(c) {
            c.data.drag.handleTouchDown(c);
        }
    );
    this.jq.mousemove({
            drag: this,
        },
        function(c) {
            c.data.drag.handleMouseMove(c);
        }
    );
    this.jq.on(
        'touchmove', {
            drag: this,
        },
        function(c) {
            c.data.drag.handleTouchMove(c);
        }
    );
    this.stop = function() {
        this.mousedown = false;
        MouseUpCapture.end();
        MouseMoveCapture.end();
        TouchEndCapture.end();
        TouchMoveCapture.end();
    };
}

function rgb2css(e, d, a) {
    var c = 16777216 + (e << 16) + (d << 8) + a;
    return '#' + c.toString(16).substr(1);
}

function CdoColour(a, e, l) {
    this.r = a;
    this.g = e;
    this.b = l;
    if (e == undefined || l == undefined) {
        var i = a;
        var c = Number(i);
        if (!isNaN(c)) {
            c = Math.floor(c);
            this.r = (c >> 16) & 255;
            this.g = (c >> 8) & 255;
            this.b = c & 255;
        } else {
            if (i[0] != '#') {
                i = colourSource.colourById(i);
            }
            if (i.length != 7) {
                throw 'bad Colour init';
            }
            this.r = parseInt(i.substring(1, 3), 16);
            this.g = parseInt(i.substring(3, 5), 16);
            this.b = parseInt(i.substring(5, 7), 16);
        }
    }
    var p = this.r / 255;
    var d = this.g / 255;
    var j = this.b / 255;
    var o = function(b) {
        if (b > 0.04045) {
            return Math.pow((b + 0.055) / 1.055, 2.4);
        } else {
            return b / 12.92;
        }
    };
    p = o(p);
    d = o(d);
    j = o(j);
    this.xyz_x = p * 0.4124 + d * 0.3576 + j * 0.1805;
    this.xyz_y = p * 0.2126 + d * 0.7152 + j * 0.0722;
    this.xyz_z = p * 0.0193 + d * 0.1192 + j * 0.9505;
    var k = this.xyz_x / 0.95047;
    var h = this.xyz_y;
    var f = this.xyz_z / 1.08883;
    var m = function(b) {
        if (b > 0.008856) {
            return Math.pow(b, 1 / 3);
        } else {
            return 7.787 * b + 4 / 29;
        }
    };
    k = m(k);
    h = m(h);
    f = m(f);
    this.lab_l = 116 * h - 16;
    this.lab_a = 500 * (k - h);
    this.lab_b = 200 * (h - f);
    this.lab_c = Math.sqrt(this.lab_a * this.lab_a + this.lab_b * this.lab_b);
    this.toString = function() {
        return rgb2css(this.r, this.g, this.b);
    };
    this.toNum = function() {
        return (this.r << 16) | (this.g << 8) | this.b;
    };
    this.linearDist = function(b) {
        return (
            Math.abs(this.r - b.r) + Math.abs(this.g - b.g) + Math.abs(this.b - b.b)
        );
    };
    this.squareDist = function(g) {
        var q = this.r - g.r;
        var n = this.g - g.g;
        var b = this.b - g.b;
        return Math.sqrt(q * q + n * n + b * b);
    };
    this.cielab94Dist = function(r) {
        var b = this.lab_c - r.lab_c;
        var q = this.lab_l - r.lab_l;
        var n = this.lab_a - r.lab_a;
        var g = this.lab_b - r.lab_b;
        var t = Math.sqrt(Math.abs(n * n + g * g - b * b));
        var u = b / (1 + 0.045 * this.lab_c);
        var s = t / (1 + 0.015 * this.lab_c);
        return Math.sqrt(q * q + u * u + s * s);
    };
    this.dist = this.cielab94Dist;
}
cdoToolTip = {
    shown: false,
    getUi: function() {
        var a = $('#cdoToolTip');
        if (!a.length) {
            a = $("<div id='cdoToolTip' class='hideMe'><p></p></div>");
            $('body').append(a);
        }
        return a;
    },
    show: function(b, f) {
        var d = this.getUi();
        d.removeClass('hideMe');
        d.css('left', b.clientX + 15);
        d.css('top', b.clientY + 15);
        var c = $('#cdoToolTip p');
        if (f != c.text()) {
            var e = d.width();
            d.stop(true, false);
            d.css('width', '');
            c.text(f);
            if (this.shown) {
                var a = d.width();
                if (a < e) {
                    d.css('width', e);
                    d.animate({
                            width: a,
                        },
                        200
                    );
                }
            }
        }
        this.shown = true;
    },
    hide: function() {
        var a = this.getUi();
        a.addClass('hideMe');
        this.shown = false;
    },
};
if (window.DesIO === undefined) {
    DesIO = {
        register: function() {},
    };
}
if (window.AutoSave === undefined) {
    AutoSave = {
        save: function() {},
    };
}
ZOrderManager = {
    current: null,
    focus: function(a) {
        if (a != this.current) {
            this.drop(this.current);
        }
        if (a) {
            a.css('z-index', 101);
        }
        this.current = a;
    },
    hide: function(a) {
        if (a) {
            a.css('z-index', -1);
        }
        if (a == this.current) {
            this.current = null;
        }
    },
    drop: function(a) {
        if (a) {
            a.css('z-index', 100);
        }
        if (a == this.current) {
            this.current = null;
        }
    },
};
var colourSource = {
    uiName: null,
    impl: null,
    id: '#ff0000',
    sources: [],
    codeMap: {},
    init: function() {
        DesIO.register(
            'CS',
            function(b) {
                colourSource.fromString(b);
            },
            function() {
                return colourSource.toString();
            }
        );
        var a = $('.colourSource');
        a.each(function(d, f) {
            var b = $(f).attr('object');
            var c = window[b];
            colourSource.sources[d] = c;
            colourSource.codeMap[c.code] = c;
            // c.init();
            var g = $(f).attr('name');
            $('#colourSourceSelect').append(
                $('<option>', {
                    value: f.id,
                }).text(g)
            );
        });
        this.setUi(this.getDefaultUi());
        $('#colourSourceSelect').change(function() {
            var b = $('#colourSourceSelect').val();
            colourSource.setUi(b);
            AutoSave.save('quiet');
        });
    },
    cookieKey: 'cdoColourSourceUi=',
    getDefaultUi: function() {
        var c = document.cookie;
        var a = c.indexOf(this.cookieKey);
        if (a == -1) {
            return 'farbtasticPicker';
        }
        a += this.cookieKey.length;
        var b = c.indexOf(';', a);
        if (b == -1) {
            b = c.length;
        }
        var d = c.substring(a, b);
        return d;
    },
    setDefaultUi: function(b) {
        var a = new Date();
        a.setDate(a.getDate() + 365 * 5);
        document.cookie =
            this.cookieKey + b + ';expires=' + a.toUTCString() + ';path=/';
    },
    toString: function() {
        var c = new Array(7);
        var b = 0;
        var a = 0;
        c[b++] = B64Coder.encodeNumber(a, 12);
        c[b++] = B64Coder.encodeNumber(this.uiName.length, 12);
        c[b++] = this.uiName;
        var d = c.join('');
        return d;
    },
    fromString: function(b) {
        if (!b) {
            return;
        }
        var d = new StringDecoder(b);
        d.getNumU(2);
        var a = d.getNumU(2);
        var c = d.getStr(a);
        d.checkEnd();
        if (c.length) {
            this.setUi(c);
        }
    },
    setUi: function(b) {
        if (this.uiName == b) {
            return;
        }
        $('.colourSource').addClass('hideMe');
        this.current = $('#' + b);
        this.current.removeClass('hideMe');
        var a = this.current.attr('object');
        this.impl = window[a];
        this.impl.activate();
        $('#colourSourceSelect').val(b);
        this.uiName = b;
        this.showId(this.id);
        this.setDefaultUi(b);
    },
    obs: [],
    linkTo: function(a) {
        this.obs.push(a);
        return this;
    },
    notify: function(b) {
        for (var a in this.obs) {
            this.obs[a](b);
        }
    },
    setColour: function(a) {
        this.setId(this.idByColour(a));
    },
    setId: function(a) {
        this.showId(a);
        this.notify(a);
    },
    showId: function(b) {
        this.id = b;
        var a = this.implById(b);
        if (this.impl == a) {
            this.impl.showId(b, b);
        } else {
            this.impl.showId(this.impl.toId(a.fromId(b)), b);
        }
    },
    colourById: function(b) {
        var a = this.implById(b);
        return a.fromId(b);
    },
    nameById: function(b) {
        var a = this.implById(b);
        return a.idName(b);
    },
    idByColour: function(a) {
        return this.impl.toId(a);
    },
    implById: function(b) {
        var a = b.substr(0, 1);
        return this.codeMap[a];
    },
    threshold: function(a) {
        if (a) {
            return this.implById(a).threshold;
        } else {
            return this.impl.threshold;
        }
    },
    extractId: function(b) {
        var a = b.length;
        while (b[a - 1] == '_') {
            a--;
        }
        return b.substr(0, a);
    },
    formatId: function(a) {
        while (a.length < 7) {
            a += '_';
        }
        return a;
    },
    numColours: function() {
        return this.impl.numColours;
    },
    idByIndex: function(a) {
        return this.impl.fromIndex(a);
    },
    strongChoice: function() {
        return this.impl.strongChoice;
    },
};
var farbtasticColourSource = {
    code: '#',
    fb: null,
    doNotify: true,
    threshold: 2.5,
    numColours: 256 * 256 * 256,
    strongChoice: false,
    init: function() {
        this.fb = $.farbtastic('#farbtasticPicker');
        this.fb.linkTo(function() {
            farbtasticColourSource.fbColourPick(this.color);
        });
    },
    fromId: function(a) {
        return a;
    },
    toId: function(a) {
        return a;
    },
    idName: function(a) {
        return generalColourList.nearest(a).colName;
    },
    showId: function(b, a) {
        this.doNotify = false;
        this.fb.setColor(this.fromId(b));
        this.doNotify = true;
    },
    activate: function() {},
    fbColourPick: function(a) {
        var b = this.toId(a);
        colourSource.id = b;
        if (this.doNotify) {
            colourSource.notify(b);
        }
    },
    fromIndex: function(a) {
        return rgb2css(a >> 16, (a >> 8) & 255, a & 255);
    },
};
var dmcPaletteColourSource = {
    code: 'D',
    threshold: 0.5,
    canvas: null,
    ctx: null,
    img: null,
    imgData: null,
    lastId: '',
    numColours: 454,
    strongChoice: false,
    init: function() {
        this.canvas = document.getElementById('dmcPaletteCanvas');
        if (this.canvas) {
            this.ctx = this.canvas.getContext('2d');
            this.img = document.getElementById('dmcPaletteImage');
            $(this.img).load(function() {
                dmcPaletteColourSource.getImage();
            });
            this.getImage();
            this.startMouse();
        }
        this.numColours = dmcColours.numColours;
    },
    getImage: function() {
        this.img = document.getElementById('dmcPaletteImage');
        this.ctx.drawImage(this.img, 0, 0);
        this.imgData = this.ctx.getImageData(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );
    },
    fromId: function(b) {
        var a = dmcColours.lookup(b);
        if (a) {
            return a.colour;
        }
        return '#ffffff';
    },
    toId: function(b) {
        var a = dmcColours.nearest(b);
        if (a) {
            return a.id;
        }
        return '#ffffff';
    },
    idName: function(b) {
        var a = dmcColours.lookup(b);
        if (a) {
            return a.name;
        }
        return 'unknown DMC';
    },
    showId: function(b, a) {},
    activate: function() {
        this.lastId = '';
    },
    moveCapture: false,
    idAt: function(m) {
        var e = $(this.img).offset();
        var l = Math.round(m.clientX - e.left + window.pageXOffset);
        var j = Math.round(m.clientY - e.top + window.pageYOffset);
        if (l < 0 || this.canvas.width <= l || j < 0 || this.canvas.height <= j) {
            this.moveCapture = false;
            MouseMoveCapture.end();
            cdoToolTip.hide();
            return '';
        }
        if (!this.moveCapture) {
            this.moveCapture = true;
            MouseMoveCapture.start({
                    self: this,
                },
                dmcPaletteColourSource.handleMouseMove
            );
        }
        var f = (l + j * this.canvas.width) * 4;
        var c = this.imgData.data[f++];
        var h = this.imgData.data[f++];
        var k = this.imgData.data[f];
        var a = rgb2css(c, h, k);
        var d = dmcColours.lookupColour(a).id;
        return d;
    },
    over: function(a) {
        var b = this.idAt(a);
        if (!b) {
            cdoToolTip.hide();
            return '';
        }
        if (b != this.lastId) {
            cdoToolTip.show(a, this.idName(b));
        }
        return b;
    },
    select: function(a) {
        var b = this.over(a);
        if (!b) {
            return;
        }
        colourSource.setId(b);
    },
    startMouse: function() {
        var a = $(this.img);
        a.mousedown({
                self: this,
            },
            dmcPaletteColourSource.handleMouseDown
        );
        a.on(
            'touchstart', {
                self: this,
            },
            dmcPaletteColourSource.handleTouchDown
        );
        a.mousemove({
                self: this,
            },
            dmcPaletteColourSource.handleMouseMove
        );
        a.on(
            'touchmove', {
                self: this,
            },
            dmcPaletteColourSource.handleTouchMove
        );
    },
    mousedown: false,
    extractTouch: function(a) {
        if (a.originalEvent.touches && a.originalEvent.touches[0]) {
            a.clientX = a.originalEvent.touches[0].clientX;
            a.clientY = a.originalEvent.touches[0].clientY;
        }
    },
    handleMouseDown: function(a) {
        var b = a.data.self;
        b.mousedown = true;
        a.preventDefault();
        b.select(a);
        MouseUpCapture.start({
                self: b,
            },
            dmcPaletteColourSource.handleMouseUp
        );
        MouseMoveCapture.start({
                self: b,
            },
            dmcPaletteColourSource.handleMouseMove
        );
        TouchEndCapture.start({
                self: b,
            },
            dmcPaletteColourSource.handleTouchUp
        );
        TouchMoveCapture.start({
                self: b,
            },
            dmcPaletteColourSource.handleTouchMove
        );
    },
    handleTouchDown: function(a) {
        dmcPaletteColourSource.extractTouch(a);
        dmcPaletteColourSource.handleMouseDown(a);
    },
    handleMouseMove: function(a) {
        var b = a.data.self;
        if (!b.mousedown) {
            b.over(a);
            return;
        }
        a.preventDefault();
        b.select(a);
    },
    handleTouchMove: function(a) {
        dmcPaletteColourSource.extractTouch(a);
        dmcPaletteColourSource.handleMouseMove(a);
    },
    handleMouseUp: function(a) {
        var b = a.data.self;
        b.mousedown = false;
        b.moveCapture = false;
        cdoToolTip.hide();
        a.preventDefault();
        MouseUpCapture.end();
        MouseMoveCapture.end();
        TouchEndCapture.end();
        TouchMoveCapture.end();
        b.select(a);
    },
    handleTouchUp: function(a) {
        dmcPaletteColourSource.extractTouch(a);
        dmcPaletteColourSource.handleMouseUp(a);
    },
    fromIndex: function(a) {
        return dmcColours.fromIndex(a);
    },
};
var dmcNumberColourSource = {
    code: dmcPaletteColourSource.code,
    threshold: 0.5,
    input: null,
    numColours: 454,
    strongChoice: true,
    init: function() {
        this.input = $('#dmcNumberInput');
        this.input.change(function() {
            dmcNumberColourSource.inputChanged();
        });
        $('#dmcNumberInputSet').click(function() {
            dmcNumberColourSource.inputChanged();
        });
        this.numColours = dmcColours.numColours;
    },
    fromId: function(b) {
        var a = dmcColours.lookup(b);
        if (a) {
            return a.colour;
        }
        return '#ffffff';
    },
    toId: function(b) {
        var a = dmcColours.nearest(b);
        if (a) {
            return a.id;
        }
        return '#ffffff';
    },
    idName: function(b) {
        var a = dmcColours.lookup(b);
        if (a) {
            return a.name;
        }
        return 'unknown DMC';
    },
    doNotify: true,
    showId: function(c, a) {
        this.doNotify = false;
        var b = dmcColours.lookup(c);
        if (b) {
            this.input.val(b.code);
        }
        this.doNotify = true;
        this.showDetails(b, a);
    },
    activate: function() {},
    inputChanged: function() {
        var b = this.input.val();
        var a = dmcColours.lookup(b);
        if (a) {
            colourSource.id = a.id;
            if (this.doNotify) {
                colourSource.notify(a.id);
            }
        }
        this.showDetails(a, null);
    },
    showDetails: function(e, d) {
        var c = 'unknown DMC';
        var b = '#ffffff';
        if (e) {
            c = e.colName;
            b = e.colour;
            if (d && e.id != d && e.colour != d) {
                c = 'Similar to: ' + c;
            }
        }
        $('#dmcNumberName').text(c);
        var f = $('#dmcNumberSample');
        f.css('background-color', b);
        var a = f.position().top;
        f.css('height', 194 - a);
    },
    fromIndex: function(a) {
        return dmcColours.fromIndex(a);
    },
};

function DMCColour(c, b, a, d) {
    this.code = c;
    this.id = 'D' + c;
    this.name = 'DMC ' + c + ', ' + b;
    this.colName = b;
    this.card = a;
    this.colour = d;
    this.cdoColour = new CdoColour(d);
}
dmcColours = {
    colours: null,
    colourIndex: null,
    colourTable: null,
    numColours: 0,
    init: function() {
        var e = [
            ['304', 'Middle Red', 1, '#780216'],
            ['321', 'Red', 1, '#7c0215'],
            ['347', 'Very Dark Salmon', 1, '#9b0722'],
            ['349', 'Dark Coral', 1, '#a20419'],
            ['350', 'Middle Coral', 1, '#bd1a26'],
            ['351', 'Coral', 1, '#cc453d'],
            ['352', 'Light Coral', 1, '#da7662'],
            ['353', 'Peach', 1, '#e4a791'],
            ['498', 'Dark Red', 1, '#750216'],
            ['666', 'Bright Red', 1, '#a70115'],
            ['760', 'Salmon', 1, '#d1797a'],
            ['761', 'Light Salmon', 1, '#da9d9c'],
            ['814', 'Dark Garnet', 1, '#3d0715'],
            ['815', 'Middle Garnet', 1, '#540314'],
            ['816', 'Garnet', 1, '#670216'],
            ['817', 'Very Dark Coral Red', 1, '#910211'],
            ['3328', 'Dark Salmon', 1, '#ad333f'],
            ['3705', 'Dark Melon', 1, '#ca2140'],
            ['3706', 'Middle Melon', 1, '#e56772'],
            ['3708', 'Light Melon', 1, '#ec8d9f'],
            ['3712', 'Middle Salmon', 1, '#c1585b'],
            ['3713', 'Very Light Salmon', 1, '#e9c3c0'],
            ['3801', 'Very Dark Melon', 1, '#bd0426'],
            ['309', 'Dark Rose', 2, '#9c0e35'],
            ['326', 'Very Dark Rose', 2, '#8c062a'],
            ['335', 'Rose', 2, '#c14364'],
            ['776', 'Middle Pink', 2, '#df919d'],
            ['777', 'Very Dark Raspberry', 2, '#6a0220'],
            ['818', 'Baby Pink', 2, '#e7c6c3'],
            ['819', 'Light Baby Pink', 2, '#f0ddd8'],
            ['891', 'Dark Carnation', 2, '#e1344b'],
            ['892', 'Middle Carnation', 2, '#e84856'],
            ['893', 'Light Carnation', 2, '#e66273'],
            ['894', 'Very Light Carnation', 2, '#ee899a'],
            ['899', 'Middle Rose', 2, '#d0647e'],
            ['956', 'Geranium', 2, '#e95d7c'],
            ['957', 'Pale Geranium', 2, '#f192a4'],
            ['961', 'Dark Dusty Rose', 2, '#c44a6b'],
            ['962', 'Middle Dusty Rose', 2, '#c6617f'],
            ['963', 'Ultra Very Light Dusty Rose', 2, '#e9b9c1'],
            ['3326', 'Light Rose', 2, '#df929e'],
            ['3716', 'Very Light Dusty Rose', 2, '#e297a6'],
            ['3831', 'Dark Raspberry', 2, '#98082e'],
            ['3832', 'Middle Raspberry', 2, '#b7304e'],
            ['3833', 'Light Raspberry', 2, '#c8596f'],
            ['150', 'Ultra Very Dark Dusty Rose', 3, '#7a0427'],
            ['151', 'Very Light Dusty Rose', 3, '#e1acbc'],
            ['600', 'Very Dark Cranberry', 3, '#b20b4d'],
            ['601', 'Dark Cranberry', 3, '#b70f51'],
            ['602', 'Middle Cranberry', 3, '#d04378'],
            ['603', 'Cranberry', 3, '#da6e93'],
            ['604', 'Light Cranberry', 3, '#e390b0'],
            ['605', 'Very Light Cranberry', 3, '#e0a0bb'],
            ['718', 'Plum', 3, '#91085a'],
            ['915', 'Dark Plum', 3, '#64032f'],
            ['917', 'Middle Plum', 3, '#930d5a'],
            ['3350', 'Ultra Dark Dusty Rose', 3, '#931441'],
            ['3354', 'Light Dusty Rose', 3, '#c68895'],
            ['3607', 'Light Plum', 3, '#ad357e'],
            ['3608', 'Very Light Plum', 3, '#cf86b1'],
            ['3609', 'Ultra Light Plum', 3, '#d195bf'],
            ['3685', 'Very Dark Mauve', 3, '#510420'],
            ['3687', 'Mauve', 3, '#a64266'],
            ['3688', 'Middle Mauve', 3, '#b96a85'],
            ['3689', 'Light Mauve', 3, '#dda5b9'],
            ['3731', 'Very Dark Dusty Rose', 3, '#ac3e5d'],
            ['3733', 'Dusty Rose', 3, '#c3697d'],
            ['3803', 'Dark Mauve', 3, '#6c0b38'],
            ['3804', 'Dark Cyclamen Pink', 3, '#b81d63'],
            ['3805', 'Cyclamen Pink', 3, '#b82569'],
            ['3806', 'Light Cyclamen Pink', 3, '#d46f95'],
            ['152', 'Middle Light Shell Pink', 4, '#b98d87'],
            ['154', 'Very Dark Grape', 4, '#1f0c1a'],
            ['221', 'Very Dark Shell Pink', 4, '#610e1d'],
            ['223', 'Light Shell Pink', 4, '#9a595e'],
            ['224', 'Very Light Shell Pink', 4, '#ca9f99'],
            ['225', 'Ultra Very Light Shell Pink', 4, '#e0c7c0'],
            ['315', 'Middle Dark Antique Mauve', 4, '#642b3a'],
            ['316', 'Middle Antique Mauve', 4, '#a36285'],
            ['778', 'Very Light Antique Mauve', 4, '#be999c'],
            ['902', 'Very Dark Garnet', 4, '#450b1a'],
            ['3041', 'Middle Antique Violet', 4, '#5c4658'],
            ['3042', 'Light Antique Violet', 4, '#8d8292'],
            ['3721', 'Dark Shell Pink', 4, '#7b2632'],
            ['3722', 'Middle Shell Pink', 4, '#8c3e47'],
            ['3726', 'Dark Antique Mauve', 4, '#773f4e'],
            ['3727', 'Light Antique Mauve', 4, '#b98e9a'],
            ['3740', 'Dark Antique Violet', 4, '#523849'],
            ['3743', 'Very Light Antique Violet', 4, '#a8a2af'],
            ['3802', 'Very Dark Antique Mauve', 4, '#4b1227'],
            ['3834', 'Dark Grape', 4, '#4b1a42'],
            ['3835', 'Middle Grape', 4, '#74426e'],
            ['3836', 'Light Grape', 4, '#9b6e94'],
            ['153', 'Very Light Violet', 5, '#c5a0c2'],
            ['155', 'Middle Dark Blue Violet', 5, '#6c67ad'],
            ['156', 'Middle Light Blue Violet', 5, '#6175ac'],
            ['157', 'Very Light Cornflower Blue', 5, '#86a3c7'],
            ['158', 'Middle Very Dark Cornflower Blue', 5, '#1c316b'],
            ['208', 'Very Dark Lavender', 5, '#6c3787'],
            ['209', 'Dark Lavender', 5, '#9a71af'],
            ['210', 'Middle Lavender', 5, '#b091ca'],
            ['211', 'Light Lavender', 5, '#c4b0d9'],
            ['327', 'Dark Violet', 5, '#4c2254'],
            ['333', 'Very Dark Blue Violet', 5, '#362f7f'],
            ['340', 'Middle Blue Violet', 5, '#6b6eb3'],
            ['341', 'Light Blue Violet', 5, '#7b90ba'],
            ['550', 'Very Dark Violet', 5, '#320843'],
            ['552', 'Middle Violet', 5, '#612876'],
            ['553', 'Violet', 5, '#7a438a'],
            ['554', 'Light Violet', 5, '#ad7fb3'],
            ['791', 'Very Dark Cornflower Blue', 5, '#15225d'],
            ['792', 'Dark Cornflower Blue', 5, '#19367b'],
            ['793', 'Middle Cornflower Blue', 5, '#4c6697'],
            ['794', 'Light Cornflower Blue', 5, '#6488b3'],
            ['3746', 'Dark Blue Violet', 5, '#464794'],
            ['3747', 'Very Light Blue Violet', 5, '#acb7cc'],
            ['3807', 'Cornflower Blue', 5, '#364f8a'],
            ['3837', 'Ultra Dark Lavender', 5, '#572076'],
            ['162', 'Ultra Very Light Blue', 6, '#a5c5d4'],
            ['796', 'Dark Royal Blue', 6, '#06155a'],
            ['797', 'Royal Blue', 6, '#081f5f'],
            ['798', 'Dark Delft Blue', 6, '#104891'],
            ['799', 'Middle Delft Blue', 6, '#3f73a9'],
            ['800', 'Pale Delft Blue', 6, '#88adca'],
            ['809', 'Delft Blue', 6, '#5d85b8'],
            ['813', 'Light Blue', 6, '#4d85b0'],
            ['820', 'Very Dark Royal Blue', 6, '#050c46'],
            ['824', 'Very Dark Blue', 6, '#06326c'],
            ['825', 'Dark Blue', 6, '#06407c'],
            ['826', 'Middle Blue', 6, '#165a93'],
            ['827', 'Very Light Blue', 6, '#82acca'],
            ['995', 'Dark Electric Blue', 6, '#034fac'],
            ['996', 'Middle Electric Blue', 6, '#1e8fd3'],
            ['3838', 'Dark Lavender Blue', 6, '#345ba1'],
            ['3839', 'Middle Lavender Blue', 6, '#5978b5'],
            ['3840', 'Light Lavender Blue', 6, '#8cabd3'],
            ['3843', 'Electric Blue', 6, '#0268be'],
            ['3844', 'Dark Bright Turquoise', 6, '#0271ab'],
            ['3845', 'Middle Bright', 6, '#03a1cc'],
            ['3846', 'Light Bright Turquoise', 6, '#09aed1'],
            ['159', 'Light Gray Blue', 7, '#909db9'],
            ['160', 'Middle Gray Blue', 7, '#62759b'],
            ['161', 'Gray Blue', 7, '#435880'],
            ['312', 'Very Dark Baby Blue', 7, '#083165'],
            ['322', 'Dark Dark Baby Blue', 7, '#2e6095'],
            ['334', 'Middle Baby Blue', 7, '#306c98'],
            ['336', 'Navy Blue', 7, '#0a1637'],
            ['775', 'Very Light Baby Blue', 7, '#b3ccd4'],
            ['803', 'Ultra Very Dark Baby Blue', 7, '#072252'],
            ['823', 'Dark Navy Blue', 7, '#0b0d24'],
            ['930', 'Dark Antique Blue', 7, '#133346'],
            ['931', 'Middle Antique Blue', 7, '#285870'],
            ['932', 'Light Antique Blue', 7, '#5e8397'],
            ['939', 'Very Dark Navy Blue', 7, '#090714'],
            ['3325', 'Light Baby Blue', 7, '#729cbe'],
            ['3750', 'Very Dark Antique Blue', 7, '#0a223a'],
            ['3752', 'Very Light Antique Blue', 7, '#86a5b7'],
            ['3753', 'Ultra Very Light Antique Blue', 7, '#a4bcc6'],
            ['3755', 'Baby Blue', 7, '#598bb5'],
            ['3756', 'Ultra Very Light Baby Blue', 7, '#cfddd9'],
            ['3841', 'Pale Baby Blue', 7, '#99b8cb'],
            ['311', 'Middle Navy Blue', 8, '#072049'],
            ['517', 'Dark Wedgewood', 8, '#094880'],
            ['518', 'Light Wedgewood', 8, '#24739a'],
            ['519', 'Sky Blue', 8, '#6ca0c0'],
            ['597', 'Turquoise', 8, '#38869a'],
            ['598', 'Light Turquoise', 8, '#6eaab0'],
            ['747', 'Very Light Sky Blue', 8, '#c1dde1'],
            ['806', 'Dark Peacock Blue', 8, '#135f90'],
            ['807', 'Peacock Blue', 8, '#2681a0'],
            ['828', 'Ultra Very Very Light Blue', 8, '#a9c9d0'],
            ['924', 'Very Dark Gray Green', 8, '#0e333e'],
            ['926', 'Middle Gray Green', 8, '#506f70'],
            ['927', 'Light Gray Green', 8, '#819e99'],
            ['928', 'Very Light Gray Green', 8, '#a5bab4'],
            ['3760', 'Middle Wedgewood', 8, '#145f8f'],
            ['3761', 'Light Sky Blue', 8, '#8ebacc'],
            ['3765', 'Very Dark Peacock Blue', 8, '#064a79'],
            ['3766', 'Light Peacock Blue', 8, '#599eb4'],
            ['3768', 'Dark Gray Green', 8, '#35555f'],
            ['3808', 'Ultra Very Dark Turquoise', 8, '#05324d'],
            ['3809', 'Very Dark Turquoise', 8, '#044961'],
            ['3810', 'Dark Turquoise', 8, '#0c657b'],
            ['3811', 'Very Light Turquoise', 8, '#87b9bd'],
            ['3842', 'Dark Wedgwood', 8, '#043268'],
            ['3847', 'Dark Teal Green', 8, '#044147'],
            ['3848', 'Middle Teal Green', 8, '#066468'],
            ['3849', 'Light Teal Green', 8, '#268a8e'],
            ['163', 'Middle Celadon Green', 9, '#187458'],
            ['500', 'Very Dark Blue Green', 9, '#0d2b29'],
            ['501', 'Dark Blue Green', 9, '#124f41'],
            ['502', 'Blue Green', 9, '#2c725e'],
            ['503', 'Middle Blue Green', 9, '#529685'],
            ['504', 'Very Light Blue Green', 9, '#84b2a2'],
            ['505', 'Jade Green', 9, '#055d38'],
            ['561', 'Very Dark Jade', 9, '#07563f'],
            ['562', 'Middle Jade', 9, '#147b53'],
            ['563', 'Light Jade', 9, '#57ae91'],
            ['564', 'Very Light Jade', 9, '#79bf9f'],
            ['943', 'Middle Aquamarine', 9, '#02776b'],
            ['958', 'Dark Seagreen', 9, '#0b948d'],
            ['959', 'Middle Seagreen', 9, '#23a6a1'],
            ['964', 'Light Seagreen', 9, '#7ac6c4'],
            ['966', 'Middle Baby Green', 9, '#77b391'],
            ['991', 'Dark Aquamarine', 9, '#025b54'],
            ['992', 'Light Aquamarine', 9, '#229688'],
            ['993', 'Very Light Aquamarine', 9, '#40a394'],
            ['3812', 'Very Dark Seagreen', 9, '#027374'],
            ['3813', 'Light Blue Green', 9, '#88b5a5'],
            ['3814', 'Aquamarine', 9, '#03675f'],
            ['3815', 'Dark Celadon Green', 9, '#0f6650'],
            ['3816', 'Celadon Green', 9, '#3a8373'],
            ['3817', 'Light Celadon Green', 9, '#71ac96'],
            ['3850', 'Dark Bright Green', 9, '#026b5b'],
            ['3851', 'Light Bright Green', 9, '#07907e'],
            ['164', 'Light Forest Green', 10, '#77ba7d'],
            ['319', 'Very Dark Pistachio Green', 10, '#062e1b'],
            ['320', 'Middle Pistachio Green', 10, '#42845e'],
            ['367', 'Dark Pistachio Green', 10, '#1d6742'],
            ['368', 'Light Pistachio Green', 10, '#66a46d'],
            ['369', 'Very Light Pistachio Green', 10, '#a1cd9a'],
            ['772', 'Very Light Yellow Green', 10, '#c1d8ab'],
            ['890', 'Ultra Dark Pistachio Green', 10, '#042914'],
            ['895', 'Very Dark Hunter Green', 10, '#0b4122'],
            ['909', 'Very Dark Emerald Green', 10, '#03522a'],
            ['910', 'Dark Emerald Green', 10, '#026e39'],
            ['911', 'Middle Emerald Green', 10, '#037c47'],
            ['912', 'Light Emerald Green', 10, '#0e9466'],
            ['913', 'Middle Nile Green', 10, '#39ae7f'],
            ['954', 'Nile Green', 10, '#64bd91'],
            ['955', 'Light Nile Green', 10, '#9cd9b5'],
            ['986', 'Very Dark Forest Green', 10, '#05481a'],
            ['987', 'Dark Forest Green', 10, '#11692f'],
            ['988', 'Middle Forest Green', 10, '#2d8441'],
            ['989', 'Forest Green', 10, '#4c9a54'],
            ['3345', 'Dark Hunter Green', 10, '#0c4619'],
            ['3346', 'Hunter Green', 10, '#256725'],
            ['3347', 'Middle Yellow Green', 10, '#448236'],
            ['3348', 'Light Yellow Green', 10, '#9db670'],
            ['3818', 'Ultra Very Dark Emerald Greene', 10, '#034326'],
            ['469', 'Avocado Green', 11, '#2f5d12'],
            ['470', 'Light Avocado Green', 11, '#4d8721'],
            ['471', 'Very Light Avocado Green', 11, '#6a9633'],
            ['472', 'Ultra Light Avocado Green', 11, '#a4bf62'],
            ['520', 'Dark Fern Green', 11, '#214a32'],
            ['522', 'Fern Green', 11, '#6f9377'],
            ['523', 'Light Fern Green', 11, '#7e9b7a'],
            ['524', 'Very Light Fern Green', 11, '#93a489'],
            ['699', 'Green', 11, '#023e1d'],
            ['700', 'Bright Green', 11, '#03632a'],
            ['701', 'Light Green', 11, '#047733'],
            ['702', 'Kelly Green', 11, '#12883a'],
            ['703', 'Chartreuse', 11, '#469f43'],
            ['704', 'Bright Chartreuse', 11, '#62a93a'],
            ['904', 'Very Dark Parrot Green', 11, '#095912'],
            ['905', 'Dark Parrot Green', 11, '#086c10'],
            ['906', 'Middle Parrot Green', 11, '#149509'],
            ['907', 'Light Parrot Green', 11, '#69b316'],
            ['934', 'Black Avocado Green', 11, '#132718'],
            ['935', 'Dark Avocado Green', 11, '#193720'],
            ['936', 'Very Dark Avocado Green', 11, '#26451b'],
            ['937', 'Middle Avocado Green', 11, '#255115'],
            ['3051', 'Dark Green Gray', 11, '#334a25'],
            ['3052', 'Middle Green Gray', 11, '#667e56'],
            ['3053', 'Green Gray', 11, '#799065'],
            ['165', 'Very Light Moss Green', 12, '#bbc66d'],
            ['166', 'Middle Light Moss Green', 12, '#8d9f15'],
            ['370', 'Middle Mustard', 12, '#838344'],
            ['371', 'Mustard', 12, '#858147'],
            ['372', 'Light Mustard', 12, '#919661'],
            ['580', 'Dark Moss Green', 12, '#44620d'],
            ['581', 'Moss Green', 12, '#64901f'],
            ['730', 'Very Dark Olive Green', 12, '#3e480d'],
            ['731', 'Dark Olive Green', 12, '#565f0d'],
            ['732', 'Olive Green', 12, '#565e0e'],
            ['733', 'Middle Olive Green', 12, '#898d26'],
            ['734', 'Light Olive Green', 12, '#9da045'],
            ['829', 'Very Dark Golden Olive', 12, '#534314'],
            ['830', 'Dark Golden Olive', 12, '#534d13'],
            ['831', 'Middle Golden Olive', 12, '#686314'],
            ['832', 'Golden Olive', 12, '#847818'],
            ['833', 'Light Golden Olive', 12, '#979035'],
            ['834', 'Very Light Golden Olive', 12, '#b2ac56'],
            ['3011', 'Dark Khaki Green', 12, '#4e5827'],
            ['3012', 'Middle Khaki Green', 12, '#6c763b'],
            ['3013', 'Light Khaki Green', 12, '#95a16b'],
            ['3362', 'Dark Pine Green', 12, '#295531'],
            ['3363', 'Middle Pine Green', 12, '#3e6d42'],
            ['3364', 'Pine Green', 12, '#6a8f59'],
            ['3819', 'Light Moss Green', 12, '#b5c353'],
            ['167', 'Very Dark Yellow Beige', 13, '#7f6931'],
            ['420', 'Dark Hazelnut Brown', 13, '#79581e'],
            ['422', 'Light Hazelnut Brown', 13, '#ad9d68'],
            ['610', 'Dark Drab Brown', 13, '#665a31'],
            ['611', 'Drab Brown', 13, '#64603b'],
            ['612', 'Light Drab Brown', 13, '#968d65'],
            ['613', 'Very Light Drab Brown', 13, '#bec1a5'],
            ['676', 'Light Old Gold', 13, '#ccb668'],
            ['677', 'Very Light Old Gold', 13, '#dad8a1'],
            ['680', 'Dark Old Gold', 13, '#937a29'],
            ['728', 'Topaz', 13, '#d7ae31'],
            ['729', 'Middle Old Gold', 13, '#ae9133'],
            ['746', 'Off White', 13, '#e5e6c9'],
            ['780', 'Ultra Very Dark Topaz', 13, '#7f4d0f'],
            ['781', 'Very Dark Topaz', 13, '#9b6b0c'],
            ['782', 'Dark Topaz', 13, '#99690b'],
            ['783', 'Middle Topaz', 13, '#b38616'],
            ['869', 'Very Dark Hazelnut Brown', 13, '#5f4b1a'],
            ['3045', 'Dark Yellow Beige', 13, '#97834c'],
            ['3046', 'Middle Yellow Beige', 13, '#b6b06e'],
            ['3047', 'Light Yellow Beige', 13, '#cfd199'],
            ['3820', 'Dark Straw', 13, '#c1a425'],
            ['3821', 'Straw', 13, '#ceb844'],
            ['3822', 'Light Straw', 13, '#dbca67'],
            ['3828', 'Hazelnut Brown', 13, '#927d3f'],
            ['3829', 'Very Dark Old Gold', 13, '#8b6d1a'],
            ['3852', 'Very Dark Straw', 13, '#af8f12'],
            ['307', 'Lemon', 14, '#ede31d'],
            ['444', 'Dark Lemon', 14, '#e7cb04'],
            ['445', 'Light Lemon', 14, '#f3f487'],
            ['606', 'Bright Orange-Red', 14, '#cf1311'],
            ['608', 'Bright Orange', 14, '#e5330b'],
            ['725', 'Middle Light Topaz', 14, '#e5be39'],
            ['726', 'Light Topaz', 14, '#f1d746'],
            ['727', 'Very Light Topaz', 14, '#f1eb84'],
            ['740', 'Tangerine', 14, '#f16406'],
            ['741', 'Middle Tangerine', 14, '#ed7d07'],
            ['742', 'Light Tangerine', 14, '#e9a611'],
            ['743', 'Middle Yellow', 14, '#f1c939'],
            ['744', 'Pale Yellow', 14, '#f3de74'],
            ['745', 'Light Pale Yellow', 14, '#eee398'],
            ['900', 'Dark Burnt Orange', 14, '#b01f0f'],
            ['946', 'Middle Burnt Orange', 14, '#d33e0e'],
            ['947', 'Burnt Orange', 14, '#ed4a08'],
            ['967', 'Very Light Apricot', 14, '#f6c0ac'],
            ['970', 'Light Pumpkin', 14, '#f56510'],
            ['971', 'Pumpkin', 14, '#ef6206'],
            ['972', 'Deep Canary', 14, '#e8a606'],
            ['973', 'Bright Canary', 14, '#ecd20e'],
            ['3078', 'Very Light Golden Yellow', 14, '#efeea0'],
            ['3340', 'Middle Apricot', 14, '#e9673f'],
            ['3341', 'Apricot', 14, '#f08b6b'],
            ['3824', 'Light Apricot', 14, '#ec9c84'],
            ['300', 'Very Dark Mahogany', 15, '#501d11'],
            ['301', 'Middle Mahogany', 15, '#884015'],
            ['400', 'Dark Mahogany', 15, '#702b12'],
            ['402', 'Very Light Mahogany', 15, '#cf895c'],
            ['720', 'Dark Orange Spice', 15, '#bd3a0d'],
            ['721', 'Middle Orange Spice', 15, '#d3591d'],
            ['722', 'Light Orange Spice', 15, '#e48a51'],
            ['918', 'Dark Red Copper', 15, '#711a17'],
            ['919', 'Red Copper', 15, '#831914'],
            ['920', 'Middle Copper', 15, '#942f1a'],
            ['921', 'Copper', 15, '#ab4e23'],
            ['922', 'Light Copper', 15, '#c06530'],
            ['945', 'Tawny', 15, '#d6bc9b'],
            ['951', 'Light Tawny', 15, '#e1cfb4'],
            ['3770', 'Very Light Tawny', 15, '#ebe0ca'],
            ['3776', 'Light Mahogany', 15, '#b55f32'],
            ['3823', 'Ultra Pale Yellow', 15, '#efedc7'],
            ['3825', 'Pale Pumpkin', 15, '#e69d69'],
            ['3853', 'Dark Autumn Gold', 15, '#c76f24'],
            ['3854', 'Middle Autumn Gold', 15, '#dd9d4a'],
            ['3855', 'Light Autumn Gold', 15, '#edcf7f'],
            ['3856', 'Ultra Very Light Mahogany', 15, '#debe8f'],
            ['355', 'Dark Terra Cotta', 16, '#76101b'],
            ['356', 'Middle Terra Cotta', 16, '#a75848'],
            ['407', 'Dark Desert Sand', 16, '#a77f6a'],
            ['632', 'Ultra Very Dark Desert Sand', 16, '#693e2e'],
            ['754', 'Light Peach', 16, '#ddaf96'],
            ['758', 'Very Light Terra Cotta', 16, '#ce947a'],
            ['948', 'Very Light Peach', 16, '#e2d0bb'],
            ['950', 'Light Desert Sand', 16, '#cbb195'],
            ['975', 'Dark Golden Brown', 16, '#683013'],
            ['976', 'Middle Golden Brown', 16, '#ae6d1c'],
            ['977', 'Light Golden Brown', 16, '#ca9447'],
            ['3064', 'Desert Sand', 16, '#ab7d60'],
            ['3771', 'Ultra Very Light Terra Cotta', 16, '#d39c7a'],
            ['3772', 'Very Dark Desert Sand', 16, '#865c47'],
            ['3773', 'Middle Desert Sand', 16, '#a47e69'],
            ['3774', 'Very Light Desert Sand', 16, '#d9c7b0'],
            ['3777', 'Very Dark Terra Cotta', 16, '#6d0a17'],
            ['3778', 'Light Terra Cotta', 16, '#b66e5a'],
            ['3779', 'Ultra Very Light Terra Cotta', 16, '#d6a798'],
            ['3826', 'Golden Brown', 16, '#985a1a'],
            ['3827', 'Pale Golden Brown', 16, '#d0a35f'],
            ['3830', 'Terra Cotta', 16, '#96322f'],
            ['3857', 'Dark Rosewood', 16, '#421115'],
            ['3858', 'Middle Rosewood', 16, '#65262c'],
            ['3859', 'Light Rosewood', 16, '#9d6156'],
            ['433', 'Middle Brown', 17, '#5a3313'],
            ['434', 'Light Brown', 17, '#774c16'],
            ['435', 'Very Light Brown', 17, '#966527'],
            ['436', 'Tan', 17, '#a9793c'],
            ['437', 'Light Tan', 17, '#bc9c62'],
            ['451', 'Dark Shell Gray', 17, '#716764'],
            ['452', 'Middle Shell Gray', 17, '#9d9492'],
            ['453', 'Light Shell Gray', 17, '#aeada5'],
            ['543', 'Ultra Very Light Beige Brown', 17, '#c9bdae'],
            ['712', 'Cream', 17, '#e3e3d0'],
            ['738', 'Very Light Tan', 17, '#c4b07c'],
            ['739', 'Ultra Very Light Tan', 17, '#dad2ad'],
            ['779', 'Dark Cocoa', 17, '#503936'],
            ['801', 'Dark Coffee Brown', 17, '#472717'],
            ['898', 'Very Dark Coffee Brown', 17, '#362112'],
            ['938', 'Ultra Dark Coffee Brown', 17, '#251711'],
            ['3031', 'Very Dark Mocha Brown', 17, '#342b1f'],
            ['3371', 'Black Brown', 17, '#120d0e'],
            ['3860', 'Cocoa', 17, '#5f4644'],
            ['3861', 'Light Cocoa', 17, '#837471'],
            ['3862', 'Dark Mocha Beige Turquoise', 17, '#6a4f31'],
            ['3863', 'Middle Mocha Beige', 17, '#81644a'],
            ['3864', 'Light Mocha Beige', 17, '#a39376'],
            ['B5200', 'Snow White', 18, '#fcfdfd'],
            ['Blanc', 'White', 18, '#fcfdfc'],
            ['Ecru', 'Ecru', 18, '#dfe0ca'],
            ['535', 'Very Light Ash Gray', 18, '#414e4b'],
            ['640', 'Very Dark Beige Gray', 18, '#61664c'],
            ['642', 'Dark Beige Gray', 18, '#7a7f62'],
            ['644', 'Middle Beige Gray', 18, '#b3b7a0'],
            ['822', 'Light Beige Gray', 18, '#cccdb8'],
            ['838', 'Very Dark Beige Brown', 18, '#291f19'],
            ['839', 'Dark Beige Brown', 18, '#443227'],
            ['840', 'Middle Beige Brown', 18, '#6f654b'],
            ['841', 'Light Beige Brown', 18, '#90836b'],
            ['842', 'Very Light Beige Brown', 18, '#b6ae95'],
            ['3021', 'Very Dark Brown Gray', 18, '#2e3124'],
            ['3022', 'Middle Brown Gray', 18, '#64775e'],
            ['3023', 'Light Brown Gray', 18, '#8e9781'],
            ['3024', 'Very Light Brown Gray', 18, '#adb6ab'],
            ['3032', 'Middle Mocha Brown', 18, '#868868'],
            ['3033', 'Very Light Mocha Brown', 18, '#c4c7b4'],
            ['3781', 'Dark Mocha Brown', 18, '#423b25'],
            ['3782', 'Light Mocha Brown', 18, '#9d9a7b'],
            ['3787', 'Dark Brown Gray', 18, '#3e4636'],
            ['3790', 'Ultra Dark Beige Gray', 18, '#6a5d47'],
            ['3865', 'Winter White', 18, '#f8f9f4'],
            ['3866', 'Ultra Very Light Mocha Brown', 18, '#d0d3c6'],
            ['168', 'Very Light Pewter', 19, '#9fafb3'],
            ['169', 'Light Pewter', 19, '#637a7c'],
            ['310', 'Black', 19, '#0a0b0e'],
            ['317', 'Pewter Gray', 19, '#3e4f5f'],
            ['318', 'Light Steel Gray', 19, '#7f8799'],
            ['413', 'Dark Pewter Gray', 19, '#283b40'],
            ['414', 'Dark Steel Gray', 19, '#606a78'],
            ['415', 'Pearl Gray', 19, '#a0acb3'],
            ['645', 'Very Dark Beaver Gray', 19, '#4e5d52'],
            ['646', 'Dark Beaver Gray', 19, '#687663'],
            ['647', 'Middle Beaver Gray', 19, '#859783'],
            ['648', 'Light Beaver Gray', 19, '#9fa498'],
            ['762', 'Very Light Pearl Gray', 19, '#d4dbd9'],
            ['844', 'Ultra Dark Beaver Gray', 19, '#2c332f'],
            ['3072', 'Very Light Beaver Gray', 19, '#b8c7bb'],
            ['3799', 'Very Dark Pewter Gray', 19, '#1c2628'],
        ];
        this.colours = {};
        this.colourIndex = {};
        this.colourTable = [];
        for (var a in e) {
            var g = e[a];
            if (g.length >= 4) {
                var d = g[0].toLowerCase();
                var c = g[1];
                var b = g[2];
                var f = g[3];
                this.colours[d] = new DMCColour(d, c, b, f);
                this.colourIndex[f] = this.colours[d];
                this.colourTable.push(this.colours[d]);
            }
        }
        this.numColours = e.length;
    },
    unquote: function(b) {
        var c = 0;
        if (b[c] == '"') {
            c++;
        }
        var a = b.length;
        if (b[a - 1] == '"') {
            a--;
        }
        return b.substring(c, a);
    },
    lookup: function(a) {
        if (a[0] == 'D') {
            return this.lookup(a.substr(1));
        }
        return this.colours[a.toLowerCase()];
    },
    lookupColour: function(a) {
        return this.colourIndex[a];
    },
    nearest: function(e) {
        var d = new CdoColour(e);
        var a = null;
        var g = 1000000;
        for (var h in this.colours) {
            var b = this.colours[h];
            var f = d.dist(b.cdoColour);
            if (f < g) {
                g = f;
                a = b;
            }
        }
        return a;
    },
    fromIndex: function(a) {
        return this.colourTable[a].id;
    },
};
dmcColours.init();

function GeneralColour(a, b) {
    this.id = b;
    this.name = a;
    this.colName = a;
    this.colour = b;
    this.cdoColour = new CdoColour(b);
}
generalColourList = {
    init: function() {
        this.colours = {};
        for (var a in this.table) {
            var d = this.table[a];
            if (d.length >= 2) {
                var b = d[0];
                var c = d[1];
                this.colours[c] = new GeneralColour(b, c);
            }
        }
    },
    lookup: function(a) {
        return this.colours[a];
    },
    nearest: function(e) {
        var b = new CdoColour(e);
        var a = null;
        var g = 1000000;
        for (var h in this.colours) {
            var d = this.colours[h];
            var f = b.dist(d.cdoColour);
            if (f < g) {
                g = f;
                a = d;
            }
        }
        return a;
    },
    table: [
        ['Rackley', '#5D8AA8'],
        ['Air superiority blue', '#72A0C1'],
        ['Aero blue', '#C9FFE5'],
        ['Alice blue', '#F0F8FF'],
        ['Almond', '#EFDECD'],
        ['Amaranth', '#E52B50'],
        ['Amazon', '#3B7A57'],
        ['Amethyst', '#9966CC'],
        ['Android Green', '#A4C639'],
        ['Antique brass', '#CD9575'],
        ['Antique bronze', '#665D1E'],
        ['Antique fuchsia', '#915C83'],
        ['Antique ruby', '#841B2D'],
        ['Moccasin', '#FAEBD7'],
        ['Apple green', '#8DB600'],
        ['Apricot', '#FBCEB1'],
        ['Electric cyan', '#00FFFF'],
        ['Aquamarine', '#7FFFD4'],
        ['Army green', '#4B5320'],
        ['Ash grey', '#B2BEB5'],
        ['Asparagus', '#87A96B'],
        ['Pink-orange', '#FF9966'],
        ['Red-brown', '#A52A2A'],
        ['AuroMetalSaurus', '#6E7F80'],
        ['Avocado', '#568203'],
        ['Azure', '#007FFF'],
        ['Azure mist', '#F0FFFF'],
        ['Tea rose', '#F4C2C2'],
        ['Banana yellow', '#FFE135'],
        ['Barn red', '#7C0A02'],
        ['Old silver', '#848482'],
        ['Bazaar', '#98777B'],
        ['Pale aqua', '#BCD4E6'],
        ['Beaver', '#9F8170'],
        ['Beige', '#F5F5DC'],
        ['Bdazzled Blue', '#2E5894'],
        ['Big dip o�ruby', '#9C2542'],
        ['Bistre', '#3D2B1F'],
        ['Sandy taupe', '#967117'],
        ['Black', '#000000'],
        ['Black bean', '#3D0C02'],
        ['Black leather jacket', '#253529'],
        ['Black olive', '#3B3C36'],
        ['Blanched Almond', '#FFEBCD'],
        ['Blast-off bronze', '#A57164'],
        ['Bleu de France', '#318CE7'],
        ['Blizzard Blue', '#ACE5EE'],
        ['Blond', '#FAF0BE'],
        ['Blue', '#0000FF'],
        ['Blue (NCS)', '#0087BD'],
        ['Blue (RYB)', '#0247FE'],
        ['Blue Bell', '#A2A2D0'],
        ['Blue-gray', '#6699CC'],
        ['Blue-green', '#0D98BA'],
        ['Blue sapphire', '#126180'],
        ['Blue-violet', '#8A2BE2'],
        ['Blueberry', '#4F86F7'],
        ['Blush', '#DE5D83'],
        ['Medium Tuscan red', '#79443B'],
        ['Bondi blue', '#0095B6'],
        ['Bone', '#E3DAC9'],
        ['Bottle green', '#006A4E'],
        ['Boysenberry', '#873260'],
        ['Brandeis blue', '#0070FF'],
        ['Brass', '#B5A642'],
        ['Brick red', '#CB4154'],
        ['Bright cerulean', '#1DACD6'],
        ['Bright green', '#66FF00'],
        ['Bright lavender', '#BF94E4'],
        ['Rose', '#FF007F'],
        ['Bright turquoise', '#08E8DE'],
        ['Electric lavender', '#F4BBFF'],
        ['Magenta', '#FF55A3'],
        ['Brink pink', '#FB607F'],
        ['British racing green', '#004225'],
        ['Bronze Yellow', '#737000'],
        ['Brown', '#964B00'],
        ['English green', '#1B4D3E'],
        ['Bulgarian rose', '#480607'],
        ['Burgundy', '#800020'],
        ['Burnt orange', '#CC5500'],
        ['Light red ochre', '#E97451'],
        ['Byzantine', '#BD33A4'],
        ['Byzantium', '#702963'],
        ['Cadet', '#536872'],
        ['Cadet blue', '#5F9EA0'],
        ['Cadet grey', '#91A3B0'],
        ['Cadmium green', '#006B3C'],
        ['Cadmium orange', '#ED872D'],
        ['Cadmium red', '#E30022'],
        ['Tuscan tan', '#A67B5B'],
        ['Caf� noir', '#4B3621'],
        ['Cal Poly green', '#1E4D2B'],
        ['Cambridge Blue', '#A3C1AD'],
        ['Wood brown', '#C19A6B'],
        ['Cameo pink', '#EFBBCC'],
        ['Camouflage green', '#78866B'],
        ['Deep sky blue', '#00BFFF'],
        ['Caput mortuum', '#592720'],
        ['Caribbean green', '#00CC99'],
        ['Carmine pink', '#EB4C42'],
        ['Carmine red', '#FF0038'],
        ['Carnation pink', '#FFA6C9'],
        ['Carolina blue', '#99BADD'],
        ['Carrot orange', '#ED9121'],
        ['Sacramento State green', '#00563F'],
        ['Catalina blue', '#062A78'],
        ['Ceil', '#92A1CF'],
        ['Cerulean', '#007BA7'],
        ['Celadon Green', '#2F847C'],
        ['Celeste', '#B2FFFF'],
        ['Celestial blue', '#4997D0'],
        ['Cerise pink', '#EC3B83'],
        ['Cerulean frost', '#6D9BC3'],
        ['Charcoal', '#36454F'],
        ['Charleston green', '#232B2B'],
        ['Light Thulian pink', '#E68FAC'],
        ['Cherry blossom pink', '#FFB7C5'],
        ['Chestnut', '#954535'],
        ['Thulian pink', '#DE6FA1'],
        ['China rose', '#A8516E'],
        ['Chinese red', '#AA381E'],
        ['Chocolate', '#7B3F00'],
        ['Cocoa brown', '#D2691E'],
        ['Chrome yellow', '#FFA700'],
        ['Cinereous', '#98817B'],
        ['Vermilion', '#E34234'],
        ['Citrine', '#E4D00A'],
        ['Citron', '#9FA91F'],
        ['Claret', '#7F1734'],
        ['Classic rose', '#FBCCE7'],
        ['Cobalt', '#0047AB'],
        ['Coconut', '#965A3E'],
        ['Tuscan brown', '#6F4E37'],
        ['Columbia blue', '#9BDDFF'],
        ['Tea rose (orange)', '#F88379'],
        ['Gray-blue', '#8C92AC'],
        ['Copper', '#B87333'],
        ['Pale copper', '#DA8A67'],
        ['Copper penny', '#AD6F69'],
        ['Copper red', '#CB6D51'],
        ['Copper rose', '#996666'],
        ['Coral', '#FF7F50'],
        ['Coral red', '#FF4040'],
        ['Maize', '#FBEC5D'],
        ['Cornflower blue', '#6495ED'],
        ['Cotton candy', '#FFBCD9'],
        ['Cream', '#FFFDD0'],
        ['Crimson', '#DC143C'],
        ['Crimson glory', '#BE0032'],
        ['Cyan', '#00B7EB'],
        ['Cyber Grape', '#58427C'],
        ['Dandelion', '#F0E130'],
        ['Dark blue-gray', '#666699'],
        ['Otter brown', '#654321'],
        ['Dark byzantium', '#5D3954'],
        ['Dark candy apple red', '#A40000'],
        ['Dark cerulean', '#08457E'],
        ['Dark chestnut', '#986960'],
        ['Dark coral', '#CD5B45'],
        ['Dark cyan', '#008B8B'],
        ['Dark goldenrod', '#B8860B'],
        ['Dark gray', '#A9A9A9'],
        ['Dark green', '#013220'],
        ['Dark Indigo', '#00416A'],
        ['Dark jungle green', '#1A2421'],
        ['Dark khaki', '#BDB76B'],
        ['Taupe', '#483C32'],
        ['Dark lavender', '#734F96'],
        ['Dark magenta', '#8B008B'],
        ['Dark midnight blue', '#003366'],
        ['Dark olive green', '#556B2F'],
        ['Dark orange', '#FF8C00'],
        ['Dark orchid', '#9932CC'],
        ['Dark pastel green', '#03C03C'],
        ['Dark pastel purple', '#966FD6'],
        ['Dark pastel red', '#C23B22'],
        ['Dark powder blue', '#003399'],
        ['Dark raspberry', '#872657'],
        ['Dark red', '#8B0000'],
        ['Dark salmon', '#E9967A'],
        ['Dark scarlet', '#560319'],
        ['Dark sea green', '#8FBC8F'],
        ['Dark sienna', '#3C1414'],
        ['Dark slate blue', '#483D8B'],
        ['Dark slate gray', '#2F4F4F'],
        ['Dark spring green', '#177245'],
        ['Dark tan', '#918151'],
        ['Dark turquoise', '#00CED1'],
        ['Dark vanilla', '#D1BEA8'],
        ['Dark violet', '#9400D3'],
        ['Dark yellow', '#9B870C'],
        ['Davys grey', '#555555'],
        ['Deep carmine pink', '#EF3038'],
        ['Deep carrot orange', '#E9692C'],
        ['Deep cerise', '#DA3287'],
        ['Deep chestnut', '#B94E48'],
        ['Deep coffee', '#704241'],
        ['Fuchsia', '#C154C1'],
        ['Deep jungle green', '#004B49'],
        ['Deep lilac', '#9955BB'],
        ['Deep magenta', '#CC00CC'],
        ['Peach', '#FFCBA4'],
        ['Fluorescent pink', '#FF1493'],
        ['Deep ruby', '#843F5B'],
        ['Deep saffron', '#FF9933'],
        ['Deep Taupe', '#7E5E60'],
        ['Deep Tuscan red', '#66424D'],
        ['Deer', '#BA8759'],
        ['Denim', '#1560BD'],
        ['Desert sand', '#EDC9AF'],
        ['Diamond', '#7D1242'],
        ['Dim gray', '#696969'],
        ['Dodger blue', '#1E90FF'],
        ['Dogwood rose', '#D71868'],
        ['Dollar bill', '#85BB65'],
        ['Duke blue', '#00009C'],
        ['Dust storm', '#E5CCC9'],
        ['Ebony', '#555D50'],
        ['Sand', '#C2B280'],
        ['Eggplant', '#614051'],
        ['Egyptian blue', '#1034A6'],
        ['Electric blue', '#7DF9FF'],
        ['Green', '#00FF00'],
        ['Indigo', '#6F00FF'],
        ['Fluorescent yellow', '#CCFF00'],
        ['Violet', '#8F00FF'],
        ['Yellow', '#FFFF00'],
        ['Paris Green', '#50C878'],
        ['English lavender', '#B48395'],
        ['Eton blue', '#96C8A2'],
        ['Eucalyptus', '#44D7A8'],
        ['Falu red', '#801818'],
        ['Hollywood cerise', '#F400A1'],
        ['Fawn', '#E5AA70'],
        ['Feldgrau', '#4D5D53'],
        ['Light apricot', '#FDD5B1'],
        ['Fern green', '#4F7942'],
        ['Field drab', '#6C541E'],
        ['Firebrick', '#B22222'],
        ['Fire engine red', '#CE2029'],
        ['Flame', '#E25822'],
        ['Flamingo pink', '#FC8EAC'],
        ['Flax', '#EEDC82'],
        ['Folly', '#FF004F'],
        ['Forest green (web)', '#228B22'],
        ['Pomp and Power', '#86608E'],
        ['French wine', '#AC1E44'],
        ['Fresh Air', '#A6E7FF'],
        ['Magenta', '#FF00FF'],
        ['Fuchsia pink', '#FF77FF'],
        ['Fuchsia rose', '#C74375'],
        ['Gainsboro', '#DCDCDC'],
        ['Gamboge', '#E49B0F'],
        ['Ginger', '#B06500'],
        ['Glaucous', '#6082B6'],
        ['Gold Fusion', '#85754E'],
        ['Golden brown', '#996515'],
        ['Golden poppy', '#FCC200'],
        ['Goldenrod', '#DAA520'],
        ['Granny Smith Apple', '#A8E4A0'],
        ['Grape', '#6F2DA8'],
        ['Gray-asparagus', '#465945'],
        ['Green (Munsell)', '#00A877'],
        ['Green (pigment)', '#00A550'],
        ['Green (RYB)', '#66B032'],
        ['Green-yellow', '#ADFF2F'],
        ['Grullo', '#A99A86'],
        ['Spring green', '#00FF7F'],
        ['Han blue', '#446CCF'],
        ['Han purple', '#5218FA'],
        ['Harvard crimson', '#C90016'],
        ['Harvest Gold', '#DA9100'],
        ['Olive', '#808000'],
        ['Heliotrope', '#DF73FF'],
        ['Honeydew', '#F0FFF0'],
        ['Honolulu blue', '#006DB0'],
        ['Hookers green', '#49796B'],
        ['Hot pink', '#FF69B4'],
        ['Hunter green', '#355E3B'],
        ['Iceberg', '#71A6D2'],
        ['Illuminating Emerald', '#319177'],
        ['Imperial', '#602F6B'],
        ['Imperial blue', '#002395'],
        ['Inchworm', '#B2EC5D'],
        ['Indian red', '#CD5C5C'],
        ['Indian yellow', '#E3A857'],
        ['Indigo (web)', '#4B0082'],
        ['International Klein Blue', '#002FA7'],
        ['International orange (aerospace)', '#FF4F00'],
        ['International orange (engineering)', '#BA160C'],
        ['Iris', '#5A4FCF'],
        ['Isabelline', '#F4F0EC'],
        ['Islamic green', '#009000'],
        ['Ivory', '#FFFFF0'],
        ['Jade', '#00A86B'],
        ['Jasper', '#D73B3E'],
        ['Jazzberry jam', '#A50B5E'],
        ['Jelly Bean', '#DA614E'],
        ['June bud', '#BDDA57'],
        ['Jungle green', '#29AB87'],
        ['Kelly green', '#4CBB17'],
        ['Khaki (HTML/CSS) (Khaki)', '#C3B091'],
        ['Light khaki', '#F0E68C'],
        ['Sienna', '#882D17'],
        ['Kobi', '#E79FC4'],
        ['KU Crimson', '#E8000D'],
        ['La Salle Green', '#087830'],
        ['Languid lavender', '#D6CADD'],
        ['Laurel green', '#A9BA9D'],
        ['Lavender', '#B57EDC'],
        ['Lavender mist', '#E6E6FA'],
        ['Periwinkle', '#CCCCFF'],
        ['Lavender blush', '#FFF0F5'],
        ['Lavender gray', '#C4C3D0'],
        ['Navy purple', '#9457EB'],
        ['Lavender purple', '#967BB6'],
        ['Lavender rose', '#FBA0E3'],
        ['Lemon', '#FFF700'],
        ['Lemon lime', '#E3FF00'],
        ['Lemon yellow', '#FFF44F'],
        ['Licorice', '#1A1110'],
        ['Light blue', '#ADD8E6'],
        ['Light brown', '#B5651D'],
        ['Light carmine pink', '#E66771'],
        ['Light coral', '#F08080'],
        ['Light cyan', '#E0FFFF'],
        ['Light fuchsia pink', '#F984EF'],
        ['Light gray', '#D3D3D3'],
        ['Light green', '#90EE90'],
        ['Light orchid', '#E6A8D7'],
        ['Light pastel purple', '#B19CD9'],
        ['Light salmon', '#FFA07A'],
        ['Light salmon pink', '#FF9999'],
        ['Light sky blue', '#87CEFA'],
        ['Light slate gray', '#778899'],
        ['Light steel blue', '#B0C4DE'],
        ['Light taupe', '#B38B6D'],
        ['Light yellow', '#FFFFE0'],
        ['Lilac', '#C8A2C8'],
        ['Lime green', '#32CD32'],
        ['Limerick', '#9DC209'],
        ['Lincoln green', '#195905'],
        ['Linen', '#FAF0E6'],
        ['Little boy blue', '#6CA0DC'],
        ['Liver', '#534B4F'],
        ['Magenta', '#CA1F7B'],
        ['Magic mint', '#AAF0D1'],
        ['Magnolia', '#F8F4FF'],
        ['Mahogany', '#C04000'],
        ['Malachite', '#0BDA51'],
        ['Manatee', '#979AAA'],
        ['Mango Tango', '#FF8243'],
        ['Mantis', '#74C365'],
        ['Rich maroon', '#B03060'],
        ['Mauve', '#E0B0FF'],
        ['Raspberry glace', '#915F6D'],
        ['Mauvelous', '#EF98AA'],
        ['Maya blue', '#73C2FB'],
        ['Meat brown', '#E5B73B'],
        ['Medium aquamarine', '#66DDAA'],
        ['Medium blue', '#0000CD'],
        ['Pale carmine', '#AF4035'],
        ['Vanilla', '#F3E5AB'],
        ['Medium electric blue', '#035096'],
        ['Medium jungle green', '#1C352D'],
        ['Plum', '#DDA0DD'],
        ['Medium orchid', '#BA55D3'],
        ['Sapphire blue', '#0067A5'],
        ['Medium red-violet', '#BB3385'],
        ['Medium ruby', '#AA4069'],
        ['Medium sea green', '#3CB371'],
        ['Medium slate blue', '#7B68EE'],
        ['Medium spring bud', '#C9DC87'],
        ['Medium spring green', '#00FA9A'],
        ['Medium taupe', '#674C47'],
        ['Medium turquoise', '#48D1CC'],
        ['Vermilion (Plochere)', '#D9603B'],
        ['Red-violet', '#C71585'],
        ['Mellow apricot', '#F8B878'],
        ['Melon', '#FDBCB4'],
        ['Metallic Seaweed', '#0A7E8C'],
        ['Metallic Sunburst', '#9C7C38'],
        ['Mexican pink', '#E4007C'],
        ['Midnight blue', '#191970'],
        ['Midnight green', '#004953'],
        ['Midori', '#E3F988'],
        ['Mint', '#3EB489'],
        ['Misty rose', '#FFE4E1'],
        ['Moonstone blue', '#73A9C2'],
        ['Moss green', '#ADDFAD'],
        ['Mountbatten pink', '#997A8D'],
        ['MSU Green', '#18453B'],
        ['Mulberry', '#C54B8C'],
        ['Mustard', '#FFDB58'],
        ['Myrtle', '#21421E'],
        ['Napier green', '#2A8000'],
        ['Navajo white', '#FFDEAD'],
        ['Navy blue', '#000080'],
        ['Neon fuchsia', '#FE4164'],
        ['New York pink', '#D7837F'],
        ['North Texas Green', '#059033'],
        ['Nyanza', '#E9FFDB'],
        ['Ochre', '#CC7722'],
        ['Old burgundy', '#43302E'],
        ['Old gold', '#CFB53B'],
        ['Old lace', '#FDF5E6'],
        ['Old lavender', '#796878'],
        ['Wine dregs', '#673147'],
        ['Old rose', '#C08081'],
        ['Olive Drab #3', '#6B8E23'],
        ['Olive Drab #7', '#3C341F'],
        ['Olivine', '#9AB973'],
        ['Onyx', '#353839'],
        ['Opera mauve', '#B784A7'],
        ['Orange', '#FF7F00'],
        ['Orange (RYB)', '#FB9902'],
        ['Orange-red', '#FF4500'],
        ['Orchid', '#DA70D6'],
        ['Orchid pink', '#F28DCD'],
        ['Outer Space', '#414A4C'],
        ['Oxford Blue', '#002147'],
        ['Pakistan green', '#006600'],
        ['Palatinate blue', '#273BE2'],
        ['Pale turquoise', '#AFEEEE'],
        ['Pale brown', '#987654'],
        ['Pale cerulean', '#9BC4E2'],
        ['Pale chestnut', '#DDADAF'],
        ['Pale cornflower blue', '#ABCDEF'],
        ['Pale gold', '#E6BE8A'],
        ['Pale goldenrod', '#EEE8AA'],
        ['Pale green', '#98FB98'],
        ['Pale lavender', '#DCD0FF'],
        ['Pale magenta', '#F984E5'],
        ['Pale pink', '#FADADD'],
        ['Pale violet-red', '#DB7093'],
        ['Pale robin egg blue', '#96DED1'],
        ['Pale silver', '#C9C0BB'],
        ['Pale spring bud', '#ECEBBD'],
        ['Pale taupe', '#BC987E'],
        ['Pansy purple', '#78184A'],
        ['Pastel blue', '#AEC6CF'],
        ['Pastel brown', '#836953'],
        ['Pastel gray', '#CFCFC4'],
        ['Pastel green', '#77DD77'],
        ['Pastel magenta', '#F49AC2'],
        ['Pastel pink', '#DEA5A4'],
        ['Pastel purple', '#B39EB5'],
        ['Pastel red', '#FF6961'],
        ['Pastel violet', '#CB99C9'],
        ['Pastel yellow', '#FDFD96'],
        ['Peach-orange', '#FFCC99'],
        ['Pear', '#D1E231'],
        ['Pearl', '#EAE0C8'],
        ['Pearl Aqua', '#88D8C0'],
        ['Pearly purple', '#B768A2'],
        ['Persian blue', '#1C39BB'],
        ['Persian green', '#00A693'],
        ['Persian indigo', '#32127A'],
        ['Persian orange', '#D99058'],
        ['Persian pink', '#F77FBE'],
        ['Prune', '#701C1C'],
        ['Persian rose', '#FE28A2'],
        ['Persimmon', '#EC5800'],
        ['Psychedelic purple', '#DF00FF'],
        ['Pictorial carmine', '#C30B4E'],
        ['Pine green', '#01796F'],
        ['Pink', '#FFC0CB'],
        ['Pink lace', '#FFDDF4'],
        ['Pink pearl', '#E7ACCF'],
        ['Pistachio', '#93C572'],
        ['Platinum', '#E5E4E2'],
        ['Plum (traditional)', '#8E4585'],
        ['Portland Orange', '#FF5A36'],
        ['Prussian blue', '#003153'],
        ['Puce', '#CC8899'],
        ['Pumpkin', '#FF7518'],
        ['Veronica', '#A020F0'],
        ['Purple pizzazz', '#FE4EDA'],
        ['Purple taupe', '#50404D'],
        ['Queen blue', '#436B95'],
        ['Queen pink', '#E8CCD7'],
        ['Raspberry', '#E30B5D'],
        ['Raspberry pink', '#E25098'],
        ['Raw umber', '#826644'],
        ['Red', '#FF0000'],
        ['Red (pigment)', '#ED1C24'],
        ['Rose vale', '#AB4E52'],
        ['Regalia', '#522D80'],
        ['Rhythm', '#777696'],
        ['Rich black', '#004040'],
        ['Rich brilliant lavender', '#F1A7FE'],
        ['Rich electric blue', '#0892D0'],
        ['Rich lavender', '#A76BCF'],
        ['Rich lilac', '#B666D2'],
        ['Rifle green', '#414833'],
        ['Rocket metallic', '#8A7F80'],
        ['Roman silver', '#838996'],
        ['Rose gold', '#B76E79'],
        ['Rose pink', '#FF66CC'],
        ['Rose quartz', '#AA98A9'],
        ['Rose taupe', '#905D5D'],
        ['Rosewood', '#65000B'],
        ['Rosy brown', '#BC8F8F'],
        ['Royal azure', '#0038A8'],
        ['Royal blue (traditional)', '#002366'],
        ['Royal blue', '#4169E1'],
        ['Royal fuchsia', '#CA2C92'],
        ['Royal purple', '#7851A9'],
        ['Rubine red', '#D10056'],
        ['Ruby red', '#9B111E'],
        ['Ruddy', '#FF0028'],
        ['Ruddy brown', '#BB6528'],
        ['Ruddy pink', '#E18E96'],
        ['Russet', '#80461B'],
        ['Rusty red', '#DA2C43'],
        ['Saddle brown', '#8B4513'],
        ['Safety orange (blaze orange)', '#FF6700'],
        ['Saffron', '#F4C430'],
        ['Salmon', '#FF8C69'],
        ['Salmon pink', '#FF91A4'],
        ['Sandstorm', '#ECD540'],
        ['Sandy brown', '#F4A460'],
        ['Sap green', '#507D2A'],
        ['Sapphire', '#0F52BA'],
        ['Sassy Pink', '#FABBBB'],
        ['Satin sheen gold', '#CBA135'],
        ['School bus yellow', '#FFD800'],
        ['Screaming Green', '#76FF7A'],
        ['Sea blue', '#006994'],
        ['Sea green', '#2E8B57'],
        ['Seal brown', '#321414'],
        ['Sepia', '#704214'],
        ['Shadow', '#8A795D'],
        ['Shamrock green', '#009E60'],
        ['Sheen Green', '#8FD400'],
        ['Shimmering Blush', '#D98695'],
        ['Shocking pink', '#FC0FC0'],
        ['Silver', '#C0C0C0'],
        ['Silver pink', '#C4AEAD'],
        ['Skobeloff', '#007474'],
        ['Sky blue', '#87CEEB'],
        ['Slate blue', '#6A5ACD'],
        ['Slate gray', '#708090'],
        ['Smoke', '#738276'],
        ['Smokey topaz', '#933D41'],
        ['Smoky black', '#100C08'],
        ['Soap', '#CEC8EF'],
        ['Sonic silver', '#757575'],
        ['Space cadet', '#1D2951'],
        ['Spanish carmine', '#D10047'],
        ['Spring bud', '#A7FC00'],
        ['Star command blue', '#007BBB'],
        ['Steel blue', '#4682B4'],
        ['Stormcloud', '#4F666A'],
        ['Straw', '#E4D96F'],
        ['Strawberry', '#FC5A8D'],
        ['Super pink', '#CF6BA9'],
        ['Tan', '#D2B48C'],
        ['Tangerine', '#F28500'],
        ['Taupe gray', '#8B8589'],
        ['Tea green', '#D0F0C0'],
        ['Teal', '#008080'],
        ['Teal blue', '#367588'],
        ['Teal deer', '#99E6B3'],
        ['Terra cotta', '#E2725B'],
        ['Thistle', '#D8BFD8'],
        ['Tigers eye', '#E08D3C'],
        ['Timberwolf', '#DBD7D2'],
        ['Tomato', '#FF6347'],
        ['Toolbox', '#746CC0'],
        ['Topaz', '#FFC87C'],
        ['Tropical rain forest', '#00755E'],
        ['True Blue', '#0073CF'],
        ['Tufts Blue', '#417DC1'],
        ['Tulip', '#FF878D'],
        ['Tumbleweed', '#DEAA88'],
        ['Turquoise', '#30D5C8'],
        ['Turquoise blue', '#00FFEF'],
        ['Turquoise green', '#A0D6B4'],
        ['Tuscan red', '#7C4848'],
        ['Tuscany', '#C09999'],
        ['Twilight lavender', '#8A496B'],
        ['Tyrian purple', '#66023C'],
        ['Ube', '#8878C3'],
        ['UCLA Blue', '#536895'],
        ['UCLA Gold', '#FFB300'],
        ['UFO Green', '#3CD070'],
        ['Ultramarine blue', '#4166F5'],
        ['Umber', '#635147'],
        ['Unbleached silk', '#FFDDCA'],
        ['Vegas gold', '#C5B358'],
        ['Venetian red', '#C80815'],
        ['Verdigris', '#43B3AE'],
        ['Violet', '#8601AF'],
        ['Violet-blue', '#324AB2'],
        ['Violet-red', '#F75394'],
        ['Viridian', '#40826D'],
        ['Vivid auburn', '#922724'],
        ['Vivid burgundy', '#9F1D35'],
        ['Vivid orchid', '#CC00FF'],
        ['Vivid tangerine', '#FFA089'],
        ['Waterspout', '#A4F4F9'],
        ['Wenge', '#645452'],
        ['Wheat', '#F5DEB3'],
        ['White', '#FFFFFF'],
        ['White smoke', '#F5F5F5'],
        ['Wild blue yonder', '#A2ADD0'],
        ['Wild orchid', '#D77A02'],
        ['Wild Strawberry', '#FF43A4'],
        ['Windsor tan', '#AE6838'],
        ['Wine', '#722F37'],
        ['Wisteria', '#C9A0DC'],
        ['Yellow-green', '#9ACD32'],
        ['Yellow Orange', '#FFAE42'],
        ['Zaffre', '#0014A8'],
        ['Zinnwaldite brown', '#2C1608'],
    ],
};
generalColourList.init();
ColourList.prototype.getColour = function(a) {
    return colourSource.colourById(this.getId(a));
};
ColourList.prototype.getId = function(a) {
    return this.colours[this.colours.length - a - 1];
};
ColourList.prototype.getName = function(a) {
    return colourSource.nameById(this.getId(a));
};
ColourList.prototype.addColour = function(b) {
    var a = 0;
    a = this.removeColour(b);
    if (a == -1 && this.colours.length == this.maxColours) {
        a = this.colours[0];
        this.colours.shift();
    }
    this.colours.push(b);
    this.display();
    return a;
};
ColourList.prototype.colourUsed = function(a) {
    if (this.colours[this.colours.length - 1] == a) {
        this.lastColourUsed = true;
    }
};
ColourList.prototype.removeColour = function removeColour(b) {
    var a = -1;
    a = this.colours.indexOf(b);
    if (a != -1) {
        this.colours.splice(a, 1);
    }
    this.display();
    return a;
};
ColourList.prototype.newColour = function(a) {
    if (this.colours.indexOf(a) == -1) {
        if (!this.lastColourUsed) {
            this.removeColour(this.colours[this.colours.length - 1]);
        }
        this.lastColourUsed = false;
        this.currentColour = a;
        this.addColour(a);
    } else {
        this.select(a);
    }
};
ColourList.prototype.select = function(d) {
    var a = this.colours.indexOf(d);
    var b = 'selectedColour';
    $('.colSample').removeClass(b);
    if (a != -1) {
        var c = 'col' + (this.colours.length - a - 1);
        $('#' + c).addClass(b);
    }
    this.currentColour = d;
    return a;
};
ColourList.prototype.display = function display() {
    var b, d, c;
    $('#colList1').empty();
    $('#colList2').empty();
    $('#colList3').empty();
    $('#colList4').empty();
    var a = this;
    for (b = 0; b < this.colours.length; b++) {
        d = Math.floor(b / 8) + 1;
        c = 'col' + b;
        $('#colList' + d).append(
            '<div class="colColumn clickable"><span class="colSample" id="' +
            c +
            '" style="background:' +
            this.getColour(b) +
            '" cdoCol="' +
            this.getId(b) +
            '" title="' +
            this.getName(b) +
            '" ></span><span>X</span></div>'
        );
        $('#' + c).click(function() {
            var e = $(this).attr('cdoCol');
            colourSource.setId(e);
        });
        $('#' + c)
            .next()
            .click(function() {
                a.removeColour($(this).prev().attr('cdoCol'));
            });
    }
    this.select(this.currentColour);
};

function ColourList(c) {
    var b;
    this.colours = new Array();
    this.maxColours = c;
    this.lastColourUsed = false;
    for (b = 0; b < arguments.length; b++) {
        if (b == 0 && typeof arguments[b] == 'number') {
            this.maxColours = arguments[b];
            continue;
        }
        this.addColour(arguments[b]);
    }
    var a = this;
    colourSource.linkTo(function(d) {
        a.newColour(d);
    });
}
var KEYCODE_ESC = 27;

function CdoPopup(a) {
    if (typeof a == 'string') {
        this.id = a;
        this.ui = $(a);
    } else {
        this.ui = a;
        this.id = a.attr('id');
    }
    this.titleBar = null;
    this.closeable = false;
    this.isFocused = false;
    this.focusHandlersSet = false;
    this.firstShow = true;
    this.show = function() {
        if (this.ui.length == 0) {
            this.ui = $(a);
        }
        var b = this.ui;
        b.removeClass('hideMe');
        this.forward();
        this.setPosition();
        this.setFocus();
        if (this.firstShow) {
            this.ui.click({
                    self: this,
                },
                function(c) {
                    c.data.self.forward();
                }
            );
        }
    };

    this.forward = function() {
        ZOrderManager.focus(this.ui);
    };

    this.setFocus = function() {
        var g = this.ui;
        var k = null;
        var h = g.attr('focus');
        if (h) {
            var d = h.split(' ');
            var c = $(document);
            do {
                k = c.contents().find('#' + d[0]);
                d.shift();
                if (d.length) {
                    c = k;
                }
            } while (d.length);
        } else {
            k = g;
            g.attr('tabindex', '-1');
        }
        if (k && !this.isFocused) {
            if (!this.focusHandlersSet) {
                k.focus({
                        popup: this,
                    },
                    function(l) {
                        l.data.popup.isFocused = true;
                    }
                );
                k.blur({
                        popup: this,
                    },
                    function(l) {
                        l.data.popup.isFocused = false;
                    }
                );
                this.focusHandlersSet = true;
            }
            k.focus();
            k.select();
        }
        var g = this.ui;
        if (!this.titleBar) {
            this.titleBar = $(a).find('h1');
            this.drag = new Draggable(this.titleBar, this);
            var b = 0;
            var j = $('<span class="popupIcons"></span>');
            this.helpId = this.titleBar.attr('help');
            if (this.helpId) {
                var e = $('<span class="popupIcon">?</span>');
                e.mousedown({
                        popup: this,
                    },
                    function(l) {
                        l.data.popup.clickHelp();
                    }
                );
                b++;
                j.append(e);
            }
            if (this.titleBar.attr('close')) {
                var f = $('<span class="popupIcon">x</span>');
                f.mousedown({
                        popup: this,
                    },
                    function(l) {
                        l.data.popup.clickX();
                    }
                );
                b++;
                j.append(f);
                this.closeable = true;
            }
            if (b) {
                this.titleBar.append(j);
                var i = this.titleBar.width();
                i += 10;
                g.css('min-width', i);
            }
        }
        g.keydown({
                popup: this,
            },
            function(l) {
                if (l.keyCode == KEYCODE_ESC) {
                    l.data.popup.escapePress();
                }
            }
        );
        k.keydown({
                popup: this,
            },
            function(l) {
                if (l.keyCode == KEYCODE_ESC) {
                    l.data.popup.escapePress();
                }
            }
        );
    };
    this.clickX = function() {
        var b = this.ui;
        b.focus();
        b.blur();
        this.hide();
    };
    this.clickHelp = function() {
        if (!this.helpPopup) {
            this.helpPopup = new PgPopup('#' + this.helpId);
        }
        this.helpPopup.show();
    };
    this.escapePress = function() {
        if (this.closeable) {
            this.hide();
        }
    };
    this.hideCB = null;
    this.hideCBObj = null;
    this.hideCBArgs = null;
    this.hide = function() {
        var b = this.ui;
        b.addClass('hideMe');
        ZOrderManager.hide(this.ui);
        if (this.drag) {
            this.drag.stop();
        }
        if (this.hideCB) {
            this.hideCB.apply(this.hideCBObj, this.hideCBArgs);
        }
    };
    this.setPosition = function() {
        var d = this.ui;
        var c = d.attr('near');
        var b = d.attr('at');
        var f = 5;
        var e;
        if (c) {
            e = $('#' + c).offset();
        } else {
            if (b) {
                e = $('#' + b).offset();
                e.left += 20;
                e.top += 20;
            } else {
                e = {
                    left: window.left + window.width / 2,
                    top: window.top + window.height / 2,
                };
            }
        }
        d.offset(e);
    };
    this.dragStart = function(b) {
        var d = this.ui;
        var c = d.find('.popupIcon');
        var e = false;
        c.each(function(j, m) {
            var p = $(m);
            var g = p.offset();
            var h = g.left;
            var f = h + p.outerWidth();
            var q = g.top;
            var n = q + p.outerHeight();
            var o = b.clientX + window.pageXOffset;
            var k = b.clientY + window.pageYOffset;
            if (h <= o && o <= f && q <= k && k <= n) {
                e = true;
                p.mousedown();
            }
        });
        this.moved = e;
    };
    this.dragMove = function(c) {
        this.moved = true;
        var f = this.ui;
        var d = c.clientX - this.drag.lastX;
        var b = c.clientY - this.drag.lastY;
        var e = f.offset();
        e.left += d;
        e.top += b;
        f.offset(e);
    };
    this.dragEnd = function(b) {
        if (!this.moved) {
            this.setFocus();
        }
    };
    this.forget = function() {
        this.hideCB = null;
        this.hideCBObj = null;
        this.hideCBArgs = null;
        this.ui = null;
        this.titleBar = null;
        this.id = '';
    };
}