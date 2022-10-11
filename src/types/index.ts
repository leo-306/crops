import { CSSProperties } from 'react';

export interface CorpSketchProps {
  coordinates: Coordinate[];
  src: string;
  width: number | string;
  height?: number | string;
  className?: string;
  limit?: number;
  coordinateConfig?: CoordinateConfig;
  locationLine?: boolean;
  rotatable?: boolean;
  onChange?(coordinate: Coordinate, index: number, coordinates: Coordinate[]): void;
  onAdd?(coordinate: Coordinate, index: number): void;
  onDelete?(coordinate: Coordinate, index: number): void;
  onMount?(): void;
}

export type CorpCanvasSketchProps = Omit<CorpSketchProps, 'width' | 'height'> & { width: number; height?: number };

export interface CorpSketchRef {
  getCropData(coordinates: Coordinate[]): CorpData[];
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
  showLocationLine: boolean;
  selected: boolean;
  rotatable?: boolean;
  coordinate: Coordinate;
  index: number;
  onChange(coordinate: Coordinate): void;
  onDelete(coordinate: Coordinate): void;
  setLocationInfo(info: LocationLineInfo | null): void;
  setSelectedId(id: string): void;
}

export type AnyType = any;

export type LocationLineInfo = {
  style: {
    leftTopVertical: CSSProperties;
    leftTopHorizontal: CSSProperties;
    rightBottomVertical: CSSProperties;
    rightBottomHorizontal: CSSProperties;
  };
  offset: {
    leftTopVertical: number;
    leftTopHorizontal: number;
    rightBottomVertical: number;
    rightBottomHorizontal: number;
  }
};