"use client";

import { Accordion, AccordionItem } from "@nextui-org/react";

export default function ChangeLogAccordion() {
    return (
        <Accordion variant="splitted">
            <AccordionItem
                className="dark"
                key={6}
                aria-label="4/3/2024"
                title={
                    <div className="flex border-b pb-2 mb-2 gap-4">
                        <div className="text-lg text-orange-600 font-bold">
                            4/3/2024
                        </div>
                        <div className="text-lg text-green-400 font-bold">
                            NEW!
                        </div>
                    </div>
                }>
                <div className="text-lg">
                    <ul>
                        <li>- Duplicate Ticker Tape to under header video</li>
                        <li>
                            - Ticker Tape height dynamically set by image height
                            to fix glitching
                        </li>
                    </ul>
                </div>
            </AccordionItem>
            <AccordionItem
                className="dark"
                key={5}
                aria-label="1/3/2024"
                title={
                    <div className="flex border-b pb-2 mb-2 gap-4">
                        <div className="text-lg text-orange-600 font-bold">
                            1/3/2024
                        </div>
                    </div>
                }>
                <div className="text-lg">
                    <ul>
                        <li>
                            - You can now report problems by clicking the menu
                            next to your avatar
                        </li>
                        <li>- Client side ordering of Logos.</li>
                        <li>- Streamlined API routes.</li>
                        <li>- Unsaved changes notifications.</li>
                        <li>
                            - Case Study unsaved changes warning when closing
                            modal.
                        </li>
                        <li>
                            - Segment unsaved changes now visible on banner when
                            closed.
                        </li>
                        <li>- Mobile fix for editing segments.</li>
                    </ul>
                </div>
            </AccordionItem>
            <AccordionItem
                className="dark"
                key={4}
                aria-label="28/2/2024"
                title={
                    <div className="flex border-b pb-2 mb-2 gap-4">
                        <div className="text-lg text-orange-600 font-bold">
                            28/2/2024
                        </div>
                    </div>
                }>
                <div className="text-lg">
                    <ul>
                        <li>- Upload now has progress percentage.</li>
                        <li>- Delete file now checks if file is used.</li>
                        <li>
                            - If file is used, you will receive a message
                            telling you where.
                        </li>
                    </ul>
                </div>
            </AccordionItem>
            <AccordionItem
                className="dark"
                key={3}
                aria-label="27/2/2024"
                title={
                    <div className="text-lg text-orange-600 font-bold border-b pb-2 mb-2">
                        27/2/2024
                    </div>
                }>
                <div className="text-lg">
                    <ul>
                        <li>- Media bin now sorted by upload date</li>
                        <li>- Ticker tape logos now sorted alphabetically</li>
                        <li>- Changed video tags to HEADER_ and VIDEO_</li>
                        <li>
                            - Dynamically add target _blank to a tags in
                            Markdown text
                        </li>
                        <li>
                            - Error handling when trying to download Segment
                            that has Case Studies
                        </li>
                        <li>- Fixed download media being corrupt</li>
                        <li>- CTA is now 10 second delay</li>
                    </ul>
                </div>
            </AccordionItem>
            <AccordionItem
                className="dark"
                key={2}
                aria-label="23/2/2024"
                title={
                    <div className="text-lg text-orange-600 font-bold border-b pb-2 mb-2">
                        23/2/2024
                    </div>
                }>
                <div className="text-lg">
                    <ul>
                        <li>- Video in examples now has a play icon</li>
                        <li>
                            - Video in examples has option to add a thumbnail
                        </li>
                        <li>
                            - Logo bar moves slower and changed color per
                            request
                        </li>
                        <li>- Logo bar on all pages and mobile</li>
                        <li>- Socials bar changes color as per request</li>
                        <li>
                            - Text positioning on segments now lines up with
                            body of text
                        </li>
                        <li>
                            - Call to action &quot;Scroll Down&quot; when first
                            load and stationary at top for 5 seconds
                        </li>
                        <li>- Can now download media from the media page</li>
                    </ul>
                </div>
            </AccordionItem>
            <AccordionItem
                className="dark"
                key={1}
                aria-label="17/2/2024"
                title={
                    <div className="text-lg text-orange-600 font-bold border-b pb-2 mb-2">
                        17/2/2024
                    </div>
                }>
                <div className="text-lg">
                    <ul>
                        <li>- Ticker Tape logos on home page.</li>
                        <li>
                            - Ability to upload logos of companies worked with.
                        </li>
                        <li>- Button styling and animation.</li>
                        <li>- Text animation on page segments.</li>
                        <li>- Can add link to segment titles.</li>
                        <li>- Custom button text for case study pop up.</li>
                        <li>- Can add Date and Location to case studies.</li>
                        <li>- Fixed header size when no text is present.</li>
                    </ul>
                </div>
            </AccordionItem>
        </Accordion>
    );
}
