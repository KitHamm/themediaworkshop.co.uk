"use client";
// packages
import { Breadcrumbs, BreadcrumbItem } from "@heroui/react";
import Link from "next/link";

const BreadcrumbLinks = ({ page }: Readonly<{ page: string }>) => {
	return (
		<Breadcrumbs className="dark" underline="active">
			<BreadcrumbItem key="page">
				<Link
					href={"/dashboard/pages"}
					className="text-2xl text-orange-500"
				>
					Pages
				</Link>
			</BreadcrumbItem>
			<BreadcrumbItem className="capitalize" key={page} isCurrent>
				<div className="text-2xl">{page}</div>
			</BreadcrumbItem>
		</Breadcrumbs>
	);
};

export default BreadcrumbLinks;
