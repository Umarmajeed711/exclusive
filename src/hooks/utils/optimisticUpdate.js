

export const optimisticDelete = async ({
  queryClient,
  queryKey,
  matchField,
  ids,
  dataKey,
}) => {
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
};


export const rollbackQueries = (
  queryClient,
  previousQueries
) => {
  previousQueries?.forEach(([queryKey, data]) => {
    queryClient.setQueryData(queryKey, data);
  });
};