import { CaseStudy, Page, Segment } from "@prisma/client";

export interface ExtendedPage extends Page {
    segment: ExtendedSegment[];
}
export interface ExtendedSegment extends Segment {
    casestudy: CaseStudy[];
}

export type UserWithoutPassword = {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    position: string | null;
    image: string | null;
    activated: boolean;
    role: string;
};
