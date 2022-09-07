import { CSSProperties } from 'react';

export interface CorpSketchProps {
  coordinates: Coordinate[];
  src: string;
  coordinateConfig?: CoordinateConfig;
  sketchStyle?: CSSProperties;
  onChange?(coordinate: Coordinate, index: number, coordinates: Coordinate[]): void;
  onAdd?(coordinate: Coordinate, index: number): void;
  onDelete?(coordinate: Coordinate, index: number): void;
  onMount?(): void;
  getCropData?(coordinates: Coordinate[]): CorpData[];
}

export interface Coordinate {
  x: number;
  y: number;
  width: number;
  height: number;
  id: string;
}

export interface CoordinateConfig {
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
}

export type CorpData = Coordinate & { img: string };

export type Point = { x: number; y: number };

export interface HotAreaProps {
  coordinate: Coordinate;
  index: number;
  onChange(coordinate: Coordinate): void;
  onDelete(coordinate: Coordinate): void;
}

export type AnyType = any;