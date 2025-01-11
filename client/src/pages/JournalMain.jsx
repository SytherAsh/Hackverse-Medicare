import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Plus, 
  Calendar,
  Filter,
  SortDesc,
  Tag,
  Edit2
} from 'lucide-react';
import JournalEditor from './JournalEditor';
import axios from 'axios';

const JournalMain = () => {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMood, setSelectedMood] = useState('all');
  const [showEditor, setShowEditor] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    fetchJournals();
  }, []);

 

    const fetchJournals = async () => {
    try {
        const response = await axios.get('http://localhost:3500/journals');
        console.log()
        setJournals(response.data);  // Set the response data to your state
        setLoading(false);
    } catch (error) {
        console.error('Error fetching journals:', error);
        setLoading(false);
    }
    };

  const handleJournalClick = (journal) => {
    setSelectedJournal(journal);
    setShowEditor(true);
  };

  const handleEditorClose = () => {
    setShowEditor(false);
    setSelectedJournal(null);
    fetchJournals(); // Refresh the list
  };

  const getEmoji = (mood) => {
    const emojiMap = {
      happy: '😊',
      sad: '😢',
      anxious: '😰',
      neutral: '😐',
      excited: '🎉',
      angry: '😠'
    };
    return emojiMap[mood] || '😐';
  };

  const filteredJournals = journals.filter(journal => {
    const matchesSearch = journal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         journal.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMood = selectedMood === 'all' || journal.mood === selectedMood;
    return matchesSearch && matchesMood;
  });

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Journal</h1>
        <Button 
          onClick={() => setShowEditor(true)} 
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Entry
        </Button>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search journals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setFilterOpen(!filterOpen)}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filter
        </Button>
        {filterOpen && (
          <div className="absolute mt-12 right-4 bg-white shadow-lg rounded-lg p-4 z-10">
            <select
              value={selectedMood}
              onChange={(e) => setSelectedMood(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="all">All Moods</option>
              <option value="happy">Happy</option>
              <option value="sad">Sad</option>
              <option value="anxious">Anxious</option>
              <option value="neutral">Neutral</option>
              <option value="excited">Excited</option>
              <option value="angry">Angry</option>
            </select>
          </div>
        )}
      </div>

      {/* Journal Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJournals.map((journal) => (
          <Card
            key={journal._id}
            className="cursor-pointer hover:shadow-lg transition-shadow rounded-xl"
            onClick={() => handleJournalClick(journal)}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{journal.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    {new Date(journal.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <span className="text-2xl" title={journal.mood}>
                  {getEmoji(journal.mood)}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 line-clamp-3">{journal.content}</p>
              {journal.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {journal.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Journal Editor Dialog */}
      <Dialog open={showEditor} onOpenChange={setShowEditor}>
        <DialogContent className="max-w-4xl w-full">
          <DialogHeader>
            <DialogTitle>
              {selectedJournal ? 'Edit Journal Entry' : 'New Journal Entry'}
            </DialogTitle>
          </DialogHeader>
          <JournalEditor
            journal={selectedJournal}
            onClose={handleEditorClose}
          />
        </DialogContent>
      </Dialog>

      {/* Empty State */}
      {!loading && journals.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No Journal Entries Yet</h3>
          <p className="text-gray-600 mb-4">
            Start writing your thoughts and experiences.
          </p>
          <Button onClick={() => setShowEditor(true)}>
            Create Your First Entry
          </Button>
        </div>
      )}
    </div>
  );
};

export default JournalMain;