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
  }>({
    isOpen: false,
    prayerId: null,
    isDeleting: false,
  });

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
        setPrayers(prev =>
          prev.map(p => p.id === id ? { ...p, status: 'completed' } : p)
        );
      } else {
        console.error('Error updating prayer status');
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
        setPrayers(prev =>
          prev.map(p => p.id === id ? { ...p, status: 'pending' } : p)
        );
      } else {
        console.error('Error updating prayer status');
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
      alert('An error occurred while deleting. Please try again.');
    } finally {
      setDeleteConfirmation(prev => ({ ...prev, isDeleting: false }));
    }
  };

  const openDeleteConfirmation = (id: string) => {
    setDeleteConfirmation({ isOpen: true, prayerId: id, isDeleting: false });
  };

  const closeDeleteConfirmation = () => {
    setDeleteConfirmation({ isOpen: false, prayerId: null, isDeleting: false });
  };

  const pendingPrayers = prayers.filter(p => p.status === 'pending');
  const completedPrayers = prayers.filter(p => p.status === 'completed');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8 sm:py-12 min-h-40">
        <div className="flex flex-col items-center gap-2 sm:gap-3">
          <Loader2 className="w-8 sm:w-10 h-8 sm:h-10 animate-spin" style={{ color: '#6c7d36' }} />
          <p className="text-xs sm:text-sm text-gray-600">Loading prayers...</p>
        </div>
      </div>
    );
  }

  const PrayerCard = ({ prayer, isCompleted }: { prayer: Prayer; isCompleted: boolean }) => (
    <Card
      className="p-4 sm:p-6 bg-white/80 border-l-4 shadow-sm hover:shadow-md transition-shadow backdrop-blur-sm"
      style={{ borderLeftColor: isCompleted ? '#F5BFD7' : '#6c7d36' }}
    >
      <div className="space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-1 truncate">
              {prayer.name}
            </h3>
            {prayer.city && (
              <p className="text-xs sm:text-sm text-gray-600 truncate">{prayer.city}</p>
            )}
          </div>
          {isCompleted ? (
            <span
              className="inline-block px-2 sm:px-3 py-1 text-gray-800 text-xs font-medium rounded-full whitespace-nowrap"
              style={{ backgroundColor: '#F5BFD7' }}
            >
              Answered
            </span>
          ) : (
            <span className="text-xs font-medium text-gray-600 whitespace-nowrap sm:text-right">
              {formatDate(prayer.created_at)}
            </span>
          )}
        </div>

        {prayer.prayer_request && (
          <div
            className="p-3 sm:p-4 rounded-lg"
            style={{ backgroundColor: isCompleted ? '#ABC9E9' : '#CAEFD7' }}
          >
            <p className="text-xs sm:text-sm text-gray-800 leading-relaxed line-clamp-3 sm:line-clamp-none">
              {prayer.prayer_request}
            </p>
          </div>
        )}

        {prayer.voice_data && (
          <VoicePlayer voiceUrl={prayer.voice_data} duration={prayer.voice_duration || 0} />
        )}

        <div className="flex gap-2 pt-2">
          {isCompleted ? (
            <Button
              onClick={() => markAsPending(prayer.id)}
              variant="outline"
              size="sm"
              className="flex-1 text-xs sm:text-sm border-gray-300 text-gray-700 hover:bg-gray-100 min-h-10 sm:min-h-9 touch-manipulation"
            >
              Reopen
            </Button>
          ) : (
            <Button
              onClick={() => markAsDone(prayer.id)}
              size="sm"
              className="flex-1 text-white font-medium text-xs sm:text-sm min-h-10 sm:min-h-9 touch-manipulation"
              style={{ backgroundColor: '#6c7d36' }}
            >
              <span className="hidden sm:inline">Mark as Answered</span>
              <span className="sm:hidden">Answered</span>
            </Button>
          )}
          <Button
            onClick={() => openDeleteConfirmation(prayer.id)}
            size="sm"
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-1 min-h-10 sm:min-h-9 touch-manipulation"
          >
            <Trash2 className="w-3 h-3" />
            <span className="hidden sm:inline">Delete</span>
            <span className="sm:hidden">Del</span>
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
      <div className="w-full space-y-4 sm:space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-300/40 p-1 rounded-full gap-1">
            <TabsTrigger
              value="pending"
              className="text-xs sm:text-sm py-2 sm:py-2.5 px-2 sm:px-3 rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 font-medium transition-all"
            >
              <span className="hidden sm:inline">Active Prayer</span>
              <span className="sm:hidden">Active</span>
              <span className="ml-1 text-xs">({pendingPrayers.length})</span>
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="text-xs sm:text-sm py-2 sm:py-2.5 px-2 sm:px-3 rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 font-medium transition-all"
            >
              <span className="hidden sm:inline">Answered Prayers</span>
              <span className="sm:hidden">Answered</span>
              <span className="ml-1 text-xs">({completedPrayers.length})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-3 sm:space-y-4 mt-4 sm:mt-6">
            {pendingPrayers.length === 0 ? (
              <Card className="p-6 sm:p-12 text-center bg-white/80 border-0 shadow-sm backdrop-blur-sm">
                <p className="text-xs sm:text-base text-gray-600">
                  All prayers are currently answered. Check back soon!
                </p>
              </Card>
            ) : (
              pendingPrayers.map(prayer => (
                <PrayerCard key={prayer.id} prayer={prayer} isCompleted={false} />
              ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-3 sm:space-y-4 mt-4 sm:mt-6">
            {completedPrayers.length === 0 ? (
              <Card className="p-6 sm:p-12 text-center bg-white/80 border-0 shadow-sm backdrop-blur-sm">
                <p className="text-xs sm:text-base text-gray-600">
                  No completed prayers yet. Your prayers make a difference!
                </p>
              </Card>
            ) : (
              completedPrayers.map(prayer => (
                <PrayerCard key={prayer.id} prayer={prayer} isCompleted={true} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}