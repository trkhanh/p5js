import p5 from 'p5';
import { FindCursor } from './modules/find-cursor.js';
import { SmoothLine } from './modules/smooth-line';
import { BoundCircle } from './modules/bound-circle';
import { RobotArm } from './modules/robot-arm';
import { SimpleScale } from './modules/simple-scale';
import { LoadImage } from './modules/load-image.js';
import { RobotGame } from './modules/robot-game';
import { CircleMovement } from './modules/circle-movement';
import { Spirals } from './modules/spiral';

new p5(SmoothLine);
new p5(FindCursor);
new p5(BoundCircle);
new p5(RobotArm);
new p5(SimpleScale);
new p5(LoadImage);
new p5(RobotGame);
new p5(CircleMovement);
new p5(Spirals)
