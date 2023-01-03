import React from "react";
import { getStatsQuery } from "../graphql/queries";
import { useQuery } from "@apollo/react-hooks";

function Test() {
  const { loading, error, data } = useQuery(getStatsQuery, {
    variables: { userId: "5f1996efd98ffa176cf4bd3d" },
    fetchPolicy: "network-only",
  });

  if (loading) {
    return <div>loading...</div>;
  }

  if (error) {
    console.log(error);
    return <div>err</div>;
  }

  if (!data) {
    return <div>no data</div>;
  }

  return <div>OK</div>;
}

export default Test;
