"use client";

import { Accordion, AccordionItem } from "@nextui-org/react";

export default function InfoAccordion() {
    return (
        <Accordion variant="splitted">
            <AccordionItem
                className="dark"
                key={1}
                aria-label="Pages"
                title={
                    <div className="border-b pb-4 text-2xl font-bold capitalize text-orange-600">
                        Pages
                    </div>
                }>
                <p className="text-lg pb-4">
                    This is where most of the action takes place. You can add
                    segments to each page, and case studies to each segment.
                    When new content is added it is defaulted as a draft, you
                    will need to publish the content before it appears on the
                    main pages.
                </p>
                <p className="text-lg">
                    Each page requires a background video, and has optional Year
                    In Review and Showreel video options. On all pages except
                    the home page there is an option to add a title. On all
                    pages there is a required description.
                </p>
                <div className="grid grid-cols-1 xl:grid-cols-2 xl:gap-10 gap-5">
                    <div id="left">
                        <div className="border-b py-4 mb-5 text-xl font-bold capitalize ">
                            Segments
                        </div>
                        <p className="text-lg text-justify">
                            Segments appear on the main page. They contain an
                            optional title, some required content text and a
                            minimum of 1 image. If more images are added they
                            will appear as a carousel and automatically cycle
                            through the images. If the segment has Case Studies
                            associated with it, a button will appear to view
                            them.
                        </p>
                    </div>
                    <div id="right">
                        <div className="border-b pb-4 xl:py-4 mb-5 text-xl font-bold capitalize ">
                            Case Studies
                        </div>
                        <p className="text-lg text-justify">
                            If 1 or more case studies are added to a segment, a
                            button will appear that will display a popup of the
                            case studies associated with that segment. Case
                            Studies need a title, some content text and minimum
                            1 image. If more images are added they will appear
                            as a carousel. There is also an option to add a
                            video. Images and the video will be clickable to
                            bring into a focused view.
                        </p>
                    </div>
                </div>
            </AccordionItem>
            <AccordionItem
                className="dark"
                key={2}
                aria-label="Media"
                title={
                    <div className="border-b pb-4 text-2xl font-bold capitalize text-orange-600">
                        Media
                    </div>
                }>
                <p className="text-lg pb-4">
                    This is where you will find all the media uploaded and
                    available on the site.
                </p>
                <p className="text-lg pb-4">
                    Be sure to follow the naming conventions stated on the
                    upload form to ensure media as saved in the correct place
                    and is accessible by the font end.
                </p>
                <p className="text-lg pb-4">
                    Files should be prefixed in the correct way. All upper case
                    with the correct tag.
                </p>
                <p className="text-lg pb-4">
                    For example: <strong>HEADER_VideoName.mp4</strong>
                </p>
                <p className="text-lg text-red-400">
                    Try not to use special characters, especially hyphens ( - )
                </p>
                <p className="text-md text-neutral-500 pb-4">
                    This is due to the fact then when media is uploaded the name
                    is also tagged wit the time and date of upload using
                    hyphens. Adding these elsewhere will confuse the system.
                </p>
                <p className="text-lg font-bold text-red-400">
                    If you are deleting media make sure that it is not being
                    used in any sections or case studies.
                </p>
                <div className="grid grid-cols-1 xl:grid-cols-2 xl:gap-10 gap-5">
                    <div id="left">
                        <div className="border-b py-4 mb-5 text-xl font-bold capitalize ">
                            Video Prefix
                        </div>
                        <div className="flex gap-2 text-lg">
                            <strong>Background Videos:</strong>
                            <div>HEADER_</div>
                        </div>
                        <div className="flex gap-2 text-lg">
                            <strong>Other Videos:</strong>
                            <div>VIDEO_</div>
                        </div>
                    </div>
                    <div id="right">
                        <div className="border-b pb-4 xl:py-4 mb-5 text-xl font-bold capitalize ">
                            Image Prefix
                        </div>
                        <div className="flex gap-2 text-lg">
                            <strong>Section Header Images:</strong>
                            <div>SEGHEAD_</div>
                        </div>
                        <div className="flex gap-2 text-lg">
                            <strong>Section Images:</strong>
                            <div>SEGMENT_</div>
                        </div>
                        <div className="flex gap-2 text-lg">
                            <strong>Case Study Images:</strong>
                            <div>STUDY_</div>
                        </div>
                        <div className="flex gap-2 text-lg">
                            <strong>Thumbnail Images:</strong>
                            <div>THUMBNAIL_</div>
                        </div>
                        <div className="flex gap-2 text-lg">
                            <strong>Logo Images:</strong>
                            <div>LOGO_</div>
                        </div>
                    </div>
                </div>
            </AccordionItem>
            <AccordionItem
                className="dark"
                key={3}
                aria-label="Messages"
                title={
                    <div className="border-b pb-4 text-2xl font-bold capitalize text-orange-600">
                        Messages
                    </div>
                }>
                <p className="text-lg pb-4">
                    All messages submitted through the contact form will appear
                    here. If there are new unread messages, an icon will appear
                    on the Messages tab with the number of unread messages.
                </p>
                <p className="pb-2 text-red-400">(Experimental)</p>
                <p className="pb-4 text-lg">
                    When a new message is received an email will also be sent to
                    info@themediaworkshop.co.uk informing you that a message has
                    been received on the website.
                </p>
            </AccordionItem>
            <AccordionItem
                className="dark"
                key={4}
                aria-label="Settings"
                title={
                    <div className="border-b pb-4 text-2xl font-bold capitalize text-orange-600">
                        Settings
                    </div>
                }>
                <p className="text-lg pb-4">
                    Here is where you can see all people with account access to
                    the site.
                </p>
                <p className="text-lg pb-4">
                    When adding a new account, a random password will be
                    generated and displayed to you when the account has been
                    successfully created. Make sure to take note of this and
                    send it to the account holder.
                </p>
                <p className="text-lg pb-4 text-red-400">
                    You can also delete accounts, except for you own account.
                </p>
            </AccordionItem>
        </Accordion>
    );
}
