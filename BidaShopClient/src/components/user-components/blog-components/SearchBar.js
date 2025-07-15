import React from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchBar = ({ searchInput, setSearchInput }) => {
	return (
		<div className='flex'>
			<input
				type="text"
				placeholder="Search here..."
				value={searchInput}
				onChange={(e) => setSearchInput(e.target.value)}
				className="w-full"
				style={{
					width: "100%",
					padding: "10px 40px 10px 10px",
					border: "2px solid #ff7300",
					borderRadius: "15px",
					fontSize: "1rem",
					boxSizing: "border-box",
					backgroundColor: "#2b2b2b",
					color: "#fff",
				}}
			/>

			{/* <button className='focus ml-[-1px] rounded-r-md bg-red-500 p-3 text-white'>
				<FaSearch />
			</button> */}
		</div>
	);
};

export default SearchBar;
