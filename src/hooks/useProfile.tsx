
import React, { useState } from 'react';
import { supabase, Profile } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';

export const useProfile = () => {
  const [profileLoading, setProfileLoading] = useState(false);

  const fetchUserProfile = async (userId: string): Promise<Profile | null> => {
    try {
      if (profileLoading) return null;
      
      setProfileLoading(true);
      console.log('Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      setProfileLoading(false);
      
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      
      console.log('Profile fetched successfully:', data);
      return data;
    } catch (error) {
      setProfileLoading(false);
      console.error('Unexpected error fetching profile:', error);
      return null;
    }
  };

  const ensureUserProfile = async (user: User, setProfile: (profile: Profile | null) => void) => {
    try {
      console.log('Ensuring profile exists for user:', user.id);
      const profile = await fetchUserProfile(user.id);
      
      if (profile) {
        setProfile(profile);
        return;
      }
      
      console.log('Profile not found, creating new profile for:', user.id);
      const { error: createError } = await supabase
        .from('profiles')
        .insert([
          { 
            id: user.id, 
            name: user.email?.split('@')[0] || 'User', 
            email: user.email || '',
            tests_completed: 0,
            courses_completed: 0
          }
        ]);

      if (createError) {
        console.error('Profile creation error:', createError);
        toast.error('Ошибка создания профиля', {
          description: createError.message
        });
      } else {
        console.log('Profile created successfully for user:', user.id);
        const newProfile = await fetchUserProfile(user.id);
        setProfile(newProfile);
      }
    } catch (error) {
      console.error('Unexpected error in ensureUserProfile:', error);
    }
  };

  return {
    fetchUserProfile,
    ensureUserProfile,
    profileLoading
  };
};
