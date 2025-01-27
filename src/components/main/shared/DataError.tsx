const DataError = ({}: Readonly<{}>) => {
	return (
		<main className="min-h-screen flex flex-col gap-4 justify-center items-center">
			<div className="text-4xl">Unexpected Error</div>
			<div>
				It looks like we are experiencing some problems at the moment.
			</div>
			<div>Please try again later.</div>
		</main>
	);
};

export default DataError;
