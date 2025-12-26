import useGetConversations from "../../hooks/useGetConversations";
import useConversation from "../../zustand/useConversation";
import Conversation from "./Conversation";
import { getRandomEmoji } from "../../utils/emojis";

const Conversations = () => {
  const { loading, conversations } = useGetConversations();
  const { searchQuery } = useConversation();

  const filteredConversations = conversations.filter((c) =>
    c.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-70 h-screen bg-white bg-opacity-70 backdrop-filter backdrop-blur-lg flex flex-col border-r border-gray-300">
      <div className="flex-1 overflow-y-auto font-bold scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
        {filteredConversations.map((conversation, idx) => (
          <Conversation
            key={conversation._id}
            conversation={conversation}
            emoji={getRandomEmoji()}
            lastIdx={idx === filteredConversations.length - 1}
          />
        ))}

        {loading && <span className="loading loading-spinner mx-auto"></span>}
      </div>
    </div>
  );
};

export default Conversations;
