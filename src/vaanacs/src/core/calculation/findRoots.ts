import { Value } from "../../projects/models/project";

export function findRoots(minAE: number, array: Value[]) {
    if (array.find(p => p.v === minAE)) {
        return array.filter(p => p.v === minAE);
    }

    let vectors = pairwise(array);

    let crossZeroVectors = vectors.filter(([u, v]) => {
        if (u.v > minAE && v.v < minAE) return true;
        else return false;
    })
    

    let roots: Value[] = [];

    for(let [u,v] of crossZeroVectors){
        let axisVector = [{t:u.v, v:minAE }, {t:v.v, v:minAE}];

        let intersectionPoint = lineIntersect(u.t, u.v, v.t, v.v, axisVector[0].t, axisVector[0].v, axisVector[1].t, axisVector[1].v);

        //alert(intersectionPoint);

        if(intersectionPoint)
            roots.push({
                t:intersectionPoint.x,
                v:intersectionPoint.y
            });

    }
    
    return roots;

}

function lineIntersect(x1:number, y1:number, x2:number, y2:number, x3:number, y3:number, x4:number, y4:number)
{
    var ua, ub, denom = (y4 - y3)*(x2 - x1) - (x4 - x3)*(y2 - y1);
    if (denom == 0) {
        return null;
    }
    ua = ((x4 - x3)*(y1 - y3) - (y4 - y3)*(x1 - x3))/denom;
    ub = ((x2 - x1)*(y1 - y3) - (y2 - y1)*(x1 - x3))/denom;
    return {
        x: x1 + ua * (x2 - x1),
        y: y1 + ub * (y2 - y1),
        seg1: ua >= 0 && ua <= 1,
        seg2: ub >= 0 && ub <= 1
    };
}

function pairwise<T>(arr: T[]): Array<Array<T>> {
    let result = [];
    for (var i = 0; i < arr.length - 1; i++) {
        result.push([arr[i], arr[i + 1]])
    }

    return result;
}
