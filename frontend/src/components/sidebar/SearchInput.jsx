import { IoSearchSharp } from "react-icons/io5";
import useConversation from "../../zustand/useConversation";
import toast from "react-hot-toast";

const SearchInput = () => {
	const { searchQuery, setSearchQuery, conversations, setSelectedConversation } = useConversation();

	const handleSearch = () => {
		if (!searchQuery) return;

		const conversation = conversations.find((c) =>
			c.fullName.toLowerCase().includes(searchQuery.toLowerCase())
		);

		if (conversation) {
			setSelectedConversation(conversation);
			setSearchQuery("");
		} else {
			toast.error("No such user found!");
		}
	};

	return (
		<div className='flex items-center gap-2'>
			<input
				type='text'
				placeholder='Search…'
				className='input input-bordered rounded-full'
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
			/>
			<button onClick={handleSearch} className='btn btn-circle bg-sky-500 text-white'>
				<IoSearchSharp className='w-6 h-6 outline-none' />
			</button>
		</div>
	);
};
export default SearchInput;