import { useEffect } from "react";

import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";

import notificationSound from "../assets/sounds/notification.mp3";

const useListenMessages = () => {
	const { socket } = useSocketContext();
	const { setMessages, selectedConversation } = useConversation();

	useEffect(() => {
		socket?.on("newMessage", (newMessage) => {
			setMessages((prevMessages) => {
				const messagesArray = Array.isArray(prevMessages) ? prevMessages : [];
				newMessage.shouldShake = true;
				const sound = new Audio(notificationSound);
				sound.play();
				return [...messagesArray, newMessage];
			});
		});

		return () => socket?.off("newMessage");
	}, [socket]);
};
export default useListenMessages;