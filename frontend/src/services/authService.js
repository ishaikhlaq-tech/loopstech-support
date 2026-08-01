import supabase from '@lib/supabase';

const authService = {
  signIn: async ({ email, password }) => {
    // TODO: implement sign-in logic
  },

  signOut: async () => {
    // TODO: implement sign-out logic
  },

  getSession: async () => {
    // TODO: implement session retrieval
  },

  onAuthStateChange: (callback) => {
    // TODO: implement auth state listener
  },
};

export default authService;
