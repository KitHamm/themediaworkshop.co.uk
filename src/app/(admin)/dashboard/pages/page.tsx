import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function PagesMain() {
    const data = await prisma.page.findMany({
        orderBy: {
            id: "asc",
        },
        select: {
            title: true,
        },
    });

    if (!data) return <div>Not Found</div>;

    return (
        <div className="block xl:mx-20 fade-in my-10 xl:pb-0 pb-16">
            {data.map((page: { title: string }, index: number) => {
                return (
                    <div
                        className="bg-neutral-800 mb-4 p-4 rounded-md"
                        key={index}>
                        <Link
                            className="capitalize"
                            href={"/dashboard/pages/" + page.title}>
                            {page.title}
                        </Link>
                    </div>
                );
            })}
        </div>
    );
}
