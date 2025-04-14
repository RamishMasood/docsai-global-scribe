
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Subscription {
  id: string;
  user_id: string;
  tier: 'free' | 'basic' | 'premium';
  starts_at: string;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useSubscription(userId: string | undefined) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = async (userId: string) => {
    if (!userId) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "No rows returned" error
        throw error;
      }

      setSubscription(data as Subscription | null);
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching subscription:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const createSubscription = async (userId: string, tier: 'free' | 'basic' | 'premium', duration: 'monthly' | 'yearly') => {
    try {
      // Calculate expiry date based on duration
      const now = new Date();
      let expiryDate = new Date(now);
      
      if (duration === 'monthly') {
        expiryDate.setMonth(now.getMonth() + 1);
      } else {
        expiryDate.setFullYear(now.getFullYear() + 1);
      }

      const newSubscription = {
        user_id: userId,
        tier,
        starts_at: now.toISOString(),
        expires_at: expiryDate.toISOString(),
        is_active: true
      };

      const { data, error } = await supabase
        .from('subscriptions')
        .insert(newSubscription)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setSubscription(data as Subscription);
      toast.success('Subscription created successfully');
      return data as Subscription;
    } catch (error: any) {
      console.error('Error creating subscription:', error);
      toast.error('Failed to create subscription', {
        description: error.message
      });
      return null;
    }
  };

  const updateSubscription = async (subscriptionId: string, updates: Partial<Subscription>) => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .update(updates)
        .eq('id', subscriptionId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setSubscription(data as Subscription);
      toast.success('Subscription updated successfully');
      return data as Subscription;
    } catch (error: any) {
      console.error('Error updating subscription:', error);
      toast.error('Failed to update subscription', {
        description: error.message
      });
      return null;
    }
  };

  const cancelSubscription = async (subscriptionId: string) => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .update({ is_active: false })
        .eq('id', subscriptionId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setSubscription(data as Subscription);
      toast.success('Subscription cancelled successfully');
      return true;
    } catch (error: any) {
      console.error('Error cancelling subscription:', error);
      toast.error('Failed to cancel subscription', {
        description: error.message
      });
      return false;
    }
  };

  const hasAccess = (requiredTier: 'free' | 'basic' | 'premium'): boolean => {
    if (!subscription || !subscription.is_active) {
      return requiredTier === 'free';
    }

    const tierLevels = { 
      'free': 0, 
      'basic': 1, 
      'premium': 2 
    };

    return tierLevels[subscription.tier] >= tierLevels[requiredTier];
  };

  useEffect(() => {
    if (userId) {
      fetchSubscription(userId);
    } else {
      setSubscription(null);
      setLoading(false);
    }
  }, [userId]);

  return {
    subscription,
    loading,
    error,
    fetchSubscription,
    createSubscription,
    updateSubscription,
    cancelSubscription,
    hasAccess,
  };
}
