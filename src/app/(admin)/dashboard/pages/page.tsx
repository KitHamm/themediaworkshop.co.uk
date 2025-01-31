// prisma
import prisma from "@/lib/prisma";
// packages
import { Divider } from "@heroui/react";
import Link from "next/link";
// types
import { ExtendedPage } from "@/lib/types";
import PageOrderButtons from "@/components/dashboard/pageView/PageOrderButtons";

export default async function PagesMain() {
	let data: ExtendedPage[] = [];
	try {
		data = await prisma.page.findMany({
			orderBy: {
				id: "asc",
			},
			include: {
				segment: {
					include: {
						casestudy: true,
					},
				},
			},
		});
	} catch (error) {
		console.log("Unexpected error:", error);
	}

	return (
		<>
			<div className="xl:mx-20 mx-4 fade-in pb-20 xl:pb-0 xl:h-screen flex flex-col">
				<div className="xl:py-10 w-full">
					<div className="border-b flex gap-10 w-full py-4 mb-10">
						<div className="flex gap-4">
							<div className="text-3xl font-bold capitalize">
								Pages
							</div>
						</div>
					</div>
					{data.map((page: ExtendedPage, index: number) => {
						const totalCaseStudies = page.segment.reduce(
							(total, segment) => {
								return total + segment.casestudy.length;
							},
							0
						);
						return (
							<div
								key={page.title}
								className="flex gap-4 mb-4 fade-in xl:w-1/2"
							>
								<Link
									href={`/dashboard/pages/${page.title}`}
									className="grow block bg-neutral-800 hover:bg-orange-500 text-orange-600 hover:text-white transition-all p-4 rounded-md"
								>
									<div className="flex justify-between">
										<div className="flex justify-between lg:justify-start lg:gap-4 w-full">
											<div className="lg:w-24 w-10 capitalize lg:text-2xl lg:mb-0 mb-auto mt-auto font-bold">
												{page.title}
											</div>
											<div className="flex flex-col lg:flex-row gap-0 lg:gap-8">
												<div className="mt-auto lg:text-lg flex gap-2 text-white">
													<div>Segments:</div>
													<div>
														{page.segment.length}
													</div>
												</div>
												<div className="mt-auto lg:text-lg flex gap-2 text-white">
													<div>Case Studies:</div>
													<div>
														{totalCaseStudies}
													</div>
												</div>
											</div>
											<div className="lg:ms-auto text-center my-auto lg:text-xl">
												Edit
											</div>
										</div>
										<div className="flex gap-8"></div>
									</div>
									<Divider className="bg-white mt-2" />
								</Link>
								<PageOrderButtons
									pageId={page.id}
									hideFirst={index === 0}
									hideLast={index === data.length - 1}
								/>
							</div>
						);
					})}
				</div>
			</div>
		</>
	);
}
