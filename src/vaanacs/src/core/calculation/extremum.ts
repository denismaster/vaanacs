import { Value } from "../../projects/models/project";

export function findExtremumPoints(array: Value[]): Value[] {
    let peak: Value | undefined;
    return array.reduce((peaks: Value[], _, i, arr) => {
        if (arr[i + 1] && arr[i + 1].v > arr[i].v) {
            peak = arr[i + 1];
        } else if (arr[i + 1] && (arr[i + 1].v < arr[i].v) && (peak && typeof peak.v === 'number')) {
            peaks.push(peak);
            peak = undefined;
        }
        return peaks;
    }, []);
}