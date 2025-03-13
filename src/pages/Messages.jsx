import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { FiSearch, FiSend, FiPaperclip, FiCornerDownRight, FiMessageSquare, FiX } from 'react-icons/fi';

const Messages = () => {
  const { user } = useAuth();
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);

  // Enhanced mock data with thread support
  const [conversations] = useState([
    {
      id: 1,
      with: {
        id: 2,
        name: 'Jane Smith',
        role: 'client',
        avatar: 'https://ui-avatars.com/api/?name=Jane+Smith'
      },
      messages: [
        {
          id: 1,
          sender: 2,
          text: 'Hi, I have a question about the project timeline.',
          timestamp: '2024-03-14T10:00:00Z',
          read: true,
          replies: []
        },
        {
          id: 2,
          sender: 1,
          text: "Of course! I'll be happy to help. What would you like to know?",
          timestamp: '2024-03-14T10:05:00Z',
          read: true,
          parentId: 1,
          replies: [
            {
              id: 3,
              sender: 2,
              text: 'When will the design phase be completed?',
              timestamp: '2024-03-14T10:10:00Z',
              read: true
            },
            {
              id: 4,
              sender: 1,
              text: 'The design phase is scheduled to complete by the end of next week.',
              timestamp: '2024-03-14T10:15:00Z',
              read: true
            }
          ]
        }
      ],
      unread: 0
    },
    {
      id: 2,
      with: {
        id: 3,
        name: 'Bob Johnson',
        role: 'client',
        avatar: 'https://ui-avatars.com/api/?name=Bob+Johnson'
      },
      messages: [
        {
          id: 5,
          sender: 3,
          text: 'Could you review the latest documents I sent?',
          timestamp: '2024-03-13T15:30:00Z',
          read: false,
          replies: []
        }
      ],
      unread: 1
    }
  ]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: user.id,
      text: messageText,
      timestamp: new Date().toISOString(),
      read: false,
      replies: [],
      parentId: replyingTo?.id
    };

    // In production, this would be handled by your backend
    setReplyingTo(null);
    setMessageText('');
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const MessageThread = ({ message, depth = 0 }) => {
    const isCurrentUser = message.sender === user.id;

    return (
      <div className={`space-y-2 ${depth > 0 ? 'ml-8 border-l-2 border-gray-100 pl-4' : ''}`}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-xs md:max-w-md rounded-lg p-3 ${
              isCurrentUser ? 'bg-primary-500 text-white' : 'bg-white'
            }`}
          >
            <p className="text-sm">{message.text}</p>
            <div className={`flex items-center justify-between mt-1 text-xs ${
              isCurrentUser ? 'text-primary-100' : 'text-gray-500'
            }`}>
              <span>{formatTime(message.timestamp)}</span>
              {!replyingTo && (
                <button
                  onClick={() => setReplyingTo(message)}
                  className={`ml-2 flex items-center ${
                    isCurrentUser ? 'text-primary-100 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <FiMessageSquare className="w-3 h-3 mr-1" />
                  Reply
                </button>
              )}
            </div>
          </div>
        </motion.div>
        
        {message.replies && message.replies.map(reply => (
          <MessageThread key={reply.id} message={reply} depth={depth + 1} />
        ))}
      </div>
    );
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Conversations Sidebar */}
      <div className="w-80 border-r border-gray-200 bg-white">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-y-auto h-full">
          {conversations.map((conversation) => (
            <motion.div
              key={conversation.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setSelectedChat(conversation.id)}
              className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                selectedChat === conversation.id ? 'bg-primary-50' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <img
                  src={conversation.with.avatar}
                  alt={conversation.with.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-gray-900">
                      {conversation.with.name}
                    </h3>
                    {conversation.unread > 0 && (
                      <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
                        {conversation.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {conversation.messages[conversation.messages.length - 1]?.text}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center space-x-3">
                <img
                  src={conversations.find((c) => c.id === selectedChat).with.avatar}
                  alt={conversations.find((c) => c.id === selectedChat).with.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h2 className="font-medium text-gray-900">
                    {conversations.find((c) => c.id === selectedChat).with.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {conversations.find((c) => c.id === selectedChat).with.role}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {conversations
                .find((c) => c.id === selectedChat)
                .messages.map((message) => (
                  !message.parentId && <MessageThread key={message.id} message={message} />
                ))}
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200">
              {replyingTo && (
                <div className="mb-2 p-2 bg-gray-50 rounded-md flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <FiCornerDownRight className="w-4 h-4 mr-2" />
                    <span>Replying to message: {replyingTo.text.substring(0, 50)}...</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setReplyingTo(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                >
                  <FiPaperclip className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  placeholder={replyingTo ? "Type your reply..." : "Type a message..."}
                  className="flex-1 p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                />
                <button
                  type="submit"
                  className="p-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 disabled:opacity-50"
                  disabled={!messageText.trim()}
                >
                  <FiSend className="w-5 h-5" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;