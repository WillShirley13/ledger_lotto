import React from "react";

const FaqListItem = (props: {question: string, answer: string}) => {
	return (
		<div className="container flex p-4 rounded-md">
			<details
				className="border border-transparent open:bg-[var(--secondary)] open:rounded-md"
			>
				<summary className="mx-5 select-none">
					{props.question}
				</summary>
				<div className="mx-5 mt-2 text-sm leading-6">
					<p>
						{props.answer}
					</p>
				</div>
			</details> 
		</div>
	);
};

export default FaqListItem;
