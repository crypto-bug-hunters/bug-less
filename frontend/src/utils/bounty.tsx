import { AppBounty } from "../model/state";
import { useEffect, useState } from 'react';
import { getBlock } from 'viem'
import { usePublicClient } from 'wagmi'

export enum BountyStatus {
    ACTIVE,
    EXPLOITED,
    EXPIRED,
}

export function useBlockTimestamp() {
    const [timestamp, setTimestamp] = useState<bigint>();
    const publicClient = usePublicClient();
    useEffect(() => {
        publicClient.getBlock().then((block) => {
            setTimestamp(block.timestamp);
        });
    }, [publicClient]);
    return timestamp;
};

export function useBountyStatus(bounty: AppBounty): BountyStatus {
    if (bounty.Exploit)
        return BountyStatus.EXPLOITED;

    const timestamp = useBlockTimestamp();

    return (timestamp < bounty.Deadline)
        ? BountyStatus.ACTIVE
        : BountyStatus.EXPIRED;
}
