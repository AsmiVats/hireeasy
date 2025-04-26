const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL,
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  endpoints: {
    auth: {
      login: '/auth/login',
      signup: '/auth/signup',
      logout: '/auth/logout'
    },
    jobs: {
      list: '/jobs',
      create: '/jobs/create',
      update: '/jobs/update',
      delete: '/jobs/delete'
    }
  }
};

export default config;