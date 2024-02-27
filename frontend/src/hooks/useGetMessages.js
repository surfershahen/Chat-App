import React, { useState, useEffect } from "react";
import useConversation from "../zustand/useConversation.js";
import toast from "react-hot-toast";

const useGetMessages = () => {
  // Get messages from the conversation instance and send them to the conversation instance itself via the  conversation  instance method
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();
  // Get messages from the conversation instance and send them to the conversation instance itself via the conversation instance
  useEffect(() => {
    // Get messages from the conversation instance and send them to the conversation instance itself via
    const getMessages = async () => {
      setLoading(true);
      try {
        //get the messages from the backend
        const res = await fetch(`/api/messages/${selectedConversation._id}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setMessages(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    //if there are a selected message we will fetch all the message otherwise we don't
    if (selectedConversation?._id) getMessages();
  }, [selectedConversation?._id, setMessages]);

  return { loading, messages };
};

export default useGetMessages;
