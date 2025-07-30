'use client';
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import io from 'socket.io-client';
let socket;

export default function Home() {
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [msg, setMsg] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);
    const router = useRouter();
    const currentUserRef = useRef(currentUser);
    const selectedUserRef = useRef(selectedUser);

    useEffect(() => {
        currentUserRef.current = currentUser;
        selectedUserRef.current = selectedUser;
    }, [currentUser, selectedUser]);

    useEffect(() => {
        const initialize = async () => {
            const userEmail = localStorage.getItem('email');
            if (!userEmail) {
                router.push('/login');
                return;
            }

            try {
                const userRes = await fetch(`/api/users/by-email?email=${userEmail}`);
                if (!userRes.ok) throw new Error('Failed to fetch user');
                const { user: loggedInUser } = await userRes.json();
                setCurrentUser(loggedInUser);

                const allUsersRes = await fetch('/api/users');
                const { users: allUsers } = await allUsersRes.json();
                setUsers(allUsers.filter(u => u.id !== loggedInUser.id));

                socket = io('http://localhost:3001');

                socket.on('receive-message', (newMessage) => {
                    const { senderId, receiverId } = newMessage;
                    const current = currentUserRef.current;
                    const selected = selectedUserRef.current;
                    const isRelevant = 
                        (senderId === current?.id && receiverId === selected?.id) ||
                        (senderId === selected?.id && receiverId === current?.id);

                    if (isRelevant) {
                        setMessages((prevMessages) => {
                            if (senderId === current?.id) {
                                const tempMessageIndex = prevMessages.findIndex(m => m.id.startsWith('temp-') && m.content === newMessage.content);
                                if (tempMessageIndex !== -1) {
                                    const updatedMessages = [...prevMessages];
                                    updatedMessages[tempMessageIndex] = newMessage;
                                    return updatedMessages;
                                }
                            }
                            if (!prevMessages.some(m => m.id === newMessage.id)) {
                                return [...prevMessages, newMessage];
                            }

                            return prevMessages;
                        });
                    }
                });

            } catch (error) {
                console.error("Initialization Error:", error);
                localStorage.removeItem('user_email');
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };

        initialize();
        return () => {
            if (socket) {
                socket.off('receive-message');
                socket.disconnect();
            }
        };
    }, [router]);

    // Effect to fetch message history when a user is selected
    useEffect(() => {
        if (!selectedUser || !currentUser) return;

        const fetchMessages = async () => {
            try {
                const response = await fetch(`/api/messages?senderId=${currentUser.id}&receiverId=${selectedUser.id}`);
                const data = await response.json();
                if (response.ok) {
                    setMessages(data.messages);
                }
            } catch (error) {
                console.error("❌ Error fetching messages:", error);
            }
        };
        fetchMessages();
    }, [selectedUser, currentUser]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
    
    const handleLogout = () => {
        localStorage.removeItem('user_email');
        if(socket) socket.disconnect();
        router.push('/login');
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (msg.trim() === "" || !selectedUser || !currentUser) return;

        const messageObj = {
            id: `temp-${Date.now()}`,
            content: msg,
            senderId: currentUser.id,
            receiverId: selectedUser.id,
            timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, messageObj]);
        socket.emit("send-message", messageObj);
        setMsg("");
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen bg-gray-900 text-white">Loading Chat...</div>;
    }

    return (
        <div className="flex h-screen bg-gray-900 text-white font-sans">
            <div className="w-1/3 bg-gray-800 border-r border-gray-700 flex flex-col">
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold">{currentUser?.name} (You)</h2>
                     <button onClick={handleLogout} className="bg-red-600 text-xs px-3 py-1 rounded hover:bg-red-700 transition-colors">Logout</button>
                </div>
                <ul className="overflow-y-auto">
                    {users.map(user => (
                        <li key={user.id} onClick={() => setSelectedUser(user)} className={`p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors ${selectedUser?.id === user.id ? 'bg-blue-800 font-semibold' : ''}`}>
                            {user.name}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="w-2/3 flex flex-col">
                {selectedUser ? (
                    <>
                        <div className="p-4 border-b border-gray-700 bg-gray-800 shadow-sm">
                            <h2 className="text-xl font-bold">Chat with {selectedUser.name}</h2>
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto bg-gray-900">
                            {messages.map((m) => (
                                <div key={m.id} className={`flex my-2 ${m.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`py-2 px-4 rounded-2xl max-w-lg ${m.senderId === currentUser.id ? 'bg-blue-600' : 'bg-gray-700'}`}>
                                        <p>{m.content}</p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="p-4 bg-gray-800 border-t border-gray-700">
                            <form onSubmit={handleSend} className="flex">
                                <input value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Type a message..." className="flex-1 px-4 py-2 border rounded-l-md bg-gray-700 border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-r-md font-semibold transition-colors">Send</button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                        <p className="text-xl">Select a user to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
}
