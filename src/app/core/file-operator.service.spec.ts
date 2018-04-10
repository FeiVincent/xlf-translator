import { TestBed, inject } from '@angular/core/testing';

import { FileOperatorService } from './file-operator.service';

describe('FileOperatorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FileOperatorService]
    });
  });

  it('should be created', inject([FileOperatorService], (service: FileOperatorService) => {
    expect(service).toBeTruthy();
  }));
});
