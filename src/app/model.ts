export interface TranslationUnit {
    index: number;
    id: string;
    meaning: string;
    description: string;
    source: string;
    target: string;
}

export class FileInfo {
    path: string;
    fileName: string;
    xmlData: string;
}

