import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, MapPin, Cloud, Tag, AlertCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import axios from 'axios';

const JournalEditor = ({ journal, onClose }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    mood: 'neutral',
    tags: [],
    isPrivate: true,
    activities: []
  });
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [activityInput, setActivityInput] = useState('');

  useEffect(() => {
    if (journal) {
      setFormData({
        title: journal.title || '',
        content: journal.content || '',
        mood: journal.mood || 'neutral',
        tags: journal.tags || [],
        isPrivate: journal.isPrivate !== undefined ? journal.isPrivate : true, // Default to true if undefined
        activities: journal.activities || []
      });
    }
  }, [journal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const url = journal ? `http://localhost:3500/journals/${journal._id}` : 'http://localhost:3500/journals';
      const method = journal ? 'put' : 'post';
  
      // Use Axios for the API call
      const response = await axios({
        method,
        url,
        data: formData,
        // Authorization will be handled on the backend based on the token in the cookie or session
      });
  
      if (response.status === 200 || response.status === 201) {
        toast({
          title: journal ? 'Journal Updated' : 'Journal Created',
          description: 'Your entry has been saved successfully.',
        });
        onClose();
      } else {
        throw new Error('Failed to save journal');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save journal entry. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addTag = (e) => {
    if (e.key === 'Enter' && tagInput) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const addActivity = (e) => {
    if (e.key === 'Enter' && activityInput) {
      setFormData(prev => ({
        ...prev,
        activities: [...prev.activities, activityInput.trim()]
      }));
      setActivityInput('');
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{journal ? 'Edit Journal Entry' : 'New Journal Entry'}</h2>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              placeholder="Title"
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="text-xl font-semibold"
            />
          </div>

          <div className="flex gap-4">
            <select
                value={formData.mood}
                onChange={(e) => setFormData((prev) => ({ ...prev, mood: e.target.value }))}
                className="w-40"
                >
                <option value="happy">😊 Happy</option>
                <option value="sad">😢 Sad</option>
                <option value="anxious">😰 Anxious</option>
                <option value="neutral">😐 Neutral</option>
                <option value="excited">🎉 Excited</option>
                <option value="angry">😠 Angry</option>
            </select>


            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isPrivate}
                onChange={e => setFormData(prev => ({ ...prev, isPrivate: e.target.checked }))}
                className="w-4 h-4"
              />
              <label>Private Entry</label>
            </div>
          </div>

          <Textarea
            placeholder="Write your thoughts..."
            value={formData.content}
            onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
            className="min-h-[300px]"
          />

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              <Input
                placeholder="Add tags (press Enter)"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyPress={addTag}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-blue-100 rounded-full text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <Input
                placeholder="Add activities (press Enter)"
                value={activityInput}
                onChange={e => setActivityInput(e.target.value)}
                onKeyPress={addActivity}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.activities.map((activity, index) => (
                <span key={index} className="px-2 py-1 bg-green-100 rounded-full text-sm">
                  {activity}
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={loading}
            >
              {loading ? 'Saving...' : (journal ? 'Update' : 'Save')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default JournalEditor;