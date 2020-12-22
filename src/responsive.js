import p5 from 'p5';
import { FindCursor } from './modules/find-cursor.js';
import { SmoothLine } from './modules/smooth-line';
import { BoundCircle } from './modules/bound-circle';
new p5(SmoothLine);
new p5(FindCursor);
new p5(BoundCircle);
