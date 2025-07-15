const btnStyles = `bg-white px-1.5 py-1 font-medium transition-all hover:!bg-red-500 hover:text-white`;

function PopularTags() {
	return (
		<div className='space-x-1.5 space-y-1.5 bg-gray-100 p-6'>
			<h3 className='relative pb-2 mb-4 text-xl font-bold before:absolute before:bottom-0 before:h-1 before:w-16 before:bg-red-500'>
				Popular Tags
			</h3>
			<button className={btnStyles}>Crossfit</button>
			<button className={btnStyles}>Fitness</button>
			<button className={btnStyles}>Gym</button>
			<button className={btnStyles}>Meditation</button>
			<button className={btnStyles}>Running</button>
			<button className={btnStyles}>Workout</button>
			<button className={btnStyles}>Yoga</button>
		</div>
	);
}

export default PopularTags;
