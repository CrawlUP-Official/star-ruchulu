import { useState, useEffect } from 'react';
import { Mail, Search, Eye, Trash2, CheckCircle, XCircle, X } from 'lucide-react';
import api from '../../services/api';

const AdminContactMessages = () => {
    const [messages, setMessages] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [filterStatus, setFilterStatus] = useState('All');

    const fetchMessages = async () => {
        try {
            const res = await api.get('/contact');
            const data = res.data.map(m => ({
                id: m.id,
                name: m.name,
                email: m.email,
                phone: m.phone,
                message: m.message,
                date: m.created_at,
                isResolved: false // Not tracked in db yet
            }));
            setMessages(data);
        } catch (error) {
            console.error("Failed to fetch messages:", error);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleDelete = (id) => {
        alert("Delete not implemented in backend Phase 2");
    };

    const toggleResolved = (id) => {
        alert("Resolve toggle not implemented in backend Phase 2");
    };

    const filteredMessages = messages.filter(m => {
        const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'All'
            ? true
            : filterStatus === 'Resolved' ? m.isResolved : !m.isResolved;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-[var(--color-primary-green)]">Contact Messages</h1>
                    <p className="text-sm text-gray-500 mt-1">Review and manage inquiries submitted by customers.</p>
                </div>
                <div className="flex gap-3">
                    <div className="px-4 py-2 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-xl text-sm font-bold shadow-sm">
                        Pending: {messages.filter(m => !m.isResolved).length}
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="relative flex-1 md:w-1/2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by Name or Email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-green)]/20 focus:border-[var(--color-primary-green)] transition-all text-sm"
                    />
                </div>
                <div className="flex gap-2">
                    {['All', 'Pending', 'Resolved'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-colors ${filterStatus === status ? 'bg-[var(--color-primary-green)] text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Messages Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold text-xs uppercase tracking-wider">
                                <th className="p-4 pl-6">Sender Details</th>
                                <th className="p-4">Snippet</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 pr-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMessages.map(msg => (
                                <tr key={msg.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4 pl-6">
                                        <div className="font-bold text-gray-800 text-sm mb-0.5">{msg.name}</div>
                                        <div className="text-xs text-gray-500 flex items-center gap-1.5"><Mail size={12} className="text-gray-400" /> {msg.email}</div>
                                    </td>
                                    <td className="p-4">
                                        <p className="text-sm text-gray-600 line-clamp-2 max-w-xs">{msg.message}</p>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-sm font-medium text-gray-600">
                                            {new Date(msg.date).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold border ${msg.isResolved ? 'bg-green-100 text-green-700 border-green-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'}`}>
                                            {msg.isResolved ? <CheckCircle size={12} /> : <XCircle size={12} />}
                                            {msg.isResolved ? 'Resolved' : 'Pending'}
                                        </span>
                                    </td>
                                    <td className="p-4 pr-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => setSelectedMessage(msg)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                                                title="View Message"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(msg.id)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                                title="Delete Message"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredMessages.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500">
                                        No messages found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Read Message Modal */}
            {selectedMessage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedMessage(null)}></div>
                    <div className="bg-white rounded-3xl w-full max-w-xl relative z-10 shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">

                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-[var(--color-bg-alt)]">
                            <h2 className="text-xl font-heading font-bold text-[var(--color-primary-green)] flex items-center gap-2">
                                Message Details <span className="text-xs font-mono text-gray-400 bg-white px-2 py-1 rounded-md border border-gray-200">{selectedMessage.id}</span>
                            </h2>
                            <button onClick={() => setSelectedMessage(null)} className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Sender</p>
                                    <p className="font-bold text-gray-800">{selectedMessage.name}</p>
                                    <p className="text-sm text-gray-600 mt-0.5">{selectedMessage.email}</p>
                                    <p className="text-sm text-gray-600">{selectedMessage.phone}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col justify-between">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Date Received</p>
                                        <p className="font-medium text-gray-800 text-sm">{new Date(selectedMessage.date).toLocaleString()}</p>
                                    </div>
                                    <div className="mt-3">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-bold border ${selectedMessage.isResolved ? 'bg-green-100 text-green-700 border-green-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'}`}>
                                            {selectedMessage.isResolved ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                            {selectedMessage.isResolved ? 'Resolved' : 'Requires Action'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs text-[var(--color-primary-green)] uppercase font-bold tracking-wider mb-2 border-b border-gray-100 pb-2">Full Message</p>
                                <div className="p-4 bg-[var(--color-bg-alt)] border border-gray-100 rounded-xl text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                                    {selectedMessage.message}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                            <button onClick={() => toggleResolved(selectedMessage.id)} className={`px-5 py-2.5 font-bold rounded-xl shadow-sm transition-colors border flex items-center gap-2 ${selectedMessage.isResolved ? 'bg-white border-gray-200 text-gray-600 hover:bg-gray-100' : 'bg-[#C6A75E] border-transparent text-white hover:bg-yellow-600'}`}>
                                {selectedMessage.isResolved ? 'Mark as Pending' : 'Mark as Resolved'}
                            </button>
                            <button onClick={() => setSelectedMessage(null)} className="px-5 py-2.5 bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 rounded-xl transition-colors">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminContactMessages;
