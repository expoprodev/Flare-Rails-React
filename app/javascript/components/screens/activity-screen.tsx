import {
  Flex,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import axios from "axios";
import * as React from "react";
import { useEffect, useState } from "react";

import styled from "styled-components";

function ActivityScreen() {
  const [totalMembers, setTotalMembers] = useState(0);
  const [activeSubscriptions, setActiveSubscriptions] = useState(0);
  const fetchStatus = async () => {
    const res = await axios.get("/dashboard.json");
    console.log(res);
    setTotalMembers(res.data.total_members);
    setActiveSubscriptions(res.data.active_subscriptions);
  };
  useEffect(() => {
    fetchStatus();
  }, []);
  return (
    <Flex>
      <Stat>
        <StatLabel>Total Members</StatLabel>
        <StatNumber>{totalMembers}</StatNumber>
        <StatHelpText></StatHelpText>
      </Stat>
      <Stat>
        <StatLabel>Active Subscriptions</StatLabel>
        <StatNumber>{activeSubscriptions}</StatNumber>
        <StatHelpText></StatHelpText>
      </Stat>
    </Flex>
  );
}

export default ActivityScreen;
