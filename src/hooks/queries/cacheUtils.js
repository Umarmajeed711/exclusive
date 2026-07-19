// lib/react-query/cacheUtils.js

export const cacheUtils = {
  invalidate(queryClient, queryKey, options = {}) {
  return queryClient.invalidateQueries({
    queryKey,
    ...options,
  });
},

  rollback(queryClient, previousQueries) {
    previousQueries?.forEach(([queryKey, data]) => {
      queryClient.setQueryData(queryKey, data);
    });
  },

  async optimisticDelete({
    queryClient,
    queryKey,
    ids,
    dataKey,
    matchField,
  }) {
    await queryClient.cancelQueries({
      queryKey,
    });

    const previousQueries = queryClient.getQueriesData({
      queryKey,
    });

    queryClient.setQueriesData(
      {
        queryKey,
      },
      (oldData) => {
        if (!oldData?.[dataKey]) return oldData;

        return {
          ...oldData,

          [dataKey]: oldData[dataKey].filter(
            (item) => !ids.includes(item[matchField])
          ),
        };
      }
    );

    return { previousQueries };
  },

  async optimisticUpdate({
    queryClient,
    queryKey,
    updatedItem,
    dataKey,
    matchField,
  }) {
    await queryClient.cancelQueries({
      queryKey,
    });

    const previousQueries = queryClient.getQueriesData({
      queryKey,
    });

    queryClient.setQueriesData(
      {
        queryKey,
      },
      (oldData) => {
        if (!oldData?.[dataKey]) return oldData;

        return {
          ...oldData,

          [dataKey]: oldData[dataKey].map((item) =>
            item[matchField] === updatedItem[matchField]
              ? updatedItem
              : item
          ),
        };
      }
    );

    return { previousQueries };
  },

  // async optimisticInsert({
  //   queryClient,
  //   queryKey,
  //   newItem,
  //   dataKey,
  // }) {
  //   await queryClient.cancelQueries({
  //     queryKey,
  //   });

  //   const previousQueries = queryClient.getQueriesData({
  //     queryKey,
  //   });

  //   queryClient.setQueriesData(
  //     {
  //       queryKey,
  //     },
  //     (oldData) => {
  //       if (!oldData?.[dataKey]) return oldData;

  //       return {
  //         ...oldData,

  //         [dataKey]: [
  //           newItem,
  //           ...oldData[dataKey],
  //         ],
  //       };
  //     }
  //   );

  //   return { previousQueries };
  // },

  async optimisticBulkUpdate({
    queryClient,
    queryKey,
    ids,
    updater,
    dataKey,
    matchField,
  }) {
    await queryClient.cancelQueries({
      queryKey,
    });

    const previousQueries = queryClient.getQueriesData({
      queryKey,
    });

    queryClient.setQueriesData(
      {
        queryKey,
      },
      (oldData) => {
        if (!oldData?.[dataKey]) return oldData;

        return {
          ...oldData,

          [dataKey]: oldData[dataKey].map((item) =>
            ids.includes(item[matchField])
              ? updater(item)
              : item
          ),
        };
      }
    );

    return { previousQueries };
  },
};