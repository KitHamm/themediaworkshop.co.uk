import { CaseStudy, Page, Role, Segment, toLink } from "@prisma/client";

// Main
export interface ExtendedPage extends Page {
    segment: ExtendedSegment[];
}
export interface ExtendedSegment extends Segment {
    casestudy: CaseStudy[];
}

// Case Study Types
export type CaseStudyImageType = {
    url: string;
};

export type CaseStudyTagType = {
    text: string;
};

export type CaseStudyFromType = {
    title: string;
    dateLocation: string;
    copy: string;
    image: CaseStudyImageType[];
    video: string;
    videoThumbnail: string;
    segmentId: number;
    tags: CaseStudyTagType[];
    order: number;
    published: boolean;
};

// Segment Types
export type ImageFormType = {
    url: string;
};

export type VideoFormType = {
    url: string;
};
export type SegmentFormType = {
    id: number;
    title: string;
    copy: string;
    image: ImageFormType[];
    video: VideoFormType[];
    headerImage: string;
    order: number;
    buttonText: string;
    linkTo: toLink;
};

// Page Types
export type PageFormType = {
    page: string;
    subTitle: string;
    description: string;
    header: string;
    video1: string;
    video2: string;
    backgroundVideo: string;
    videoOneButtonText: string;
    videoTwoButtonText: string;
};

// Notification Types
export type Notification = {
    component: string;
    title: string;
};

export type NotificationProviderType = {
    notifications: Notification[];
    setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
};

// Ticket Type
export type TicketFormType = {
    dashboard: boolean;
    reproducible: boolean;
    problem: string;
    submittedBy: string;
};

// User Types
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

export type UserFormTypes = {
    email: string;
    firstName: string;
    lastName: string;
    position: string;
    image: string;
    password: string;
    role: Role;
};
export type UserPasswordFormTypes = {
    id: string;
    password: string;
    confirmPassword: string;
    currentPassword: string;
};
export type ResetUserPasswordFormType = {
    userId: string;
    password: string;
    adminId: string;
    adminPassword: string;
};

// Contact Types
export type ContactFormTypes = {
    name: string;
    email: string;
    message: string;
};

// Stat Types
export type DiskSpaceType = {
    diskPath: string;
    free: number;
    size: number;
};
