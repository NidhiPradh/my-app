export interface Sample {
  sampleID?: number;
  productID: number;
//   reportID?: number;
//   durationID?: number;

  sampleCode: string;
  sampleType: string;
  pullPoint?: string;

  sampleStatus: string;
  receivedDate: Date;

  createdBy: number;
  createdOn: Date;

  updatedBy?: number;
  updatedOn?: Date;
}