export interface CoverageTable {
    id?: number,
    coverage_detail:string,
    created_at?: Date,
}

export interface CoverageDetail {
    value: string;
    unit: string;
}

export interface Coverage {
    title: string;
    detail: CoverageDetail;
}