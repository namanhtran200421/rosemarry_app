export interface CurrentCircle {
    circleId: number;
    cycleId: number;
    name: string;
    startsAt: Date;
    endsAt: Date;
}

export interface CurrentCirclesResponse {
    circles: CurrentCircle[];
}