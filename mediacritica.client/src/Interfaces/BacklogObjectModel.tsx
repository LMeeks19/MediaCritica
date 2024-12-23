import { BacklogModel } from "./BacklogModel";

export interface BacklogObjectModel {
    backlog: BacklogModel[];
    totalBacklogCount: number;

    inProgress: BacklogModel[];
    totalInProgressCount: number

    finished: BacklogModel[];
    totalFinishedCount: number;
}