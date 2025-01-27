import { CaseStudy, Segment, Page } from "@prisma/client";

export interface ExtendedPage extends Page {
	segment: ExtendedSegment[];
}
export interface ExtendedSegment extends Segment {
	casestudy: CaseStudy[];
}

export enum MessageSendingState {
	"NONE",
	"SENDING",
	"SUCCESS",
	"ERROR",
}
