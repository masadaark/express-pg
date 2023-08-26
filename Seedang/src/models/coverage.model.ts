export interface CoverageTable {
    id?: number,
    coverage_detail:coverageDetails,
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
export interface coverageDetails{
    coverage: Coverage[]
}
