'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Trash2 } from 'lucide-react';
import { VoicePlayer } from '@/components/voice-player';
import { DeleteConfirmationModal } from '@/components/delete-confirmation-modal';

interface Prayer {
  id: string;
  name: string;
  city: string;
  prayer_request: string;
  voice_data?: string;
  voice_duration?: number;
  status: 'pending' | 'completed';
  created_at: string;
}

export function PrayersDashboard() {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    prayerId: string | null;
    isDeleting: boolean;
  }>({ isOpen: false, prayerId: null, isDeleting: false });

  const fetchPrayers = useCallback(async () => {
    try {
      const res = await fetch('/api/prayer');
      const data = await res.json();
      if (!res.ok) {
        console.error('Error fetching prayers:', data.error);
      } else {
        setPrayers(data.data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrayers();
    const interval = setInterval(fetchPrayers, 30000);
    return () => clearInterval(interval);
  }, [fetchPrayers]);

  const markAsDone = useCallback(async (id: string) => {
    try {
      const res = await fetch('/api/prayer/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'completed' }),
      });
      if (res.ok) {
        setPrayers(prev => prev.map(p => p.id === id ? { ...p, status: 'completed' } : p));
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }, []);

  const markAsPending = useCallback(async (id: string) => {
    try {
      const res = await fetch('/api/prayer/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'pending' }),
      });
      if (res.ok) {
        setPrayers(prev => prev.map(p => p.id === id ? { ...p, status: 'pending' } : p));
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }, []);

  const confirmDelete = async () => {
    if (!deleteConfirmation.prayerId) return;
    setDeleteConfirmation(prev => ({ ...prev, isDeleting: true }));
    try {
      const res = await fetch('/api/prayer', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteConfirmation.prayerId }),
      });
      if (res.ok) {
        setPrayers(prev => prev.filter(p => p.id !== deleteConfirmation.prayerId));
        closeDeleteConfirmation();
      } else {
        alert('Error deleting prayer. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setDeleteConfirmation(prev => ({ ...prev, isDeleting: false }));
    }
  };

  const openDeleteConfirmation = (id: string) => setDeleteConfirmation({ isOpen: true, prayerId: id, isDeleting: false });
  const closeDeleteConfirmation = () => setDeleteConfirmation({ isOpen: false, prayerId: null, isDeleting: false });

  const pendingPrayers = prayers.filter(p => p.status === 'pending');
  const completedPrayers = prayers.filter(p => p.status === 'completed');

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 min-h-40">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-[#e85c1a]" />
          <p className="text-sm text-gray-500">Loading prayers...</p>
        </div>
      </div>
    );
  }

  const PrayerCard = ({ prayer, isCompleted }: { prayer: Prayer; isCompleted: boolean }) => (
    <Card className="p-5 bg-white border-0 shadow-md hover:shadow-lg transition-shadow rounded-2xl border-l-4"
      style={{ borderLeftColor: isCompleted ? '#f59e0b' : '#e85c1a' }}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-gray-800 truncate">{prayer.name}</h3>
            {prayer.city && <p className="text-xs text-gray-500 mt-0.5">{prayer.city}</p>}
          </div>
          {isCompleted ? (
            <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full whitespace-nowrap">
              Answered ✓
            </span>
          ) : (
            <span className="text-xs text-gray-400 whitespace-nowrap">{formatDate(prayer.created_at)}</span>
          )}
        </div>

        {prayer.prayer_request && (
          <div className={`p-3 rounded-xl text-sm text-gray-700 leading-relaxed ${isCompleted ? 'bg-amber-50' : 'bg-orange-50'}`}>
            {prayer.prayer_request}
          </div>
        )}

        {prayer.voice_data && (
          <VoicePlayer voiceUrl={prayer.voice_data} duration={prayer.voice_duration || 0} />
        )}

        <div className="flex gap-2 pt-1">
          {isCompleted ? (
            <Button onClick={() => markAsPending(prayer.id)} variant="outline" size="sm"
              className="flex-1 text-xs border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl">
              Reopen
            </Button>
          ) : (
            <Button onClick={() => markAsDone(prayer.id)} size="sm"
              className="flex-1 text-white font-semibold text-xs rounded-xl"
              style={{ backgroundColor: '#e85c1a' }}>
              Mark as Answered
            </Button>
          )}
          <Button onClick={() => openDeleteConfirmation(prayer.id)} size="sm"
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1">
            <Trash2 className="w-3 h-3" />
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );

  return (
    <>
      <DeleteConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onConfirm={confirmDelete}
        onCancel={closeDeleteConfirmation}
        isLoading={deleteConfirmation.isDeleting}
      />
      <div className="w-full space-y-5">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-200 p-1 rounded-full gap-1">
            <TabsTrigger value="pending"
              className="text-sm py-2 rounded-full data-[state=active]:bg-white data-[state=active]:shadow data-[state=active]:text-[#e85c1a] font-semibold transition-all">
              Active ({pendingPrayers.length})
            </TabsTrigger>
            <TabsTrigger value="completed"
              className="text-sm py-2 rounded-full data-[state=active]:bg-white data-[state=active]:shadow data-[state=active]:text-amber-600 font-semibold transition-all">
              Answered ({completedPrayers.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-3 mt-5">
            {pendingPrayers.length === 0 ? (
              <Card className="p-10 text-center bg-white border-0 shadow-sm rounded-2xl">
                <p className="text-sm text-gray-500">All prayers are currently answered. Check back soon!</p>
              </Card>
            ) : (
              pendingPrayers.map(prayer => <PrayerCard key={prayer.id} prayer={prayer} isCompleted={false} />)
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-3 mt-5">
            {completedPrayers.length === 0 ? (
              <Card className="p-10 text-center bg-white border-0 shadow-sm rounded-2xl">
                <p className="text-sm text-gray-500">No completed prayers yet. Your prayers make a difference!</p>
              </Card>
            ) : (
              completedPrayers.map(prayer => <PrayerCard key={prayer.id} prayer={prayer} isCompleted={true} />)
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}