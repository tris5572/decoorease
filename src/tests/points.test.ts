import { expect, test } from "vitest";
import { decreaseStraightPoint, Point } from "../scripts/point";

test("decreaseStraightPoint(): 要素数が少ない時", () => {
  const lnglats = [
    new Point(140.0011, 36.0001),
    new Point(140.0021, 36.0001),
    new Point(140.0031, 36.0001),
    new Point(140.0041, 36.0001),
    new Point(140.0051, 36.0001),
    new Point(140.0061, 36.0001),
  ];

  expect(decreaseStraightPoint(lnglats, 1.0, 2).length).toBe(4);
  expect(decreaseStraightPoint(lnglats, 1.0, 3).length).toBe(3);
  expect(decreaseStraightPoint(lnglats, 1.0, 4).length).toBe(3);
  expect(decreaseStraightPoint(lnglats, 1.0, 5).length).toBe(2);
  expect(decreaseStraightPoint(lnglats, 1.0, 10).length).toBe(2);
});

test("decreaseStraightPoint(): 各方角で間引かれる", () => {
  const east = [
    new Point(140.0101, 36.0001),
    new Point(140.0201, 36.0002),
    new Point(140.0301, 36.0001),
    new Point(140.0401, 36.0),
  ];
  expect(decreaseStraightPoint(east, 1.0, 3).length).toBe(2);

  const north = [
    new Point(140.0001, 36.0101),
    new Point(140.0, 36.0201),
    new Point(140.0002, 36.0301),
    new Point(140.0001, 36.0401),
  ];
  expect(decreaseStraightPoint(north, 1.0, 3).length).toBe(2);

  const west = [
    new Point(140.0401, 36.0001),
    new Point(140.0301, 36.0),
    new Point(140.0201, 36.0002),
    new Point(140.0101, 36.0001),
    new Point(140.0001, 36.0002),
  ];
  expect(decreaseStraightPoint(west, 1.0, 2).length).toBe(3);
  expect(decreaseStraightPoint(west, 1.0, 3).length).toBe(3);
});

test("decreaseStraightPoint(): 曲線が間引かれない", () => {
  const lnglats = [
    new Point(140.001, 36.001),
    new Point(140.002, 36.001),
    new Point(140.003, 36.002),
    new Point(140.003, 36.003),
    new Point(140.004, 36.005),
    new Point(140.005, 36.004),
    new Point(140.004, 36.003),
  ];
  expect(decreaseStraightPoint(lnglats, 1.0, 3).length).toBe(7);
});

test("decreaseStraightPoint(): 曲がったときの動作", () => {
  const lnglats = [
    new Point(140.001, 36.001),
    new Point(140.002, 36.001),
    new Point(140.003, 36.001),
    new Point(140.002, 36.002),
    new Point(140.001, 36.003),
  ];
  expect(decreaseStraightPoint(lnglats, 1.0, 3)).toEqual([
    new Point(140.001, 36.001),
    new Point(140.003, 36.001),
    new Point(140.001, 36.003),
  ]);
});
