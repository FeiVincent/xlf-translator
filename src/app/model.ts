export interface TranslationUnit {
    index: number;
    id: string;
    meaning: string;
    description: string;
    source: string;
    target: string;
    version: string;
}

export class FileInfo {
    path: string;
    fileName: string;
    jsonData: any;
}

