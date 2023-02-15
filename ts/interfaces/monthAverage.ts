export interface issues {
  opened: number[];
  closed: number[];
}

export interface pulls {
  opened: number[];
  closed: number[];
  merged: number[];
}
export interface MonthAverage {
  issues: issues;
  pulls: pulls;
}
