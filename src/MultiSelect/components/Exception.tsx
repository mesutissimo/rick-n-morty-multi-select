const Exception = ({ exception }: { exception: string | null }) => {
	return (
		exception && (
			<div className="exception-info">
				<p>{exception}</p>
			</div>
		)
	);
};

export default Exception;
