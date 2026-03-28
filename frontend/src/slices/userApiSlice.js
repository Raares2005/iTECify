import { apiSlice } from './apiSlice';

const USERS_URL = '/api/users';

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: 'POST',
        body: data,
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: 'POST',
      }),
    }),

    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/createUser`,
        method: 'POST',
        body: data,
      }),
    }),

    getUserDetails: builder.query({
      query: () => ({
        url: `${USERS_URL}/profile`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useGetUserDetailsQuery,
} = userApiSlice;