// components
import Page from "../page";

export default async function LoadPage({
	params,
}: Readonly<{ params: Promise<{ slug?: string }> }>) {
	const { slug } = await params;

	return <Page slug={slug} />;
}
