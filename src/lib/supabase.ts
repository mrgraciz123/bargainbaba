import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Detect if we should use mock client
const isMockEnabled = !supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder') || supabaseAnonKey.includes('placeholder');

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  wedding_date?: string;
  budget?: number;
  guest_count?: number;
  city?: string;
}

export interface WeddingProject {
  id: string;
  user_id: string;
  budget: number;
  guests: number;
  city: string;
  wedding_type: string;
  venue_type: string;
  catering: string;
  ai_analysis: any;
  created_at: string;
}

// Keep WeddingAnalysis interface for type compatibility in other files
export interface WeddingAnalysis {
  id: string;
  project_id: string;
  user_id: string;
  created_at: string;
  data: any;
}

// LocalStorage key helper
const STORAGE_KEYS = {
  SESSION: 'bb_session',
  USERS: 'bb_users',
  WEDDING_PROJECTS: 'bb_wedding_projects',
};

// Pure Mock Database Client Implementation
class MockSupabaseClient {
  private getStorage<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  }

  private setStorage<T>(key: string, data: T): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(data));
  }

  auth = {
    signUp: async ({ email, password, options }: any) => {
      const users = this.getStorage<any[]>(STORAGE_KEYS.USERS, []);
      if (users.find(u => u.email === email)) {
        return { data: { user: null }, error: { message: 'User already exists!' } };
      }
      const newUser = {
        id: Math.random().toString(36).substring(2, 15),
        email,
        name: options?.data?.name || email.split('@')[0],
        created_at: new Date().toISOString(),
      };
      users.push({ ...newUser, password });
      this.setStorage(STORAGE_KEYS.USERS, users);

      const session = { user: newUser, access_token: 'mock-token' };
      this.setStorage(STORAGE_KEYS.SESSION, session);
      this.triggerAuthChange('SIGNED_IN', session);

      return { data: { user: newUser, session }, error: null };
    },

    signInWithPassword: async ({ email, password }: any) => {
      const users = this.getStorage<any[]>(STORAGE_KEYS.USERS, []);
      const user = users.find(u => u.email === email && u.password === password);
      if (!user) {
        return { data: { user: null, session: null }, error: { message: 'Invalid credentials!' } };
      }
      const { password: _, ...safeUser } = user;
      const session = { user: safeUser, access_token: 'mock-token' };
      this.setStorage(STORAGE_KEYS.SESSION, session);
      this.triggerAuthChange('SIGNED_IN', session);

      return { data: { user: safeUser, session }, error: null };
    },

    signInWithOAuth: async ({ provider, options }: any) => {
      // Create a premium mock Google OAuth session
      const newUser = {
        id: 'google-' + Math.random().toString(36).substring(2, 15),
        email: 'shaadi.planner@gmail.com',
        name: 'Kabir Oberoi (Google)',
        created_at: new Date().toISOString(),
      };
      const session = { user: newUser, access_token: 'mock-google-token' };
      this.setStorage(STORAGE_KEYS.SESSION, session);
      this.triggerAuthChange('SIGNED_IN', session);

      if (typeof window !== 'undefined') {
        setTimeout(() => {
          window.location.href = options?.redirectTo || '/dashboard';
        }, 500);
      }
      return { data: { provider, url: options?.redirectTo || '/dashboard' }, error: null };
    },

    signOut: async () => {
      this.setStorage(STORAGE_KEYS.SESSION, null);
      this.triggerAuthChange('SIGNED_OUT', null);
      return { error: null };
    },

    getSession: async () => {
      const session = this.getStorage<any>(STORAGE_KEYS.SESSION, null);
      return { data: { session }, error: null };
    },

    getUser: async () => {
      const session = this.getStorage<any>(STORAGE_KEYS.SESSION, null);
      return { data: { user: session?.user || null }, error: null };
    },

    onAuthStateChange: (callback: any) => {
      if (typeof window === 'undefined') return { data: { subscription: { unsubscribe: () => {} } } };
      const handler = (e: any) => {
        callback(e.detail.event, e.detail.session);
      };
      window.addEventListener('bb_auth_change', handler);
      
      // Call immediately with initial session
      const session = this.getStorage<any>(STORAGE_KEYS.SESSION, null);
      if (session) {
        setTimeout(() => callback('SIGNED_IN', session), 10);
      } else {
        setTimeout(() => callback('SIGNED_OUT', null), 10);
      }

      return {
        data: {
          subscription: {
            unsubscribe: () => {
              window.removeEventListener('bb_auth_change', handler);
            }
          }
        }
      };
    }
  };

  private triggerAuthChange(event: string, session: any) {
    if (typeof window === 'undefined') return;
    const customEvent = new CustomEvent('bb_auth_change', {
      detail: { event, session }
    });
    window.dispatchEvent(customEvent);
  }

  // Database simulator for wedding_projects
  from(table: string) {
    const getItems = (): any[] => {
      if (table === 'wedding_projects') return this.getStorage<WeddingProject[]>(STORAGE_KEYS.WEDDING_PROJECTS, []);
      if (table === 'profiles') return this.getStorage<UserProfile[]>(STORAGE_KEYS.USERS, []);
      // Maintain old endpoints as virtual maps to the new table
      if (table === 'projects' || table === 'analyses') {
        const weddingProjects = this.getStorage<WeddingProject[]>(STORAGE_KEYS.WEDDING_PROJECTS, []);
        if (table === 'projects') {
          return weddingProjects.map(wp => ({
            id: wp.id,
            user_id: wp.user_id,
            title: `${wp.wedding_type.split(' ')[0]} Shaadi in ${wp.city}`,
            budget: wp.budget,
            guest_count: wp.guests,
            city: wp.city,
            wedding_type: wp.wedding_type,
            venue_type: wp.venue_type,
            decor_style: wp.ai_analysis?.metadata?.decor_style || 'Traditional Marigold',
            catering_pref: wp.catering,
            photography_budget: wp.ai_analysis?.metadata?.photography_budget || 150000,
            created_at: wp.created_at
          }));
        } else {
          return weddingProjects.map(wp => ({
            id: wp.id,
            project_id: wp.id,
            user_id: wp.user_id,
            created_at: wp.created_at,
            data: wp.ai_analysis
          }));
        }
      }
      return [];
    };

    const setItems = (items: any[]) => {
      if (table === 'wedding_projects') {
        this.setStorage(STORAGE_KEYS.WEDDING_PROJECTS, items);
      } else if (table === 'projects' || table === 'analyses') {
        // Map updates back to wedding_projects
        const currentWeddingProjects = this.getStorage<WeddingProject[]>(STORAGE_KEYS.WEDDING_PROJECTS, []);
        if (table === 'projects') {
          const updated = currentWeddingProjects.map(wp => {
            const match = items.find(i => i.id === wp.id);
            if (match) {
              return {
                ...wp,
                budget: match.budget,
                guests: match.guest_count,
                city: match.city,
                wedding_type: match.wedding_type,
                venue_type: match.venue_type,
                catering: match.catering_pref
              };
            }
            return wp;
          });
          this.setStorage(STORAGE_KEYS.WEDDING_PROJECTS, updated);
        } else {
          const updated = currentWeddingProjects.map(wp => {
            const match = items.find(i => i.project_id === wp.id);
            if (match) {
              return {
                ...wp,
                ai_analysis: match.data
              };
            }
            return wp;
          });
          this.setStorage(STORAGE_KEYS.WEDDING_PROJECTS, updated);
        }
      } else if (table === 'profiles') {
        this.setStorage(STORAGE_KEYS.USERS, items);
      }
    };

    let queryItems = getItems();

    return {
      select: (fields: string = '*') => {
        return {
          eq: (column: string, value: any) => {
            const results = queryItems.filter(item => {
              if (column === 'user_id' || column === 'id' || column === 'project_id') {
                return item[column] === value;
              }
              return true;
            });
            return {
              order: (orderCol: string, { ascending = false } = {}) => {
                const sorted = [...results].sort((a, b) => {
                  const valA = a[orderCol];
                  const valB = b[orderCol];
                  if (typeof valA === 'string') {
                    return ascending ? valA.localeCompare(valB) : valB.localeCompare(valA);
                  }
                  return ascending ? valA - valB : valB - valA;
                });
                return { data: sorted, error: null };
              },
              data: results,
              error: null,
              single: () => ({ data: results[0] || null, error: results[0] ? null : { message: 'Not found' } })
            };
          },
          order: (orderCol: string, { ascending = false } = {}) => {
            const sorted = [...queryItems].sort((a, b) => {
              const valA = a[orderCol];
              const valB = b[orderCol];
              if (typeof valA === 'string') {
                return ascending ? valA.localeCompare(valB) : valB.localeCompare(valA);
              }
              return ascending ? valA - valB : valB - valA;
            });
            return { data: sorted, error: null };
          },
          data: queryItems,
          error: null
        };
      },
      insert: (data: any) => {
        const items = getItems();
        const recordsToInsert = Array.isArray(data) ? data : [data];
        const newRecords = recordsToInsert.map(record => {
          const id = record.id || Math.random().toString(36).substring(2, 15);
          const created_at = record.created_at || new Date().toISOString();
          
          if (table === 'wedding_projects') {
            return {
              id,
              created_at,
              user_id: record.user_id,
              budget: record.budget,
              guests: record.guests,
              city: record.city,
              wedding_type: record.wedding_type,
              venue_type: record.venue_type,
              catering: record.catering,
              ai_analysis: record.ai_analysis
            };
          }
          return {
            id,
            created_at,
            ...record
          };
        });
        
        items.push(...newRecords);
        setItems(items);
        
        return {
          select: () => ({ data: newRecords, error: null }),
          data: newRecords,
          error: null
        };
      },
      update: (data: any) => {
        return {
          eq: (column: string, value: any) => {
            const items = getItems();
            let updatedRecords: any[] = [];
            const updatedItems = items.map(item => {
              if (item[column] === value) {
                const updatedRecord = { ...item, ...data };
                updatedRecords.push(updatedRecord);
                return updatedRecord;
              }
              return item;
            });
            setItems(updatedItems);
            return { data: updatedRecords, error: null };
          }
        };
      },
      delete: () => {
        return {
          eq: (column: string, value: any) => {
            const items = getItems();
            const filteredItems = items.filter(item => item[column] !== value);
            setItems(filteredItems);
            return { data: null, error: null };
          }
        };
      }
    };
  }
}

// Export the active client
export const supabase = isMockEnabled
  ? (new MockSupabaseClient() as any)
  : createClient(supabaseUrl, supabaseAnonKey);

export const isUsingMock = isMockEnabled;
